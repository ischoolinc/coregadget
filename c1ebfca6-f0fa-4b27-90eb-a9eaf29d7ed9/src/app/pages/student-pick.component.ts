import { ConfigService, AbsenceConf, PeriodConf } from './../service/config.service';
import { AlertService } from './../service/alert.service';
import { DSAService, Student, AttendanceItem, PeriodStatus, GroupType, RollCallCheck } from './../service/dsa.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPositionX } from '@angular/material/menu';
import { StudentCheck } from '../student-check';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GadgetService } from '../service/gadget.service';
import { RollCallRateDenominator } from './vo';
import { Console } from '@angular/core/src/console';

@Component({
  selector: 'gd-student-pick',
  templateUrl: './student-pick.component.html',
  styleUrls: ['../common.css']
})
export class StudentPickComponent implements OnInit {
 
  /** 是否顯示英文名字 預設為否 */
  displayEnglishName :boolean = false ;
  
  today: string;

  periodConf: PeriodConf; // 節次設定，決定有哪些缺曠可以點。

  period: string;

  selectedAbsence: string; // 已選擇的缺曠類別。

  groupInfo: { type: GroupType, id: string, name: string } // 課程或班級。

  /**【View Binding】 */
  studentChecks: StudentCheck[]; //點名狀態。

  checkSummary: string; // 目前點名狀態統計。

  showCurrentAbsentType = "";

  // isMouseIn = false;

  absenceRates: any;
  teacherSetting: any;
  settingList: any;
  objectKeys = Object.keys;
  showPhoto: boolean;
  explainMessage: string = "";

  constructor(
    private dsa: DSAService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private config: ConfigService,
    private change: ChangeDetectorRef,
    private router: Router,
    private gadget: GadgetService
  ) {
  }

  async ngOnInit() {
    this.today = await this.dsa.getToday();

    //setting 
    this.teacherSetting = await this.dsa.getTeacherSetting();
    this.settingList = this.objectKeys(this.teacherSetting);

    this.showPhoto = this.teacherSetting['usePhoto'];

    this.groupInfo = { type: '', id: '', name: '' };
    await this.config.ready;

    this.route.paramMap.subscribe(async pm => {
      this.groupInfo.type = pm.get('type') as GroupType; // course or class
      this.groupInfo.id = pm.get('id'); // course id
      this.period = pm.get('period'); // period name
      this.groupInfo.name = pm.get('name');

      // console.log(pm.get('name'));

      //載入出席率
      await this.loadAbsencreRate();
      // 可點節次。
      this.periodConf = this.config.getPeriod(this.period);
      this.periodConf.Absence = [].concat(this.periodConf.Absence || []);

      try {
        // 學生清單（含點名資料）。 
        await this.reloadStudentAttendances();
      } catch (error) {
        this.alert.json('ServiceError:GetStudents');
        console.log(error);
      }

      // 當有假別預設選第1個
      if (this.periodConf.Absence.length > 0) {
        this.selectedAbsence = this.periodConf.Absence[0].Name;
      }
    });
  }

  /** 依目前以數載入缺曠資料。 */
  public async reloadStudentAttendances(msg?: string) {

    const students = await this.dsa.getStudent(this.groupInfo.type, this.groupInfo.id, this.today, this.period);
    this.studentChecks = [];

    const c = await this.gadget.getContract("campus.rollcall.teacher");
    const session = await c.send("DS.Base.Connect", { RequestSessionID: '' });
    // 看看能不能顯示出席率 
    let denominator: RollCallRateDenominator = await this.dsa.getAbsenRateDenominator(this.groupInfo.id);

    //【檢查】(是否顯示出席率) 如果有設定 使用上課週數 * 節數 
    // console.log("IsUseWeeks",denominator.IsUseWeeks)

    if (denominator.IsUseWeeks == 'true') {
      if ((denominator.Period == "0" || denominator.Period == "")) {
        this.explainMessage = "出席率分母採用 上課週數 * 節數， \n但節數為0或未設定，無法計算出席率 。"
      } else // 如果 節數設定正常 
      {
        if (denominator.WeeksFromCourse) {
          this.explainMessage = `出席率分母採用 上課週數 * 節數  為  (${denominator.WeeksFromCourse}週*${denominator.Period}節) ${denominator.CourseDe} 堂`

        } else {
          this.explainMessage = `出席率分母採用 上課週數 * 節數  為  (${denominator.DefaultWeeks}週*${denominator.Period}節) ${denominator.DefaultDe} 堂`
        }
      }

    } else { // 不採用上課週數 => 實際點名
      this.explainMessage = `出席率分母採用 教師實際點名次數 為 ${denominator.ActualRollcallTime} 堂`
    }

    for (const stu of students) {
      // 取得學生照片 url
      stu.PhotoUrl = `${this.dsa.getAccessPoint()}/GetStudentPhoto?stt=Session&sessionid=${session.SessionID}&parser=spliter&content=StudentID:${stu.StudentID}`;
      // 取得出席率 
      const status = this.getSelectedAttendance(stu);
      // 加入出席率
      stu.AbsenceRate = this.absenceRates[stu.StudentID];
      this.studentChecks.push(new StudentCheck(stu, status, this.periodConf));
    }

    this.calcSummaryText();

    if (msg) this.alert.snack(msg);
  }

  changeAttendance(stu: StudentCheck) {

    if (!this.selectedAbsence) {
      this.alert.snack('請選擇假別！');
      return;
    }

    if (!stu.acceptChange()) {
      this.alert.snack('此學生無法調整缺曠。');
      return;
    }

    stu.setAttendance(this.selectedAbsence);

    this.calcSummaryText();

    //因為只是調整陣列中的某個元件資料，並不會引發畫面更新。
    // this.change.markForCheck();
  }

  /** 計算統計值。 */
  calcSummaryText() {
    const summary = new Map<string, number>();
    for (const check of this.studentChecks) {

      if (!check.acceptChange()) continue;
      if (!check.status) continue;

      if (!summary.has(check.status.AbsenceType)) {
        summary.set(check.status.AbsenceType, 0);
      }

      summary.set(check.status.AbsenceType, summary.get(check.status.AbsenceType) + 1);
    }

    let text: string[] = [];
    for (let k of Array.from(summary)) {
      text.push(`${k[0]}: ${k[1]}`);
    }

    this.checkSummary = text.join(', ');
  }

  getAttendanceText(stu: StudentCheck) {

    return stu.status ? stu.status.AbsenceType : '- -';
  }

  /**顯示absType */
  showAbsText(stu: StudentCheck) {

    if (stu.status) {
    
        return stu.status.AbsenceType;
  

    } else {
      if (stu.isMouseIn) {
        return stu.showCurrentAbsType;

      } else {
        return " - "
      }

    }


  }
  getAttendanceStyle(stu: StudentCheck) {

    let bgColor = 'rgba(255,255,255, 0.1)';
    let fgColor = 'rgba(0,0,0,0.5)';

    if (stu.status) {
      const absType = stu.status.AbsenceType;
      const absConf = this.config.getAbsence(absType);
      if (absConf.Abbr) {
        bgColor = this.config.getAbsenceColor(absConf.Abbr);
      }
      fgColor = 'white';
    }

    return {
      "background-color": bgColor,
      "color": fgColor,
    }
  }

  getAbsenceRateStyle(rate) {
    //rgba(0, 0, 0, 0.54) !important
    var seed = 100 - Math.sqrt(100 - (rate || 0)) * 17;
    if (seed < 0) seed = 0;

    var r = 255 - 255 * seed / 100;
    var a = 1 - 0.54 * seed / 100;
    return {
      "color": "rgba(" + r + ", 0, 0, " + a + ")",
      "font-weight": (rate > 70 ? "" : "bold")
    }
  }

  /**
   * 取得學生在目前節次的缺曠狀態。
   * @param stu 學生資料。
   */
  private getSelectedAttendance(stu: Student) {
    var abs = (stu.Absence.AbsenceName || stu.Absence.RollCallChecked == 'true') ? stu.Absence.AbsenceName : stu.Absence.HelperRollCall;
    if (abs) {
      return {
        '@text': this.periodConf.Name,
        AbsenceType: abs
      } as PeriodStatus;
    }
    else {
      return null;
    }
    // if (!stu.Attendance) return;
    // const period = this.periodConf.Name;
    // const dateAtts = [].concat(stu.Attendance.Period) as PeriodStatus[];
    // return dateAtts.find(v => v['@text'] === period);
  }

  async saveRollCall() {

    const items: RollCallCheck[] = [];

    for (const check of this.studentChecks) {
      items.push(check.getCheckData());
    }

    const dialog = this.alert.waiting("儲存中...");

    try {
      await this.dsa.setRollCall(this.groupInfo.type, this.groupInfo.id, this.periodConf.Name, items);
      this.router.navigate(['/main']);
    } catch (error) {
      this.alert.json(error);
    } finally {
      dialog.close();
    }

  }

  /**滑鼠移進來時顯示 目前顯示的 */
  showCurrentAbsType(studentCheck: StudentCheck) {

    studentCheck.isMouseIn = true;
    studentCheck.setShowCurrentAbsent(this.selectedAbsence);

    studentCheck.setShowCurrentAbsent(this.selectedAbsence);
  }
  /**滑鼠移進除去時顯示 不要顯示的 */
  hideCurrentAbsType(studentCheck: StudentCheck) {
    studentCheck.isMouseIn = false;
    studentCheck.clearShowCurrentAbsent();
  }

  selectedAbsenceItem(abbr) {
    this.selectedAbsence = abbr.Name;
  }


  //取得學生出席率 
  async loadAbsencreRate() {

    if (this.groupInfo.type == 'Course')
      this.absenceRates = await this.dsa.getAbsenceRate(this.groupInfo.id);
    else
      this.absenceRates = {};

  }
}
import { ConfigService, AbsenceConf, PeriodConf } from './../service/config.service';
import { AlertService } from './../service/alert.service';
import { DSAService, Student, AttendanceItem, PeriodStatus, GroupType, RollCallCheck } from './../service/dsa.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPositionX } from '@angular/material/menu';
import { StudentCheck } from '../student-check';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GadgetService } from '../service/gadget.service';

@Component({
  selector: 'gd-student-pick',
  templateUrl: './student-pick.component.html',
  styleUrls: ['../common.css']
})
export class StudentPickComponent implements OnInit {

  today: string;

  period: string;

  periodConf: PeriodConf; // 節次設定，決定有哪些缺曠可以點。

  selectedAbsence: string; // 已選擇的缺曠類別。

  groupInfo: { type: GroupType, id: string, name: string } // 課程或班級。

  studentChecks: StudentCheck[]; //點名狀態。

  checkSummary: string; // 目前點名狀態統計。

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
    
    this.groupInfo = { type: '', id: '', name: '' };
    await this.config.ready;

    this.route.paramMap.subscribe(async pm => {
      this.groupInfo.type = pm.get('type') as GroupType; // course or class
      this.groupInfo.id = pm.get('id'); // course id
      this.period = pm.get('period'); // period name
      this.groupInfo.name = pm.get('name');

      console.log(pm.get('name'));

      // 可點節次。
      this.periodConf = this.config.getPeriod(this.period);
      this.periodConf.Absence = [].concat(this.periodConf.Absence || []);

      try {
        // 學生清單（含點名資料）。 
        await this.reloadStudentAttendances();
      } catch (error) {
        this.alert.json(error.message);
      }

      // 當有假別預設選第1個
      if (this.periodConf.Absence.length > 0) {
        this.selectedAbsence = this.periodConf.Absence[0].Name;
      }
    });
  }

  /** 依目前以數載入缺曠資料。 */
  public async reloadStudentAttendances(msg?: string) {
    const students = await this.dsa.getStudents(this.groupInfo.type, this.groupInfo.id, this.period, this.today);
    this.studentChecks = [];

    const c = await this.gadget.getContract("campus.rollcall.student");
    const session = await c.send("DS.Base.Connect", { RequestSessionID: '' });
    console.log(session.SessionID);

    for (const stu of students) {

      // 取得學生照片 url
      stu.PhotoUrl = `${this.dsa.getAccessPoint()}/_.GetStudentPhoto?stt=Session&sessionid=${session.SessionID}&parser=spliter&content=StudentID:${stu.ID}`;
      const status = this.getSelectedAttendance(stu);
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

  /**
   * 取得學生在目前節次的缺曠狀態。
   * @param stu 學生資料。
   */
  private getSelectedAttendance(stu: Student) {
    if (!stu.Attendance) return;
    const period = this.periodConf.Name;
    const dateAtts = [].concat(stu.Attendance.Period) as PeriodStatus[];
    return dateAtts.find(v => v['@text'] === period);
  }

  async saveRollCall() {

    const items: RollCallCheck[] = [];

    for (const check of this.studentChecks) {
      items.push(check.getCheckData());
    }

    const dialog = this.alert.waiting("儲存中...");

    try {
      await this.dsa.setRollCall(this.groupInfo.type, this.groupInfo.id, this.periodConf.Name, items);
      // await this.reloadStudentAttendances();
      this.router.navigate(['/main']);
    } catch (error) {
      this.alert.json(error);
    } finally {
      dialog.close();
    }

  }

  selectedAbsenceItem(abbr) {
    console.log(abbr);
    this.selectedAbsence = abbr.Name;
  }
}
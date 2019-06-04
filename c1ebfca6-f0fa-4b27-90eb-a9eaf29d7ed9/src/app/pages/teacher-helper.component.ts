import { Component, OnInit } from '@angular/core';
import { DSAService, Student, AttendanceItem, PeriodStatus, GroupType, RollCallCheck } from './../service/dsa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GadgetService } from '../service/gadget.service';
import { AlertService } from './../service/alert.service';
import { Console } from '@angular/core/src/console';

@Component({
  selector: 'gd-teacher-helper',
  templateUrl: './teacher-helper.component.html',
  styleUrls: ['../common.css']
})
export class TeacherHelperComponent implements OnInit {

  today: string;
  courseName: string;
  courseID: string;
  period: string;
  teacherHelper: TeacherHelper = {} as TeacherHelper;
  students: Student[];
  showPhoto: boolean;
  teacherSetting: any;
  settingList: any;
  objectKeys = Object.keys;

  constructor(
    private dsa: DSAService,
    private route: ActivatedRoute,
    private gadget: GadgetService,
    private alert: AlertService,
    private router: Router,
  ) {
  }

  async ngOnInit() {


    // 取得 setting  (是否取得照片)
    const SettingJSON = await this.dsa.getTeacherSetting();
    this.teacherSetting = JSON.parse(SettingJSON);
    this.settingList = this.objectKeys(this.teacherSetting);
    this.showPhoto = this.teacherSetting['use_photo'];

    this.today = await this.dsa.getToday();
    this.route.paramMap.subscribe(async pm => {

      this.courseName = pm.get('name'); // course name
      this.courseID = pm.get('id'); // course id
      this.period = pm.get('period');

      try {
        // 學生清單（含點名資料）。 
        await this.reloadTeacherHelper();
      } catch (error) {
        this.alert.json(error.message);
      }
    });
  }

  public async reloadTeacherHelper() {
    this.students = [];
    // 取得學生清單
    const _students = await this.dsa.getStudents('Course', this.courseID, this.today, this.period);
    // 取得學生照片URL
    const c = await this.gadget.getContract("campus.rollcall.teacher");
    const session = await c.send("DS.Base.Connect", { RequestSessionID: '' });
    for (const stu of _students) {
      // 取得學生照片 url
      stu.PhotoUrl = `${this.dsa.getAccessPoint()}/GetStudentPhoto?stt=Session&sessionid=${session.SessionID}&parser=spliter&content=StudentID:${stu.ID}`;
      this.students.push(stu);
    }
    // 取得課程助手
    const courseRecord = await this.dsa.getSchedule(this.today);
    courseRecord.CourseConf.forEach((course) => {
      console.log(this.courseID);
      if (course.CourseID == this.courseID) {
        this.teacherHelper.StudentID = course.StudentID;
        this.teacherHelper.StudentName = course.StudentName;
        this.teacherHelper.StudentNumber = course.StudentNumber;
      }
    });

  }

  getTeacherHelperText(stu: Student) {
    return (stu.ID == this.teacherHelper.StudentID) ? '小幫手' : '- -';
  }

  getTeacherHelperStyle(stu: Student) {

    let bgColor = 'rgba(255,255,255, 0.1)';
    let fgColor = 'rgba(0,0,0,0.5)';

    if (stu.ID == this.teacherHelper.StudentID) {
      bgColor = '#259B24';
      fgColor = 'white';
    }

    return {
      "background-color": bgColor,
      "color": fgColor,
    }
  }

  changeTeacherHelper(stu: Student) {
    this.teacherHelper.StudentID = stu.ID;
    this.teacherHelper.StudentName = stu.Name;
    this.teacherHelper.StudentNumber = stu.StudentNumber;
  }

  async saveTeacherHelper() {

    const dialog = this.alert.waiting("儲存中...");

    try {
      await this.dsa.setHelper(this.courseID, this.teacherHelper.StudentID);

      this.router.navigate(['/setting']);
    } catch (error) {
      this.alert.json(error);
    } finally {
      dialog.close();
    }
  }

}

export interface TeacherHelper {
  StudentID: string;
  StudentName: string;
  StudentNumber: string;
}
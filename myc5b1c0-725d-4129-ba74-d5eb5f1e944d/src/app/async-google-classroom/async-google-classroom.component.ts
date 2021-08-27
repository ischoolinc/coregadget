import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MyCourseRec, MyCourseTeacherRec } from '../core/data/my-course';
import { GoogleClassroomService } from '../core/google-classroom.service';
import { MyCourseService } from '../core/my-course.service';

@Component({
  selector: 'app-async-google-classroom',
  templateUrl: './async-google-classroom.component.html',
  styleUrls: ['./async-google-classroom.component.scss']
})
export class AsyncGoogleClassroomComponent implements OnInit {

  processState = 201;
  processErrorMsg = '';
  progressBar = { max: 0, current: 0 };
  createStudentMsg = '';

  @Input() adminIsConnectedGoogle = false;
  @Input() dsns = '';
  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };

  constructor(
    private myCourseSrv: MyCourseService,
    private changeDetector: ChangeDetectorRef,
    private gClassroomSrv: GoogleClassroomService,
  ) { }

  ngOnInit(): void {
  }

  async asyncGoogleClassroomCourse(course: MyCourseRec) {
    if (!this.adminIsConnectedGoogle) { return; }
    if ([202].indexOf(this.processState) !== -1) { return; }

    // 1. 取得共同授課老教師清單、取得課程學生清單
    // 2. 建立課程 + 將老師加入課程(協同教學)
    // 3. 將學生加入課程
    // 4. 將 Google Classroom 課程資訊補充到 course

    this.processErrorMsg = '';
    this.processState = 202;

    this.progressBar = {
      max: 50 * 4, // 一個步驟 => 50
      current: 0,
    };
    this.createStudentMsg = '';

    let teachers: MyCourseTeacherRec[] = [];
    let courseOwner: MyCourseTeacherRec = {} as MyCourseTeacherRec;
    let students: any = [];

    try { // 從 DSA 取得老師、學生清單。
      const promiseList = [
        this.myCourseSrv.getCoursetTeachers(this.dsns, course.CourseId),
        this.myCourseSrv.getCourseStudents(this.dsns, course.CourseId)
      ];

      teachers = await promiseList[0];
      courseOwner = teachers.find(v => v.TeacherSequence === 1) || {} as MyCourseTeacherRec;

      students = await promiseList[1];
      this.progressBar.max += students.length;
    } catch (error) {
      this.processState = 9999;
      this.processErrorMsg = '哎呀！取得班級資料時出了一點問題！';
    }

    // 開始同步
    try {
      this.reportProgress(50); // 取得資料完成

      try { // 同步學生清單到 Google Classroom.
        await this.addStudentToGoogleClassroomCourse(students, course.Alias || '');

        this.progressBar.current = this.progressBar.max;
        this.changeDetector.detectChanges();

        setTimeout(() => {
          this.processState = 2000;
        }, 100);
      } catch (error) {
        this.processState = 9999;
        this.processErrorMsg = '哎呀！班級加入學生時出了一點問題！';
      }
    } catch (error) {
      this.processState = 9999;

      if (error && error.error && error.error.status) {
        if (error.error.status === 'PERMISSION_DENIED') {
          this.processErrorMsg = `教師帳號必須是有效的 Google 教育帳號！${courseOwner.LinkAccount}`;
        }
      }
    }
  }

  reportProgress(value: number) {
    this.progressBar = { ...this.progressBar, current: this.progressBar.current += value };
    this.changeDetector.detectChanges();
  }

  async addStudentToGoogleClassroomCourse(students: any[], alias: string) {
    const promiseList: { p: Promise<any>, student: any }[] = students.map(student => {
      if (student.LinkAccount) {
        return {
          p: this.gClassroomSrv.createStudent(this.dsns, 'google_classroom_admin', alias, student.LinkAccount),
          student,
        };
      } else {
        return { p: new Promise((r, j) => j('skip')), student };
      }
    });

    let createStudentSuccesCount = 0;
    const createStudentErrors = [];

    for (const item of promiseList) {
      try {
        await item.p;
        createStudentSuccesCount += 1;
        this.reportProgress(50 / promiseList.length);
      } catch (error) {
        if (error && error.error && error.error.status) {
          if (error.error.status !== 'ALREADY_EXISTS') {
            createStudentErrors.push(`${item.student.StudentName} (${item.student.LinkAccount}) => ALREADY_EXISTS`);
          }
        } else {
          createStudentErrors.push(`${item.student.StudentName} (${item.student.LinkAccount}) => ${ item.student.LinkAccount ? 'ERROR' : 'NO_ACCOUNT'}`);
        }
      } finally {
        this.createStudentMsg = `成功建立學生成員數：${createStudentSuccesCount}`;
      }
    }
    console.log('失敗成員數', createStudentErrors);
    if (promiseList.length === 0) { this.reportProgress(50); }
  }

  googleSigninChooserUrl(url: string = '') {
    return `https://accounts.google.com/ServiceLogin/signinchooser?service=accountsettings&continue=${url}`;
  }
}

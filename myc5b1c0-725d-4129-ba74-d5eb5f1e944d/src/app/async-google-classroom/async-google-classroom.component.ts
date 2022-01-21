import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CourseStudentRec } from '../core/data/course-student';
import { MyCourseRec } from '../core/data/my-course';
import { ErrorWithGC, GoogleClassroomService } from '../core/google-classroom.service';
import { MyCourseService } from '../core/my-course.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-async-google-classroom',
  templateUrl: './async-google-classroom.component.html',
  styleUrls: ['./async-google-classroom.component.scss']
})
export class AsyncGoogleClassroomComponent implements OnInit {

  processState = 201;
  processErrorMsg = '';
  progressBar = { max: 0, current: 0 };
  studentMap: Map<number, { info: string, message: string, student: CourseStudentRec }> = new Map();

  @Input() adminIsConnectedGoogle = false;
  @Input() adminDomain = '';
  @Input() dsns = '';
  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };

  constructor(
    private myCourseSrv: MyCourseService,
    private changeDetector: ChangeDetectorRef,
    private gClassroomSrv: GoogleClassroomService,
    private snackbarSrv: SnackbarService,
  ) { }

  ngOnInit(): void {
  }

  async asyncGoogleClassroomCourse(course: MyCourseRec) {
    if (!this.adminIsConnectedGoogle) { return; }
    if ([202].indexOf(this.processState) !== -1) { return; }

    // 1. 取得課程學生清單
    // 2. 將學生加入課程
    // 3. 將 Google Classroom 課程資訊補充到 course

    this.processErrorMsg = '';
    this.processState = 202;

    this.progressBar = {
      max: 50 * 4, // 一個步驟 => 50
      current: 0,
    };

    let students: CourseStudentRec[] = [];

    try { // 從 DSA 取得學生清單。
      students = await this.myCourseSrv.getCourseStudents(this.dsns, course.CourseId);
      this.progressBar.max += students.length;
    } catch (error) {
      this.processState = 9999;
      this.processErrorMsg = '哎呀！取得學生資料時出了一點問題！';
    }

    // 開始同步
    try {
      this.reportProgress(50); // 取得資料完成

      // 同步學生清單到 Google Classroom.
      await this.addStudentToGoogleClassroomCourse(students, course.Alias || '');

      this.progressBar.current = this.progressBar.max;
      this.changeDetector.detectChanges();

      setTimeout(() => {
        this.processState = 2000;
      }, 100);

    } catch (error) {
      console.log(error);
      this.processState = 9999;
      this.processErrorMsg = '哎呀！班級加入學生時出了一點問題！';
    }
  }

  reportProgress(value: number) {
    this.progressBar = { ...this.progressBar, current: this.progressBar.current += value };
    this.changeDetector.detectChanges();
  }

  async addStudentToGoogleClassroomCourse(students: CourseStudentRec[], alias: string) {
    this.studentMap.clear();

    const awaiter = students.map(student => {
      if (student.LinkAccount) {
        return this.gClassroomSrv.createStudent(this.dsns, 'google_classroom_admin', alias, student.LinkAccount)
          .then(() =>{
            this.studentMap.set(student.StudentId, { info: 'success', message: '', student });
          })
          .catch((reason: ErrorWithGC) => {
            if (reason.error.status === 'ALREADY_EXISTS') {
              this.studentMap.set(student.StudentId, { info: 'success', message: reason.error.message, student });
            } else {
              this.studentMap.set(student.StudentId, { info: 'error', message: reason.error.message, student });
              this.snackbarSrv.show(`建立學生${student.StudentName}時發生問題！`);
            }
          })
          .finally(() => {
            this.reportProgress(50 / students.length);
          });
      } else {
        this.studentMap.set(student.StudentId, { info: 'error', message: 'NO_ACCOUNT', student });
        this.snackbarSrv.show(`建立學生${student.StudentName}時發生問題！`);
        this.reportProgress(50 / students.length);
        return Promise.resolve();
      }
    });

    await Promise.all(awaiter);

    if (students.length === 0) { this.reportProgress(50); }
  }

  googleSigninChooserUrl(url: string = '') {
    return this.gClassroomSrv.getGoogleSigninChooserUrl(url);
  }

  viewReason() {
    const newWin = window.open('', 'gc_reason');
    if (newWin) {
      const resultS: any[] = [];
      this.studentMap.forEach(v => {
        resultS.push(`
          <td>
            ${[
              '學生',
              v.student.StudentId,
              v.student.StudentName,
              v.student.LinkAccount,
              v.info === 'success' ? '成功' : '失敗',
              v.info === 'success' ? '' : v.message
            ].join('</td><td>')}
          </td>`);
      });

      newWin.document.body.innerHTML = `
        <html>
          <head>
            <title>Result</title>
            <style type="text/css">
              table {
                border-collapse: collapse;
                border-spacing: 0px;
                margin: 30px 0 0 30px;
              }
              table, th, td {
                padding: 5px;
                border: 1px solid black;
              }
            </style>
          </head>
          <body>
            <p>Domain: ${this.adminDomain}</p>
            <table>
              <thead>
                <tr>
                  <th>身分</th>
                  <th>系統編號</th>
                  <th>姓名</th>
                  <th>登入帳號</th>
                  <th>結果</th>
                  <th>備註</th>
                </tr>
              </thead>
              <tbody>
                ${ resultS ? `<tr>${resultS.join('</tr><tr>')}</tr>` : '' }
              </tbody>
            </table>
          </body>
        </html>
      `;
    }
  }

}

import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CourseStudentRec } from '../core/data/course-student';
import { MyCourseRec, MyCourseTeacherRec } from '../core/data/my-course';
import { ErrorWithGC, GoogleClassroomCourse, GoogleClassroomService } from '../core/google-classroom.service';
import { MyCourseService } from '../core/my-course.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-add-google-classroom',
  templateUrl: './add-google-classroom.component.html',
  styleUrls: ['./add-google-classroom.component.scss']
})
export class AddGoogleClassroomComponent implements OnInit {

  googleClassroomLink = new FormControl(''); // 使用者提供的 Google Classroom Link。
  processState = 101;
  processErrorMsg = '';
  progressBar = { max: 0, current: 0 };
  createStudentMsg = '';
  linkGCSuccessMsg = '';
  teacherMap: Map<number, { info: string, message: string, teacher: MyCourseTeacherRec }> = new Map();
  studentMap: Map<number, { info: string, message: string, student: CourseStudentRec }> = new Map();

  @Input() adminIsConnectedGoogle = false;
  @Input() adminDomain = '';
  @Input() dsns = '';
  @Input() account = '';
  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };
  @ViewChild('inputLink') inputLink!: ElementRef;

  constructor(
    private myCourseSrv: MyCourseService,
    private changeDetector: ChangeDetectorRef,
    private gClassroomSrv: GoogleClassroomService,
    private snackbarSrv: SnackbarService,
  ) { }

  ngOnInit(): void {
  }

  async asyncGoogleClassroomCourse(course: MyCourseRec, action: 'create' | 'link') {
    if (!this.adminIsConnectedGoogle) { return; }
    if ([102, 202].indexOf(this.processState) !== -1) { return; }
    if (action === 'link' && !this.googleClassroomLink.value) { this.inputLink.nativeElement.focus(); return; }

    // 1. 取得共同授課老教師清單、取得課程學生清單
    // 2. 建立課程 + 將老師加入課程(協同教學)
    // 3. 將學生加入課程
    // 4. 將 Google Classroom 課程資訊補充到 course

    this.processErrorMsg = '';
    if (action === 'create') { this.processState = 102; }
    if (action === 'link') {
      this.processState = 103;
      this.progressBar = {
        max: 100, // 一個步驟 => 50
        current: 0,
      };
      await this.linkExistsGoogleClassroom(course);
      return;
    }

    this.progressBar = {
      max: 50 * 4, // 一個步驟 => 50
      current: 0,
    };
    this.createStudentMsg = '';

    let newGCourse: GoogleClassroomCourse = {} as GoogleClassroomCourse;
    let teachers: MyCourseTeacherRec[] = [];
    let courseOwner: MyCourseTeacherRec = {} as MyCourseTeacherRec;
    let coTeachers: MyCourseTeacherRec[] = [];
    let students: any = [];

    try { // 從 DSA 取得老師、學生清單。
      const promiseList = [
        this.myCourseSrv.getCoursetTeachers(this.dsns, course.CourseId),
        this.myCourseSrv.getCourseStudents(this.dsns, course.CourseId)
      ];

      teachers = await promiseList[0];
      courseOwner = teachers.find(v => v.TeacherSequence === 1) || {} as MyCourseTeacherRec;
      coTeachers = teachers.filter(v => v.TeacherSequence !== 1);

      students = await promiseList[1];
      this.progressBar.max += students.length;
    } catch (error) {
      this.processState = 9999;
      this.processErrorMsg = '哎呀！取得班級資料時出了一點問題！';
    }

    // 開始同步
    this.reportProgress(50); // 取得資料完成

    // 建立 Google Classroom.
    if (action === 'create') {
      try {
        newGCourse = await this.gClassroomSrv.createCourse(this.dsns, 'google_classroom_admin', {
          id: course.Alias || '',
          name: course.CourseName,
          ownerId: courseOwner.LinkAccount,
          courseState: 'ACTIVE',
        });
        // console.log(newGCourse);
      } catch (error) {
        this.processState = 9999;
        const reason = error as ErrorWithGC;
        if (reason && reason.error && reason.error.status) {
          if (reason.error.status === 'ALREADY_EXISTS') {
            this.processErrorMsg = '課程已存在！';
          } else if (reason.error.status === 'PERMISSION_DENIED') {
            this.processErrorMsg = `教師帳號必須是有效的 Google 教育帳號！${courseOwner.LinkAccount}`;
          }
        }

        return;
      }

      try {
        await this.addTeacherToGoogleClassroomCourse(coTeachers, course.Alias || '');
      } catch (error) { }

      this.reportProgress(50);
    }

    try { // 同步學生清單到 Google Classroom.
      await this.addStudentToGoogleClassroomCourse(students, course.Alias || '');

      if (action === 'create') { course.GoogleExt = newGCourse; }

      this.progressBar.current = this.progressBar.max;
      this.changeDetector.detectChanges();

      setTimeout(() => {
        this.processState = 2000;
      }, 100);
    } catch (error) {
      this.processState = 9999;
      this.processErrorMsg = `哎呀！班級加入學生時出了一點問題！`;
    }
  }

  async linkExistsGoogleClassroom(course: MyCourseRec) {
    const { dsns, account } = this;
    const userLink = this.googleClassroomLink.value;
    const userCode = this.getCodeFromClassroomUrl(userLink);
    this.googleClassroomLink.setValue('');
    this.linkGCSuccessMsg = '';
    let courses = [];
    let found: GoogleClassroomCourse | undefined = undefined;

    try {
      courses = await this.gClassroomSrv.getCourses(dsns, 'google_classroom_admin', account);
    } catch (error) {
      const reason = error as ErrorWithGC;
      this.processState = 9999;
      this.processErrorMsg = `哎呀！連結 Google Classroom 發生錯誤！(${reason.error.message}})`;
    }

    try {
      this.reportProgress(50);
      // console.log(courses);

      for (const course of courses) {
        const { alternateLink } = course;
        const courseCode = this.getCodeFromClassroomUrl(alternateLink);
        if (userCode == courseCode) {
          found = course;
          break;
        }
      }

      if (!found) {
        this.processState = 9999;
        this.processErrorMsg = `連結錯誤，此 Google Classroom 不存在、已封存或無權限存取。`;
        return;
      }

      try {
        await this.gClassroomSrv.setCourseAlias(dsns,
          'google_classroom_admin',
          found.id,
          course.Alias || '');

        course.GoogleExt = found;

        this.processState = 2100;
        this.linkGCSuccessMsg = `已將您的課程「${course.CourseName}」連結到 Google Classroom 的「${found.name}」。`;
      } catch (error) {
        const reason = error as ErrorWithGC;
        this.processState = 9999;
        this.processErrorMsg = `哎呀！連結 Google Classroom 發生錯誤！(${reason.error.message}})`;
      }

    } catch(error) {
      this.processState = 9999;
      this.processErrorMsg = `哎呀！連結 Google Classroom 發生錯誤！(${(error instanceof Error) ? error.message : '內部錯誤'})`;
    }
  }

  reportProgress(value: number) {
    this.progressBar = { ...this.progressBar, current: this.progressBar.current += value };
    this.changeDetector.detectChanges();
  }

  async addTeacherToGoogleClassroomCourse(teachers: MyCourseTeacherRec[], alias: string) {
    this.teacherMap.clear();

    const awaiter = teachers.map(teacher => {
      if (teacher.LinkAccount) {
        return this.gClassroomSrv.createTeacher(this.dsns, 'google_classroom_admin', alias, teacher.LinkAccount)
          .then(() =>{
            this.teacherMap.set(teacher.TeacherId, { info: 'success', message: '', teacher });
          })
          .catch((reason: ErrorWithGC) => {
            if (reason.error.status === 'ALREADY_EXISTS') {
              this.teacherMap.set(teacher.TeacherId, { info: 'success', message: reason.error.message, teacher });
            } else {
              this.teacherMap.set(teacher.TeacherId, { info: 'error', message: reason.error.message, teacher });
              this.snackbarSrv.show(`建立協同教師${teacher.TeacherName}時發生問題！`);
            }
          });
      } else {
        this.teacherMap.set(teacher.TeacherId, { info: 'error', message: 'NO_ACCOUNT', teacher });
        return Promise.resolve();
      }
    });

    await Promise.all(awaiter);
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
        this.reportProgress(50 / students.length);
        return Promise.resolve();
      }
    });

    await Promise.all(awaiter);

    if (students.length === 0) { this.reportProgress(50); }
  }

  private getCodeFromClassroomUrl(url: string) {
    const pattern = /https:\/\/classroom.google.com(\/\w)?(\/\d)?(\/\w)?\/([\w\s]*)/im;
    const match = pattern.exec(url);
    return match ? match[4] : null;
  }

  googleSigninChooserUrl(url: string = '') {
    return this.gClassroomSrv.getGoogleSigninChooserUrl(url);
  }

  viewReason() {
    const newWin = window.open('', 'gc_reason');
    if (newWin) {
      const resultT: any[] = [];
      this.teacherMap.forEach(v => {
        resultT.push(`
          <td>
            ${[
              '教師',
              v.teacher.TeacherId,
              v.teacher.TeacherName,
              v.teacher.LinkAccount,
              v.info === 'success' ? '成功' : '失敗',
              v.info === 'success' ? '' : v.message
            ].join('</td><td>')}
          </td>`);
      });

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
                ${ resultT ? `<tr>${resultT.join('</tr><tr>')}</tr>` : '' }
                ${ resultS ? `<tr>${resultS.join('</tr><tr>')}</tr>` : '' }
              </tbody>
            </table>
          </body>
        </html>
      `;
    }
  }
}

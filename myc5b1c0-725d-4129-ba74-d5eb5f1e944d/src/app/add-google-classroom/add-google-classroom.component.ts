import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MyCourseRec, MyCourseTeacherRec } from '../core/data/my-course';
import { GoogleClassroomCourse, GoogleClassroomService } from '../core/google-classroom.service';
import { MyCourseService } from '../core/my-course.service';

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

  @Input() adminConnectedGoogle = false;
  @Input() dsns = '';
  @Input() account = '';
  @Input() data: { target: MyCourseRec } = { target: {} as MyCourseRec };
  @ViewChild('inputLink') inputLink!: ElementRef;

  constructor(
    private myCourseSrv: MyCourseService,
    private changeDetector: ChangeDetectorRef,
    private gClassroomSrv: GoogleClassroomService,
  ) { }

  ngOnInit(): void {
  }

  async asyncGoogleClassroomCourse(course: MyCourseRec, action: 'create' | 'update' | 'link') {
    if (!this.adminConnectedGoogle) { return; }
    if ([102, 202].indexOf(this.processState) !== -1) { return; }
    if (action === 'link' && !this.googleClassroomLink.value) { this.inputLink.nativeElement.focus(); return; }

    // 1. 取得共同授課老教師清單、取得課程學生清單
    // 2. 建立課程 + 將老師加入課程(協同教學)
    // 3. 將學生加入課程
    // 4. 將 Google Classroom 課程資訊補充到 course

    this.processErrorMsg = '';
    this.processState = (
      action === 'create' ? 102 :
        action === 'update' ? 202 : 103);

    if (action === 'link') {
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
    try {
      this.reportProgress(50); // 取得資料完成

      // 建立 Google Classroom.
      if (action === 'create') {
        newGCourse = await this.gClassroomSrv.createCourse(this.dsns, 'google_classroom_admin', {
          id: course.Alias || '',
          name: course.CourseName,
          ownerId: courseOwner.LinkAccount,
          courseState: 'ACTIVE',
        });
        // console.log(newGCourse);

        await this.addTeacherToGoogleClassroomCourse(coTeachers, course.Alias || '');
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
        this.processErrorMsg = '哎呀！班級加入學生時出了一點問題！';
      }
    } catch (error) {
      this.processState = 9999;

      if (error && error.error && error.error.status) {
        if (error.error.status === 'ALREADY_EXISTS') {
          this.processErrorMsg = '課程已存在！';
        } else if (error.error.status === 'PERMISSION_DENIED') {
          this.processErrorMsg = `教師帳號必須是有效的 Google 教育帳號！${courseOwner.LinkAccount}`;
        }
      }
    }
  }

  async linkExistsGoogleClassroom(course: MyCourseRec) {
    const { dsns, account } = this;
    const userLink = this.googleClassroomLink.value;
    const userCode = this.getCodeFromClassroomUrl(userLink);
    this.googleClassroomLink.setValue('');

    try {
      const courses = await this.gClassroomSrv.getCourses(dsns, 'google_classroom_admin', account);
      this.reportProgress(50);
      console.log(courses);

      let found: GoogleClassroomCourse | null = null;
      for(const course of courses) {
        const { alternateLink } = course;
        const courseCode = this.getCodeFromClassroomUrl(alternateLink);
        if(userCode == courseCode) {
          found = course;
          break;
        }
      }

      if(!found) {
        this.processState = 9999;
        this.processErrorMsg = `連結錯誤，此 Google Classroom 不存在、已封存或無權限存取。`;
        return;
      }

      const rsp = await this.gClassroomSrv.setCourseAlias(dsns,
        'google_classroom_admin',
        found.id,
        course.Alias || '');

      course.GoogleExt = found;

      this.processState = 2100;
      this.createStudentMsg = `已將您的課程「${course.CourseName}」連結到 Google Classroom 的「${found.name}」。`;

    } catch(err) {
      this.processState = 9999;
      this.processErrorMsg = `哎呀！連結 Google Classroom 發生錯誤！`;
    }
  }

  reportProgress(value: number) {
    this.progressBar = { ...this.progressBar, current: this.progressBar.current += value };
    this.changeDetector.detectChanges();
  }

  async addTeacherToGoogleClassroomCourse(teachers: MyCourseTeacherRec[], alias: string) {
    const promiseList: { p: Promise<any>, teacher: any }[] = teachers.map(teacher => {
      if (teacher.LinkAccount) {
        return {
          p: this.gClassroomSrv.createTeacher(this.dsns, 'google_classroom_admin', alias, teacher.LinkAccount),
          teacher: teacher,
        };
      } else {
        return { p: new Promise((r, j) => j('skip')), teacher: teacher };
      }
    });

    // let createTeacherSuccesCount = 0;
    // const createTeacherErrors = [];

    for (const item of promiseList) {
      try {
        await item.p;
        // createTeacherSuccesCount += 1;
      } catch (error) {
        // if (error && error.error && error.error.status) {
        //   if (error.error.status !== 'ALREADY_EXISTS') {
        //     createTeacherErrors.push(`${item.teacher.TeacherName} (${item.teacher.LinkAccount})`);
        //   }
        // } else {
        //   createTeacherErrors.push(`${item.teacher.TeacherName} (${item.teacher.LinkAccount})`);
        // }
      } finally {
        // this.createTeacherMsg = `成功建立協同教師數：${createTeacherSuccesCount}`;
      }
    }
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
    // const createStudentErrors = [];

    for (const item of promiseList) {
      try {
        await item.p;
        createStudentSuccesCount += 1;
        this.reportProgress(50 / promiseList.length);
      } catch (error) {
        // if (error && error.error && error.error.status) {
        //   if (error.error.status !== 'ALREADY_EXISTS') {
        //     createStudentErrors.push(`${item.student.StudentName} (${item.student.LinkAccount})`);
        //   }
        // } else {
        //   createStudentErrors.push(`${item.student.StudentName} (${item.student.LinkAccount})`);
        // }
      } finally {
        this.createStudentMsg = `成功建立學生成員數：${createStudentSuccesCount}`;
      }
    }

    if (promiseList.length === 0) { this.reportProgress(50); }
  }

  private getCodeFromClassroomUrl(url: string) {
    const pattern = /https:\/\/classroom.google.com(\/\w)?(\/\d)?(\/\w)?\/([\w\s]*)/im;
    const match = pattern.exec(url);
    return match ? match[4] : null;
  }

  googleSigninChooserUrl(url: string = '') {
    return `https://accounts.google.com/ServiceLogin/signinchooser?service=accountsettings&continue=${url}`;
  }
}

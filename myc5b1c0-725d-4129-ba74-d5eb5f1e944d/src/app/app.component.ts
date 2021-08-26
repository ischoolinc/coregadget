import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from './core/login.service';
import { TimetableService } from './core/timetable.service';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import dj from 'dayjs';
import { GoogleClassroomCourse, GoogleClassroomService, GoogleCourseState } from './core/google-classroom.service';
import { GadgetCustomCloudServiceRec, MyCourseRec, MyCourseService, MyCourseTeacherRec, MyTargetBaseRec, Semester } from './core/my-course.service';
import { DSAService } from './dsutil-ng/dsa.service';
import { SelectComponent } from './shared/select/select/select.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';
import { MyInfo, SelectedContext } from './core/data/login';
import { ConnectedSettingService } from './core/connected-setting.service';
import { ClassroomService } from './core/classroom.service';
import { concat, interval } from 'rxjs';
import { Actions, ofActionCompleted, ofActionSuccessful, Store } from '@ngxs/store';
import { Context } from './core/states/context.actions';
import { ContextState } from './core/states/context.state';
import { Timetable } from './core/states/timetable.actions';
import { TimetableState } from './core/states/timetable.state';
import { concatMap, concatMapTo, withLatestFrom } from 'rxjs/operators';

type GadgetSystemService = 'google_classroom' | '1campus_oha' | 'custom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loading = true;
  saving = false;
  dialogRef?: MatDialogRef<any>;
  dialogRefManage?: MatDialogRef<any>;
  dialogRefAsync?: MatDialogRef<any>;

  errorMsg = '';
  processState = 101;
  processErrorMsg = '';
  progressBar = { max: 0, current: 0 };
  createStudentMsg = '';

  curSelectedContext: SelectedContext = {} as SelectedContext;
  dsns = '';
  myInfo: MyInfo = {} as MyInfo;
  adminConnectedGoogle: { success: boolean, message: string } = { success: false, message: '' };
  curSemester: Semester = {} as Semester;
  courses: MyCourseRec[] = [];
  googleCourses: GoogleClassroomCourse[] = [];

  #updateTimestamp = dj();
  classroomUpdateRequired = false;
  classroomUpdating = false;
  googleClassroomLink = new FormControl(''); // 使用者提供的 Google Classroom Link。
  dislinkingGoogle = false
  #classroom_url = 'https://oha.1campus.net';

  semesterRowSource: Semester[] = [];
  tabs = [
    { value: 0, tabId: 'tab1', tabTitle: '所有時段', checked: false },
    { value: 1, tabId: 'tab2', tabTitle: '星期一', checked: false },
    { value: 2, tabId: 'tab3', tabTitle: '星期二', checked: false },
    { value: 3, tabId: 'tab4', tabTitle: '星期三', checked: false },
    { value: 4, tabId: 'tab5', tabTitle: '星期四', checked: false },
    { value: 5, tabId: 'tab6', tabTitle: '星期五', checked: false },
    { value: 6, tabId: 'tab7', tabTitle: '星期六', checked: false },
    { value: 7, tabId: 'tab8', tabTitle: '星期日', checked: false },
  ];
  curTab = 0;
  curCourseList: MyCourseRec[] = [];

  manageProcessState = 301;
  manageProcessErrorMsg = '';

  curCSTab = 'editlink';

  @ViewChild('semester', { static: true }) semester: SelectComponent = {} as SelectComponent;

  constructor(
    private timetable: TimetableService,
    private login: LoginService,
    private dsa: DSAService,
    private myCourseSrv: MyCourseService,
    private gClassroomSrv: GoogleClassroomService,
    private dialog: MatDialog,
    private snackbarSrv: SnackbarService,
    private changeDetector: ChangeDetectorRef,
    private ConnectedSettingSrv: ConnectedSettingService,
    private crSrv: ClassroomService,
    private store: Store,
    private actions$: Actions
  ) {}

  async ngOnInit() {
    const { store, actions$ } = this;

    // 將相關資料放進 Store 裡面。
    await this.store.dispatch(new Context.FetchAll()).pipe(
      concatMap(() => actions$.pipe(ofActionSuccessful(Context.FetchAll))),
      concatMap(() => store.dispatch(new Timetable.FetchAll())),
    ).toPromise();

    // 取得 DSNS、我的登入帳號(需為 Google 登入才能使用此功能)
    // 確認管理者是否已設定連結 Google 帳號
    // 取得目前學年期、我的課程清單、我在 Google Classroom 的課程清單
    // 比對 Google Classroom 中的 alias，符合「d:dsns@course@courseId」就代表此課程有啟用 Google Classroom
    // 組合兩者的資訊

    try {
      const info = this.store.selectSnapshot(ContextState.personalInfo);
      this.myInfo = info;

      this.curSelectedContext = await this.login.getSelectedContext().toPromise() as SelectedContext;
      this.dsns = this.curSelectedContext.dsns;

      this.semesterRowSource = await this.getAttendSemesters();
      this.semester.selected = this.getHeadSemester();
      const { school_year, semester } = this.getHeadSemester();
      const sourceCourses = await this.getCourses(school_year, semester);

      await this.checkConnected();
      await this.displayCourses(sourceCourses);

      let dayOfWeek = dj().day() // 0: 星期日 1: 星期一 6: 星期六
      dayOfWeek = (dayOfWeek === 0) ? 7 : dayOfWeek;
      this.curTab = dayOfWeek;
      this.toggleTab();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }

    interval(2000).subscribe(v => {
      this.classroomUpdateRequired = dj().diff(this.#updateTimestamp, 'second') > 55;
    });
  }


  private displayCourses(sourceCourses: MyCourseRec[]) {
    sourceCourses.forEach(v => {
      v.GoogleIsReady = false;
      v.Alias = this.formatCourseAlias(v);
      v.SystemCloudService = this.createDefaultSystemCloudService();
      v.CustomCloudService = [];
      v.TargetId = v.CourseId;
      v.TargetType = 'COURSE';
      v.TargetName = v.ClassName;
    });
    this.courses = sourceCourses;
    this.mappingClassroomLive();
    this.mappingGoogleClassroom();
  }

  createDefaultSystemCloudService() {
    return new Map([
      ['google_classroom', { Enabled: true } as GadgetCustomCloudServiceRec],
      ['1campus_oha', { Enabled: true } as GadgetCustomCloudServiceRec],
      ['custom', { Enabled: true } as GadgetCustomCloudServiceRec]
    ]);
  }

  async semesterChange(sems: Semester) {
    const { school_year, semester } = sems;
    const sourceCourses = await this.getCourses(school_year, semester);
    this.displayCourses(sourceCourses);
  }

  getHeadSemester() {
    return this.semesterRowSource[0] ?? {} as Semester;
  }

  formatCourseAlias(course: MyCourseRec) {
    return `d:${this.dsns}@course@${course.CourseId}`;
  }

  async getCourses(schoolYear: number, semester: number) {
    try {
      return this.myCourseSrv.teacherGetCourses(this.dsns, schoolYear, semester);
    } catch (error) {
      this.snackbarSrv.show('取得課程發生錯誤！');
      return [];
    }
  }

  // 取得校務當前的學年期
  async getSemester() {
    try {
      const sems = await this.myCourseSrv.getCurrentSemester(this.dsns);
      return { school_year: sems.SchoolYear, semester: sems.Semester } as Semester;
    } catch (error) {
      this.snackbarSrv.show('取得目前學年期發生錯誤！');
      return {};
    }
  }

  async getAttendSemesters() {
    try {
      return (await this.myCourseSrv.teacherGetSemesters(this.dsns))?.semesters ?? [];
    } catch (error) {
      this.snackbarSrv.show('取得授課學年期發生錯誤！');
      return [];
    }
  }

  async checkConnected() {
    try {
      const rsp: any = await this.ConnectedSettingSrv.check_connected(this.dsns, 'google_classroom_admin');
      this.adminConnectedGoogle = rsp;
    } catch (error) {
      this.snackbarSrv.show('確認連結 Google 帳號發生錯誤！');
    }
  }

  async mappingGoogleClassroom() {
    if (this.adminConnectedGoogle.success) {
      for (const course of [...this.courses]) {
        this.getGoogleClassroomCourse(course).then(gCourse => {
          if (gCourse) { course.GoogleExt = gCourse; }
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          course.GoogleIsReady = true;
        })
      }
    }
  }

  async mappingClassroomLive(force: boolean = false) {

    this.classroomUpdating = true;
    this.#updateTimestamp = dj();

    try {
      const courses = this.courses.map(v => v.CourseId);
      const crlist = await this.crSrv.queryOpenStatus({
        dsns: this.dsns,
        courses
      }, force);

      this.courses.forEach(v => v.live = false);
      this.courses.forEach(v => {
        for (const cr of crlist) {
          if (v.CourseId === cr.target.uid) {
            v.live = cr.isOpen;
          }
        }
      });

      this.courses = this.courses.sort((x, y) => {
        return (y.live + '').localeCompare(x.live + '');
      });
    } catch { }
    finally {
      this.classroomUpdating = false;
      this.classroomUpdateRequired = false;
    }
  }

  async getGoogleClassroomCourse(course: MyCourseRec) {
    try {
      return this.gClassroomSrv.getCourse(this.dsns, 'google_classroom_admin', course.Alias || '');
    } catch (error) {
      this.snackbarSrv.show('取得 Google Classroom Course 時發生錯誤！');
      return {} as GoogleClassroomCourse;
    }
  }

  manageService(target: MyCourseRec, template: TemplateRef<any>) {
    this.manageProcessErrorMsg = '';
    this.manageProcessState = 301;
    this.processErrorMsg = '';
    this.processState = 101;
    this.dialogRefManage = this.dialog.open(template, {
      data: { target },
      width: '480px',
    });
  }

  asyncService(course: MyCourseRec, template: TemplateRef<any>) {
    this.processErrorMsg = '';
    this.processState = 201;
    this.dialogRef = this.dialog.open(template, {
      data: { course },
      width: '480px',
    });
  }

  async asyncGoogleClassroomCourse(course: MyCourseRec, action: 'create' | 'update' | 'link') {
    if (!this.adminConnectedGoogle.success) { return; }
    if ([102, 202].indexOf(this.processState) !== -1) { return; }

    // 1. 取得共同授課老教師清單、取得課程學生清單
    // 2. 建立課程 + 將老師加入課程(協同教學)
    // 3. 將學生加入課程
    // 4. 將 Google Classroom 課程資訊補充到 course

    this.processErrorMsg = '';
    this.processState = (
      action === 'create' ? 102 :
        action === 'update' ? 202 : 103);

    if(action === 'link') {
      this.progressBar = {
        max: 100, // 一個步驟 => 50
        current: 0,
      };
      await this.linkExistsGoogleClassroom(course);
      return
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
    const { dsns, myInfo: { account } } = this;
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
      this.createStudentMsg = `已將你的課程「${course.CourseName}」連結到 Google Classroom 的「${found.name}」。`;

    } catch(err) {
      this.processState = 9999;
      this.processErrorMsg = `哎呀！連結 Google Classroom 發生錯誤！`;
    }
  }

  async dislinkGoogleClassroom(course: MyCourseRec) {
    const { dsns } = this;
    const { GoogleExt } = course;

    try {
      this.dislinkingGoogle = true;
      await this.gClassroomSrv.delCourseAlias(dsns,
        'google_classroom_admin',
        GoogleExt?.id || '',
        course.Alias || '');

      course.GoogleExt = undefined;
    } catch(err) {
      console.error(err);
    } finally {
      this.dislinkingGoogle = false
    }
  }

  private getCodeFromClassroomUrl(url: string) {
    const pattern = /https:\/\/classroom.google.com(\/\w)?(\/\d)?(\/\w)?\/([\w\s]*)/im;
    const match = pattern.exec(url);
    return match ? match[4] : null;
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

  // toggleGoogleClassroomCourse(e: MatSlideToggleChange, course: MyCourseRec) {
  //   if (e.checked) {
  //     this.enabledGoogleClassroomCourse(course);
  //   } else {
  //     this.disabledGoogleClassroomCourse(course);
  //   }
  // }

  // async enabledGoogleClassroomCourse(course: MyCourseRec) {
  //   if (this.saving) { return; }

  //   try {
  //     this.saving = true;
  //     const rsp = await this.patchGoogleClassroomCourse(course, 'ACTIVE');
  //     course.GoogleExt = rsp;
  //   } catch (error) {
  //     this.snackbarSrv.show('啟用 Google Classroom 發生錯誤！');
  //   } finally {
  //     this.saving = false;
  //   }
  // }

  // async disabledGoogleClassroomCourse(course: MyCourseRec) {
  //   if (this.saving) { return; }

  //   try {
  //     this.saving = true;
  //     const rsp = await this.patchGoogleClassroomCourse(course, 'ARCHIVED'); // 封存課程
  //     course.GoogleExt = rsp;
  //   } catch (error) {
  //     this.snackbarSrv.show('關閉 Google Classroom 發生錯誤！');
  //   } finally {
  //     this.saving = false;
  //   }
  // }

  async patchGoogleClassroomCourse(course: MyCourseRec, courseState: GoogleCourseState) {
    return this.gClassroomSrv.patchCourse(this.dsns, 'google_classroom_admin', course.Alias || '', {
      courseState
    });
  }

  googleSigninChooserUrl(url: string) {
    return `https://accounts.google.com/ServiceLogin/signinchooser?service=accountsettings&continue=${url}`;
  }

  reportProgress(value: number) {
    this.progressBar = { ...this.progressBar, current: this.progressBar.current += value };
    this.changeDetector.detectChanges();
  }

  classroomUrl(course: MyCourseRec) {
    const roleName = this.curSelectedContext.role;
    const target = `${this.#classroom_url}?dsns=${this.dsns}&type=course&uid=${course.CourseId}&role=${roleName}`;
    return this.login.getLinkout(target);
  }

  classroomToLive(course: MyCourseRec) {
    course.live = true;
  }

  displaySemester(record: Semester) {
    if(record && record.school_year && record.semester) {
      return record ? `${record.school_year}學年度第${record.semester}學期` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料';
    }
  }

  toggleTab() {
    this.curCourseList = this.courses; // TODO: 當前 weekday
  }

  checkSystemServiceEnabled(item: MyCourseRec, service: GadgetSystemService) {
    if (item.SystemCloudService.has(service)) {
      return item.SystemCloudService.get(service)?.Enabled;
    } else {
      return true;
    }
  }

  async toggleSystemCloudService(e: MatSlideToggleChange, target: MyTargetBaseRec, service: GadgetSystemService) {
    try {
      if (target.SystemCloudService.has(service)) {
        // await this.myCourseSrv.setWeb3SystemCloudService(this.dsns, {
        //   TargetType: target.TargetType,
        //   TargetId: target.TargetId,
        //   Title: service,
        //   Link: service,
        //   Enabled: e.checked,
        // });
        target.SystemCloudService.get(service)!.Enabled = e.checked;
      }
    } catch (error) {
      target.SystemCloudService.get(service)!.Enabled = !e.checked;
    }
  }

  openAddCloudService() {
  }

  openEditCloudService() {
  }

  openClassTime() {
  }
}

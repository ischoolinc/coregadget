import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from './core/login.service';
import { TimetableService } from './core/timetable.service';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import dj from 'dayjs';
import { GoogleClassroomCourse, GoogleClassroomService, GoogleCourseState } from './core/google-classroom.service';
import { MyCourseService } from './core/my-course.service';
import { MyCourseRec, MyCourseTeacherRec, MyTargetBaseRec, Semester } from './core/data/my-course';
import { GadgetCustomCloudServiceRec } from './core/data/cloudservice';
import { DSAService } from './dsutil-ng/dsa.service';
import { SelectComponent } from './shared/select/select/select.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';
import { MyInfo, SelectedContext } from './core/data/login';
import { ConnectedSettingService } from './core/connected-setting.service';
import { ClassroomService } from './core/classroom.service';
import { concat, forkJoin, interval } from 'rxjs';
import { Actions, ofActionCompleted, ofActionSuccessful, Store } from '@ngxs/store';
import { Context } from './core/states/context.actions';
import { ContextState, ContextStateModel } from './core/states/context.state';
import { Timetable } from './core/states/timetable.actions';
import { TimetableState } from './core/states/timetable.state';
import { concatMap, concatMapTo, map, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ConfService } from './core/conf.service';
import { Conf } from './core/states/conf.actions';
import { CourseConfState } from './core/states/conf.state';
import { AsyncGoogleClassroomComponent } from './async-google-classroom/async-google-classroom.component';

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

  errorMsg = '';

  curSelectedContext: SelectedContext = {} as SelectedContext;
  dsns = '';
  myInfo: MyInfo = {} as MyInfo;
  adminConnectedGoogle: { success: boolean, message: string } = { success: false, message: '' };
  curSemester: Semester = {} as Semester;
  courses: MyCourseRec[] = [];

  #updateTimestamp = dj();
  classroomUpdateRequired = false;
  classroomUpdating = false;
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

  @ViewChild('semester', { static: true }) semester: SelectComponent = {} as SelectComponent;

  constructor(
    private timetable: TimetableService,
    private login: LoginService,
    private dsa: DSAService,
    private myCourseSrv: MyCourseService,
    private gClassroomSrv: GoogleClassroomService,
    private dialog: MatDialog,
    private snackbarSrv: SnackbarService,
    private ConnectedSettingSrv: ConnectedSettingService,
    private crSrv: ClassroomService,
    private store: Store,
    private conf: ConfService
  ) {}

  async ngOnInit() {
    const { store, conf } = this;

    // 將相關資料放進 Store 裡面。
    await store.dispatch(new Context.FetchAll()).pipe(
      concatMap(() => store.dispatch([new Timetable.FetchAll(), new Conf.FetchAll()]))
    ).toPromise();

    // store.dispatch(new Timetable.SetCourse({
    //   course_id: '11729',
    //   periods: [{ weekday: '3', period: '5' }, { weekday: '3', period: '4' }]
    // })).pipe(
    //   concatMap(() => store.selectOnce(TimetableState.getCourse)),
    //   map(fn => fn(11729))
    // ).subscribe(console.log);

    // 取得 DSNS、我的登入帳號(需為 Google 登入才能使用此功能)
    // 確認管理者是否已設定連結 Google 帳號
    // 取得目前學年期、我的課程清單、我在 Google Classroom 的課程清單
    // 比對 Google Classroom 中的 alias，符合「d:dsns@course@courseId」就代表此課程有啟用 Google Classroom
    // 組合兩者的資訊

    try {
      const info = this.store.selectSnapshot(ContextState.personalInfo);
      this.myInfo = info;
      console.log(info);

      this.curSelectedContext = await this.login.getSelectedContext().toPromise() as SelectedContext;
      this.dsns = this.curSelectedContext.dsns;

      this.semesterRowSource = await this.getAttendSemesters();
      this.semester.selected = this.getHeadSemester();
      const { school_year, semester } = this.getHeadSemester();
      const sourceCourses = await this.getCourses(school_year, semester);

      let dayOfWeek = dj().day() // 0: 星期日 1: 星期一 6: 星期六
      dayOfWeek = (dayOfWeek === 0) ? 7 : dayOfWeek;
      this.curTab = dayOfWeek;

      await this.checkConnected();
      await this.displayCourses(sourceCourses);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }

    interval(2000).subscribe(v => {
      this.classroomUpdateRequired = dj().diff(this.#updateTimestamp, 'second') > 55;
    });
  }


  private async displayCourses(sourceCourses: MyCourseRec[]) {
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
    await this.mappingClassroomLive();
    await this.mappingGoogleClassroom();
    this.toggleTab();
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

      this.courses.forEach(v => v.Live = false);
      this.courses.forEach(v => {
        for (const cr of crlist) {
          if (v.CourseId === cr.target.uid) {
            v.Live = cr.isOpen;
          }
        }
      });

      this.courses = this.courses.sort((x, y) => {
        return (y.Live + '').localeCompare(x.Live + '');
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
    this.dialogRefManage = this.dialog.open(template, {
      data: { target },
      width: '480px',
    });
  }

  googleSigninChooserUrl(url: string = '') {
    return this.gClassroomSrv.getGoogleSigninChooserUrl(url);
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

  openClassTime() {
  }
}

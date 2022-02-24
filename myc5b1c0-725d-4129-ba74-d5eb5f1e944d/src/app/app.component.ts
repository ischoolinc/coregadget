import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngxs/store';
import dj from 'dayjs';
import { interval, Subject } from 'rxjs';
import { concatMap, map, takeUntil } from 'rxjs/operators';
import { LoginService } from './core/login.service';
import { GoogleClassroomCourse, GoogleClassroomService } from './core/google-classroom.service';
import { MyCourseService } from './core/my-course.service';
import { MyCourseRec, MyTargetBaseRec, PeriodRec, Semester } from './core/data/my-course';
import { SelectComponent } from './shared/select/select/select.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';
import { MyInfo, SelectedContext } from './core/data/login';
import { ConnectedSettingService } from './core/connected-setting.service';
import { ClassroomService } from './core/classroom.service';
import { Context } from './core/states/context.actions';
import { ContextState } from './core/states/context.state';
import { Timetable } from './core/states/timetable.actions';
import { TimetableState } from './core/states/timetable.state';
import { Conf } from './core/states/conf.actions';
import { ServiceConfState } from './core/states/conf.state';
import { ServiceConf } from './core/data/service-conf';
import { TimetableManageComponent } from './timetable-manage/timetable-manage.component';
import { CourseTimetable } from './core/data/timetable';
import { Params } from './core/states/params.actions';
import { ParamsService } from './params.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  loading = true;
  saving = false;
  dialogRefManage?: MatDialogRef<any>;

  errorMsg = '';

  curSelectedContext: SelectedContext = {} as SelectedContext;
  dsns = '';
  role = '';
  myInfo: MyInfo = {} as MyInfo;
  adminConnectedGoogle: { success: boolean, message: string, link_account: string } = { success: false, message: '', link_account: '' };
  courses: MyCourseRec[] = [];

  #updateTimestamp = dj();
  classroomUpdateRequired = false;
  classroomUpdating = false;

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
  curTab = { value: 0, tabId: 'tab1', tabTitle: '所有時段', checked: true };
  curCourseList: MyCourseRec[] = [];
  scheduleSource: 'standard' | 'personal' = 'personal';

  manageProcessState = 301;
  manageProcessErrorMsg = '';
  unSubscribe$ = new Subject();

  @ViewChild('semester', { static: true }) semester: SelectComponent = {} as SelectComponent;
  @ViewChild('weekdayTab', { static: true }) weekdayTab: SelectComponent = {} as SelectComponent;

  constructor(
    private login: LoginService,
    private myCourseSrv: MyCourseService,
    private gClassroomSrv: GoogleClassroomService,
    private dialog: MatDialog,
    private snackbarSrv: SnackbarService,
    private ConnectedSettingSrv: ConnectedSettingService,
    private crSrv: ClassroomService,
    private store: Store,
    private params: ParamsService
  ) {}

  async ngOnInit() {
    const { store } = this;

    // 將相關資料放進 Store 裡面。
    await store.dispatch([new Context.FetchAll(), new Params.FetchAll]).pipe(
      concatMap(() => store.dispatch([new Timetable.FetchAll(), new Conf.FetchAll()]))
    ).toPromise();

    // 課表來源(校務行政 or 教師自行輸入)。
    this.scheduleSource = this.params.scheduleSource;

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
      this.role = this.curSelectedContext.role;

      this.semesterRowSource = await this.getAttendSemesters();
      this.semester.selected = this.getHeadSemester();
      await this.semesterChange(this.semester.selected);

      let dayOfWeek = dj().day(); // 0 ~ 6，0 是星期日
      dayOfWeek = (dayOfWeek === 0) ? 7 : dayOfWeek;
      this.weekdayTabChange(this.tabs[dayOfWeek]);

      await this.checkConnected();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }

    interval(2000).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.classroomUpdateRequired = dj().diff(this.#updateTimestamp, 'second') > 55;
    });

  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
  }

  private async displayCourses(sourceCourses: MyCourseRec[]) {
    sourceCourses.forEach(v => {
      v.GoogleIsReady = false;
      v.Alias = this.myCourseSrv.formatCourseAlias(this.dsns, v);
      v.ServiceConfig = [];
      v.Timetable = new Map();
      v.TargetId = v.CourseId;
      v.TargetType = 'COURSE';
      v.TargetName = v.CourseName;

      this.store.select(ServiceConfState.getServicesConf).pipe(
        map(fn => fn(v.CourseId))
        , takeUntil(this.unSubscribe$)
      ).subscribe(storeSC => {
        const defaultServices = this.setDefaultSystemCloudService(v.CourseId);
        defaultServices.forEach(defSC => {
          const found = storeSC.find(sc => sc.service_id === defSC.service_id);
          if (found) {
            Object.assign(defSC, found);
          }
        });
        v.ServiceConfig = defaultServices;
      });

      this.store.select(TimetableState.getCourse).pipe(
        map(fn => fn(v.CourseId))
        , takeUntil(this.unSubscribe$)
      ).subscribe(courseTimetable => {
        const colTimetable: Map<number, PeriodRec> = new Map();
        new Array().concat(courseTimetable || []).forEach((tt: CourseTimetable) => {
          new Array().concat(tt.periods).forEach(obj => {
            if (obj) {
              const intWeekday = +obj.weekday;
              if (!colTimetable.has(intWeekday)) {
                colTimetable.set(intWeekday, { Weekday: intWeekday, Periods: []});
              }
              colTimetable.get(intWeekday)!.Periods.push(+obj.period);
            }
          });
        });
        colTimetable.forEach(item => {
          item.Periods = item.Periods.sort();
        });
        v.Timetable = new Map([...colTimetable].sort());
      });
    });

    this.courses = sourceCourses;
    await this.mappingClassroomLive();
    await this.mappingGoogleClassroom();
    this.toggleTab();
  }

  // 設定雲端服務初始值，如果沒設定過，資料庫不會有資料
  setDefaultSystemCloudService(courseId: number) {
    return [
      { uid: '', course_id: courseId, service_id: '1campus_oha', conf: null, link: '', enabled: true, order: 1 },
      { uid: '', course_id: courseId, service_id: 'google_classroom', conf: null, link: '', enabled: true, order: 2 },
      { uid: '', course_id: courseId, service_id: 'customize', conf: {}, link: '', enabled: true, order: 3 },
    ];
  }

  async semesterChange(sems: Semester) {
    const { school_year, semester } = sems;
    const sourceCourses = await this.getCourses(school_year, semester);
    this.displayCourses(sourceCourses);
  }

  getHeadSemester() {
    return this.semesterRowSource[0] ?? {} as Semester;
  }

  async getCourses(schoolYear: number, semester: number) {
    if (this.role === 'teacher') {
      try {
        return this.myCourseSrv.teacherGetCourses(this.dsns, schoolYear, semester);
      } catch (error) {
        this.snackbarSrv.show('取得課程發生錯誤！');
        return [];
      }
    } else {
      try {
        const rsp = await this.myCourseSrv.studentGetCourses(this.dsns, schoolYear, semester);
        const courseMap: Map<string, MyCourseRec> = new Map();
        new Array().concat(rsp || []).forEach(v => {
          const alias = this.myCourseSrv.formatCourseAlias(this.dsns, v);
          if (!courseMap.has(alias)) {
            courseMap.set(alias, { ...v, Teachers: [] });
          }
          const item = courseMap.get(alias);
          item!.Teachers!.push({
            TeacherId: v.TeacherId,
            TeacherName: v.TeacherName,
            LinkAccount: v.LinkAccount,
            TeacherSequence: v.TeacherSequence,
          });
        });
        return [ ...courseMap.values() ];
      } catch (error) {
        this.snackbarSrv.show('取得課程發生錯誤！');
        return [];
      }
    }
  }

  async getAttendSemesters() {
    if (this.role === 'teacher') {
      try {
        return (await this.myCourseSrv.teacherGetSemesters(this.dsns))?.semesters ?? [];
      } catch (error) {
        this.snackbarSrv.show('取得授課學年期發生錯誤！');
        return [];
      }
    } else {
      try {
        return (await this.myCourseSrv.studentGetSemesters(this.dsns))?.semesters ?? [];
      } catch (error) {
        this.snackbarSrv.show('取得學年期發生錯誤！');
        return [];
      }
    }
  }

  async checkConnected() {
    try {
      const rsp: any = await this.ConnectedSettingSrv.check_connected(this.dsns, 'google_classroom_admin');
      // this.adminConnectedGoogle = rsp;
      this.adminConnectedGoogle.success = false;
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

  /**
   * 教師彩色無 Live；學生以下方邏輯運行：
   * a. 灰色：教師完全沒有啟用教室。不能點擊。
   * b. 彩色無 Live：教師有啟用教室，但不在教室中。可以點擊。
   * c. 彩色有 Live：教師在教室中。可以點擊。
   */
  async mappingClassroomLive(force: boolean = false) {

    this.classroomUpdating = true;
    this.#updateTimestamp = dj();

    try {
      const courses = this.courses.map(v => v.CourseId);
      const crlist = await this.crSrv.queryOpenStatus({
        dsns: this.dsns,
        courses
      }, force);

      this.courses.forEach(v => v.Live = 'Enabled');
      this.courses.forEach(v => {
        for (const cr of crlist) {
          if (v.CourseId === cr.target.uid) {
            if (this.role === 'teacher') v.Live = 'Enabled';
            if (this.role === 'student') v.Live = cr.guessOpen();
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

  displaySemester(record: Semester) {
    if(record && record.school_year && record.semester) {
      return record ? `${record.school_year}學年度第${record.semester}學期` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料';
    }
  }

  displayWeekdayTab(tab: { value: number, tabId: string, tabTitle: string, checked: boolean }) {
    return tab?.tabTitle || '所有時段';
  }

  weekdayTabChange(tab: { value: number, tabId: string, tabTitle: string, checked: boolean }) {
    this.tabs.forEach(v => v.checked = (v.tabId === tab.tabId));
    this.curTab = tab;
    this.toggleTab();
  }

  toggleTab() {
    if (this.curTab.value === 0) { // 所有時段
      this.curCourseList = this.courses;
    } else {
      const tmp = this.courses.filter(v => {
        if (v.Timetable.has(this.curTab.value)) {
          return true;
        } else {
          return false;
        }
      });

      this.curCourseList = tmp.sort((a, b) => {
        const x = a.Timetable.get(this.curTab.value)?.Periods;
        const y = b.Timetable.get(this.curTab.value)?.Periods;
        return (x ? x[0] : 0) - (y ? y[0] : 0);
      });
    }
  }

  checkServiceIsEnabled(scs: ServiceConf[], service_id: string) {
    const serviceConf = scs.find(item => item.service_id === service_id);
    return serviceConf?.enabled;
  }

  async toggleEnabledService(e: MatSlideToggleChange, target: MyTargetBaseRec, sc: ServiceConf) {
    if (this.saving) { return; }

    this.saving = true;
    try {
      await this.store.dispatch(new Conf.SetConf({
        course_id: target.TargetId,
        service_id: sc.service_id,
        enabled: e.checked,
        order: sc.order,
      })).toPromise();
    } catch (error) {
    } finally {
      this.saving = false;
    }
  }

  manageTimeTable(course: MyCourseRec) {
    this.dialogRefManage = this.dialog.open(TimetableManageComponent, {
      data: { course },
    });
  }

  getAdminDomain() {
    try {
      return this.adminConnectedGoogle.link_account.split('@')[1];
    } catch (error) {
      return '';
    }
  }
}

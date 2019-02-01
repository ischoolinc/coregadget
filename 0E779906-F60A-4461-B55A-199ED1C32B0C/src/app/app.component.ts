import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import * as moment from 'moment';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { BasicService } from './service';
import { SemesterFormatPipe } from './shared/pipes/semester-format.pipe';
import { SimpleModalComponent } from './shared/component/simple-modal/simple-modal.component';
import { ConflictCourse, Course } from './data';
import { GadgetService } from './gadget.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  providers: [
    SemesterFormatPipe,
  ]
})
export class AppComponent implements OnInit {
  loadState: 'ready' | 'finish' | 'loading' | 'error' | 'limited' | 'closed' | 'black' = 'loading';
  isSaving = false;
  mainMsgClass = '';
  mainMsgText = '';
  modalRef: BsModalRef;

  currTab = '';

  get student() {
    return this.basicSrv.student;
  }
  get openingDate() {
    return this.basicSrv.openingDate;
  }
  get currSchoolYear() {
    return this.basicSrv.currSchoolYear;
  }
  get currSemester() {
    return this.basicSrv.currSemester;
  }
  get currLevel() {
    return this.basicSrv.currLevel;
  }
  get allCourse() {
    return this.basicSrv.allCourse;
  }
  get faqA() {
    return this.basicSrv.faqA;
  }
  get faqB() {
    return this.basicSrv.faqB;
  }
  get configuration() {
    return this.basicSrv.configuration;
  }

  /**目前界面上是否有衝突 */
  conflicted = false;

  /**目前已選課程清單 */
  currAttends: Course[] = [];
  /**可選課程(可加選) */
  canChooseCourses: Course[] = [];
  /**選課最終確認課程清單 */
  scAttends: Course[] = [];
  /**衝堂課程 */
  conflictCourseMap: Map<string, ConflictCourse> = new Map();

  /**取得退選記錄LOG */
  scAttendWithdrawnLogs: Course[] = [];

  /**是否已確認最終選課結果 */
  scConfirmed = false;
  /**使用者確認最終選課結果的日期 */
  scConfirmDate = '';

  constructor(
    private basicSrv: BasicService,
    private semesterFormatPipe: SemesterFormatPipe,
    private modalService: BsModalService,
    private viewportScroller: ViewportScroller,
    private gadgetService: GadgetService) {
  }

  async ngOnInit() {
    this.loadState = await this.basicSrv.init();

    if (this.loadState === 'ready') {
      try {
        if (this.currLevel === 'choose') {
          this.getConflictCourse();
          this.getCanChooseCourse();
          this.getAttend();
        } else if (['announcement', 'afterAnnouncement', 'increment'].indexOf(this.currLevel) !== -1) {
          this.getConflictCourse();
          this.getAttend();
        } else if (this.currLevel === 'afterChoose') {
          this.getConflictCourse();
        } else if (this.currLevel === 'afterIncrement') {
          this.getSCAttend();
        } else if (this.currLevel === 's5') {
          this.getConflictCourse();
        }

        // 設定預設 tabs
        if (['s5', 'choose', 'beforeChoose'].indexOf(this.currLevel) !== -1) {
          this.currTab = 'sa01';
        } else if (['afterChoose', 'announcement', 'afterAnnouncement', 'increment'].indexOf(this.currLevel) !== -1) {
          this.currTab = 'sa06';
        } else if (['afterIncrement'].indexOf(this.currLevel) !== -1) {
          this.currTab = 'sa07';
        } else {
          this.currTab = 'sa02';
        }

        this.gadgetService.onLeave(() => {
          if (this.stopExit()) {
            return '您尚未儲存選課結果，確認要離開此網頁嗎?';
          }
          return '';
        });

        this.loadState = 'finish';
      } catch (error) {
        this.loadState = 'error';
      }
    }
  }

  /**切換頁籤 */
  toggleTab(tabName: string) {
    if (this.currTab === 'sa01' && tabName !== 'sa01') {
      if (this.stopExit()) {
        const config = {
          initialState: {
            title: '離開網頁',
            content: '您尚未儲存選課結果，確認要離開此網頁嗎?',
            okBtn: {
              show: true,
              text: '確定',
              clickBtn: async() => {
                this.currTab = tabName;
                this.modalRef.hide();
              }
            },
            cancelBtn: {
              show: true,
              text: '取消',
              clickBtn: () => { this.modalRef.hide(); }
            }
          }
        };
        this.openModal(SimpleModalComponent, config);
      } else {
        this.currTab = tabName;
      }
    } else {
      this.currTab = tabName;
    }
  }

  /**取得已選課程，調整課程的退選狀態、衝突課程、選課來自哪個階段 */
  async getAttend() {
    this.currAttends = [];

    try {
      const rsp = await this.basicSrv.getAlumniSelectCourse(this.currSchoolYear, this.currSemester);

      for (const item of rsp) {
        if (this.allCourse.has(item.AlumniID)) {
          const course = this.allCourse.get(item.AlumniID);
          course.WillQuit = false;
          course.HaveConflict = [];
          this.currAttends.push(course);
        }
      }
    } catch (error) {

    }
  }

  /**重設可所有勾選狀態 */
  resetAddQuit() {
    this.currAttends.map((v: Course) => { v.WillQuit = false; v.HaveConflict = []; });
    this.canChooseCourses.map((v: Course) => { v.WillAdd = false; v.HaveConflict = []; });
    this.checkAddQuitBtn();
  }

  /**
   * 加入或取消勾選課程
   * 退選：
   *  勾選(要退選) =>
   *    state = true。比對所有可加選課程中，所有 WillAdd = true 的所有突衝課程，將其視為不衝突
   *  取消勾選(保持已選) =>
   *    state = false。比對所有可加選課程中，所有 WillAdd = true 的所有突衝課程，將其視為衝突
   * 加選：
   *  勾選(要加選) =>
   *    state = true。比對預選、已選課程中，所有 WillQuit = false 的所有突衝課程，將其視為衝突；
   *    state = true。比對可加選課程中，所有 WillAdd = true 的所有突衝課程，將其視為衝突
   *   取消勾選(取消加選) =>
   *    state = false。比對預選、已選課程中，所有 WillQuit = false 的所有突衝課程，將其視為不衝突；
   *    state = false。比對可加選課程中，所有 WillAdd = true 的所有突衝課程，將其視為不衝突
  */
  clickCourseCheckbox(course: Course, keyName: string) {
    course[keyName] = !course[keyName];
    const checked = course[keyName];
    let status = false;
    if (keyName === 'WillQuit') { status = !checked; }
    if (keyName === 'WillAdd') { status = checked; }

    if (this.conflictCourseMap.has(course.AlumniID)) {
      // 取得本課程的衝突清單
      const conflictIds = this.conflictCourseMap.get(course.AlumniID).conflictCourseIds;

      for (const alumniId of conflictIds) {

        // 與已選課程比較，找出已選且衝突的課程，將其衝突清單異動，之後要用 tooltip 顯示
        for (const item of this.currAttends) {
          if (item.AlumniID === alumniId && !item.WillQuit) {
            if (status) {
              course.HaveConflict.push(item.AlumniID);
              item.HaveConflict.push(course.AlumniID);
            } else {
              item.HaveConflict = item.HaveConflict.filter((v: string) => v !== course.AlumniID);
            }
          }
        }

        // 與加選課程比較，將其衝突清單異動，之後要用 tooltip 顯示
        for (const item of this.canChooseCourses) {
          if (item.AlumniID === alumniId && item.WillAdd) {
            if (status) {
              course.HaveConflict.push(item.AlumniID);
              item.HaveConflict.push(course.AlumniID);
            } else {
              item.HaveConflict = item.HaveConflict.filter((v: string) => v !== course.AlumniID);
            }
          }
        }
      }
    }

    // 幫自己清除衝堂
    // 如果為「已選 + 勾選退選 => 退選」，將全部的衝突資料移除
    // 如果為「加選 + 取消勾選 => 不加選」，將全部的衝突資料移除
    if (!status) course.HaveConflict = [];

    this.checkAddQuitBtn();
  }

  /**確認可選課程目前是否有任何衝突 */
  checkAddQuitBtn() {
    if (this.canChooseCourses.find((v: Course) => v.HaveConflict.length > 0)) {
      this.conflicted = true;
    } else {
      this.conflicted = false;
    }
  }

  /**可選課程(可加選) */
  async getCanChooseCourse() {
    this.canChooseCourses = [];

    try {
      const rsp = await this.basicSrv.getCanChooseCourse(this.currSchoolYear, this.currSemester);
      for (const item of rsp) {
        if (this.allCourse.has(item.AlumniID)) {
          const course = this.allCourse.get(item.AlumniID);
          course.WillAdd = false;
          course.HaveConflict = [];
          this.canChooseCourses.push(course);
        }
      }
    } catch (error) {

    }
  }

  /**我的修課清單 */
  async getSCAttend() {
    try {
      const rsp = await this.basicSrv.getAlumniPractiseCourse(this.currSchoolYear, this.currSemester);
      for (const item of rsp) {
        if (this.allCourse.has(item.CourseID)) {
          const course = this.allCourse.get(item.CourseID);
          this.scAttends.push(course);
        }
      }
    } catch (error) {

    }
  }

  /**取得衝堂課程 */
  async getConflictCourse() {
    try {
      const rsp = await this.basicSrv.getConflictAlumniCourse(this.currSchoolYear, this.currSemester);
      const items = {};

      for (const item of rsp) {
        if (!items[item.CourseIDA]) {
          items[item.CourseIDA] = [];

          this.conflictCourseMap.set(item.CourseIDA, {
            course: this.allCourse.get(item.CourseIDA),
            conflictCourseIds: [],
            conflictCourses: [],
          });
        }
        items[item.CourseIDA].push(item.CourseIDB);

        const data = this.conflictCourseMap.get(item.CourseIDA);
        data.conflictCourseIds.push(item.CourseIDB);
        data.conflictCourses.push(this.allCourse.get(item.CourseIDB));
      }
    } catch (error) {

    }
  }

  /**取得退選課程 */
  getQuitList(): Course[] {
    return this.currAttends.filter(item => item.WillQuit);
  }

  /**取得加選課程 */
  getAddList(): Course[] {
    return this.canChooseCourses.filter(item => item.WillAdd);
  }

  /**已選課程總數，用於顯示目前無資料 */
  getLevelItems() {
    return this.currAttends.length;
  }

  /**顯示詢問視窗 */
  openModal(content: any, config?: ModalOptions) {
    this.modalRef = this.modalService.show(content, Object.assign({}, config));
  }

  /**詢問是否加退選課程 */
  confirmQuitAddCourse() {
    const modalTitle = '課程確認';
    const quitList = this.getQuitList();
    const addList = this.getAddList();

    if ((quitList.length + addList.length) > 0) {
      const quitCourseNames = quitList.map(item => item.CourseName);
      const addCourseNames = addList.map(item => item.CourseName);
      const modalContent = `
        <div>
          <p>
            <span style="font-size: large;color: red;">退出課程</span>：${quitCourseNames.join(', ') || '無'}
          </p>
          <p>
            <span style="font-size: large;color: red;">加選課程</span>：${addCourseNames.join(', ') || '無'}
          </p>
        </div>
      `;

      const config = {
        initialState: {
          title: modalTitle,
          content: modalContent,
          okBtn: {
            show: true,
            text: '送出',
            loadingText: '儲存中...',
            clickBtn: async() => {
              if (this.isSaving) return;

              this.isSaving = true;
              try {
                await this.saveQuitAdd(quitList, addList);

                this.modalRef.hide();

                this.viewportScroller.scrollToPosition([0, 0]);
                this.mainMsgClass = 'alert alert-success';
                this.mainMsgText = '儲存成功！';
                setTimeout(() => {
                  this.mainMsgClass = '';
                  this.mainMsgText = '';
                }, 5000);
              } catch (error) {
                (this.modalRef.content as SimpleModalComponent).errorMsg = '儲存失敗！';
              } finally {
                (this.modalRef.content as SimpleModalComponent).resetOkBtn();
                this.isSaving = false;
              }
            }
          },
          cancelBtn: {
            show: true,
            text: '取消',
            clickBtn: () => { this.modalRef.hide(); }
          }
        }
      };
      this.openModal(SimpleModalComponent, config);
    } else {
      const config = {
        initialState: {
          title: modalTitle,
          content: '<p>未有任何異動！</p>',
          okBtn: {
            show: false,
          }
        }
      };
      this.openModal(SimpleModalComponent, config);
    }
  }

  // 送出Email
  async sendMail(addListBackup: Course[], quitListBackup: Course[]) {

    // 製作郵件內的加退選課程表格
    const getCourseHtml = (courses: Course[]) => {
      const txt = [];
      if (courses.length === 0) {
        txt.push('<tr><td colspan="8">無課程</td>');
      } else {
        for (const item of courses) {
          txt.push(`
            <tr>
              <td>${item.NewSubjectCode || ''}</td>
              <td>${item.ClassName || ''}</td>
              <td>${item.CourseName || ''}</td>
              <td>${item.TeacherURLName || ''}</td>
              <td>${item.Credit || ''}</td>
              <td>${item.MumberOfElectives || ''}</td>
              <td>${item.Classroom || ''}</td>
              <td>${item.CourseTimeInfo || ''}</td>
            </tr>
            <tr>
              <td colspan="8">${item.Memo || ''}</td>
            </tr>
          `);
        }
      }
      return (`
        <table border="1" cellpadding="5px" style="border: 1px solid #C3C3C3; border-collapse: collapse;">
          <thead>
            <tr>
              <th>課程編號</th>
              <th>班次</th>
              <th>課程名稱</th>
              <th>授課教師</th>
              <th>學分</th>
              <th>人數上限</th>
              <th>教室</th>
              <th>上課時間</th>
            </tr>
          </thead>
          <tbody>
            ${txt.join('')}
          </tbody>
        </table>
      `);
    }

    // 將郵件範本格式的特定符號取代為正確內容
    const replaceContent = (content = '', mailSendingTime = '', status = '') => {
      content = content.replace(/\[\[學年度\]\]/g, this.currSchoolYear);
      content = content.replace(/\[\[學期\]\]/g, this.semesterFormatPipe.transform(this.currSemester));
      content = content.replace(/\[\[選課結果寄出時間\]\]/g, mailSendingTime);
      content = content.replace(/\[\[加退選狀態\]\]/g, status);
      content = content.replace(/\[\[加選堂數\]\]/g, addListBackup.length.toString());
      content = content.replace(/\[\[退選堂數\]\]/g, quitListBackup.length.toString());
      content = content.replace(/\[\[加選課程\]\]/g, (addListBackup.length > 0) ? `<p>加選課程：</p>${getCourseHtml(addListBackup)}` : '');
      content = content.replace(/\[\[退選課程\]\]/g, (quitListBackup.length > 0) ? `<p>退選課程：</p>${getCourseHtml(quitListBackup)}` : '');
      content = content.replace(/\[\[選課結果\]\]/g, `<p>選課結果：</p>${getCourseHtml(this.currAttends)}`);
      return content;
    }

    // 收件人
    const receiverList = [];
    for (let ii = 1; ii <= 5; ii += 1) {
      if (this.student['Email' + ii]) {
        receiverList.push(`${this.student.StudentName || ''}<${this.student['Email' + ii]}>`);
      }
    }
    if (receiverList.length > 0) {
      // 選課結果寄出時間
      const mailSendingTime = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

      // 信件主旨
      let mailSubject = this.configuration['寄發新選課程與退選課程通知Email_subject'] || '';
      // 信件內容
      let mailContent = this.configuration['emba_alumnicoursemodule_newly_elected_courses'] || '';
      // 加退選狀態
      let status = '';

      if (addListBackup.length > 0) { status += '加'; }
      if (quitListBackup.length > 0) { status += '退'; }
      status += '選';

      // 取代特定符號文字
      mailSubject = replaceContent(mailSubject, mailSendingTime, status);
      mailContent = replaceContent(mailContent, mailSendingTime, status);

      try {
        await this.basicSrv.sendMail(receiverList.join(','), mailSubject, mailContent);
        await this.basicSrv.addLog(
          '校友選課結果通知',
          '發送校友選課結果通知成功',
          `校友「'${this.student.StudentName}」發送校友選課結果通知成功`
        );
      } catch (error) {
        await this.basicSrv.addLog(
          '校友選課結果通知',
          '發送校友選課結果通知失敗',
          `校友「'${this.student.StudentName}」發送校友選課結果通知失敗：${JSON.stringify(error)}`
        );
      }
    } else {
      await this.basicSrv.addLog(
        '校友選課結果通知',
        '發送校友選課結果通知失敗',
        `校友「${this.student.StudentName}」未設定Email`
      );
    }
  };

  /**儲存加退選課 */
  async saveQuitAdd(quitList: Course[] = [], addList: Course[] = []) {
    const reqList = [];

    if (quitList.length) {
      reqList.push([
        this.basicSrv.withdrawnElective(quitList.map((item: Course) => {
          return { AlumniID: item.AlumniID };
        })),
        this.basicSrv.setElectiveLog(quitList.map((item: Course) => {
          return { AlumniID: item.AlumniID, Action: 'delete', ActionBy: 'student' };
        })),
        this.basicSrv.addLog(
          '退選',
          '退選課程',
          `校友「${this.student.StudentName}」退選課程：\n` +
            `${quitList.map((item: Course) => item.CourseName).join(',')}`
        )
      ]);
    }
    if (addList.length) {
      reqList.push([
        this.basicSrv.setElective(addList.map((item:Course) => {
          return { AlumniID: item.AlumniID };
        })),
        this.basicSrv.setElectiveLog(addList.map((item: Course) => {
          return { AlumniID: item.AlumniID, Action: 'insert', ActionBy: 'student' };
        })),
        this.basicSrv.addLog(
          '加選',
          '加選課程',
          `校友「${this.student.StudentName}」加選課程：\n` +
            `${addList.map((item: Course) => item.CourseName).join(',')}`
        )
      ]);
    }


    await Promise.all(reqList.reduce((acc, val) => acc.concat(val), []));

    // 1、備份原始加選課程及退選課程(送出前狀態)
    var addListBackup = this.getAddList();
    var quitListBackup = this.getQuitList();

    // 2、重新取得已選課程。(送出後狀態)
    await this.getAttend();

    // 3、寄送郵件通知
    await this.sendMail(addListBackup, quitListBackup);

    // 4、重新取得可選課程
    await this.getCanChooseCourse();
  }

  /**中止切換頁面(確認是否有勾選課程但尚未儲存) */
  stopExit() {
    const quitList = this.getQuitList();
    const addList = this.getAddList();
    if ((quitList.length + addList.length) > 0) {
      return true;
    }
    return false;
  };

  /**衝堂或不得重複加選的 tooltip 文字 */
  conflictCourseNames(alumniIDs: string[]) {
    if (alumniIDs && alumniIDs.length) {
      const title = alumniIDs.map(alumniId => this.allCourse.get(alumniId).CourseName || '');
      return `與「${title.join(', ')}」衝堂或不得重複加選`;
    } else {
      return '';
    }
  }
}

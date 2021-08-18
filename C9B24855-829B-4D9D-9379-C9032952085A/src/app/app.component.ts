import { ConditionalExpr } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GadgetService } from './gadget.service';
import { ToolService } from './services/tool.service';
import { ICourseInfo, CurrentItem, ITermInfo, IeslRecord, IAssessment, ISubjectInfo } from './vo/vo';
// import  { CurrentItem } from './vo/vo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  courseSelectIsOpen = false;
  title = 'ESLnesh';
  loading = false;
  accessPoint: string | undefined;
  schoolInfo: any;
  myCourse: ICourseInfo[] = [];
  currentItem: CurrentItem = new CurrentItem();
  showTarget: string = "";
  error: any;
  constructor(
    private gadget: GadgetService
    , private tool: ToolService
    , private router: Router
    , private activeRoute: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    this.showTarget = "esl_score";
    this.currentItem.currentShowSection = "Score";
    await this.getschoolInfo();
    await this.getStudentCourse();
    this.routeTo(this.showTarget); //顯示show target 的畫面
    await this.getEslTemplateByCourseID();

  }

  /** 取得學生資訊 */
  async getStudentESLInfo() {
    const contract = await this.gadget.getContract('1campus.esl.student');
    const rsp = contract.send('getESLscore');

  }

  /** 取得學校資訊*/
  async getschoolInfo() {
    try {
      this.loading = true;

      // 取得 contract 連線。
      const contract = await this.gadget.getContract('basic.public');

      this.accessPoint = contract.getAccessPoint;

      // 呼叫 service。
      this.schoolInfo = await contract.send('beta.GetSystemConfig', {
        Name: '學校資訊'
      });


    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }

  }

  /**取得學生資訊 */
  async getStudentCourse() {
    try {
      this.loading = true;

      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');

      // 呼叫 service。
      let rsp = await contract.send('GetMyCourses');

      this.myCourse = [].concat(rsp.CoursesInfo);
      // 設定default
      if (this.myCourse.length > 0) {
        this.currentItem.selectedCourse = this.myCourse[0];
      } else { //顯示目前無成績資訊


      }

    } catch (ex) {


    } finally {
      this.loading = false;
    }
  }

  /** 取得 評分樣版 */
  async getEslTemplateByCourseID() {
    try {
      this.loading = true;

      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');
      // 呼叫 service。
      let rsp = await contract.send('GetEslTemplate', {
        CourseID: this.currentItem?.selectedCourse?.CourseID
      });


    } catch (ex) {


    } finally {
      this.loading = false;
    }

  }


  /** 切換要顯示 成績還是behavior */
  changeShowSection(sectionName: string) {

    if (sectionName == "Score") {
      this.routeTo("esl_score");

    } else if (sectionName == "Behavior") {
      this.routeTo("behavior");
    }

  }

  /** 選擇課程改變的時候*/
  changeCourse(courseInfo: any) {
    this.courseSelectIsOpen = false;
    this.currentItem.selectedCourse = courseInfo;
    alert("你選的是 :" + this.currentItem?.selectedCourse?.CourseID);
    this.routeTo("esl_score");

  }

  /** */
  async routeTo(to: any) {
    await this.router.navigate([to, this.currentItem.selectedCourse?.CourseID])

  }
}

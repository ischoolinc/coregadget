import { ConditionalExpr, identifierModuleUrl } from '@angular/compiler';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { debug } from 'console';
import { GadgetService } from './gadget.service';
import { SelectComponent } from './select/select/select.component';
import { DataServiceService } from './services/data-service.service';
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
  islock :boolean =false;


  /**存放學生抓回來的資料 */
  eslScoreInfoMap: Map<string, ITermInfo> = new Map();
  eslScoreInfoList: ITermInfo[] = [];

  @ViewChild('semester', { static: true }) semester: SelectComponent | undefined;
  constructor(
    private gadget: GadgetService
    , private tool: ToolService
    , private router: Router
    , private activeRoute: ActivatedRoute
    , private dataServiceService:DataServiceService
  ) {
  }

  async ngOnInit() {
    this.showTarget = "esl_score";
    this.currentItem.currentShowSection = "Score";
    await this.getschoolInfo();
    await this.getStudentCourse();
    this.routeTo(this.showTarget); //顯示show target 的畫面
    await this.getEslTemplateByCourseID();
    await this.getESLScoreInfoByCourID()

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
      this.islock=false ;

    } else if (sectionName == "Behavior") {
      this.islock=true ;
      this.routeTo("behavior");
    }

  }

  /** 選擇課程改變的時候*/
  changeCourse(courseInfo: any) {
    this.courseSelectIsOpen = false;
    this.currentItem.selectedCourse = courseInfo;
    this.getESLScoreInfoByCourID();


    alert("你選的是 :" + this.currentItem?.selectedCourse?.CourseID);
    this.routeTo("esl_score");

  }

  /** */
    async routeTo(to: any) {
      // alert('hihi')
      await this.dataServiceService.setCurrentItem( this.currentItem) ;
      await this.router.navigate([to, this.currentItem.selectedCourse?.CourseID])

    }
  courseChange(courseInfo: any)
  {
    this.changeCourse(courseInfo);

  }


  displayCourse(courseInfo: any) {
    console.log("【displayCourse】",courseInfo)
    //console.log("record ....",courseInfo);
    //console.log("hihi~~~")
    if(courseInfo && courseInfo.CourseName ) {
      return courseInfo ? `${courseInfo.CourseName}` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料.....';
    }
  }

  /** */
  termChange(term:ITermInfo ){
    console.log("【termChange....】",term)
    alert('99')

    this.currentItem.currentTerm = term;
    this.currentItem.currentSubj = term.SubjectInfosList?.[0];
    this.dataServiceService.setCurrentItem(this.currentItem) ;
   }
  /**subj 改變 */
  subjChange(subj :any){

    this.currentItem.currentSubj = subj;
    this.dataServiceService.setCurrentItem(this.currentItem) ;
    console.log("【subjChange....】",subj);

   }


   /**取得學生的資料 */
   async getESLScoreInfoByCourID() {
    alert('來來來1')
    this.eslScoreInfoMap=new Map();
    this.eslScoreInfoList=[];
    // this.currentItem =new CurrentItem();
    // try {
      this.loading = true;
      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');
      // 呼叫 service。
      let rsp = await contract.send('GetESLscoreByCourseID', {
        CourseID: this.currentItem.selectedCourse?.CourseID
      });

      console.log("哈哈",rsp);
      // 整理一下唷
      const eslRecords: IeslRecord[] = [].concat(rsp.ESLScoreRecord||[]);
      eslRecords.forEach(scoreRecord => {


        // if(scoreRecord.UID =='51641')
        // { alert("get you");
        // console.log("scoreRecord",scoreRecord);
        // debugger
        // }
        let type = this.tool.checkScoreType(scoreRecord.CustomAssessment, scoreRecord.Assessment, scoreRecord.Subject, scoreRecord.Term);
        // Term
        if (!this.eslScoreInfoMap.has(scoreRecord.Term)) {
          let term = {
            termName: scoreRecord.Term,
            SubjectInfosMap: new Map(),
            SubjectInfosList: [],
            termScore: "",
            weight: ""
          };
          if (type == "term") {
            term.termScore = scoreRecord.Value;
            term.weight = scoreRecord.TermWeight;
          }

          this.eslScoreInfoMap.set(scoreRecord.Term, term);
          this.eslScoreInfoList.push(term);

        }
        // Subject

        if (!this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.has(scoreRecord.Subject)) {
          let subj = {
            subjectName: scoreRecord.Subject,
            AssessmentsMap: new Map(),
            AssessmentsList: [],
            subjScore: "",
            weight: ""
          };


          this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.set(scoreRecord.Subject, subj)
          this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosList.push(subj);
        }



        if (type == "subject") {
          alert("subj")
          let target =this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.get(scoreRecord.Subject)
          debugger
          if(target)
          {
            target.subjScore = scoreRecord.Value;
            target.weight = scoreRecord.SubjectWeight;
          }
          }
        // Accessment

        // if(scoreRecord.UID =='45513')
        // {
        // alert("get you");
        // console.log("scoreRecord",scoreRecord);
        // debugger
        // }
        let currentSubjectInfo: ISubjectInfo | undefined;
        if (this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.has(scoreRecord.Subject)) {
          currentSubjectInfo = this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.get(scoreRecord.Subject)
        //  if(scoreRecord.Assessment=="Midterm Exam")
        //  {
        //   alert("stop");
        //   console.log("assessment",scoreRecord);
        //   // debugger

        //  }
          if (!currentSubjectInfo?.AssessmentsMap.has(scoreRecord.Assessment)) {
            let assessment = {
              assessmentName: scoreRecord.Assessment,
              score: "",
              customAssessmentsMap: new Map(),
              customAssessmentsList: [],
              weight: ""
            }

            if(scoreRecord.Assessment=="In-Class Score" && scoreRecord.Subject=="Term 1")
            {

              console.log("ss",scoreRecord);
              debugger

            }

            currentSubjectInfo?.AssessmentsMap.set(scoreRecord.Assessment, assessment);
            currentSubjectInfo?.AssessmentsList.push(assessment);

          }
          if (type == "assessment") {
            let target = currentSubjectInfo?.AssessmentsMap.get(scoreRecord.Assessment);
            // alert("hhh2")
            // console.log("ss2",scoreRecord);
            // debugger
            if(target)
            {  debugger
              target.weight = scoreRecord.AssessmentWeight;
              target.score = scoreRecord.Value;
            }

          }

        }
        // customAssessment
        let currentAssess = currentSubjectInfo?.AssessmentsMap.get(scoreRecord.Assessment);
        if (!currentAssess?.customAssessmentsMap.has(scoreRecord.CustomAssessment)) {

          let customAssess = {
            customAssessName: scoreRecord.CustomAssessment,
            customAssessmentScore: "",
            date: "",
            description: "",
            isCheck: false
          }

          if (type == "customAssessment") {
            customAssess.customAssessName = scoreRecord.CustomAssessment;
            customAssess.customAssessmentScore = scoreRecord.Value;
            customAssess.date =scoreRecord.Date;
            customAssess.description =scoreRecord.Description;

            currentAssess?.customAssessmentsMap.set(scoreRecord.CustomAssessment, customAssess);
            currentAssess?.customAssessmentsList.push(customAssess);
          }
        }
      });
      alert('來來來')
      // 設定default
      if(this.eslScoreInfoList.length >0)
      {
        this.currentItem.currentTerm = this.eslScoreInfoList[0];
        this.currentItem.currentSubj = this.eslScoreInfoList[0].SubjectInfosList[0];

      }else{
        this.currentItem.currentTerm = undefined;
        this.currentItem.currentSubj = undefined;
      }
      console.log("整理後資料",this.eslScoreInfoList);

//     } catch (ex) {
// alert('發生錯誤 ')
// console.log('發生錯誤',ex)
//     } finally {
//       this.loading = false;
//     }

  }

  displayTerm(term: ITermInfo) {
    console.log("record ....",term);
    if(term && term.termName ) {
      return term ? `${term.termName}` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料';
    }
  }

  displaySubj(subj: ISubjectInfo) {
    console.log("AAA",subj);
    if(subj && subj.subjectName ) {
      return subj ? `${subj.subjectName}` ?? '請選擇項目' : 'Loading...';
    } else {
      return '無資料';
    }
  }

  /** 複製Email */
  copyEmail(email :string|undefined ){

    if(email)
    {

      navigator.clipboard.writeText(email);

    }

    alert(email)
  }
}

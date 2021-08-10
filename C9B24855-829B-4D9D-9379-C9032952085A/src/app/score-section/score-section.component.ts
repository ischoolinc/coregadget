import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { CurrentItem, ICustomAssessment, IeslRecord, ISubjectInfo, ITermInfo } from '../vo/vo';
import { GadgetService } from '../gadget.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-score-section',
  templateUrl: './score-section.component.html',
  styleUrls: ['./score-section.component.scss']
})
export class ScoreSectionComponent implements OnInit {

  loading = false;
  courseID :string | null | undefined;
  currentItem : CurrentItem = new CurrentItem() ;
  eslScoreInfoMap: Map<string, ITermInfo> = new Map();
  eslScoreInfoList :ITermInfo[] =[];

  constructor(
    private gadget: GadgetService,
    private route: ActivatedRoute,
    private router: Router,
    private tool: ToolService
  ) { }
  // @Input() subjData :any;
   ngOnInit()   {

    console.log("我在OnInit ");
    // 0.取得傳進來地參數
    this.route.paramMap.subscribe(
      (params: ParamMap): void => {
        this.courseID = params.get("course_id");
        console.log("11", this.courseID );
        this.getESLScoreInfoByCourID();
      })


    // 1.取得資料



  }

 async ngOnChanges() {

   console.log("我在onchange ")
 await   this.route.paramMap.subscribe(
      (params: ParamMap): void => {
        this.courseID = params.get("course_id");
        console.log("bbb", this.courseID );
      })


    // 1.取得資料
    await this.getESLScoreInfoByCourID();
  }

  /** 點選*/
  openDetail(customAssessment :ICustomAssessment){
    customAssessment.isCheck = !customAssessment.isCheck ;
    this.currentItem.currentCustomAssessment = customAssessment ;

  }

/** 取得目前成績 */
  async getESLScoreInfoByCourID() {
    console.log("去拿成績拔  拜託" ,this.courseID)
    try {
      this.loading = true;

      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.esl.student');
      // 呼叫 service。
      let rsp = await contract.send('GetESLscoreByCourseID', {
        CourseID:  this.courseID
      });

    console.log('1111', rsp.ESLScoreRecord);

      // 整理一下唷
      const eslRecords: IeslRecord[] = [].concat(rsp.ESLScoreRecord);
      eslRecords.forEach(scoreRecord => {

        let type = this.tool.checkScoreType(scoreRecord.CustomAssessment ,scoreRecord.Assessment,scoreRecord.Subject,scoreRecord.Term);
        console.log("type",type) ;
        // Term
        if (!this.eslScoreInfoMap.has(scoreRecord.Term))
          {
              let term = {
                termName: scoreRecord.Term,
                SubjectInfosMap: new Map(),
                SubjectInfosList: [],
                termScore :"",
                weight:""
              };
             if(type=="term"){
              term.termScore =scoreRecord.Value ;
              term.weight=scoreRecord.TermWeight;
             }

            this.eslScoreInfoMap.set(scoreRecord.Term,term);
            this.eslScoreInfoList.push(term);

          }
        // Subject

        if (!this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.has(scoreRecord.Subject)) {
          let subj =  {
            subjectName: scoreRecord.Subject,
            AssessmentsMap: new Map(),
            AssessmentsList: [],
            subjScore :"",
            weight:""
          } ;

          if(type=="subject"){
            subj.subjScore = scoreRecord.Value ;
            subj.weight = scoreRecord.SubjectWeight;
           }
          this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.set(scoreRecord.Subject,subj)
          this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosList.push(subj);
        }
        // Accessment
        let currentSubjectInfo:ISubjectInfo|undefined ;
        if (!this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.has(scoreRecord.Assessment)) {
          currentSubjectInfo = this.eslScoreInfoMap.get(scoreRecord.Term)?.SubjectInfosMap.get(scoreRecord.Subject)
            if(!currentSubjectInfo?.AssessmentsMap.has(scoreRecord.Assessment))
            {
             let  assessment = {
                assessmentName: scoreRecord.Assessment,
                score :"",
                customAssessmentsMap :new Map(),
                customAssessmentsList:[],
                weight:""
              }

              if(type=="assessment"){
                assessment.score = scoreRecord.Value ;
                assessment.weight = scoreRecord.AssessmentWeight;

               }
              currentSubjectInfo?.AssessmentsMap.set(scoreRecord.Assessment,assessment) ;
              currentSubjectInfo?.AssessmentsList.push(assessment);
            }

        }
        // customAssessment
        let currentAssess =currentSubjectInfo?.AssessmentsMap.get(scoreRecord.Assessment) ;
        if(!currentAssess?.customAssessmentsMap.has(scoreRecord.CustomAssessment)){

          let customAssess  ={
            customAssessName  :scoreRecord.CustomAssessment ,
            customAssessmentScore :"",
            date :"",
            description :"",
            isCheck : false
          }

          if(type =="customAssessment")
          {
            customAssess.customAssessName =scoreRecord.CustomAssessment;
            customAssess.customAssessmentScore = scoreRecord.Value ;

            currentAssess?.customAssessmentsMap.set(scoreRecord.CustomAssessment ,customAssess);
            currentAssess?.customAssessmentsList.push(customAssess);
          }
        }
      });

      // 設定default
      this.currentItem.currentTerm =   this.eslScoreInfoList[0];
      this.currentItem.currentSubj =   this.eslScoreInfoList[0].SubjectInfosList[0];
      console.log("AA",this.eslScoreInfoMap);
    } catch (ex) {

    } finally {
      this.loading = false;
    }

  }
}

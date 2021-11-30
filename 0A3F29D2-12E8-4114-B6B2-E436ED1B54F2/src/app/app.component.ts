import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Component } from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { Contract, GadgetService } from './gadget.service';
import { CustomizeLogyHelper } from './helper/CustomizeLogyHelper';
import { ExamSelectedHelper } from './helper/examSelectHelper';
import { RankInfo, studentInfo, RankInfoSource, ChildInfo, Exam, SubjectInfo, subjAndExamInfo } from './vo/vo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  destroyed = new Subject<void>();
  isSmallScreen:boolean =false;

  currentSchoolYear :string ="" ;
  currentSemester :string ="";
  subjects: SubjectInfo[] = [];
  exams: Exam[] = [];
  currentStudent: ChildInfo | undefined;
  currentStudentRankInto: studentInfo | undefined;
  loading = false;
  accessPoint = "";
  studentRankInfo: studentInfo | undefined
  user_rule: '' | '' = "";
  error: any;
  role: string = "";
  myChilern: ChildInfo[] = []
  selectedExam :Exam |undefined ;
  /**選擇 */
 rankTypeSelected :'班排名'|'類別1排名' ='班排名';
  rankInfoSource : RankInfoSource[]=[];
   /** 螢幕size 用 */
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  //建構子
  constructor(
    public examSelectedHelper :ExamSelectedHelper ,
    private customizeLogyHelper:CustomizeLogyHelper,
    private gadget: GadgetService
    ,breakpointObserver: BreakpointObserver) {

      //偵測螢幕
      breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        result.matches
        this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

      });
    }

  async ngOnInit() {

    await this.getCurrentSchoolYearAndSemester();;
    // 取得腳色
    this.role = gadget.params.role;
    // 取得家長或學生之腳色
    // 1.抓取學生班牌 類組牌
    if (this.role == "student") {
      await this.getRankByStuRole(this.currentSchoolYear,this.currentSemester,"班排名");
      await this.getSubjectAndExamsByStu(this.currentSchoolYear,this.currentSemester);
      this.examSelectedHelper.setExams(this.exams,0); // 預設第一次段考

    } else if (this.role == "parent") {
      await this.getStudentInfo();
      await this.getSubjectAndExamsByPar(this.currentSchoolYear,this.currentSemester,this.currentStudent?.StudentID);
      this.examSelectedHelper.setExams(this.exams,0); // 預設第一次段考
      await this.getRankByParentRole(this.currentSchoolYear,this.currentSemester,"班排名");
    }
  }

  /** */
  async clickChild(child: ChildInfo) {
    this.setSelectd(child)
    this.currentStudent = child;
    await this.getSubjectAndExamsByPar(this.currentSchoolYear,this.currentSemester,this.currentStudent?.StudentID);

    await this.getRankByParentRole(this.currentSchoolYear,this.currentSemester ,'班排名') ;

  }
  /**家長身分時取得自己的小孩 */
  async getStudentInfo() {
    this.myChilern = [];
    // 取得 contract 連線。
    const contract = await this.gadget.getContract('1campus.exam.rank.parent');
    // 呼叫 service。
    let rsp = await contract.send('_.GetStudentInfo', {
    });
    [].concat(rsp.Result.Student || []).forEach(studentInfo => {
      if (studentInfo) {
        this.myChilern.push(studentInfo);
      }
    })
    this.currentStudent = this.myChilern[0]
    this.currentStudent.isSelected = true;
  }

  /** 取得排名 by 家長身分 */
  async getRankByParentRole(schoolYear :string ,semester :string ,rankType :string   ) {
    // 取得孩子資訊
    try {
      this.loading = true;
      // 取得 連線。
      const contract = await this.gadget.getContract('1campus.exam.rank.parent');
      // 呼叫 service。
      let rsp = await contract.send('_.getExamFixedRank', {
        StudentID: this.currentStudent?.StudentID,
        SchoolYear :schoolYear ,
        Semester :semester
      });
      this.currentStudentRankInto = new studentInfo()
       this.rankInfoSource= [].concat(rsp.rs || []);
       this.rankInfoSource.forEach(rankInfo => {
      this.currentStudentRankInto?.addRankInfo(new RankInfo(rankInfo));
      })
    } catch (err) {
      this.error = err;
      alert("取得排名發生錯誤! \n" +JSON.stringify(err))
    } finally {
      this.loading = false;
    }
  }
  /**取得學生排名資料 */
  async getRankByStuRole(schoolYear :string ,semester :string ,rankType :string  ) {

    try {
      this.loading = true;
      // 取得 contract 連線。
      const contract = await this.gadget.getContract('1campus.exam.rank.student');
      console.log("contract", contract)
      this.accessPoint = contract.getAccessPoint;
      // 呼叫 service。
      let rsp = await contract.send('_.getExamFixedRank', {
        SchoolYear :schoolYear ,
        Semester :semester
      });
      console.log("rsp", rsp)
      // 裝
      this.currentStudentRankInto = new studentInfo()
    this.rankInfoSource = [].concat(rsp.rs || []);
    this.rankInfoSource.forEach(rankInfo => {
        this.currentStudentRankInto?.addRankInfo(new RankInfo(rankInfo));
      })
    } catch (err) {
      this.error = err;
      alert("發生錯誤"+JSON.stringify(err))
    } finally {
      this.loading = false;
    }
  }

  /** 用 【科目】 【試別】  取得排名  */
   getRankBySubjectAndType (itemName :string ,examID :string|undefined   ) :RankInfoSource|undefined {

    if(!examID)
     {

      return undefined
     }
    let targetRankInfo ;

    if(this.rankTypeSelected == "班排名"){ //如果選擇班排

      targetRankInfo  = this.rankInfoSource.find(item =>(item.item_name == itemName && item.ref_exam_id == examID &&  item.rank_type == this.rankTypeSelected))

    } else { //如果選擇類排

      targetRankInfo  = this.rankInfoSource.find(item =>(item.item_name == itemName && item.ref_exam_id == examID && item.rank_type == this.rankTypeSelected ))


    }
    return targetRankInfo ;



  }


  /** 取得當前學前度學期  */
  async getCurrentSchoolYearAndSemester(){
    try{
      const contract =await  this.gadget.getContract("basic.public");
      const baseInfoContract  = await await contract.send("_.baseInfoContract");
      this.currentSchoolYear =baseInfoContract.SchoolYear ;
      this.currentSemester =baseInfoContract.Semester ;

    }catch(ex){
       alert("取得學年度學期發生錯誤! \n" + JSON.stringify(ex));
   }
  }

  /**取得 科目及 試別 【學生】*/
  async getSubjectAndExamsByStu(schoolYear :string ,semester :string ) {

    try {
      const  contract = await this.gadget.getContract("1campus.exam.rank.student");


      const rsp = await contract.send("_.GetExamsAndSubjects" ,{
        SchoolYear :schoolYear ,
        Semester :semester
      });
      const subjAndExamInfos: subjAndExamInfo[] = [].concat(rsp.rs || []);

      subjAndExamInfos.forEach(item => {
        // debugger
        const hasValue = this.exams.find(x => x.examID == item.exam_id)
        if (!hasValue &&this.customizeLogyHelper.isExamShow(item.exam_name) ) {
          // 1.整理試別
          const exam = new Exam(item.exam_id, item.exam_name);
          // push

            this.exams.push(exam);

        }

         // 2.整理科目
        const hseSubj = this.subjects.find(x => x.subjectName == item.subject)
        if (!hseSubj) {
          const subject = new SubjectInfo(item.subject)
          this.subjects.push(subject);
        }
      })

    } catch (ex) {

    }
  }



  /**取得 科目及 試別  【家長】*/
  async getSubjectAndExamsByPar(schoolYear :string ,semester :string,studentID :string|undefined ) {

    if(!studentID){
      alert("無法確認學生ID")
      return
    }
    try {

      const  contract = await this.gadget.getContract("1campus.exam.rank.parent");
      debugger
      const rsp = await contract.send("_.GetExamsAndSubjects" ,{
        SchoolYear :schoolYear ,
        Semester :semester,
        StudentID :studentID
      });
      const subjAndExamInfos: subjAndExamInfo[] = [].concat(rsp.rs || []);

      subjAndExamInfos.forEach(item => {

        const hasValue = this.exams.find(x => x.examID == item.exam_id)
        if (!hasValue &&this.customizeLogyHelper.isExamShow(item.exam_name)) {
          // 1.整理試別
          const exam = new Exam(item.exam_id, item.exam_name);
          // push
          this.exams.push(exam);
        }

         // 2.整理科目
        const hseSubj = this.subjects.find(x => x.subjectName == item.subject)
        if (!hseSubj) {
          const subject = new SubjectInfo(item.subject)
          this.subjects.push(subject);
        }
      })

    } catch (ex) {
      alert("取得科目及試別發生錯誤! \n"+JSON.stringify(ex))
    }
  }

  /**  測試用 */
  getJSON(abs: any) {
    return JSON.stringify(abs);
  }
  /**get */
  getClassName(child: ChildInfo): string {

    if (child.isSelected) {
      return ' ml-2  d-inline btn_color_select';
    } else {
      return 'ml-2  d-inline btn_color_noselect'
    }
  }
  /** */
  setSelectd(child: ChildInfo) {
    if (this.currentStudent) {
      this.currentStudent.isSelected = false;
    }
    child.isSelected = true;

  }
}

import { ScoreRec, } from './data/score';
import { GadgetService } from './gadget.service';
import { Component, OnInit, NgZone, Inject, TemplateRef } from '@angular/core';
import { StudentRec, ExamScoreRec, MatrixRec, ExamRec, ExamRankRec, SSRec, ScoreRankInfo, SubScoreRankRec } from './data';
import NP from 'number-precision';

import { setTheme } from 'ngx-bootstrap/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ClassInfo, RankInfo, RankType, ScoreType, SelectionObj, SemsScoreInfo, StudentInfo, SubjectOrDomainInfo, YearSemster } from './vo';
import { MatGridTileHeaderCssMatStyler } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css"]

})
export class AppComponent implements OnInit {

  // setting 1. 是否顯示排名 
  isSchoolSetingShowRank: boolean = true;
  isUserSelectShowRank: boolean = false;
  modalRef: BsModalRef; // ngx-boostrap 
  //  移過來的
  contract: any;
  classess: ClassInfo[] = [];
  // public currentClass: ClassInfo | undefined;
  schoolYearSemester: YearSemster[] = []
  // currentSemester: YearSemster | undefined;
  scoreTypeList: string[] = ['科目成績', '領域成績'];
  // currentScoreType: string = '科目成績';
  selectShowItems: SubjectOrDomainInfo[] = [];
  ShowItem: SubjectOrDomainInfo[] = [];
  scoreInfoMap: Map<string, StudentInfo> = new Map();
  studentList: StudentInfo[] = [];
  rankTypeList: RankType[] = [];
  currentRankType: RankType;
  scoreTypeStateListt: ScoreType[] = [];  // 放你要哪一種成績
  ScoreTypestringList = ['成績', '原始成績', '補考成績',];
  selectionObj: SelectionObj;
  showingScoreType: string = "";



  scoreInfoList: SemsScoreInfo[] = [];
  subjSelectAll = false;

  // 運作基本參數
  isFirstLoading: boolean;
  isLoading: boolean; // 讓html可以依此變數來調整畫面呈現
  // contract: any; // 用來接收GadgetService getContract的結果，並運用在各service呼叫

  // // 班級相關變數 
  // curClass:ClassRec = {} as ClassRec;  
  // classList: ClassRec[] = []; // 字串集合的陣列，存放使用者班級清單

  // 學年度學期相關變數
  curSS: SSRec = {} as SSRec;
  ssList: SSRec[];
  noneSS = false;


  initScorType: ScoreRec = {
    score: '',
    type: '',
    symbol: '',
    noneScore: null
  }

  // 排名類型相關變數
  matrixList = [];  // 排名母群存放的陣列
  curMatrix: any;
  rankType = [];
  stuExamRank: ScoreRankInfo[];
  oriSemesSubRank = []; // 原先評估要把排行資料依排行類型做分類，分別組成四個陣列，但現行先決定直接用原資料來做吃料處理
  noneRank = false; // 作為判別有無計算過固定排名，沒有(true)則排名及五標級距均不顯示 *切換選項的時候需重置
  // subItem = ['學業','專業科目','實習科目']; // 存放學期分項項目
  subItem = ['學業', '專業科目', '實習科目', '體育', '健康與護理', '國防通識'];
  subItem2 = ['學業分項', '專業科目分項', '實習科目分項', '體育分項', '健康與護理分項', '國防通識分項'];
  // 平均類型相關變數
  avgTypeList = ['算術平均', '加權平均'];
  curAvgType = this.avgTypeList[0];
  //curAvgTypeForServer = '平均'; //因為資料庫中算術平均儲存的字串為'平均'

  // 科目相關變數
  subjectList: string[];
  subjectSubjList: string[];
  subjectEntryList: string[];
  noneSubj = false; // *切換選項的時候需重置
  subjectList2: string[]; // 顯示用的科目清單（裡面只存放學期成績取得的科目）

  /// 學生清單相關變數
  // studentList: StudentRec[];

  // 成績相關變數
  examMatrix = {}; // 即時加總的的級距
  examMatrix2 = {}; // 直接撈DB資料組成的級距及五標
  fiveRange = [
    { key: 'avg_top_25', value: '頂標' }
    , { key: 'avg_top_50', value: '高標' }
    , { key: 'avg', value: '均標' }
    , { key: 'avg_bottom_50', value: '低標' }
    , { key: 'avg_bottom_25', value: '底標' }
  ];

  rangeList = [
    { key: 'level_gte100', value: '≥ 100' }
    , { key: 'level_90', value: '≥ 90, < 100' }
    , { key: 'level_80', value: '≥ 80, < 90' }
    , { key: 'level_70', value: '≥ 70, < 80' }
    , { key: 'level_60', value: '≥ 60, < 70' }
    , { key: 'level_50', value: '≥ 50, < 60' }
    , { key: 'level_40', value: '≥ 40, < 50' }
    , { key: 'level_30', value: '≥ 30, < 40' }
    , { key: 'level_20', value: '≥ 20, < 30' }
    , { key: 'level_10', value: '≥ 10, < 20' }
    , { key: 'level_lt10', value: '< 10' }
  ]

  subSubjItemList = [];
  i = 0

  constructor(
    private gadget: GadgetService,

    private modalService: BsModalService,
  ) {
    setTheme('bs4'); // ngx-bootstrap設定
  }

  async ngOnInit() {
    //  0.初始化 裝selection 的物件 
    this.selectionObj = new SelectionObj();
    // 0. 初始化畫面  成績
    await this.initScoreType();
    // 1. 取得連線
    this.contract = await this.gadget.getContract('ischool.jh.semscore.teacher');
    // 2. 取得班級
    await this.lodingSelectData();
    // 3. 取得科目 
    // 4. 取得成績資料
    await this.searchData();
  }


  /**
   * 取得成績顯示長度
   */
  getScoreTypeSelectCount(): number {
    console.log("getScoreType");
    let count = 0;
    this.scoreTypeStateListt.forEach(item => {
      if (item.Check) { count++; }
    });
    return count;
  }


  /**
  *  現在
  */
  async setScoretypeCheck(scoreType: ScoreType) {
    scoreType.Check = !scoreType.Check;
  }


  /**
   *  處理header 要如何顯示 
   */
  getShowItemCheckCount(): number {

    let count = 0;
    this.scoreTypeStateListt.forEach(item => {

      if (!this.isSchoolSetingShowRank && !this.isUserSelectShowRank) { // 沒有選擇要顯示排名
        if (item.Check) {
          count++;
        }
      } else { // 使用者有選擇顯示排名
        if (item.Check && item.HasRank) { // 有點選也有排名
          count += 2;
        } else if (item.Check && !item.HasRank) {
          count++;
        }
      }
    });


    // 如果有顯示排名 
    return count;
  }

  /**
   *  【畫面】 初始化 顯示哪種成績 
   */
  async initScoreType() {
    console.log("init scoretype")
    this.ScoreTypestringList.forEach(scoretype => {
      const scoreType = new ScoreType(scoretype);
      if (scoretype == '補考成績') { // 因為補考成績沒有排名 所以將他放在
        scoreType.HasRank = false;
      }
      if (scoretype == '成績') {  // 預設勾選 擇優成績
        scoreType.Check = true;
      }
      this.scoreTypeStateListt.push(scoreType);
    });
    console.log("init len", this.ScoreTypestringList);
  }

  /**
   * 跑畫面 
   */
  async lodingSelectData() {
    await this.getMyClasses();
    if (this.selectionObj.currentClass) {
      // 3. 取得學年度
      await this.getSchoolYearSemesterInfo();
      // 4. 取得科目
      await this.getIfShowRank();
      // 6 . 如果顯示學校開放查詢顯示排名 顯示 
      await this.getRankType();
    }
  }

  /**
   * 按下[查詢]
   */
  async searchData() {
    if (this.selectionObj.currentScoreType == "科目成績") {
      this.showingScoreType = "科目"
      await this.getSubjByClassID();
    } else { // 領域
      this.showingScoreType = "領域"
      await this.getDomainByClassID();
    }
    await this.loadingSemsScoreData();
  }

  /**
   * 
   */
  async loadingSemsScoreData() {
    console.log("current...this.selectionObj", this.selectionObj)
    this.scoreInfoMap = new Map();

    let rsp: any;
    let rankrsp: { StudentRankInfo: "" };
    if (this.selectionObj.currentScoreType == "科目成績") {

      // 取得學生科目成績 
      rsp = await this.contract.send('_.GetSubjectSemsScoreByClass', {
        ClassID: this.selectionObj.currentClass.ID
        , SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
        , Semester: this.selectionObj.schoolYearSemester.Semester
      });
      // 選擇學生科目之排名 
      if (this.isSchoolSetingShowRank && this.currentRankType) {
        rankrsp = await this.contract.send('_.GetStudentRank', {
          ClassID: this.selectionObj.currentClass.ID
          , SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
          , Semester: this.selectionObj.schoolYearSemester.Semester
          , ItemType: "subject"
          , RankType: this.currentRankType.RankType
        });

        console.log("subject rank", rankrsp);

      }



    } else {
      // 取得學生領域成績
      rsp = await this.contract.send('_.GetDomainSemsScoreByClass', {
        ClassID: this.selectionObj.currentClass.ID
        , SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
        , Semester: this.selectionObj.schoolYearSemester.Semester


      });
      // 取得學生領域排名 
      if (this.isSchoolSetingShowRank && this.currentRankType) {
        rankrsp = await this.contract.send('_.GetStudentRank', {
          ClassID: this.selectionObj.currentClass.ID
          , SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
          , Semester: this.selectionObj.schoolYearSemester.Semester
          , ItemType: "domain"
          , RankType: this.currentRankType.RankType
        });
      }
      console.log("domain rank", rankrsp);
    }


    console.log("loading 資料 rsp", rsp);
    //  1.開始整理成績資料 => Map <string >
    const scoreRecord: SemsScoreInfo[] = [].concat(rsp.ScoreInfos);
    scoreRecord.forEach(scoreRec => {
      if (!this.scoreInfoMap.has(scoreRec.StudentID)) // 如果 Map 中沒有該學生的資料
      {
        this.scoreInfoMap.set(scoreRec.StudentID, new StudentInfo(scoreRec)); //建立 一個 Map 
      }
      if (!this.scoreInfoMap.get(scoreRec.StudentID).hasSubj(scoreRec.Title)) { // 如果沒有此科目 
        this.scoreInfoMap.get(scoreRec.StudentID).addScoreInfo(scoreRec); // 加入此科目之資料
      } else {
        // 同一學生有 相同科目的學期成績  
        // 可能有問題要再看要怎樣處理
        // 
      }
    });
    // 2.開始整理排名 成績  
    const rankRecord: RankInfo[] = [].concat(rankrsp ? rankrsp.StudentRankInfo : []);
    // 
    console.log("開始整理 ...排名資料", rankRecord);
    rankRecord.forEach(rankInfo => {
      if (this.scoreInfoMap.has(rankInfo.StudentID)) {

        if (this.scoreInfoMap.get(rankInfo.StudentID).hasSubj(rankInfo.ItemName)) {
          console.log("加入...")
          this.scoreInfoMap.get(rankInfo.StudentID).addRankInfo(rankInfo);
        }
      }
    });



    // * 把 Map 轉換成 Array 供可跌代 
    console.log("整理完", this.scoreInfoMap);
    this.studentList = Array.from(this.scoreInfoMap.values());
    this.ShowItem = this.selectShowItems.filter(x => x.Check == 'true');
    // alert("請看console")
    console.log("this.studentList", this.studentList);
  }


  /**
   *  取得該教師所代班級
  */
  async getMyClasses() {
    const rsp = await this.contract.send('_.GetMyClasses', {});
    this.classess = [].concat(rsp.Class);
    this.selectionObj.currentClass = this.classess[0];
  }

  /**
   * 取得學年度學期資料 並指定 目前的學年度
   *
   */
  async getSchoolYearSemesterInfo() {
    const rsp = await this.contract.send('_.GetSchoolYearAndSemester', { ClassID: this.selectionObj.currentClass.ID });
    this.schoolYearSemester = [].concat(rsp.YearSemester);
    if (this.schoolYearSemester.length > 0) {
      this.selectionObj.schoolYearSemester = this.schoolYearSemester[0]; // 設定預設班級
    }
  }


  /**
   * 選擇班級後 學年度學期隨著改變
   * @param classInfo
   */
  async clickClassbtn(classInfo: ClassInfo) {
    console.log("clickClick.....", classInfo);
    this.selectionObj.currentClass = classInfo;
    await this.getSchoolYearSemesterInfo();  // 取得學期 
    await this.getSubjByClassID();    // 取得科目
    await this.getRankType();         // 取得 排名總類
   
  }


  /**
   * 取得學年度學期
   */
  async clickSchoolYearSemester(semester: YearSemster) {
    this.selectionObj.schoolYearSemester = semester;
    await this.getRankType();
  }

  /**
   *  取得要查的項目
   */
  async clickScoreType(currentScoreType: string) {
    this.selectionObj.currentScoreType = currentScoreType;
    // load 科目或領域項目 

  }

  //點學年度學期  
  async clickSemester(semester: YearSemster) {
    this.selectionObj.schoolYearSemester = semester;
  }

  /**
   * 取得班級
   */
  async setClass() {


  }

  /**
   * 選擇所有 
   */
  async selectAllSubj(event) {
    console.log("event", event);
    this.subjSelectAll = !this.subjSelectAll;
    this.selectShowItems.forEach(subj => {
      1
      if (this.subjSelectAll) {
        subj.Check = 'true';
      } else {
        subj.Check = 'false';
      }
    });
  }
  /**
   * 
   */
  async setMatrix(currRankType: any) {
    console.log("currentRankType")
    this.currentRankType = currRankType;



  }
  /**
   * 【即時互動】【資料同步】勾選顯示 科目/領域
   * @param item 
   */
  setCheck(item: SubjectOrDomainInfo) {

    if (item) {
      if (item.Check == 'true') {
        item.Check = 'false';
      } else {
        item.Check = 'true';
      }
    }
  }

  /**
   * 【重新載入】 重新載入學生學期成績資料
   */
  async reloadData() {
    await this.loadingSemsScoreData();
    this.modalRef.hide();
  }

  /**
   * 【畫面互動】 顯示模組 
   */
  async showSubjModal() {

    $("#subjSeleModal").show();

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
  }

  /**
  *
  * 取得科目
  * @memberof AppComponent
  */
  async getSubjByClassID() {
    const rsp = await this.contract.send('_.GetAllSubjByClassID',
      {
        ClassID: this.selectionObj.currentClass.ID
        , SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
        , Semester: this.selectionObj.schoolYearSemester.Semester
      });
    this.selectShowItems = rsp.Subjects;
    console.log('this.showSubject ', rsp);
  }

  /**
   *  取得領域科目
   */
  async getDomainByClassID() {
    const rsp = await this.contract.send('_.GetAllDomainByClassID',
      {
        ClassID: this.selectionObj.currentClass.ID
        , SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
        , Semester: this.selectionObj.schoolYearSemester.Semester
      });
    this.selectShowItems = rsp.Domains;
    console.log('this.getDomainByClassID 的 rsp', rsp);

  }


  /**
   * 取得是否顯示排名 
   */
  async getIfShowRank() {
    // todo  實際上去抓取資料 第一版暫時
    this.isSchoolSetingShowRank = false;
  }

  /**
  * 取得所選學年度學期的排名
  */
  async getRankType() {

    const rsp = await this.contract.send('_.GetAllRankTypeBySemester',
      {
        SchoolYear: this.selectionObj.schoolYearSemester.SchoolYear
        , Semester: this.selectionObj.schoolYearSemester.Semester
      });
    console.log('getRankType', rsp);
    this.rankTypeList = [].concat(rsp.RankType);
    if (this.rankTypeList.length > 0) {
      this.currentRankType = this.rankTypeList[0];
    }
  }





  // 呼叫service獲取資料類型function 區塊 

  /** 取得班級 */
  // async getMyClass() {
  //   this.classList = [];
  //   try {
  //     const rsp = await this.contract.send('GetMyClass', {});
  //     this.classList = [].concat(rsp.Class ||[]);
  //     this.curClass = this.classList[0];
  //   } catch (error) {
  //     console.log('取得班級失敗' + error.message);
  //     return
  //   }
  // }

  /** 取得學年度學期 */
  // async GetSemsSubjSS() {
  //   this.ssList = [];
  //   try {
  //     const rsp = await this.contract.send('GetSemsScoreSS',{
  //       ClassID: this.curClass.id
  //     });
  //     if(rsp.SchoolYearSemester){
  //       this.ssList = [].concat(rsp.SchoolYearSemester || []).map((data:SSRec) => {
  //           data.content = `${data.school_year}學年度${data.semester}學期`
  //           return data;
  //       });
  //       this.curSS = this.ssList[0];
  //     } else {
  //       this.noneSS = true;
  //       this.ssList[0]= {
  //         content: '沒有學年度學期',
  //         school_year: 0,
  //         semester: 0,
  //       }
  //       this.matrixList = ['沒有排名母群'];
  //       this.curMatrix = this.matrixList[0];
  //       this.curSS = this.ssList[0];
  //     }
  //     console.log(this.ssList);
  //   } catch (error) {
  //     console.log('取得學年度學期錯誤' + error.message);
  //   }
  // }

  /** 取得班級學生 */
  // async GetClassStudent(){
  //   this.studentList = [];
  //   try{
  //     const rsp = await this.contract.send('GetClassStudent',{
  //       ClassID:this.curClass.id
  //     });
  //     this.studentList = [].concat(rsp.Students || []).map((stu: StudentRec) => {
  //       stu.subject = {};
  //       return stu;
  //     });
  //   } catch (err) {
  //     console.log('取得班級學生失敗' + err.message);
  //     return
  //   }
  //   //console.log(this.studentList);
  // }

  // /** 取得科目清單 */
  // async GetSubject(){

  //   this.subjectList = [];
  //   try {
  //     const rsp = await this.contract.send('GetSHSubject', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //     this.subjectList = [].concat(rsp.SemesSubj || []).map((subj) => {
  //       return subj.subject;
  //     });
  //   } catch (err) {
  //     console.log('建立學期科目清單失敗' + err.message);
  //     return
  //   }
  //   //console.log(this.studentList);
  // }

  /** 
   *  取得科目清單(從科目對照表)
   *  分別從學期成績紀錄、固定排名結果及科目對照表取得各一份科目清單
   *  排名來的清單：主要取得實際有的科目
   *  科目對照表來的清單：取得科目清單順序
   *  兩份組成：科目清單順序且實際有排名的科目清單
   *  備註：要考慮實際有的科目但沒有存在科目對照表內
   */
  // async GetSubject2(){
  //   this.subjectList = [];
  //   this.subjectList2 = [];
  //   let subjFromRank = [];
  //   let subjFromList = [];
  //   let extraSubj = [];
  //   let noneSubjList = false;
  //   let noneSubj = false;
  //   let temp1 = [];
  //   let temp2 = [];
  //   let temp3 = [];
  //   let temp4 = [];
  //   let temp5 = [];
  //   try {
  //     const rsp2 = await this.contract.send('GetSHSubjFromRank', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //     if(rsp2.SemesSubj){ // 如果有計算固定排名
  //       subjFromRank = [].concat(rsp2.SemesSubj || []).map((subj) => {
  //         return subj.item_name;
  //       });
  //     } else if (rsp2.SemesSubjScore){ // 沒有有計算固定排名，則從學期成績取得科目清單
  //       subjFromRank = [].concat(rsp2.SemesSubjScore || []).map((subj) => {
  //         return subj.subject;
  //       });
  //     } else {
  //       noneSubj = true // 學期成績跟排名都沒有科目
  //     }

  //     // 取得「學期成績」跟「排名」來的科目超集合
  //     temp1 = [].concat(rsp2.SemesSubj || []);
  //     temp2 = [].concat(rsp2.SemesSubjScore || []);
  //     temp5 = [].concat(rsp2.SemesSubjScore || []).map((subj) => {
  //       return subj.subject;
  //     });
  //     temp1.forEach(t1 => {
  //       const index = temp2.findIndex(t2 => t2.subject === t1.item_name);
  //       if(index > -1){
  //         temp3.push(t1.item_name);
  //       } else if (index <= -1){
  //         temp4.push(t1.item_name);
  //       }
  //     });
  //     temp3 = temp3.concat(temp4);
  //     temp4 = [];
  //     temp2.forEach(t2 => {
  //       const index = temp3.findIndex(t3 => t3 === t2.subject);
  //       if(index <= -1) {
  //         temp4.push(t2.subject);
  //       }
  //     });
  //     temp3 = temp3.concat(temp4);
  //     console.log(temp3);
  //     subjFromRank = temp3;
  //   } catch (err) {
  //     console.log('建立學期科目清單失敗(從固定排名取得)' + err.message);
  //     return
  //   }
  //   extraSubj = subjFromRank;
  //   try {
  //     const rsp = await this.contract.send('GetSHSubjList', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //     if(rsp.SemesSubj) {
  //       subjFromList = [].concat(rsp.SemesSubj || []).map((subj) => {
  //         return subj.subject;
  //       });
  //     } else {
  //       noneSubjList = true
  //     };
  //   } catch (err) {
  //     console.log('建立學期科目清單失敗(從科目對照表取得)' + err.message);
  //     return
  //   }
  //   // 「固定排名」跟「學期成績」超集合取得的科目清單，依照科目對照表來做整理 
  //   if(noneSubj === false && noneSubjList === false ){ // 有計算排名且有科目對照表
  //     subjFromList.forEach(sfl => {
  //       subjFromRank.forEach(sfr => {
  //         if(sfl === sfr) {
  //           this.subjectList.push(sfl);
  //         } 
  //       });
  //     });

  //     subjFromRank.forEach(sfl => {
  //       let index: number;
  //         index = subjFromList.indexOf(sfl);
  //         if(index === -1){
  //           this.subjectList.push(sfl);
  //         }
  //       });
  //   } else if(noneSubj === false && noneSubjList === true ){ // 有計算排名但沒有科目對照表
  //     this.subjectList = subjFromRank;
  //   } else if(noneSubj === true && noneSubjList === false ){ // 沒有計算排名但有科目對照表
  //     this.subjectList = subjFromList;
  //   } else { // 沒有計算排名也沒有科目對照表，無科目呈現。
  //     this.subjectList.push('沒有科目');
  //     this.noneSubj = true;
  //   }

  //   // 「固定排名」，依照科目對照表來做整理，作為畫面顯示
  //   if(noneSubj === false && noneSubjList === false ){ // 有計算排名且有科目對照表
  //     subjFromList.forEach(sfl => {
  //       temp5.forEach(sfr => {
  //         if(sfl === sfr) {
  //           this.subjectList2.push(sfl);
  //         } 
  //       });
  //     });

  //     temp5.forEach(sfl => {
  //       let index: number;
  //         index = subjFromList.indexOf(sfl);
  //         if(index === -1){
  //           this.subjectList2.push(sfl);
  //         }
  //       });
  //   } else if(noneSubj === false && noneSubjList === true ){ // 有計算排名但沒有科目對照表
  //     this.subjectList2 = temp5;
  //   } else if(noneSubj === true && noneSubjList === false ){ // 沒有計算排名但有科目對照表
  //     this.subjectList2 = subjFromList;
  //   } else { // 沒有計算排名也沒有科目對照表，無科目呈現。
  //     this.subjectList2.push('沒有科目');
  //     this.noneSubj = true;
  //   }
  //   let subItem = ['學業分項','專業科目分項','實習科目分項','體育分項','健康與護理分項','國防通識分項'];
  //   this.subjectSubjList = this.subjectList;
  //   this.subjectList = this.subjectList.concat(subItem);
  //   console.log(this.subjectList);
  //   console.log(this.subjectList2);
  //   console.log(this.subjectSubjList);
  // }

  /** 取得學期分項項目清單
   * 
   * @param ClassID
   * @param SchoolYear
   * @param Semester
  */
  // async GetSubItem() {
  //   try {
  //     const rsp = await this.contract.send('GetSHSemeSubItem', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //     if(rsp.SemesSubItem){
  //       this.subItem = [];
  //       [].concat(rsp.SemesSubItem.forEach(item => {
  //         this.subItem.push(item.item_name);
  //       }));
  //     };
  //   } catch (error) {
  //     console.log('取得學期分項項目清單錯誤');
  //     console.log(error);
  //   }

  // }

  /** 取得學期分項分數及排名
   * 
   * @param ClassID
   * @param SchoolYear
   * @param Semester
  */
  // async GetSubScoreRank() {
  //   try {
  //     const rsp = await this.contract.send('GetSHSubScoreRank', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //     if(rsp.SubScoreRank){
  //       this.studentList.forEach((stu: StudentRec) => {
  //         rsp.SubScoreRank.forEach((i: SubScoreRankRec) => {
  //           if(stu.id === i.ref_student_id) {
  //             // 例：stu[學業/分項成績][年排名][學業][分數]
  //             let tempText = '';
  //             tempText = i.item_name + '分項';
  //             stu[i.item_type][i.rank_type][tempText]['分數'] = i.score;
  //             stu[i.item_type][i.rank_type][tempText]['排名'] = i.rank;
  //             stu[i.item_type][i.rank_type][tempText]['類別'] = i.rank_name;
  //           }
  //         });
  //       });
  //     } 

  //   } catch (error) {
  //     console.log('取得取得學期分項分數及排名失敗');
  //     console.log(error);
  //   }
  // }


  /** 取得學期成績排名類型,排名母群類型
   * 排名類型：{學期科目/學期分項/學期科目(原始)/學期分項(原始)}
   * 排名母群類型：{班排名/年排名/科排名/類別排名} 
   * 
   * @param ClassID
   * @param SchoolYear
   * @param Semester
  */
  // async GetStuRankType() {
  //   let RankGTypeTemp = ['班排名','年排名','科排名','類別1排名','類別2排名'];
  //   try {
  //     const rsp = await this.contract.send('GetSHRankType', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //       this.matrixList = [];
  //       this.rankType = [];
  //       //建立排名母群類型清單
  //       if(!rsp.RankGType || !rsp.RankType){
  //         this.matrixList = ['沒有排名'];
  //         this.noneRank = true;
  //       } else {
  //         RankGTypeTemp.forEach(it => {
  //           rsp.RankGType.forEach(i => {
  //             if(it === i.rank_group_type){
  //               this.matrixList.push(it);
  //             }
  //           });
  //         });

  //         //建立排名類型清單
  //         rsp.RankType.forEach(i => {
  //           this.rankType.push(i.rank_type);
  //         })
  //       };
  //       this.curMatrix = this.matrixList[0];
  //       console.log(this.noneRank);
  //     } catch (error) {
  //       console.log('取得學期成績排名類型,排名母群類型' + error.message);
  //     }
  //   }

  /** 取得學期科目成績
   * 
   * @param ClassID
   * @param SchoolYear
   * @param Semester
  */
  // async GetStuSemsScore() {
  //   // this.subjectList = [];
  //   try {
  //     const rsp = await this.contract.send('GetSHExamScore', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });

  //       // 初始化級距清單
  //       this.initiRange();
  //       // 建立學期科目清單
  //       try{ 
  //         this.buildstuSub();
  //       } catch(err) { 
  //         console.log('建立學期科目清單失敗' + err.message);
  //       }

  //       [].concat(rsp.SemesScore || []).forEach((data: ExamScoreRec) => {

  //           // 寫入各項成績
  //           try {

  //             this.insertStuScore(data);
  //           } catch (error) {
  //             console.log('寫入各項成績失敗' + error.message);
  //             console.log(error);
  //           }
  //         });
  //         this.insertStuRank();
  //   } catch (error) {
  //     console.log('取得成績失敗' + error.message);
  //   }
  // }

  /** 取得學期成績排名{科目/分項/科目(原始)/分項(原始)}
   * 
   * @param ClassID
   * @param SchoolYear
   * @param Semester
  */
  // async GetStuExamRank() {
  //   this.oriSemesSubRank = [];
  //   try {
  //     const rsp = await this.contract.send('GetSHScoreRank', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //       this.stuExamRank = [].concat(rsp.SemesScore || []);
  //       this.oriSemesSubRank = [].concat(this.stuExamRank.filter(r => r.item_type === '學期/科目成績(原始)'));
  //     } catch (error) {
  //       console.log('取得學期成績排名失敗' + error.message);
  //     }
  //   }


  /** 取得分項成績（從學期成績來 not固定排名）
   * 當沒有計算固定排名時，學期分項成績則取用此處獲得的成績
   * @param ClassID
   * @param SchoolYear
   * @param Semester
  // */
  // async GetSemsEntryScore() {
  //   this.initiRange2();
  //   let subItemAll = ['學業','專業科目','實習科目','體育','健康與護理','國防通識'];
  //   try {
  //     const rsp = await this.contract.send('GetSemsEntryScore', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //     console.log(rsp.SemsEntryScore);
  //     if(rsp.SemsEntryScore){
  //       [].concat(rsp.SemsEntryScore).forEach(ses =>{
  //         this.studentList.forEach(stu =>{
  //           if(stu.id === ses.student_id){
  //               stu.subject['學業分項']['原始'] = ses['原始學業'] ? ses['原始學業'] : '--';
  //               stu.subject['學業分項']['擇優'] = ses['學業'] ? ses['學業'] : '--';
  //               stu.subject['專業科目分項']['原始'] = ses['原始專業科目'] ? ses['原始專業科目'] : '--';
  //               stu.subject['專業科目分項']['擇優'] = ses['專業科目'] ? ses['專業科目'] : '--';
  //               stu.subject['實習科目分項']['原始'] = ses['原始實習科目'] ? ses['原始實習科目'] : '--';
  //               stu.subject['實習科目分項']['擇優'] = ses['實習科目'] ? ses['實習科目'] : '--';
  //               stu.subject['體育分項']['原始'] = ses['原始體育'] ? ses['原始體育'] : '--';
  //               stu.subject['體育分項']['擇優'] = ses['體育'] ? ses['體育'] : '--';
  //               stu.subject['健康與護理分項']['原始'] = ses['原始健康與護理'] ? ses['原始健康與護理'] : '--';
  //               stu.subject['健康與護理分項']['擇優'] = ses['健康與護理'] ? ses['健康與護理'] : '--';
  //               stu.subject['國防通識分項']['原始'] = ses['原始國防通識'] ? ses['原始國防通識'] : '--';
  //               stu.subject['國防通識分項']['擇優'] = ses['國防通識'] ? ses['國防通識'] : '--';
  //           }
  //         })
  //       })
  //     } else {
  //       this.studentList.forEach(stu =>{
  //             stu['學業分項']['原始'] = '--';
  //             stu['學業分項']['擇優'] = '--';
  //             stu['專業科目分項']['原始'] = '--';
  //             stu['專業科目分項']['擇優'] = '--';
  //             stu['實習科目分項']['原始'] = '--';
  //             stu['實習科目分項']['擇優'] = '--';
  //             stu['體育分項']['原始'] = '--';
  //             stu['體育分項']['擇優'] = '--';
  //             stu['健康與護理分項']['原始'] = '--';
  //             stu['健康與護理分項']['擇優'] = '--';
  //             stu['國防通識分項']['原始'] = '--';
  //             stu['國防通識分項']['擇優'] = '--';
  //         })
  //       }
  //     } catch (error) {
  //       console.log('取得學期分項成績失敗' + error.message);
  //     }
  //   }

  // async GetExamRankMatrix(){

  // }

  // 設定類型function 區塊 ↓↓↓

  // async setClass(data:ClassRec){ // 用於設定班級，會影響學年度學期的資料內容
  //   this.isLoading = true;
  //   this.curClass = data;
  //   this.noneRank = false;
  //   this.noneSubj = false;
  //   this.noneSS = false;
  //   this.subItem = ['學業','專業科目','實習科目','體育','健康與護理','國防通識'];
  //   this.matrixList = [];
  //   this.subjectList2 = [];
  //     await this.GetSemsSubjSS();
  //     if(!this.noneSS){
  //       await this.GetClassStudent();
  //       await this.GetSubject2();
  //       await this.GetSubItem();
  //       if(this.noneSubj === false){
  //         await this.GetStuRankType();
  //         await this.GetStuExamRank();
  //         await this.GetStuSemsScore();
  //         await this.GetSemsEntryScore();
  //         if(this.noneRank === false){
  //           await this.GetSubScoreRank();
  //           await this.GetRangeMaterix();
  //         }
  //       }
  //     }
  //     console.log(this.studentList);
  //     console.log(this.subjectSubjList);
  //     console.log(this.examMatrix2);
  //   this.isLoading = false;
  // };

  // async setSS(data: SSRec){ //用於設定學年度學期
  //   this.isLoading = true;
  //   this.curSS = data;
  //   this.noneRank = false;
  //   this.noneSubj = false;
  //   this.noneSS = false;
  //   this.subItem = ['學業','專業科目','實習科目','體育','健康與護理','國防通識'];
  //   this.matrixList = [];
  //   this.subjectList2 = [];
  //   await this.GetClassStudent();
  //     await this.GetSubject2();
  //     await this.GetSubItem();
  //     if(this.noneSubj === false){
  //       await this.GetStuRankType();
  //       await this.GetStuExamRank();
  //       await this.GetStuSemsScore();
  //       await this.GetSemsEntryScore();
  //       if(this.noneRank === false){
  //         await this.GetSubScoreRank();
  //         await this.GetRangeMaterix();
  //       }
  //     }
  //     console.log(this.studentList);
  //     console.log(this.examMatrix2);
  //   this.isLoading = false;
  // }

  // async setMatrix(data: string) {
  //   this.isLoading = true;
  //   this.curMatrix = data;
  //   this.isLoading = false;
  // }

  // async setAvgType(data: string){
  //   if(data === '算術平均' || ''){
  //     this.curAvgType = data;
  //     //this.curAvgTypeForServer = '平均';     
  //   }else if(data === '加權平均' ){
  //     this.curAvgType = data;
  //     //this.curAvgTypeForServer = '加權平均';
  //   }
  // };
  // 設定類型function 區塊 ↑↑↑ 


  // 資料處理類型function 區塊 ↓↓↓

  // public buildSub (subject: string) {
  //   if (this.subjectList.find(sub => sub === subject) === undefined) {
  //     this.subjectList.push(subject);      
  //   }
  //   // console.log(this.studentList);

  // };

  /** 建立學生擁有的科目 */
  // public buildstuSub() {
  //   let type = ['原始','擇優'];
  //   let scoreRank = ['分數','排名'];
  //   let subItemAll = ['學業分項','專業科目分項','實習科目分項','體育分項','健康與護理分項','國防通識分項'];

  //   // 總分相關初始化
  //   this.studentList.forEach( stu => {
  //     stu['rank_name'] = stu['rank_name'] ? stu['rank_name'] : '';
  //     stu['算術平均'] = stu['算術平均'] ? stu['算術平均'] : {};
  //     stu['加權平均'] = stu['加權平均'] ? stu['加權平均'] : {};
  //     stu['算術平均']['擇優'] = stu['算術平均']['擇優'] ? stu['算術平均']['擇優'] : '';
  //     stu['算術平均']['原始'] = stu['算術平均']['原始'] ? stu['算術平均']['原始'] : '';
  //     stu['加權平均']['擇優'] = stu['加權平均']['擇優'] ? stu['加權平均']['擇優'] : '';
  //     stu['加權平均']['原始'] = stu['加權平均']['原始'] ? stu['加權平均']['原始'] : '';
  //     stu['學期/分項成績'] = stu['學期/分項成績'] ? stu['學期/分項成績'] : {}; // 預定塞入排名
  //     stu['學期/分項成績(原始)'] = stu['學期/分項成績(原始)'] ? stu['學期/分項成績(原始)'] : {}; // 預定塞入排名
  //     stu['類別1排名'] = stu['類別1排名'] ? stu['類別1排名'] : '';
  //     stu['類別1排名'] = stu['類別1排名'] ? stu['類別1排名'] : '';
  //     subItemAll.forEach(sb => {
  //       stu[sb] = stu[sb] ? stu[sb] : {} ;
  //       type.forEach(item => {
  //         stu[sb][item] = stu[sb][item] ? stu[sb][item] : '--';
  //       })
  //     })
  //     stu['score_tooltip'] = stu['score_tooltip'] ? stu['score_tooltip'] : '';

  //     if(!this.noneRank) {
  //     this.matrixList.forEach(item => { // 塞母群
  //       stu['學期/分項成績'][item] = stu['學期/分項成績'][item] ? stu['學期/分項成績'][item] : {}; 
  //       stu['學期/分項成績(原始)'][item] = stu['學期/分項成績(原始)'][item] ? stu['學期/分項成績(原始)'][item] : {}; 
  //       this.subItem2.forEach(st => {
  //         stu['學期/分項成績'][item][st] = stu['學期/分項成績'][item][st] ? stu['學期/分項成績'][item][st] : {}; 
  //         stu['學期/分項成績(原始)'][item][st] = stu['學期/分項成績(原始)'][item][st] ? stu['學期/分項成績(原始)'][item][st] : {}; 
  //           scoreRank.forEach(sr =>{
  //             stu['學期/分項成績'][item][st][sr] = stu['學期/分項成績'][item][st][sr]  ? stu['學期/分項成績'][item][st][sr] : ''; 
  //             stu['學期/分項成績(原始)'][item][st][sr]  = stu['學期/分項成績(原始)'][item][st][sr] ? stu['學期/分項成績(原始)'][item][st][sr]  : ''; 
  //             });
  //           });

  //       });
  //     }
  //     // 在排名類型內放入排名母群
  //     // if(!this.noneRank) {
  //     //   this.matrixList.forEach(m => {
  //     //     stu['學期/分項成績'][m] = stu['學期/分項成績'][m] ? stu['學期/分項成績'][m] : '';
  //     //     stu['學期/分項成績(原始)'][m] = stu['學期/分項成績(原始)'][m] ? stu['學期/分項成績(原始)'][m] : '';
  //     //   });
  //     // }

  //     // 新增擺放總分、加權總分、總學分數及科目總數(紀錄科目總數目的為過濾掉學分數為零的科目，不會列計平均時的分母)
  //     stu['credit'] = stu['credit'] ? stu['credit']: 0; // 總學分數
  //     stu['exam_total'] = stu['exam_total'] ? stu['exam_total']: 0; // 科目總數(不含0學分的科目)
  //     stu['examWeighted_total'] = stu['examWeighted_total'] ? stu['examWeighted_total']: 0; // 加權總分(擇優)
  //     stu['examScore_total'] = stu['examScore_total'] ? stu['examScore_total']: 0; // 總分(擇優)
  //     stu['ori_examWeighted_total'] = stu['ori_examWeighted_total'] ? stu['ori_examWeighted_total']: 0; // 加權總分(原始)
  //     stu['ori_examScore_total'] = stu['ori_examScore_total'] ? stu['ori_examScore_total']: 0; // 總分(原始)

  //     // 新增處理平均所用的變數
  //     stu['score_decimal'] = stu['score_decimal'] ? stu['score_decimal'] : 0;
  //     stu['score_carry'] = stu['score_carry'] ? stu['score_carry'] : '';
  //     this.subjectList.forEach (sub => {
  //       stu.subject[sub] = stu.subject[sub] ? stu.subject[sub] : {};
  //       stu.subject[sub]['ori_score'] = stu.subject[sub]['ori_score'] ? stu.subject[sub]['ori_score'] : {};
  //       stu.subject[sub]['adjustedScore'] = stu.subject[sub]['adjustedScore'] ? stu.subject[sub]['adjustedScore'] : {};
  //       stu.subject[sub]['year_rj_score'] = stu.subject[sub]['year_rj_score'] ? stu.subject[sub]['year_rj_score'] : {};
  //       stu.subject[sub]['make_up_score'] = stu.subject[sub]['make_up_score'] ? stu.subject[sub]['make_up_score'] : {};
  //       stu.subject[sub]['re_score'] = stu.subject[sub]['re_score'] ? stu.subject[sub]['re_score'] : {};
  //       stu.subject[sub]['finalScore'] = stu.subject[sub]['finalScore'] ? stu.subject[sub]['finalScore'] : [];
  //       stu.subject[sub]['finalMark'] = stu.subject[sub]['finalMark'] ? stu.subject[sub]['finalMark'] : '';
  //       stu.subject[sub]['avg'] = stu.subject[sub]['avg'] ? stu.subject[sub]['avg'] : '';
  //       stu.subject[sub]['credit_avg'] = stu.subject[sub]['credit_avg'] ? stu.subject[sub]['credit_avg'] : '';
  //       stu.subject[sub]['學期/科目成績(原始)'] = stu.subject[sub]['學期/科目成績(原始)'] ? stu.subject[sub]['學期/科目成績(原始)'] : {}; // 預定塞入排名
  //       stu.subject[sub]['學期/科目成績'] = stu.subject[sub]['學期/科目成績'] ? stu.subject[sub]['學期/科目成績'] : {}; // 預定塞入排名
  //       stu.subject[sub]['get_cedit'] = stu.subject[sub]['get_cedit'] ? stu.subject[sub]['get_cedit'] : false;
  //       // 各科排名初始化
  //       if(!this.noneRank){
  //         this.matrixList.forEach(m => {
  //           stu.subject[sub]['學期/科目成績'][m] = stu.subject[sub]['學期/科目成績'][m] ? stu.subject[sub]['學期/科目成績'][m] : '';
  //           stu.subject[sub]['學期/科目成績(原始)'][m] = stu.subject[sub]['學期/科目成績(原始)'][m] ? stu.subject[sub]['學期/科目成績(原始)'][m] : '';
  //         });
  //       }
  //     });
  //   });
  // };

  /** 將成績依照學生擁有的科目放入，並整理 */
  // public insertStuScore(data: ExamScoreRec) {
  //   const index = this.studentList.findIndex((stu: StudentRec) => stu.id == data.student_id);
  //   if(index > -1){
  //     // 將各分數及分數狀態寫入清單，為了後續比較大小，還需額外紀錄成績是否存在（noneScore）
  //     //let doc = JSON.stringify(data.class_rating);
  //     this.studentList[index].subject[data.subject]['ori_score'].score = data.ori_score ? data.ori_score : 0; // 原始成績
  //     this.studentList[index].subject[data.subject]['ori_score'].type = '原始成績';
  //     this.studentList[index].subject[data.subject]['ori_score'].symbol = 'O';
  //     this.studentList[index].subject[data.subject]['ori_score'].noneScore = data.ori_score ? true : false;
  //     this.studentList[index].subject[data.subject]['adjustedScore'].score = data.adjustedscore ? data.adjustedscore : '0'; // 手動調整成績
  //     this.studentList[index].subject[data.subject]['adjustedScore'].type = '手動調整成績';
  //     this.studentList[index].subject[data.subject]['adjustedScore'].symbol = 'A';
  //     this.studentList[index].subject[data.subject]['adjustedScore'].noneScore = data.adjustedscore ? true : false;
  //     this.studentList[index].subject[data.subject]['year_rj_score'].score = data.year_rj_score ? data.year_rj_score : '0'; // 學年調整成績
  //     this.studentList[index].subject[data.subject]['year_rj_score'].type = '學年調整成績';
  //     this.studentList[index].subject[data.subject]['year_rj_score'].symbol = 'Y' ;
  //     this.studentList[index].subject[data.subject]['year_rj_score'].noneScore = data.year_rj_score ? true : false;
  //     this.studentList[index].subject[data.subject]['make_up_score'].score = data.make_up_score ? data.make_up_score  : '0'; // 補考成績
  //     this.studentList[index].subject[data.subject]['make_up_score'].type = '補考成績';
  //     this.studentList[index].subject[data.subject]['make_up_score'].symbol = 'M';
  //     this.studentList[index].subject[data.subject]['make_up_score'].noneScore = data.make_up_score ? true : false;
  //     this.studentList[index].subject[data.subject]['re_score'].score = data.re_score ? data.re_score : '0'; // 重修成績
  //     this.studentList[index].subject[data.subject]['re_score'].type = '重修成績';
  //     this.studentList[index].subject[data.subject]['re_score'].symbol = 'R';
  //     this.studentList[index].subject[data.subject]['re_score'].noneScore = data.re_score ? true : false;
  //     this.studentList[index].subject[data.subject]['score_tooltip'] = this.studentList[index].subject[data.subject]['score_tooltip'] ? this.studentList[index].subject[data.subject]['score_tooltip'] : '';
  //     if(data.get_cedit === '是') {
  //       this.studentList[index].subject[data.subject]['get_cedit'] = true;
  //     } else {
  //       this.studentList[index].subject[data.subject]['get_cedit'] = false;
  //     }
  //     this.studentList[index].subject[data.subject]['finalScore'] = this.calfinalScore(data, index);

  // 統計級距 (手動計算，但之後改為直接取用固定排名的資料)
  // this.calRange(data.subject, '原始', data.ori_score);
  // this.calRange(data.subject, '擇優', this.studentList[index].subject[data.subject]['finalScore'][0].score);

  // 計算總分(含原始)、加權總分(含原始)、總學分數及科目總數
  // let score_decimal = 0;
  // let score_avg_calculating = 0;
  // let score_weight = 0;
  // let score_carry = ''

  // score_decimal = parseInt(data.score_decimal);
  // this.studentList[index]['score_decimal'] = score_decimal;
  // score_weight = parseInt(data.credit);
  // if(data.score_carry_45){
  //   score_carry = '四捨五入'
  // } else if(data.score_carry_round_down) {
  //   score_carry = '無條件捨去'
  // } else {
  //   score_carry = '無條件進位'
  // }
  // this.studentList[index]['score_carry'] = score_carry;

  // if(score_weight > 0){
  //   this.studentList[index]['credit'] = this.studentList[index]['credit'] + score_weight;
  //   this.studentList[index]['exam_total'] = this.studentList[index]['exam_total'] + 1;
  //   this.studentList[index]['examScore_total'] = this.studentList[index]['examScore_total'] + parseInt(this.studentList[index].subject[data.subject]['finalScore'][0].score); // 總分(擇優)
  //   this.studentList[index]['examWeighted_total'] = this.studentList[index]['examWeighted_total'] + NP.times(parseInt(this.studentList[index].subject[data.subject]['finalScore'][0].score), score_weight); // 加權總分(擇優)
  //   this.studentList[index]['ori_examScore_total'] = this.studentList[index]['ori_examScore_total'] + parseInt(this.studentList[index].subject[data.subject]['ori_score'].score); // 加權總分(原始)
  //   this.studentList[index]['ori_examWeighted_total'] = this.studentList[index]['ori_examWeighted_total'] + NP.times(parseInt(this.studentList[index].subject[data.subject]['ori_score'].score), score_weight); // 總分(原始)
  // }
  //   }else {
  //       console.log('成績資料內有學生，沒有存在目前班級學生清單中');
  //       console.log(data);
  //   }
  // };

  /** 處理最終顯示成績 */
  // public calfinalScore(data: ExamScoreRec, index: number) {
  //   const count: ScoreRec[] = [];
  //   let finaltxt = '';
  //   let scoreTooltip = ''

  //   count.push(
  //     this.studentList[index].subject[data.subject]['ori_score'],
  //     this.studentList[index].subject[data.subject]['adjustedScore'],
  //     this.studentList[index].subject[data.subject]['year_rj_score'],
  //     this.studentList[index].subject[data.subject]['make_up_score'],
  //     this.studentList[index].subject[data.subject]['re_score']
  //   );
  //   count.sort((a: ScoreRec, b: ScoreRec) => {
  //     // return parseFloat(a.score) - parseFloat(b.score);
  //     return parseFloat(b.score) - parseFloat(a.score);
  //   });

  //   // 組成「其他成績」字串
  //   count.forEach((i, index) => {
  //     if (i.type !== '原始成績' && i.noneScore) {
  //       finaltxt = finaltxt + i.symbol + ':' + i.score + ';';
  //       scoreTooltip = scoreTooltip + i.type + ':' + i.score + '; \n';
  //     }
  //   });
  //   this.studentList[index].subject[data.subject]['finalMark'] = finaltxt;
  //   this.studentList[index].subject[data.subject]['score_tooltip'] = scoreTooltip;
  //   return count;
  // }




  // 放入學生排行及計算平均
  // public insertStuRank() {
  //   this.studentList.forEach((student: StudentRec) => {
  //     // 計算平均 (佳樺決議拿掉)
  //     // this.calAvg(student); 
  //     this.stuExamRank.forEach((ser: ScoreRankInfo) => {
  //       try {
  //         if (ser.student_id === student.id && ser.item_type && student.subject[ser.item_name]) {
  //           if (ser.rank_type === '類別1排名') {
  //             student['類別1排名'] = ser.rank_name;
  //           } else if (ser.rank_type === '類別2排名') {
  //             student['類別2排名'] = ser.rank_name;
  //           }
  //           switch (ser.item_type) {
  //             case '學期/科目成績':
  //               student.subject[ser.item_name]['學期/科目成績'][ser.rank_type] = ser.rank ? ser.rank : '--';
  //               break;

  //             case '學期/科目成績(原始)':
  //               student.subject[ser.item_name]['學期/科目成績(原始)'][ser.rank_type] = ser.rank ? ser.rank : '--';
  //               break;

  //             case '學期/分項成績':
  //               if (ser.item_name === '學業') {
  //                 student['學期/分項成績'][ser.rank_type] = ser.rank ? ser.rank : '--';
  //               }
  //               break;
  //             case '學期/分項成績(原始)':
  //               if (ser.item_name === '學業') {
  //                 student['學期/分項成績(原始)'][ser.rank_type] = ser.rank ? ser.rank : '--';
  //               }
  //               break;
  //             default:
  //               break;
  //           }
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     })
  //   });
  // }

  // public initiRange() {
  //   // 因為要即時運算級距人數，所以重新調整；分層：單一班級->單一學年學期->科目->原始or擇優->各級距->人數
  //   // 此段處理到「各級距」層
  //   let type = ['原始','擇優']
  //   this.examMatrix = {};
  //   this.examMatrix['加權平均'] = {};
  //   this.examMatrix['算術平均'] = {};
  //   this.examMatrix['加權平均']['原始'] = {};
  //   this.examMatrix['加權平均']['擇優'] = {};
  //   this.examMatrix['算術平均']['原始'] = {};
  //   this.examMatrix['算術平均']['擇優']= {};
  //   this.subjectList.forEach( subject => {
  //     this.examMatrix[subject]= {};
  //       this.examMatrix[subject] = {};
  //       type.forEach(item => {
  //         this.examMatrix[subject][item] = {};
  //         this.examMatrix[subject][item]['level_gte100']= 0;
  //         this.examMatrix[subject][item]['level_90']= 0;
  //         this.examMatrix[subject][item]['level_80']= 0;
  //         this.examMatrix[subject][item]['level_70']= 0;
  //         this.examMatrix[subject][item]['level_60']= 0;
  //         this.examMatrix[subject][item]['level_50']= 0;
  //         this.examMatrix[subject][item]['level_40']= 0;
  //         this.examMatrix[subject][item]['level_30']= 0;
  //         this.examMatrix[subject][item]['level_20']= 0;
  //         this.examMatrix[subject][item]['level_10']= 0;
  //         this.examMatrix[subject][item]['level_lt10']= 0;
  //       })


  //         this.avgTypeList.forEach ( avgItem => {
  //           type.forEach(item => {
  //             this.examMatrix[avgItem][item] = {};
  //             this.examMatrix[avgItem][item]['level_gte100']= 0;
  //             this.examMatrix[avgItem][item]['level_90']= 0;
  //             this.examMatrix[avgItem][item]['level_80']= 0;
  //             this.examMatrix[avgItem][item]['level_70']= 0;
  //             this.examMatrix[avgItem][item]['level_60']= 0;
  //             this.examMatrix[avgItem][item]['level_50']= 0;
  //             this.examMatrix[avgItem][item]['level_40']= 0;
  //             this.examMatrix[avgItem][item]['level_30']= 0;
  //             this.examMatrix[avgItem][item]['level_20']= 0;
  //             this.examMatrix[avgItem][item]['level_10']= 0;
  //             this.examMatrix[avgItem][item]['level_lt10']= 0;
  //           })
  //         })
  //     })
  //   };

  // public calRange(subject: string, type: string, score: number) {
  //   try {
  //       let rfScore = score;
  //       switch (rfScore) {
  //         case (( rfScore >= 100) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_gte100'] = this.examMatrix[subject][type]['level_gte100'] + 1;
  //           break;
  //         case ( ( rfScore < 100 && rfScore >= 90 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_90'] = this.examMatrix[subject][type]['level_90'] + 1;
  //           break;
  //         case ( ( rfScore < 90 && rfScore >= 80 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_80'] = this.examMatrix[subject][type]['level_80'] + 1;
  //           break;
  //         case ( ( rfScore < 80 && rfScore >= 70 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_70'] = this.examMatrix[subject][type]['level_70'] + 1;
  //           break;
  //         case ( ( rfScore < 70 && rfScore >= 60 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_60'] = this.examMatrix[subject][type]['level_60'] + 1;
  //           break;
  //         case ( (rfScore < 60 && rfScore >= 50 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_50'] = this.examMatrix[subject][type]['level_50'] + 1;
  //           break;
  //         case ( ( rfScore < 50 && rfScore >= 40 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_40'] = this.examMatrix[subject][type]['level_40'] + 1;
  //           break;
  //         case ( ( rfScore < 40 && rfScore >= 30 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_30'] = this.examMatrix[subject][type]['level_30'] + 1;
  //           break;
  //         case ( ( rfScore < 30 && rfScore >= 20 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_20'] = this.examMatrix[subject][type]['level_20'] + 1;
  //           break;
  //         case ( (rfScore < 20 && rfScore >= 10 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_10'] = this.examMatrix[subject][type]['level_10'] + 1;
  //           break;
  //         case ( ( rfScore <10 ) ? rfScore : -1 ):
  //           this.examMatrix[subject][type]['level_lt10'] = this.examMatrix[subject][type]['level_lt10'] + 1;
  //           break;
  //         default:
  //           break;
  //       }
  //   } catch (error) {
  //     console.log(error);
  //   }

  // };

  // async GetRangeMaterix() {
  //   this.initiRange2();
  //   try {
  //     const rsp = await this.contract.send('GetSHRankMatrix', {
  //       ClassID: this.curClass.id
  //       , SchoolYear: this.curSS.school_year
  //       , Semester: this.curSS.semester
  //     });
  //       [].concat(rsp.RankMatrix || []).forEach((data: ExamRankRec) => {
  //         let tempText = '';
  //         if(data.item_type === '學期/分項成績' || data.item_type === '學期/分項成績(原始)' ) {
  //           tempText = data.item_name + '分項';
  //         } else {
  //           tempText = data.item_name;
  //         }
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['avg_top_25'] = data.avg_top_25 ? data.avg_top_25 : 0;
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['avg_top_50'] = data.avg_top_50 ? data.avg_top_50 : 0;
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['avg'] = data.avg ? data.avg : 0;
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['avg_bottom_50'] = data.avg_bottom_50 ? data.avg_bottom_50 : 0;
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['avg_bottom_25'] = data.avg_bottom_25 ? data.avg_bottom_25 : 0;
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_gte100'] = data.level_gte100 ? data.level_gte100 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_90'] = data.level_90 ? data.level_90 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_80'] = data.level_80 ? data.level_80 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_70'] = data.level_70 ? data.level_70 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_60'] = data.level_60 ? data.level_60 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_50'] = data.level_50 ? data.level_50 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_40'] = data.level_40 ? data.level_40 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_30'] = data.level_30 ? data.level_30 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_20'] = data.level_20 ? data.level_20 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_10'] = data.level_10 ? data.level_10 : '';
  //         this.examMatrix2[tempText][data.rank_type][data.item_type]['level_lt10'] = data.level_lt10 ? data.level_lt10 : '';
  //       });
  //     } catch (error) {
  //       console.log('取得級距及五標失敗');
  //       console.log(error);
  //     }
  // }


  // public initiRange2() {
  //   // 因為要即時運算級距人數，所以重新調整；分層：單一班級->單一學年學期->科目&總平均->原始&擇優->各級距->人數
  //   // 此段處理科目&總平均->原始&擇優->各級距 的資料基本架構
  //   let type = ['學期/科目成績(原始)','學期/科目成績','學期/分項成績(原始)','學期/分項成績']
  //   this.examMatrix2 = {};
  //   this.subSubjItemList = [];
  //   this.subSubjItemList = this.subjectList
  //   // let noneRankMatrixList = [];
  //   // 組成科目級距及五標的基本架構
  //   this.subSubjItemList.forEach(sub => {
  //     this.examMatrix2[sub] = {};
  //     if(this.noneRank === false) {
  //       this.matrixList.forEach(ml => {
  //         this.examMatrix2[sub][ml] = {};
  //           type.forEach(t => {
  //             this.examMatrix2[sub][ml][t] = {};
  //               this.rangeList.forEach(rl => {
  //                 this.examMatrix2[sub][ml][t][rl.key] = 0;
  //               })
  //               this.fiveRange.forEach(fr => {
  //                 this.examMatrix2[sub][ml][t][fr.key] = 0;
  //               })
  //           })
  //       })
  //     } else { // 這段暫時沒用...
  //       this.examMatrix2[sub]['沒有排名'] = {}
  //       type.forEach(t => {
  //         this.examMatrix2[sub]['沒有排名'][t] = {};
  //       });
  //     }
  //   });
  //   };
}

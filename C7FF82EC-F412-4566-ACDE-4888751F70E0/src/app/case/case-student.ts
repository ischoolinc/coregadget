import { QOption } from "./case-question-data-modal";
import { CaseQuestionTemplate } from "./case-question-template";

/** 個案學生 */
export class CaseStudent {
  constructor() {
    this.CaseSource = "";
    this.setOccurDateNow();
    this.CaseTeachers = [];
    this.selectCaseTeacers = [];
    this.isGuidanceTeacherHasValue = false;
  }

  UID: string;
  /** 班級 */
  ClassName: string;
  /** 座號 */ 
  SeatNo: string; 
  /** 姓名 */ 
  Name: string;
  /** 性別 */ 
  Gender: string = ''; //  
  /** 班導師 */
  TeacherName: string;
  /** 建立個案日期  */
  OccurDate: string; 
  /** 個案編號 */
  CaseNo: string; 
  /** 學生身分 */
  StudentIdentity: string; // 學生身份
  /**  疑似特殊生類別 */
  PossibleSpecialCategory: string; 
  /** 特殊生等級 */
  SpecialLevel: string; // 特殊生等級
   
  SpecialCategory: string; // 特殊生類別
  HasDisabledBook: string; // 是否領有身心障礙手冊
  DeviantBehavior: string; // 偏差行為
  ProblemCategory: string; // 個案類別(副) 
  ProblemMainCategory:string ; // 個案類別(主) 20210503 新增
  ProbleDescription: string; // 問題描述
  SpecialSituation: string; // 特殊狀況
  EvaluationResult: string; // 評估結果
  IsClosed: string; // 是否結案
  CloseDate: string; // 結案日期
  ClosedByTeacherID: string; // 結案人員教師編碼
  CloseDescription: string; // 結案說明
  StudentID: string; // 學生系統編號
  ClassID: string; // 班級編號
  CaseSource: string; // 個案來源
  CaseCount: string; // 個案輔導次數
  PhotoUrl: string;
  CaseTeachers: CaseTeacher[];
  CaseTeacherString : string ;
  /** 結案教師 */
  CaseCloseTeacher : any ;

  // 個案輔導等級相關
  isCaseLevel1Checked: boolean = false;
  isCaseLevel2Checked: boolean = false;
  isCaseLevel3Checked: boolean = false;
  isCaseLevelHasValue: boolean = false;

  CaseLevel: string = "";
  MainTeacher: string = "";
  Role: string = "";

  // 這個案選的個案老師
  selectCaseTeacers: SelectCaseTeacher[];

  deviant_behavior: QOption[]; // 偏差行為
  problem_category: QOption[]; // 	個案類別 (副)
  problem_main_category:QOption[];  // 個案類別(主) 根據月報表規則修改 就資料指向下相容副類別
  proble_description: QOption[]; //	問題描述
  special_situation: QOption[]; //	特殊狀況
  evaluation_result: QOption[]; //	評估結果

  isOccurDateHasValue: boolean = false;
  // isCaseNoHasValue: boolean = false;
  isGuidanceTeacherHasValue: boolean = false;
  isCaseSourceHasValue: boolean = false;
  isSaveButtonDisable: boolean = true;
  isAddButtonDisable: boolean = true;

  isCloseYes: boolean = false;
  isCloseNo: boolean = false;
  isCloseDateHasValue = false;

  // 不可編輯
  isEditDisable: boolean = true;

  // 是否顯示
  isDisplay: boolean = false;
  isDeviantBehaviorHasValue: boolean = false;
  isProblemCategoryHasValue: boolean = false;
  isProblemMainCategoryHasValue: boolean = false;
  isProbleDescriptionHasValue: boolean = false;
  isEvaluationResultHasValue: boolean = false;

  // 當透過轉介建立才會在值，儲存輔導紀錄 uid
  RefCounselInterviewID: string = "";

  //偏差行為
  caseQuestionTemplate: CaseQuestionTemplate = new CaseQuestionTemplate();
  // 使用預設題目項目樣版
  public useQuestionOptionTemplate() {
    this.loadDeviantBehaviorTemplate();   // 1. 取得 偏差行為之樣板
    this.loadEvaluationResultTemplate();  // 2. 取得 【評估結果】之選項
    this.loadProbleDescriptionTemplate(); // 3. 【問題描述】的選項
    this.loadProblemCategoryTemplate();   // 4. 取得 【個案類別(副)】
    this.loadProblemMainCategoryTemplate(); // 5 取得 【個案類別(主)】
    this.loadSpecialSituationTemplate();  // 6. 取得 【特殊狀況】
  }

  /** 清空個案類別(主類別) T :點選個案類別(主)時 */
  clearAllProblemMainCategory(item:QOption){
    this.problem_main_category.forEach( x=>{x.answer_checked = false});
    item.answer_checked = true;
  }

  /** 設定個案輔導層級 */ 
  SetCaseLevel(level: string) {
    this.isCaseLevel1Checked = false;
    this.isCaseLevel2Checked = false;
    this.isCaseLevel3Checked = false;
    this.CaseLevel = level;

    if (level === '初級') {
      this.isCaseLevel1Checked = true;
    } if (level === '二級') {
      this.isCaseLevel2Checked = true;
    } if (level === '三級') {
      this.isCaseLevel3Checked = true;
    }
  }

  // 取得目前個案教師名稱
  public GetTeacherNames() {
    let ta: string[] = [];
    this.CaseTeachers.forEach(item => {
      ta.push(item.TeacherName);
    });
    this.CaseTeacherString =ta.join(',');
    return ta.join(',');
  }

  /**偏差行為 */
  public loadDeviantBehaviorTemplate() {
    this.deviant_behavior = []; // 偏差行為
    let deviant_behaviorT = this.caseQuestionTemplate.getDeviantBehavior();
    let num: number = 1;
    for (let item of deviant_behaviorT) {
      let qo: QOption = new QOption();
      qo.answer_code = `deviant_behavior${num}`;
      qo.answer_martix = [];
      qo.answer_text = item.answer_text;
      qo.answer_checked = item.answer_checked;
      qo.answer_complete = item.answer_complete;
      qo.answer_value = item.answer_value;

      num += 1;
      this.deviant_behavior.push(qo);
    }
  }

  /** 取得個案類別 */
  public loadProblemCategoryTemplate() {
    let num: number = 1;
    this.problem_category = []; // 	個案類別
    let problem_categoryT = this.caseQuestionTemplate.getProblemCategory();

    for (let item of problem_categoryT) {
      let qo: QOption = new QOption();
      qo.answer_code = `problem_category${num}`;
      qo.answer_martix = [];
      qo.answer_text = item.answer_text;
      qo.answer_checked = item.answer_checked;
      qo.answer_complete = item.answer_complete;
      qo.answer_value = item.answer_value;

      num += 1;
      this.problem_category.push(qo);
    }

    console.log('副類別..',  this.problem_category)
  }



 



/**取得個案類別 (主) */
public loadProblemMainCategoryTemplate()
{
  console.log("個案類別(主) 載入.....");
  let num: number = 1;
  this.problem_main_category = []; // 	個案類別
  let problem_categoryT = this.caseQuestionTemplate.getProblemCategory();
debugger 
   console.log("個案類別...",problem_categoryT)
  for (let item of problem_categoryT) {
    let qo: QOption = new QOption();
    qo.answer_code = `problem_main_category${num}`;
    qo.answer_martix = [];
    qo.answer_text = item.answer_text;
    qo.answer_checked = item.answer_checked;
    qo.answer_complete = item.answer_complete;
    qo.answer_value = item.answer_value;

    num += 1;
    this.problem_main_category.push(qo);
  }


  console.log("裝好了 ",  this.problem_main_category)

}



  /** 問題描述 */
  public loadProbleDescriptionTemplate() {
    this.proble_description = []; //	問題描述
    let proble_descriptionT = this.caseQuestionTemplate.getProbleDescription();
    let num = 1;
    for (let item of proble_descriptionT) {
      let qo: QOption = new QOption();
      qo.answer_code = `proble_description${num}`;
      qo.answer_martix = [];
      qo.answer_text = item.answer_text;
      qo.answer_checked = item.answer_checked;
      qo.answer_complete = item.answer_complete;
      qo.answer_value = item.answer_value;

      num += 1;
      this.proble_description.push(qo);
    }
  }
  /** 特殊狀況 */
  public loadSpecialSituationTemplate() {
    this.special_situation = []; //	特殊狀況
    let special_situationT = this.caseQuestionTemplate.getSpecialSituation();
    let num = 1;
    for (let item of special_situationT) {
      let qo: QOption = new QOption();
      qo.answer_code = `special_situation${num}`;
      qo.answer_martix = [];
      qo.answer_text = item.answer_text;
      qo.answer_checked = item.answer_checked;
      qo.answer_complete = item.answer_complete;
      qo.answer_value = item.answer_value;

      num += 1;
      this.special_situation.push(qo);
    }
  }
  public loadEvaluationResultTemplate() {
    this.evaluation_result = []; //	評估結果
    let evaluation_resultT = this.caseQuestionTemplate.getEvaluationResult();
    let num = 1;
    for (let item of evaluation_resultT) {
      let qo: QOption = new QOption();
      qo.answer_code = `evaluation_result${num}`;
      qo.answer_martix = [];
      qo.answer_text = item.answer_text;
      qo.answer_checked = item.answer_checked;
      qo.answer_complete = item.answer_complete;
      qo.answer_value = item.answer_value;

      num += 1;
      this.evaluation_result.push(qo);
    }
  }

  public parseQuestioOptionToArray(data: string) {
    let value = [];
    let ss = JSON.parse(data);
    for (const s of ss) {
      let q: QOption = new QOption();
      q.answer_checked = s.answer_checked;
      q.answer_code = s.answer_code;
      q.answer_complete = s.answer_complete;
      q.answer_martix = s.answer_martix;
      q.answer_text = s.answer_text;
      q.answer_value = s.answer_value;
      value.push(q);
    }
    return value;
  }

  /** 將問答結果字串轉成 list*/
  public LoadQuestionOptionStringToList() {
    if (this.DeviantBehavior) {
      this.deviant_behavior = this.parseQuestioOptionToArray(
        this.DeviantBehavior
      );
    } else {
      this.loadDeviantBehaviorTemplate();
    }
    if (this.ProblemCategory) {
      
      this.problem_category = this.parseQuestioOptionToArray(
        this.ProblemCategory
      );

    } else {
      this.loadProblemCategoryTemplate();
    }

    //新增個案類別(主) 
    console.log('this',this)
    console.log('this,',this.ProblemMainCategory)
    if(this.ProblemMainCategory)
    {
   
      this.problem_main_category = this.parseQuestioOptionToArray(
        this.ProblemMainCategory 
      );
    
    }else{
     
      this.loadProblemMainCategoryTemplate();
    }
   

    this.isProbleDescriptionHasValue = false;
    if (this.ProbleDescription) {
      this.proble_description = this.parseQuestioOptionToArray(
        this.ProbleDescription
      );
      // 檢查是否有輸入文字
      for (const cc of this.proble_description) {
        // 有值
        if (cc.answer_value.length > 0 || cc.answer_martix.length > 0) {
          this.isProbleDescriptionHasValue = true;
        }
      }

    } else {
      this.loadProbleDescriptionTemplate();
    }

    if (this.SpecialSituation) {
      this.special_situation = this.parseQuestioOptionToArray(
        this.SpecialSituation
      );
    } else {
      this.loadSpecialSituationTemplate();
    }

    if (this.EvaluationResult) {
      this.evaluation_result = this.parseQuestioOptionToArray(
        this.EvaluationResult
      );
    } else {
      this.loadEvaluationResultTemplate();
    }
  }

  // 讀取 偏差行為 有勾選值
  public getDeviantBehaviorCheckedValue() {
    let value = [];
    for (const item of this.deviant_behavior) {
      if (item.answer_checked) {
        value.push(item.answer_value);
      }
    }
    return value.join(",");
  }

  // 讀取 個案類別 有勾選值
  public getProblemCategoryCheckedValue() {
    let value = [];
    for (const item of this.problem_category) {
      if (item.answer_checked) {
        value.push(item.answer_value);
      }
    }
    return value.join("、");
  }

  /**讀取個案類別主類別 */
  public getProblemMainCategoryCheckedValue() {
    let value = [];
    for (const item of this.problem_main_category) {
      // console.log('problem');
      // debugger
      console.log('problem00',item.answer_text+item.answer_checked);
      if (item.answer_checked) {
      console.log('problem00',item.answer_text+item.answer_checked);
      console.log('problem00)value',item.answer_value+item.answer_checked);


        value.push(item.answer_value);
      }
    }
    return value.join("、");
  }



  // 讀取 問題描述 有勾選值
  public getProbleDescriptionCheckedValue() {
    let value = [];
    for (const item of this.proble_description) {
      value.push(item.answer_value);
    }
    return value.join(",");
  }

  // 讀取 特殊狀況 有勾選值
  public getSpecialSituationCheckedValue() {
    let value = [];
    for (const item of this.special_situation) {
      if (item.answer_checked) {
        value.push(item.answer_value);
      }
    }
    return value.join(",");
  }

  // 讀取 評估結果 有勾選值
  public getEvaluationResultCheckedValue() {
    let value = [];
    for (const item of this.evaluation_result) {
      if (item.answer_checked) {
        value.push(item.answer_value);
      }
    }
    return value.join(",");
  }

  // 設定個案日期為現在
  public setOccurDateNow() {
    let dt = new Date();
    this.OccurDate = this.parseDate(dt, "-");
    this.isOccurDateHasValue = true;
  }

  public setCloseDateNow() {
    let dt = new Date();
    this.CloseDate = this.parseDate(dt, "/");
  }

  public setIsCloseNo() {
    this.IsClosed = "f";
    this.isCloseYes = false;
    this.isCloseNo = true;
  }

  // 取得是否結案文字
  public GetClosedString() {
    if (this.IsClosed && this.IsClosed === "t") {
      return "是";
    } else {
      return "否";
    }
  }

  /** 處理UI 檢查是否可以按下使用*/ 
  checkValue() {
   // debugger
    if (this.OccurDate) {
      this.isOccurDateHasValue = true;
    } else {
      this.isOccurDateHasValue = false;
    }

    // if (this.CaseNo) {
    //   this.isCaseNoHasValue = true;
    // } else {
    //   this.isCaseNoHasValue = false;
    // }

    if (this.CaseSource) {
      this.isCaseSourceHasValue = true;
    } else {
      this.isCaseSourceHasValue = false;
    }

    if (this.selectCaseTeacers.length > 0) {
      this.isGuidanceTeacherHasValue = true;
    } else {
      this.isGuidanceTeacherHasValue = false;
    }

    if (this.IsClosed && this.IsClosed === "t") {
      this.isCloseYes = true;
      this.isCloseNo = false;
    } else {
      this.isCloseYes = false;
      this.isCloseNo = true;
    }

    // 檢查是否有勾選
    this.isDeviantBehaviorHasValue = false;
    this.isProblemCategoryHasValue = false;
    this.isEvaluationResultHasValue = false;

    // 偏差行為
    for (const cc of this.deviant_behavior) {
      if (cc.answer_checked) {
        this.isDeviantBehaviorHasValue = true;
      }
    }

    // 個案類別(主)
    for (const cc of this.problem_main_category) {
      if (cc.answer_checked) {
        this.isProblemMainCategoryHasValue = true;
      }
    }

    // 個案類別(副)
    for (const cc of this.problem_category) {
      if (cc.answer_checked) {
        this.isProblemCategoryHasValue = true;
      }
    }

    //	評估結果
    for (const cc of this.evaluation_result) {
      if (cc.answer_checked) {
        this.isEvaluationResultHasValue = true;
      }
    }

    if (this.CaseLevel != '')
    {
      this.isCaseLevelHasValue = true;
    } else {
      this.isCaseLevelHasValue = false;
    }

    if (
      this.isOccurDateHasValue &&
      // this.isCaseNoHasValue &&
      this.isGuidanceTeacherHasValue &&
      this.isCaseSourceHasValue &&
      // this.isDeviantBehaviorHasValue && 20210510 依據需求改為非必填
      // this.isProblemCategoryHasValue && 20210513 副類別改為非必填
      this.isProblemMainCategoryHasValue &&
      this.isProbleDescriptionHasValue &&
      this.isEvaluationResultHasValue &&
      this.isCaseLevelHasValue &&
      this.StudentID
    ) {
      this.isSaveButtonDisable = false;
    } else {
      this.isSaveButtonDisable = true;
    }

    if (this.RefCounselInterviewID) {
      this.isAddButtonDisable = true;
    } else {
      this.isAddButtonDisable = false;
    }
  }

  public parseDate(dt: Date, str: string) {
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();
    let mStr = "" + m;
    let dStr = "" + d;
    if (m < 10) {
      mStr = "0" + m;
    }

    if (d < 10) dStr = "0" + d;

    return `${y}${str}${mStr}${str}${dStr}`;
  }
}

// 個案輔導老師
export class CaseTeacher {
  constructor() { }
  CaseID: string;
  TeacherID: string;
  MainTeacher: boolean;
  Role: string;
  TeacherName: string;
  Order: number;
}

// 輔導老師
export class CounselTeacher {
  constructor() { }
  TeacherID: string;
  Role: string;
  TeacherName: string;
}



export class SelectCaseTeacher {
  constructor() { }
  Order: number;
  CounselTeacher: CounselTeacher;
}
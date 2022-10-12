/** 新增時得使用物件 */
export class CaseQuestionTemplate {
  constructor() {}

  // 偏差行為
  public getDeviantBehavior() {
    let data = [
      {
        answer_text: "外向性攻擊行為",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "內向性攻擊行為",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "偷竊",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "離家出走",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "孤僻羞怯",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "衝動行為",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "逃學",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "焦慮反應",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "容易分心",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "說謊",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "適應性不良",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "恐嚇勒索",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "遊蕩",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "參加不良幫派",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "賭博",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "抽煙",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "吸毒",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "喝酒",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "其他%text1%",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      }
    ];

    return [].concat(data || []);
  }

  /**個案類別*/
  public getProblemCategory():IOptionInfo[] {
    let data = [
      {
        answer_text: "人際困擾",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "師生關係",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "家庭困擾",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "自我探索",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "情緒困擾",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "生活壓力",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "創傷反應",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "自我傷害",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "性別議題",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "脆弱家庭",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "兒少保議題",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "學習困擾",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "生涯輔導",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "偏差行為",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "網路沉迷",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "中離(輟)拒學",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "藥物濫用",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "精神疾患",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "其他%text1%",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      }
    ];

    return [].concat(data || []);
  }
  /** 問題描述 */
  public getProbleDescription() {
    let data = [
      {
        answer_text: "%text4%",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      }
    ];

    return [].concat(data || []);
  }
  /**特殊狀況 */ 
  public getSpecialSituation() {
    let data = [
      {
        answer_text: "長期服用藥物，藥名：%text1%",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "曾有自殺、自傷企圖",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "已建檔之個案",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "新移民子女",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "原住民子女",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "單親家庭",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "隔代教養",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "家暴議題",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "寄養家庭",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "其他：%text1%",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      }
    ];

    return [].concat(data || []);
  }

  /** 評估結果 */
  public getEvaluationResult() {
    let data = [
      {
        answer_text: "轉介認輔教師",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "轉介兼輔教師",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "轉介專輔教師",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "轉介駐區心理師",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "轉介駐區社工",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "轉介駐區精神科醫師",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      },
      {
        answer_text: "轉介社會局",
        answer_value: "",
        answer_martix: [],
        answer_complete: false,
        answer_checked: false
      }
    ];

    return [].concat(data || []);
  }

    /** 取得學生身分 */
    public getTeacherCounselLevel() {
      let teacherCounselLevel :string [] =[
        '初級',
        '二級',   
        '三級'
      ]
    
      let data :{}[]=[]
      // 預設勾選已下皆非
      teacherCounselLevel.forEach(item =>{
       let defaultChecked = false;
   
        data.push(
          {
            answer_text: item,
            answer_value: "",
            answer_martix: [],
            answer_complete: false,
            answer_checked: defaultChecked 
          }
  
        )
      })
      return [].concat(data || []);
    }

  /** 取得學生身分 */
  public getStudentStatus() {
    let studentStatusStr :string [] =[
      '以下皆非',
      '智能障礙',
      '視覺障礙',
      '聽覺障礙',
      '語言障礙',
      '肢體障礙',
      '腦性麻痺',
      '身體病弱',
      '情緒行為障礙',
      '學習障礙',
      '多重障礙',
      '自閉症',
      '發展遲緩',
      '其他障礙',

    ]
  
    let data :{}[]=[]
    // 預設勾選已下皆非
    studentStatusStr.forEach(item =>{
     let defaultChecked = false;
     if(item =='以下皆非'){
      defaultChecked=true ;

     }
      data.push(
        {
          answer_text: item,
          answer_value: "",
          answer_martix: [],
          answer_complete: false,
          answer_checked: defaultChecked 
        }

      )
    })

    return [].concat(data || []);

  }
}

/**選項得介面 */
export interface IOptionInfo{
  answer_text :string;
  answer_value :string;
  answer_martix :string[];
  answer_complete;
  answer_checked ;
}

export class OptionInfo implements IOptionInfo{
  answer_text;
  answer_value;
  answer_martix;
  answer_complete;
  answer_checked ;
}
// /** 簡單的*/
// export interface SimpOptionInfo{
//   answer_text :string ;
//   answer_checked :boolean ;

// }

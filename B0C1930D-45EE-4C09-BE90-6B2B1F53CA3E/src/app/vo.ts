export interface ClassInfo {
    ID: string;
    ClassName: string;

}

/**
 *  
 */
export interface YearSemster {
    SchoolYear: string;
    Semester: string;
}

/**
 *【畫面顯示用】 裝讀進來 來的領域資料
 */
export interface SubjectOrDomainInfo {
    Name: string;
    Order: string;
    Check: string;
}


/**
 * 裝讀進來的學生資料
 */
export interface SemsScoreInfo {
    ScoreType: string;
    StudentID: string;
    SeatNo: string;
    StudentName: string;
    Title: string;
    OrginScore: string;
    RetestScore: string;
    Score:string;

}

/**
 * 裝回來的資料
 */
export interface RankInfo {
    StudentID: string;
    ItemName: string;
    OrgainScoreRank :string;
    BestScoreRank: string;
}




export class StudentInfo {
    StudentID: string;
    SeatNo: string;
    StudentName: string;
    rank_name: string;

    /**
     * 裝科目資料
     */
    ScoreInfo: Map<string, SemsScore>

    constructor(semsSubjScoreInfo: SemsScoreInfo) {
        this.StudentID = semsSubjScoreInfo.StudentID;
        this.SeatNo = semsSubjScoreInfo.SeatNo;
        this.StudentName = semsSubjScoreInfo.StudentName;
        this.ScoreInfo = new Map();
    }

    /**
     * 確認是否已經有此科目
     */
    hasSubj(subject: string): boolean {
        return this.ScoreInfo.has(subject);
    }

    /**
     * 增加成績資訊
     */
    addScoreInfo(semsSubjScoreInfo: SemsScoreInfo) {
        const semsScoreInfo = new SemsScore(semsSubjScoreInfo);
        this.ScoreInfo.set(semsScoreInfo.Title, semsScoreInfo); // 加入字典
        //   this.SconreInfoList.push(semsScoreInfo);
    }
    /**
     * 把排名加進去
     */
    addRankInfo(rankInfo: RankInfo) {
        // console.log("addlog...")
        this.ScoreInfo.get(rankInfo.ItemName).RankInfo = rankInfo;
        // console.log("after add ", this.ScoreInfo.get(rankInfo.ItemName).RankInfo);


    }
}


/**
 * 裝成績的資訊
 */
export class SemsScore {
    constructor(semsSubjScoreInfo: SemsScoreInfo) {
        console.log("semsSubjScoreInfo",semsSubjScoreInfo)
        this.Title = semsSubjScoreInfo.Title;
        this.OrginScore = semsSubjScoreInfo.OrginScore ;
        this.RetestScore = semsSubjScoreInfo.RetestScore ; 
        this.Score = semsSubjScoreInfo.Score;
        // this.setBestScore();
        console.log("semsSubjScoreInfo end ",this)
    }

 
   
  
    Title: string;
    OrginScore: string;
    RetestScore: string;
    Score :string ;
    /**
   * 固定排名資訊  
   */
    RankInfo: RankInfo;
    // aa:string ;

    /**
     * 取得 擇優成績 
     * @memberof SemsScoreInfo
//      */
//   setBestScore() {
       
//         console.log("this.RetestScore",this.RetestScore );
//         console.log("this.OrginScore",this.OrginScore);
//         if (this.RetestScore == "" && this.OrginScore != "") { //    
//            this.Score  = parseFloat(this.OrginScore);
//         }

//         if (this.OrginScore == "" && this.RetestScore !== "") {
//             this.Score =  parseFloat(this.RetestScore);
//         }

//         if (this.OrginScore !== "" && this.RetestScore !== "") {
//             let orgin = parseFloat(this.RetestScore);
//             let retest = parseFloat(this.RetestScore);
//             if (orgin > retest) // 回傳較大的值
//             {
//                 this.Score = orgin;
//             } else {
//                 this.Score  = retest;
            
//         }

//         return  0;
//     }

//     }

    }



/**
 *
 *
 * @export
 * @interface RankType
 */
export interface RankType {
    RankType: string;
}


/**
 *
 * [顯示用] 成績用法 
 * @export
 * @class ScoreType
 */
export class ScoreType {
    constructor(name: string) {
        this.Name = name;
    }
    Name: string;
    Order: string;
    Check: boolean;
    HasRank: boolean = true; // 預設有排名 只有 【補考成績】沒有排名
}



/**
 * 存放當前選擇的項目  按下查詢的時候更新
 */
export class SelectionObj {
    /**
     *
     * 所選班級資訊
     * @type {ClassInfo}
     * @memberof SelectionObj
     */
    currentClass: ClassInfo;
    /**
     *
     * 所選學年度學期
     * @type {YearSemster}
     * @memberof SelectionObj
     */
    schoolYearSemester: YearSemster;
    /**
     * 所選成績類型 科目成績 或是 領域成績
     *
     * @type {string}
     * @memberof SelectionObj
     */
    currentScoreType: string = "科目成績";

}

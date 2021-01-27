export interface ExamScoreRec {
    /** 學生ID */
    student_id: string;

    /** 學生姓名 */
    student_name: string;

    /** 學年度 */
    school_year:string;

    /** 學期 */
    semester: string;

    /** 座號 */
    seat_no: string;

    /** 取得學分 */
    get_cedit: string;

    /** 學分 */
    credit: string;

    /** 科目 */
    subject: string;

    /** 修課必選修 */
    s_q: string;

    /** 修課校部訂 */
    s_m: string;

    /** 是否補修成績 */
    make_up_tf

    /** 科目級別 */
    subject_level: string;

    /** 原始成績 */
    ori_score: number;

    /** 手動調整成績（擇優採計成績） */
    adjustedscore: number;
    
    /** 學年調整成績 */
    year_rj_score: number;
    
    /** 補考成績 */
    make_up_score: number;
    
    /** 重修成績 */
    re_score: number;
    
    /** 重修學年度 */
    re_school: string;

    /** 重修學期 */
    re_semester: string;
    
    /** 最終呈現分數 */
    finalScore: string;

    /** 最終呈現分數 */
    finalMark: string;
    
    /** 排名 */
    rank: string;
    
    /** 算術平均 */
    avg: string;
    
    /** 加權平均 */
    avgWeight: string;

    /** 小數位數 */
    score_decimal?: string;

    /** 四捨五入進位 */
    score_carry_45?: boolean;

    /** 無條件捨去 */
    score_carry_round_down?: boolean;

    /** 無條件進位 */
    score_carry_round_up?: boolean;

    /** 班級排名 */
    class_rating?: any
    //     分數符數說明
    // 一、分數前「＊」代表不及格。
    // 二、分數前「C」代表補考。
    // 三、「/」後分數代表重修後成績。
}


export interface ScoreRankInfo {
    /** 學生ID */
    student_id: string;

    /** 科目名稱 */
    item_name: string;

    /** 排行類型 */
    item_type?: string;

    /** 學年度 */
    school_year:string;

    /** 學期 */
    semester: string;

    /** 排名 */
    rank: string;

    /** 排行母群名稱 */
    rank_name?: string;

    /** 排行母群 */
    rank_type: string;

    /** 分數 */
    score?: string;

    /** 試別ID */
    exam_id?: string;
}
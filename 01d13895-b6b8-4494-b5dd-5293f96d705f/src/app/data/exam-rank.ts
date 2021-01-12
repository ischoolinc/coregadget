export interface ExamRankRec {
    student_id: number;
    score: string;
    rank: string;
    school_year: string;
    semester: string;
    item_type: string;
    exam_id: string;
    item_name: string;
    rank_type: string;
    rank_name: string;
    avg_top_25?: number;
    avg_top_50?: number;
    avg?: number;
    avg_bottom_50?: number;
    avg_bottom_25?: number;
    level_gte100?: string;
    level_90?: string;
    level_80?: string;
    level_70?: string;
    level_60?: string;
    level_50?: string;
    level_40?: string;
    level_30?: string;
    level_20?: string;
    level_10?: string;
    level_lt10?: string;
}

export interface SubScoreRankRec {
    /** 學生UID */
    ref_student_id: string;

    /** 分項項目（學業、實習科目等） */
    item_name?: string;

    /** 分數及排名類型（最終or原始） */
    item_type?: string;

    /** 排名母群（最終or原始） */
    rank_type?: string;

    /** 排名母群類型（最終or原始） */
    rank_name?: string;

    /** 排名 */
    rank?: string;

    /** 分數 */
    score?: string;

    /** 百分比（先拿，後續可能會用到）*/
    percentile?: string;

    /** PR值（先拿，後續可能會用到）*/
    pr?: string;
}


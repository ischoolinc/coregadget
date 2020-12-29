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



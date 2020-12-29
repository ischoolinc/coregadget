export interface MatrixRec {
    exam_id: number;
    item_type: string;
    item_name: string;
    rank_type: string;
    avg_top_25: number;
    avg_top_50: number;
    avg: number;
    avg_bottom_50: number;
    avg_bottom_25: number;
    level_gte100: number;
    level_90: number;
    level_80: number;
    level_70: number;
    level_60: number;
    level_50: number;
    level_40: number;
    level_30: number;
    level_20: number;
    level_10: number;
    level_lt10: number;
}
export interface PlanRec {
    id: string;
    name: string;
    content: string;
    school_year: string;
    moe_group_code: string;
    moe_group_code_1: string;
    /** 與課程代碼比較是否有差異 */
    different?: boolean;
}

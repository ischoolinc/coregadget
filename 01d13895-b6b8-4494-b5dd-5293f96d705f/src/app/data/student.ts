export interface StudentRec {
        /** 系統編號 */
        id: string;

        /** 姓名 */
        name: string;

        /** 座號 */
        seat_no: number;

        /** 科目 */
        subject: object;

        /** 小數位數 */
        score_decimal?: number;

        /** 進位 */
        score_carry?: string;

        /** 學分 */
        credit?: number;
        
        /** 科目數加總 */
        exam_total?: number;

        /** 總分 */
        examScore_total?: number;

        /** 加權總分 */
        examWeighted_total?: number;
        
        /** 加權總分(原始) */    
        ori_examWeighted_total?: number;

        /** 總分(原始) */ 
        ori_examScore_total?: number;

        rank_name?: string;


    // /** 系統編號 */
    // id: number;
    // /** 姓名 */
    // name: string;
    // /** 座號 */
    // seat_no: number;
    // /** 科目定期評量成績 */
    // examScore: any;
    // /** 科目平時成績 */    
    // examScore_us: any;
    // /** 科目文字評量 */    
    // examScore_text: any;
    // /** 科目文字評量平均小數位數 */    
    // examScore_decimal: string;
    // /** 科目文字評量平均進位條件 */    
    // examScore_carry: string; 
    // /** 科目文字評量平均*/    
    // examScore_avg: any;
    // /** 科目加權數 */
    // examWeighted: any;
    // /** 科目加權總分 */
    // examWeighted_total: any;
    // /** 科目加權平均 */
    // examWeighted_total_avg: any;
    // /** 科目總分 */   
    // examScore_total: any;
    // /** 科目算術平均 */   
    // examScore_total_avg: any;
    // /** 科目定期評量排名 */
    // examRank: any;
}
export interface StudentRec {
    /** 系統編號 */
    id: number;
    /** 姓名 */
    name: string;
    /** 座號 */
    seat_no: number;
    /** 科目定期評量成績 */
    examScore: any;
    /** 科目平時成績 */    
    examScore_us: any;
    /** 科目文字評量 */    
    examScore_text: any;
    /** 科目文字評量平均比例 */    
    examScore_proportion: any;
    /** 科目文字評量平均小數位數 */    
    examScore_decimal: any;
    /** 科目文字評量平均進位條件 */    
    examScore_carry: any; 
    /** 科目文字評量平均*/    
    examScore_avg: any;
    /** 科目加權數 */
    examWeighted: any;
    /** 科目加權總分 */
    examWeighted_total: any;
    /** 科目加權平均 */
    examWeighted_total_avg: any;
    /** 科目總分 */   
    examScore_total: any;
    /** 科目算術平均 */   
    examScore_total_avg: any;
    /** 科目定期評量排名 */
    examRank: any;
    
}
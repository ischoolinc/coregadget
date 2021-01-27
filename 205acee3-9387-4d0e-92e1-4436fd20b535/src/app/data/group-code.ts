
export interface GroupCodeRec {
    /** 適用入學年度 */
    entry_year: string;
    /** 課程類型 */
    course_type: string;
    /** 群別代碼 */
    group_type: string;
    /** 科別代碼 */
    subject_type: string;
    /** 班群 */
    class_type: string;
    /** 課程代碼 */
    group_code: string;
  }
  
export interface GroupCodeExRec extends GroupCodeRec {
    selected: boolean;
}
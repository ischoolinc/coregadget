export class AttendRecord{

    /**選課科目系統編號 */
    SubjectID: string;

    /**選課科目名稱 */
    SubjectName: string;

    /**科目級別 */
    Level: string;

    /**學分數 */
    Credit: string;

    /**教學目標 */
    Goal: string;

    /**教學內容 */
    Content: string;

    /**備註 */
    Memo: string;

    /**修課人數上限 */
    Limit: string;

    /**選課學生修課人數 */
    AttendCount: string;

    /**設為第一志願的學生數 */
    FirstWishCount: string;

    /**鎖定 */
    Lock: boolean;

    /**修課模式 */
    AttendType: string;

    /**跨課程時段1 */
    CrossType1: string;

    /**跨課程時段2 */
    CrossType2: string;

    /**是否為跨課程時段 */
    IsCrossType: boolean;
}
export class SubjectRecord{

    /** 選課科目系統編號 */
    SubjectID: string;

    /** 選課科目名稱 */
    SubjectName: string;

    /** 科目級別 */
    Level: string;

    /** 學分數 */
    Credit: string;

    /** 教學目標 */
    Goal: string;

    /** 教學內容 */
    Content: string;

    /** 備註 */
    Memo: string;

    /** 修課人數限制 */
    Limit: number;

    /** 修課人數 */
    AttendCount: number;

    /** 設定為第一志願人數 */
    FirstWishCount: number;

    /** 黑名單資料 */
    BlockReason: string;
    
    /** 跨課程時段1 */
    CrossType1: string;

    /** 跨課程時段2 */
    CrossType2: string;

    /** 志願序 */
    WishOrder: any;

    TimeSelect: string;

    RepeatSelect: string;
}
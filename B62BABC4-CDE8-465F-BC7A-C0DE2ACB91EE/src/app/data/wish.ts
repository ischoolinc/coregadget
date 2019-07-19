export class WishRecord{

    /**科目系統編號 */
    SubjectID: string;

    /**科目名稱 */
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

    /**選課人數限制 */
    Limit: string;

    /**修課人數 */
    AttendCount: string;

    /**設為第一志願的學生人數 */
    FirstWishCount: string;

    /**第幾志願 */
    WishOrder: number;

    /**擋修原因 */
    BlockReason: string;

    /**跨課程時段1 */
    CrossType1: string;

    /**跨課程時段2 */
    CrossType2: string;

    /**此課程時段(類別)是否已選課 */
    TimeSelect: string;
}
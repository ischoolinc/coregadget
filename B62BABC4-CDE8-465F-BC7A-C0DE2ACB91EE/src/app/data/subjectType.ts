import { WishRecord } from "./wish";
import { AttendRecord } from "./attend";

export class SubjectTypeRecord{
    
    /**課程時段(類別) */
    SubjectType: string;

    /**修課紀錄 */
    Attend: AttendRecord;

    /**志願序 */
    WishList: WishRecord[];

    /**是否開放選課 */
    IsOpenType: string;
}
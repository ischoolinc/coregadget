import { SubjectTypeRecord } from "./subjectType";

export class BasicInfo{

    /**學年度 */
    SchoolYear: string;

    /**學期 */
    Semester: string;

    /**開始時間 */
    StartTime: any;

    /**結束時間 */
    EndTime: any;

    /**選課模式 */
    Mode: string;

    /**系統資料庫時間 */
    ServerTime: string;

    /**選課公告內容 */
    Memo: string;

    /**取得所有課程類別的選課狀態與資料 */
    SubjectTypeList: SubjectTypeRecord[];

    /**選課時間: ~ (模式) */
    PS: string;    
}
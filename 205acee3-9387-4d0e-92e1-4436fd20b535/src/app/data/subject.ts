import { Jsonx } from "@1campus/jsonx";

export interface SubjectRec {
    /** 領域 */
    Domain: string;
    /** 分項類別 */
    Entry: string;
    /** 科目名稱 */
    SubjectName: string;
    /** 必選修 */
    Required: string;
    /** 校部訂 */
    RequiredBy: string;
    /** 科目代碼 */
    SubjectCode: string;
    /** 開始級別 */
    StartLevel: number;
    /** desktop 排序方式 */
    RowIndex: number;
    /** 1上 */
    LastSemester1: string;
    /** 1下 */
    NextSemester1: string;
    /** 2上 */
    LastSemester2: string;
    /** 2下 */
    NextSemester2: string;
    /** 3上 */
    LastSemester3: string;
    /** 3下 */
    NextSemester3: string;
    /** 4上 */
    LastSemester4: string;
    /** 4下 */
    NextSemester4: string;
    /** 學期課程清單 */
    smsSubjectList: SemesterSubjectRec[];
}

export interface SemesterSubjectRec {
    GradeYear: string;
    Semester: string;
    CourseName: string;
    Credit: string;
    jx: Jsonx;
}

export interface SubjectExRec extends SubjectRec {
    edit: boolean;
    // jx: Jsonx;
}
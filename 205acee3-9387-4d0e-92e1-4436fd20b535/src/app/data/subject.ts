export interface SubjectRec {
    
    /** 領域 */
    Domain: string;
    /** 分項類別 */
    Entry: string;

    // === key ====
    /** 科目名稱 */
    SubjectName: string;
    /** 必選修 */
    Required: string;
    /** 校部訂 */
    RequiredBy: string;
    
    /** 科目代碼 */
    SubjectCode: string;


    Category: string;
    Credit: string;
    GradeYear: string;
    Level: string;
    FullName: string;
    NotIncludedInCalc: string;
    NotIncludedInCredit: string;
    Semester: string;
    課程代碼: string;
    課程類別: string;
    開課方式: string;
    科目屬性: string;
    領域名稱: string;
    課程名稱: string;
    學分: string;
    授課學期學分: string;
}

export interface CourseRec {

}
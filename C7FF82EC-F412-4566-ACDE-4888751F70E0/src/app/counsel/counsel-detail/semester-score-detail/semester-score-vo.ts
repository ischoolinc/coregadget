
// 領域成績
export class DomainScoreInfo {
    SchoolYear: number;
    Semester: number;
    DomainName: string;
    DomainScore: number;
    DomainCredit: number;
    SubjectScoreList: SubjectScoreInfo[] = [];

    // 計算領域成績
    CalcDomainScore() {

    }
}

// 科目成績
export class SubjectScoreInfo {
    SchoolYear: number;
    Semester: number;
    CourseName: string;
    SubjectName: string;
    SubjectCredit: string;
    SubjectScore: number;  
}
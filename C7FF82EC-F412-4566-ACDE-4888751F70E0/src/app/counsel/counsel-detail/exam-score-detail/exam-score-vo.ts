
// 領域成績
export class DomainScoreInfo {
    constructor() { }
    DomainName: string;
    DomainScore: number;
    SumScore: number;
    Credit: number;
    Order: number;

    CourseScoreList: CourseScoreInfo[] = [];
    // 計算領域成績
    CalcDomainScore() {
        if (this.CourseScoreList.length > 0) {
            this.CourseScoreList.forEach( courseItem => {
                this.Credit += courseItem.CourseCredit;
                this.SumScore += (courseItem.CourseCredit * courseItem.CourseScore);
            });

            if (this.Credit > 0) {
                this.DomainScore = round(this.SumScore / this.Credit,2);
            }
        }
    }

    
}

var round = function (val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
  }

// 課程成績
export class CourseScoreInfo {
    constructor() { }
    CourseName: string;
    DomainName: string;
    SubjectName: string;
    CourseCredit: number;
    CourseScore: number;
    Order: number;
    ExamScoreList: ExamScoreInfo[] = [];
}

// 評量成績
export class ExamScoreInfo {
    constructor() { }
    ExamName: string;
    // 總成績
    ExamScore: number;
    // 定期
    Score: number;
    // 平時
    AssignmentScore: number;
    DisplayOrder: number;
    HasScore: boolean = false;
}

export class ExamAvgScoreInfo {
    constructor() { }
    ExamName: string;
    // 加權平均
    ExamAvgScore: number;
    // 計算加權平均
    Calc() {

    }
}

export class SemesterInfo {
    SchoolYear: number;
    Semester: number;
}

// 學生評量成績
export class StudentExamScore {
    DomainNameList: string[] = [];
    CourseNameList: string[] = [];
    DomainScoreList: DomainScoreInfo[] = [];
    CourseScoreList: CourseScoreInfo[] = [];
    ExamAvgScoreList: ExamAvgScoreInfo[] = [];
    ExamNameList: string[] = [];
}
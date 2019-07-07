
// 領域成績
export class DomainScoreInfo {
    Domain: string;
    Score: number;
    Credit: number;
    Period: number;
    Effort: number;
    Text: string;
    SubjectScoreList: SubjectScoreInfo[] = [];

    Calc() {
        this.Credit = 0;
        let SumScore = 0;
        this.Effort = 0;
        this.Text = "";
        this.SubjectScoreList.forEach(item => {
            if (item.Credit)
                this.Credit += item.Credit;
            if (item.Effort)
                this.Effort += item.Effort;
            if (item.Text)
                this.Text += item.Text;
            if (item.Score)
                SumScore += (item.Credit * item.Score);
        });

        if (this.Credit > 0) {
            this.Score = round(SumScore / this.Credit, 2);
        }
    }

    GetDegree() {
        let value = '';
        if (this.Score >= 90) value = '優';
        if (this.Score >= 80 && this.Score < 90) value = '甲';
        if (this.Score >= 70 && this.Score < 80) value = '乙';
        if (this.Score >= 60 && this.Score < 70) value = '丙';
        if (this.Score < 60) value = '丁';
        return value;
    }
}

var round = function (val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

// 科目成績
export class SubjectScoreInfo {
    Domain: string;
    SubjectName: string;
    Score: number;
    Credit: number;
    Period: number;
    Effort: number;
    Text: string;

    GetDegree() {
        let value = '';
        if (this.Score >= 90) value = '優';
        if (this.Score >= 80 && this.Score < 90) value = '甲';
        if (this.Score >= 70 && this.Score < 80) value = '乙';
        if (this.Score >= 60 && this.Score < 70) value = '丙';
        if (this.Score < 60) value = '丁';
        return value;
    }
}

export class StudentSemesterScoreInfo {
    DomainScoreList: DomainScoreInfo[] = [];
    CourseLearnScore: number;
    LearnDomainScore: number;
}

export class SemesterInfo {
    SchoolYear: number;
    Semester: number;
}

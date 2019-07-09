
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
    // 國中領域成績
    DomainScoreList: DomainScoreInfo[] = [];
    // 課程學習成績
    CourseLearnScore: number;
    // 學習領域成績
    LearnDomainScore: number;

    // 全部修得學分
    TotalCredit: number = 0;
    // 全部已取得學分
    TotalPassCredit: number = 0;
    // 分項學業成績
    EntryLearnScore: number;
    // 分項實習成績
    EntryPracticeScore: number;

    // 必修學分數
    RequiredCredit: number = 0;
    // 選修學分數    
    SelectedCredit: number = 0;
    // 部定必修
    GovRequiredCredit: number = 0;
    // 校訂必修
    SchoolRequiredCredit: number = 0;
    // 校訂選修
    SchoolSelectedCredit: number = 0;
    //實習
    PracticeCredit: number = 0;

    // 必修取得學分
    RequiredPassCredit: number = 0;
    // 選修取得學分  
    SelectedPassCredit: number = 0;
    // 部定必修取得學分
    GovRequiredPassCredit: number = 0;
    // 校訂必修取得學分
    SchoolRequiredPassCredit: number = 0;
    // 校訂選修取得學分
    SchoolSelectedPassCredit: number = 0;
    //實習取得學分
    PracticePassCredit: number = 0;

    // 高中學期科目成績
    SubjectScoreScoreListSH: SubjectScoreInfoSH[] = [];

    // 計算學分數
    CalcCredits() {
        if (this.SubjectScoreScoreListSH.length > 0) {
            this.SubjectScoreScoreListSH.forEach(subjItem => {
                let Credit: number = 0;
                if (!subjItem.isNotCalc)
                    Credit = subjItem.Credit;

                this.TotalCredit += Credit;

                if (subjItem.isRequired) {
                    this.RequiredCredit += Credit;
                    if (subjItem.SubjectType === '部定') {
                        this.GovRequiredCredit += Credit;
                    } else {
                        this.SchoolRequiredCredit += Credit;
                    }
                } else {
                    this.SelectedCredit += Credit;

                    if (subjItem.SubjectType === '校訂') {
                        this.SchoolSelectedCredit += Credit;
                    }
                }

                if (subjItem.Entry === '實習科目') {
                    this.PracticeCredit += Credit;
                }

                // 取得
                if (subjItem.isPass) {
                    this.TotalPassCredit += Credit;

                    if (subjItem.isRequired) {
                        this.RequiredPassCredit += Credit;
                        if (subjItem.SubjectType === '部定') {
                            this.GovRequiredPassCredit += Credit;
                        } else {
                            this.SchoolRequiredPassCredit += Credit;
                        }
                    } else {
                        this.SelectedPassCredit += Credit;

                        if (subjItem.SubjectType === '校訂') {
                            this.SchoolSelectedPassCredit += Credit;
                        }
                    }

                    if (subjItem.Entry === '實習科目') {
                        this.PracticePassCredit += Credit;
                    }
                }
            });
        }
    }
}

export class SemesterInfo {
    SchoolYear: number;
    Semester: number;
}

// 高中成績
export class SubjectScoreInfoSH {
    // 分項    
    Entry: string = "";
    // 科目名稱
    Subject: string = "";
    // 級別
    Level: string;
    // 學分數
    Credit: number;
    // 校訂or 部定
    SubjectType: string;
    // 必修 true
    isRequired: boolean = false;
    // 成績
    Score: number;
    // 取得學分 true 取得
    isPass: boolean = false;

    // 不列入計算(true 表示不列入計算)
    isNotCalc: boolean = false;

    // 是補考成績 (補考 true)
    isReScore: boolean = false;

    // 是否顯示(畫面上切換使用)
    isDisplay: boolean = false;
}

// 領域成績
export class DomainScoreInfo {
    constructor() { }
    DomainName: string;

    SumScore: number;
    Credit: number;
    Order: number;

    // 試別加權平均    
    AvgExamScoreList: ScoreInfo[] = [];
    ExamUpDownList: ExamUpDown[] = [];
    CourseScoreList: CourseScoreInfo[] = [];
    // 計算領域成績
    CalcDomainScore() {
        let tmpKey: string[] = [];
        // 各試別加權平均
        if (this.CourseScoreList.length > 0) {
            this.CourseScoreList.forEach(courseItem => {
                courseItem.ExamScoreList.forEach(examItem => {
                    let key = examItem.ExamName;
                    if (!tmpKey.includes(key)) {
                        let si: ScoreInfo = new ScoreInfo();
                        si.Name = key;
                        this.AvgExamScoreList.push(si);
                        tmpKey.push(key);
                    }
                    this.AvgExamScoreList.forEach(item => {
                        // 參考 Web 評量成績 處理 JavaScript 進位方式
                        if (item.Name === key) {
                            let CourseCredit = courseItem.CourseCredit * 100000;
                            let Score = examItem.ExamScore * 100000;
                            item.SumCredit += CourseCredit;
                            item.SumScore += (CourseCredit * Score);
                        }
                    })
                });
            });
        }
        // 計算加權平均
        this.AvgExamScoreList.forEach(item => {
            item.Calc();
        });
    }

    GetAvgExamScore(examName: string) {
        let value: number;
        this.AvgExamScoreList.forEach(item => {
            if (item.Name === examName) {
                value = item.AvgSocre;
            }
        });

        return value;
    }

    CalcUpDown() {
        if (this.AvgExamScoreList.length > 1) {
            for (let i = 1; i < this.AvgExamScoreList.length; i++) {
                let xx: ExamUpDown = new ExamUpDown();
                xx.Name = this.AvgExamScoreList[i].Name;
                xx.isUp = (this.AvgExamScoreList[i].AvgSocre > this.AvgExamScoreList[i - 1].AvgSocre);
                xx.isDown = (this.AvgExamScoreList[i].AvgSocre < this.AvgExamScoreList[i - 1].AvgSocre)
                this.ExamUpDownList.push(xx);
            }
        }
    }

    GetUpDown(examName: string) {
        let value = new ExamUpDown();
        this.ExamUpDownList.forEach(item => {
            if (item.Name === examName) {
                value = item;
            }
        });
        return value;
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
    ExamUpDownList: ExamUpDown[] = [];

    CalcUpDown() {
        if (this.ExamScoreList.length > 1) {
            for (let i = 1; i < this.ExamScoreList.length; i++) {
                let xx: ExamUpDown = new ExamUpDown();
                xx.Name = this.ExamScoreList[i].ExamName;
                xx.isUp = (this.ExamScoreList[i].ExamScore > this.ExamScoreList[i - 1].ExamScore);
                xx.isDown = (this.ExamScoreList[i].ExamScore < this.ExamScoreList[i - 1].ExamScore)
                this.ExamUpDownList.push(xx);
            }
        }
    }

    GetUpDown(examName: string) {
        let value = new ExamUpDown();
        this.ExamUpDownList.forEach(item => {
            if (item.Name === examName) {
                value = item;
            }
        });
        return value;
    }
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
    ExamAvgScoreList: ScoreInfo[] = [];
    ExamNameList: string[] = [];
    AvgItemCountNameList: string[] = [];
    AvgItemCountList: ItemCounts[] = [];
    CalcExamAvgScore() {
        let tmpKey: string[] = [];
        // 各試別加權平均
        if (this.CourseScoreList.length > 0) {
            this.CourseScoreList.forEach(courseItem => {
                courseItem.ExamScoreList.forEach(examItem => {
                    let key = examItem.ExamName;
                    if (!tmpKey.includes(key)) {
                        let si: ScoreInfo = new ScoreInfo();
                        si.Name = key;
                        this.ExamAvgScoreList.push(si);
                        tmpKey.push(key);
                    }
                    this.ExamAvgScoreList.forEach(item => {
                        if (item.Name === key) {
                            // 參考 Web 評量成績 處理 JavaScript 進位方式
                            let CourseCredit = courseItem.CourseCredit * 100000;
                            let Score = examItem.ExamScore * 100000;
                            item.SumCredit += CourseCredit;
                            item.SumScore += (CourseCredit * Score);

                        }
                    })
                });
            });
        }

        // 計算加權平均
        this.ExamAvgScoreList.forEach(item => {
            item.Calc();
        });
    }

    GetExamAvgScore(examName: string) {
        let value = -1;
        this.ExamAvgScoreList.forEach(item => {
            if (item.Name === examName) {
                value = item.AvgSocre;
            }
        });

        return value;
    }


    GetItemCount(domin: string, subject: string, exam: string, level: string) {

        let value: ItemCount = new ItemCount();
        let key = '';
        if (domin !== '') {
            key = domin + "_" + subject + "_" + exam;
        } else {
            key = subject + "_" + exam;
        }


        this.AvgItemCountList.forEach(item => {
            if (item.Name === key) {
                item.itemList.forEach(it => {
                    if (it.Name === level) {
                        value = it;
                    }
                });
            }
        });
        return value;
    }
}

export class ScoreInfo {
    Name: string;
    SumScore: number = 0;
    AvgSocre: number = 0;
    SumCredit: number = 0;

    Calc() {
        if (this.SumCredit > 0) {
            // 參考 Web 評量成績 處理 JavaScript 進位方式
            this.AvgSocre = round(this.SumScore / this.SumCredit / 100000, 2);
        }

    }
}

export class ExamUpDown {
    Name: string;
    isUp: boolean = false;
    isDown: boolean = false;
}

export class ItemCount {
    Name: string;
    Count: number = 0;
    // 我在這
    isMe: boolean = false;
}

export class ItemCounts {
    Name: string;
    itemList: ItemCount[] = [];
}
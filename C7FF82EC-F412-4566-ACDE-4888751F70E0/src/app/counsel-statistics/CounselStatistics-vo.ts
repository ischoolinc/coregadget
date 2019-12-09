import * as moment from 'moment';
import * as node2json from 'nodexml';

export class QuizInfoReport {
    QuizID: string;
    QuizName: string;
    ImplementationDate: moment.Moment;
    ImplementationDateStr: string;
    UseMappingTable: boolean = false;

    GetQuizType() {
        if (this.UseMappingTable) {
            return '常模轉換';
        } else {
            return '自訂項目';
        }
    }
}

export class ClassStudentCountReport {
    ClassID: string;
    GradeYear: number = 0;
    ClassName: string;
    StudentCount: number;
    ItemCountList: ItemCount[] = [];
    StudentDataSource: any[] = [];

    // 計算統計
    CalcCPM_P() {
        // 智能優異PR＞=95
        // 智能在平均數以上90＜PR＜=94
        // 智能在平均數以上75＜=PR＜=90
        // 平均智能25＜PR＜75
        // 智能在平均數以下 5＜PR＜=25
        // 智能缺陷PR＜=5

        this.ItemCountList = [];
        // 項目
        let item1: ItemCount = new ItemCount();
        item1.Name = '智能優異(PR＞=95)';
        item1.Count = 0;
        item1.pst = 0;
        let item2: ItemCount = new ItemCount();
        item2.Name = '智能在平均數以上(PR >=90 且 PR＜95)';
        item2.Count = 0;
        item2.pst = 0;
        let item3: ItemCount = new ItemCount();
        item3.Name = '智能在平均數以上(PR >=75 且 PR＜90)';
        item3.Count = 0;
        item3.pst = 0;
        let item4: ItemCount = new ItemCount();
        item4.Name = '平均智能(PR >=25 且 PR＜75)';
        item4.Count = 0;
        item4.pst = 0;
        let item5: ItemCount = new ItemCount();
        item5.Name = '智能在平均數以下(PR >=5 且 PR＜25)';
        item5.Count = 0;
        item5.pst = 0;
        let item6: ItemCount = new ItemCount();
        item6.Name = '智能缺陷(PR＜5)';
        item6.Count = 0;
        item6.pst = 0;
        this.ItemCountList.push(item1);
        this.ItemCountList.push(item2);
        this.ItemCountList.push(item3);
        this.ItemCountList.push(item4);
        this.ItemCountList.push(item5);
        this.ItemCountList.push(item6);

        // 解析出學生資料
        this.StudentDataSource.forEach(studItem => {
            let xq = [].concat(node2json.xml2obj('<root>' + studItem.content + '</root>') || []);

            if (xq.length > 0) {
                if (xq[0].root && xq[0].root.Item) {
                    let items = [].concat(xq[0].root.Item || []);
                    items.forEach(subItem => {
                        if (subItem.name === '常模分數') {
                            if (subItem.value) {
                                let val: number = parseFloat(subItem.value);
                                if (val) {
                                    if (val >= 95)
                                        this.ItemCountList[0].Count++;

                                    if (val >= 90 && val < 75)
                                        this.ItemCountList[1].Count++;

                                    if (val >= 75 && val < 90)
                                        this.ItemCountList[2].Count++;

                                    if (val >= 25 && val < 75)
                                        this.ItemCountList[3].Count++;
                                    if (val >= 5 && val < 25)
                                        this.ItemCountList[4].Count++;
                                    if (val < 5)
                                        this.ItemCountList[5].Count++;

                                }
                            }

                        }
                    });
                }
            }

        });

        // 計算百分比
        if (this.StudentCount > 0) {
            this.ItemCountList.forEach(item => {
                item.pst = round(item.Count / this.StudentCount * 100, 2);
            });
        }
    }
}

var round = function (val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

export class ItemCount {
    Name: string;
    Count: number;
    pst: number;
}

// 年級資訊
export class GradeInfo {
    GradeYear: number;
    GradeYearStr: string;
    Checked: boolean = false;   
    id: string ='';
    SetGradeYearCheck(){
        this.Checked = !this.Checked;
    }
}


export class CounselClass {
    constructor() { }
    id:string = '';
    ClassID: string;
    ClassName: string;
    GradeYear: number;    
    Checked: boolean = false;

    SetClassCheck() {
        this.Checked = !this.Checked;
    }
}

export class GradeClassInfo {
    GradeYear: number;
    GradeYearStr: string;
    Checked: boolean = false;
    ClassItems: CounselClass[] = [];
    id: string ='';
    SetGradeYearCheck(){
        this.Checked = !this.Checked;
    }
}

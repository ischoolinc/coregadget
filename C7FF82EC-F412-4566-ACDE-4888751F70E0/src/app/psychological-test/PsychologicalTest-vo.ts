import * as moment from 'moment';
import * as node2json from 'nodexml';

// 心理測驗題目
export class Quiz {
    uid: string;
    QuizName: string;
    xmlSource: string;
    QuizItemList: QuizItem[] = [];
}

// 心測題目答案項目
export class QuizItem {
    QuizName: string;
    QuizOrder: number;
    Value: string;
}

// 班級心理測驗統計
export class ClassQuizCount {
    ClassName: string;
    QuizItemList: QuizItem[] = [];
    ClassStudents: number;
    HasQuizCountList: ItemCount[] = [];

    GetQuizCount(name: string) {
        let val: number = 0;
        this.HasQuizCountList.forEach(item => {
            if (item.Name === name) {
                val = item.Count;
            }
        });
        return val;
    }
}

export class ItemCount {
    Name: string;
    Count: number;
}

// 學生心理測驗資料
export class StudentQuizData {
    // 測驗項目 ID
    QuizUID: string;
    StudentID: string;
    StudentNumber: string;
    ClassName: string;
    SeatNo: string;
    // 身分證
    IDNumber: string;
    // 實施日期
    ImplementationDate: moment.Moment;
    // 解析日期
    AnalysisDate: moment.Moment;

    // 存放解析後存入資料庫
    ContentXML: string;

    // 填寫內容
    QuizItemList: QuizItem[] = [];
    // let x1 = {Item:[{ '@name': "分數",'@value': "100" }]};
    // var str = node2json.obj2xml(x1);
    parseXML() {
        if (this.QuizItemList.length > 0) {
            let dataList = [];
            this.QuizItemList.forEach(item => {
                let data = { '@name': item.QuizName, '@value': item.Value };
                dataList.push(data);
            });
            let x1 = { Item: dataList }
            let d1 = node2json.obj2xml(x1, "");
            let dr1 = d1.split('\n')
            let dr2 = [];
            this.ContentXML = '';
            if (dr1.length > 2) {
                for (let x = 1; x < dr1.length - 1; x++) {
                    dr2.push(dr1[x]);
                }
                this.ContentXML = dr2.join('');
            }
        }
    }
}

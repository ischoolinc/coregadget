import * as moment from 'moment';
import * as node2json from 'nodexml';
import { getLocaleDayNames } from '@angular/common';

// 心理測驗題目
export class Quiz {
    uid: string;
    QuizName: string;
    xmlSource: string;
    QuizItemList: QuizItem[] = [];
    // 常模對照表
    MappingTable: string;
    // 使用對照表
    UseMappingTable:boolean;
}

// 心測題目答案項目
export class QuizItem {
    QuizName: string;
    QuizOrder: number;
    Value: string;
}

// 班級心理測驗統計
export class ClassQuizCount {
    ClassID: string;
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
    StudentName: string;
    ClassName: string;
    // 男女
    Gender: string;
    // 生日
    Birthday: moment.Moment;
    // 年齡
    Age: number;
    // 原始分數
    NormSource: number;
    // 常模分數
    NormScore: string;
    SeatNo: string;
    // 身分證
    IDNumber: string;
    // 實施日期
    ImplementationDate: moment.Moment;
    // 解析日期
    AnalysisDate: moment.Moment;
    // 實施日期(文字)
    ImplementationDateStr: string;

    // 解析日期(文字)
    AnalysisDateStr: string;

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

    // 年紀轉換
    parseAge() {
        // 實施日期與生日比對
        if (this.Birthday.isValid() && this.ImplementationDate.isValid()) {
            let years: number = this.ImplementationDate.diff(this.Birthday, "years");
            let months: number = this.ImplementationDate.diff(this.Birthday, "months") - (years * 12);
            //console.log(years, months);
            if (months > 5)
                this.Age = years + 0.5;
            else
                this.Age = years;
        }
    }
    // 解析日期
    parseDT() {
        if (this.AnalysisDate.isValid()) {
            this.AnalysisDateStr = this.AnalysisDate.format('YYYY-MM-DD');
        } else {
            this.AnalysisDateStr = '';
        }

        if (this.ImplementationDate.isValid()) {
            this.ImplementationDateStr = this.ImplementationDate.format('YYYY-MM-DD');
        } else {
            this.ImplementationDateStr = '';
        }
    }

    getQuizItemValue(uid: string, q_name: string) {
        let value = '';     
        if (this.QuizUID === uid) {
            this.QuizItemList.forEach(item => {             
                if (item.QuizName === q_name) {
                    value = item.Value;
                }
            })
        }
        return value;
    }
}

// 常模對照表
export class NormTable {
    Name: string = "";
    NormList: NormInfo[] = [];

    // 傳入 原始分數與年齡，回傳常模分數
    GetScore(Source: number, Age: number) {
        let value: string = "";
        this.NormList.forEach(item => {
            if (item.Source === Source && item.Age === Age) {
                value = item.Score;
            }
        });
        return value;
    }

    // 載入對照資料
    loadMapTable(xml:string) {        
        let data = node2json.xml2obj(xml);
        if (data.Mapping && data.Mapping.Table && data.Mapping.Table.Row) {
            let dataRow = data.Mapping.Table.Row;
            dataRow.forEach(item => {
                let ni: NormInfo = new NormInfo();
                ni.Score = item.Score;
                ni.Age = parseFloat(item.Age);
                ni.Source = parseFloat(item.Source);
                this.NormList.push(ni);
            });
        }
    }

}

// 常模資料
export class NormInfo {
    // 原始分數
    Source: number;
    // 年齡
    Age: number;
    // 常模分數(會有+-符號)
    Score: string;
}

export class ClassInfo {
    ClassID: string;
    ClassName: string;
}


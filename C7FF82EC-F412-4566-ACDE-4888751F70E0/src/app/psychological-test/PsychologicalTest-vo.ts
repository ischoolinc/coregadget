import * as moment from 'moment';
import * as node2json from 'nodexml';
import { getLocaleDayNames } from '@angular/common';

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
    loadMapTable() {
        let tmp: tmpMapXML = new tmpMapXML();
        let data = node2json.xml2obj(tmp.xml);
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

export class tmpMapXML {
    xml: string = `
    <Mapping From="原始分數" To="常模分數">
    <Table Gender="男女">
        <Row Age="6.0" Source="1.0" Score="1-" />
        <Row Age="6.0" Source="2.0" Score="1-" />
        <Row Age="6.0" Source="3.0" Score="1-" />
        <Row Age="6.0" Source="4.0" Score="1-" />
        <Row Age="6.0" Source="5.0" Score="1-" />
        <Row Age="6.0" Source="6.0" Score="1-" />
        <Row Age="6.0" Source="7.0" Score="1.0" />
        <Row Age="6.0" Source="8.0" Score="1.0" />
        <Row Age="6.0" Source="9.0" Score="1.0" />
        <Row Age="6.0" Source="10.0" Score="1.0" />
        <Row Age="6.0" Source="11.0" Score="2.0" />
        <Row Age="6.0" Source="12.0" Score="3.0" />
        <Row Age="6.0" Source="13.0" Score="4.0" />
        <Row Age="6.0" Source="14.0" Score="5.0" />
        <Row Age="6.0" Source="15.0" Score="6.0" />
        <Row Age="6.0" Source="16.0" Score="8.0" />
        <Row Age="6.0" Source="17.0" Score="10.0" />
        <Row Age="6.0" Source="18.0" Score="13.0" />
        <Row Age="6.0" Source="19.0" Score="16.0" />
        <Row Age="6.0" Source="20.0" Score="18.0" />
        <Row Age="6.0" Source="21.0" Score="21.0" />
        <Row Age="6.0" Source="22.0" Score="25.0" />
        <Row Age="6.0" Source="23.0" Score="30.0" />
        <Row Age="6.0" Source="24.0" Score="37.0" />
        <Row Age="6.0" Source="25.0" Score="42.0" />
        <Row Age="6.0" Source="26.0" Score="50.0" />
        <Row Age="6.0" Source="27.0" Score="55.0" />
        <Row Age="6.0" Source="28.0" Score="63.0" />
        <Row Age="6.0" Source="29.0" Score="70.0" />
        <Row Age="6.0" Source="30.0" Score="77.0" />
        <Row Age="6.0" Source="31.0" Score="82.0" />
        <Row Age="6.0" Source="32.0" Score="90.0" />
        <Row Age="6.0" Source="33.0" Score="94.0" />
        <Row Age="6.0" Source="34.0" Score="96.0" />
        <Row Age="6.0" Source="35.0" Score="98.0" />
        <Row Age="6.0" Source="36.0" Score="99.0" />
        <Row Age="6.5" Source="1.0" Score="1-" />
        <Row Age="6.5" Source="2.0" Score="1-" />
        <Row Age="6.5" Source="3.0" Score="1-" />
        <Row Age="6.5" Source="4.0" Score="1-" />
        <Row Age="6.5" Source="5.0" Score="1-" />
        <Row Age="6.5" Source="6.0" Score="1-" />
        <Row Age="6.5" Source="7.0" Score="1-" />
        <Row Age="6.5" Source="8.0" Score="1-" />
        <Row Age="6.5" Source="9.0" Score="1.0" />
        <Row Age="6.5" Source="10.0" Score="1.0" />
        <Row Age="6.5" Source="11.0" Score="1.0" />
        <Row Age="6.5" Source="12.0" Score="2.0" />
        <Row Age="6.5" Source="13.0" Score="3.0" />
        <Row Age="6.5" Source="14.0" Score="4.0" />
        <Row Age="6.5" Source="15.0" Score="5.0" />
        <Row Age="6.5" Source="16.0" Score="6.0" />
        <Row Age="6.5" Source="17.0" Score="8.0" />
        <Row Age="6.5" Source="18.0" Score="10.0" />
        <Row Age="6.5" Source="19.0" Score="13.0" />
        <Row Age="6.5" Source="20.0" Score="16.0" />
        <Row Age="6.5" Source="21.0" Score="19.0" />
        <Row Age="6.5" Source="22.0" Score="23.0" />
        <Row Age="6.5" Source="23.0" Score="27.0" />
        <Row Age="6.5" Source="24.0" Score="34.0" />
        <Row Age="6.5" Source="25.0" Score="39.0" />
        <Row Age="6.5" Source="26.0" Score="47.0" />
        <Row Age="6.5" Source="27.0" Score="53.0" />
        <Row Age="6.5" Source="28.0" Score="61.0" />
        <Row Age="6.5" Source="29.0" Score="68.0" />
        <Row Age="6.5" Source="30.0" Score="75.0" />
        <Row Age="6.5" Source="31.0" Score="81.0" />
        <Row Age="6.5" Source="32.0" Score="87.0" />
        <Row Age="6.5" Source="33.0" Score="92.0" />
        <Row Age="6.5" Source="34.0" Score="95.0" />
        <Row Age="6.5" Source="35.0" Score="97.0" />
        <Row Age="6.5" Source="36.0" Score="99.0" />
        <Row Age="7.0" Source="1.0" Score="1-" />
        <Row Age="7.0" Source="2.0" Score="1-" />
        <Row Age="7.0" Source="3.0" Score="1-" />
        <Row Age="7.0" Source="4.0" Score="1-" />
        <Row Age="7.0" Source="5.0" Score="1-" />
        <Row Age="7.0" Source="6.0" Score="1-" />
        <Row Age="7.0" Source="7.0" Score="1-" />
        <Row Age="7.0" Source="8.0" Score="1-" />
        <Row Age="7.0" Source="9.0" Score="1-" />
        <Row Age="7.0" Source="10.0" Score="1.0" />
        <Row Age="7.0" Source="11.0" Score="1.0" />
        <Row Age="7.0" Source="12.0" Score="1.0" />
        <Row Age="7.0" Source="13.0" Score="2.0" />
        <Row Age="7.0" Source="14.0" Score="3.0" />
        <Row Age="7.0" Source="15.0" Score="4.0" />
        <Row Age="7.0" Source="16.0" Score="5.0" />
        <Row Age="7.0" Source="17.0" Score="6.0" />
        <Row Age="7.0" Source="18.0" Score="8.0" />
        <Row Age="7.0" Source="19.0" Score="10.0" />
        <Row Age="7.0" Source="20.0" Score="14.0" />
        <Row Age="7.0" Source="21.0" Score="18.0" />
        <Row Age="7.0" Source="22.0" Score="21.0" />
        <Row Age="7.0" Source="23.0" Score="25.0" />
        <Row Age="7.0" Source="24.0" Score="32.0" />
        <Row Age="7.0" Source="25.0" Score="37.0" />
        <Row Age="7.0" Source="26.0" Score="45.0" />
        <Row Age="7.0" Source="27.0" Score="50.0" />
        <Row Age="7.0" Source="28.0" Score="58.0" />
        <Row Age="7.0" Source="29.0" Score="66.0" />
        <Row Age="7.0" Source="30.0" Score="73.0" />
        <Row Age="7.0" Source="31.0" Score="79.0" />
        <Row Age="7.0" Source="32.0" Score="84.0" />
        <Row Age="7.0" Source="33.0" Score="90.0" />
        <Row Age="7.0" Source="34.0" Score="94.0" />
        <Row Age="7.0" Source="35.0" Score="96.0" />
        <Row Age="7.0" Source="36.0" Score="98+" />
        <Row Age="7.5" Source="1.0" Score="1-" />
        <Row Age="7.5" Source="2.0" Score="1-" />
        <Row Age="7.5" Source="3.0" Score="1-" />
        <Row Age="7.5" Source="4.0" Score="1-" />
        <Row Age="7.5" Source="5.0" Score="1-" />
        <Row Age="7.5" Source="6.0" Score="1-" />
        <Row Age="7.5" Source="7.0" Score="1-" />
        <Row Age="7.5" Source="8.0" Score="1-" />
        <Row Age="7.5" Source="9.0" Score="1-" />
        <Row Age="7.5" Source="10.0" Score="1-" />
        <Row Age="7.5" Source="11.0" Score="1-" />
        <Row Age="7.5" Source="12.0" Score="1.0" />
        <Row Age="7.5" Source="13.0" Score="1.0" />
        <Row Age="7.5" Source="14.0" Score="1.0" />
        <Row Age="7.5" Source="15.0" Score="2.0" />
        <Row Age="7.5" Source="16.0" Score="3.0" />
        <Row Age="7.5" Source="17.0" Score="4.0" />
        <Row Age="7.5" Source="18.0" Score="5.0" />
        <Row Age="7.5" Source="19.0" Score="6.0" />
        <Row Age="7.5" Source="20.0" Score="8.0" />
        <Row Age="7.5" Source="21.0" Score="12.0" />
        <Row Age="7.5" Source="22.0" Score="14.0" />
        <Row Age="7.5" Source="23.0" Score="18.0" />
        <Row Age="7.5" Source="24.0" Score="21.0" />
        <Row Age="7.5" Source="25.0" Score="25.0" />
        <Row Age="7.5" Source="26.0" Score="32.0" />
        <Row Age="7.5" Source="27.0" Score="37.0" />
        <Row Age="7.5" Source="28.0" Score="45.0" />
        <Row Age="7.5" Source="29.0" Score="50.0" />
        <Row Age="7.5" Source="30.0" Score="58.0" />
        <Row Age="7.5" Source="31.0" Score="66.0" />
        <Row Age="7.5" Source="32.0" Score="75.0" />
        <Row Age="7.5" Source="33.0" Score="82.0" />
        <Row Age="7.5" Source="34.0" Score="88.0" />
        <Row Age="7.5" Source="35.0" Score="92.0" />
        <Row Age="7.5" Source="36.0" Score="96+" />
        <Row Age="8.0" Source="1.0" Score="1-" />
        <Row Age="8.0" Source="2.0" Score="1-" />
        <Row Age="8.0" Source="3.0" Score="1-" />
        <Row Age="8.0" Source="4.0" Score="1-" />
        <Row Age="8.0" Source="5.0" Score="1-" />
        <Row Age="8.0" Source="6.0" Score="1-" />
        <Row Age="8.0" Source="7.0" Score="1-" />
        <Row Age="8.0" Source="8.0" Score="1-" />
        <Row Age="8.0" Source="9.0" Score="1-" />
        <Row Age="8.0" Source="10.0" Score="1-" />
        <Row Age="8.0" Source="11.0" Score="1-" />
        <Row Age="8.0" Source="12.0" Score="1-" />
        <Row Age="8.0" Source="13.0" Score="1-" />
        <Row Age="8.0" Source="14.0" Score="1-" />
        <Row Age="8.0" Source="15.0" Score="1-" />
        <Row Age="8.0" Source="16.0" Score="1.0" />
        <Row Age="8.0" Source="17.0" Score="1.0" />
        <Row Age="8.0" Source="18.0" Score="1.0" />
        <Row Age="8.0" Source="19.0" Score="2.0" />
        <Row Age="8.0" Source="20.0" Score="3.0" />
        <Row Age="8.0" Source="21.0" Score="4.0" />
        <Row Age="8.0" Source="22.0" Score="5.0" />
        <Row Age="8.0" Source="23.0" Score="6.0" />
        <Row Age="8.0" Source="24.0" Score="9.0" />
        <Row Age="8.0" Source="25.0" Score="12.0" />
        <Row Age="8.0" Source="26.0" Score="16.0" />
        <Row Age="8.0" Source="27.0" Score="21.0" />
        <Row Age="8.0" Source="28.0" Score="27.0" />
        <Row Age="8.0" Source="29.0" Score="34.0" />
        <Row Age="8.0" Source="30.0" Score="45.0" />
        <Row Age="8.0" Source="31.0" Score="55.0" />
        <Row Age="8.0" Source="32.0" Score="66.0" />
        <Row Age="8.0" Source="33.0" Score="77.0" />
        <Row Age="8.0" Source="34.0" Score="84.0" />
        <Row Age="8.0" Source="35.0" Score="90.0" />
        <Row Age="8.0" Source="36.0" Score="95+" />
        <Row Age="8.5" Source="1.0" Score="1-" />
        <Row Age="8.5" Source="2.0" Score="1-" />
        <Row Age="8.5" Source="3.0" Score="1-" />
        <Row Age="8.5" Source="4.0" Score="1-" />
        <Row Age="8.5" Source="5.0" Score="1-" />
        <Row Age="8.5" Source="6.0" Score="1-" />
        <Row Age="8.5" Source="7.0" Score="1-" />
        <Row Age="8.5" Source="8.0" Score="1-" />
        <Row Age="8.5" Source="9.0" Score="1-" />
        <Row Age="8.5" Source="10.0" Score="1-" />
        <Row Age="8.5" Source="11.0" Score="1-" />
        <Row Age="8.5" Source="12.0" Score="1-" />
        <Row Age="8.5" Source="13.0" Score="1-" />
        <Row Age="8.5" Source="14.0" Score="1-" />
        <Row Age="8.5" Source="15.0" Score="1-" />
        <Row Age="8.5" Source="16.0" Score="1.0" />
        <Row Age="8.5" Source="17.0" Score="1.0" />
        <Row Age="8.5" Source="18.0" Score="1.0" />
        <Row Age="8.5" Source="19.0" Score="2.0" />
        <Row Age="8.5" Source="20.0" Score="2.0" />
        <Row Age="8.5" Source="21.0" Score="3.0" />
        <Row Age="8.5" Source="22.0" Score="4.0" />
        <Row Age="8.5" Source="23.0" Score="5.0" />
        <Row Age="8.5" Source="24.0" Score="8.0" />
        <Row Age="8.5" Source="25.0" Score="10.0" />
        <Row Age="8.5" Source="26.0" Score="14.0" />
        <Row Age="8.5" Source="27.0" Score="19.0" />
        <Row Age="8.5" Source="28.0" Score="25.0" />
        <Row Age="8.5" Source="29.0" Score="32.0" />
        <Row Age="8.5" Source="30.0" Score="42.0" />
        <Row Age="8.5" Source="31.0" Score="53.0" />
        <Row Age="8.5" Source="32.0" Score="63.0" />
        <Row Age="8.5" Source="33.0" Score="73.0" />
        <Row Age="8.5" Source="34.0" Score="81.0" />
        <Row Age="8.5" Source="35.0" Score="87.0" />
        <Row Age="8.5" Source="36.0" Score="93+" />
        <Row Age="9.0" Source="1.0" Score="1-" />
        <Row Age="9.0" Source="2.0" Score="1-" />
        <Row Age="9.0" Source="3.0" Score="1-" />
        <Row Age="9.0" Source="4.0" Score="1-" />
        <Row Age="9.0" Source="5.0" Score="1-" />
        <Row Age="9.0" Source="6.0" Score="1-" />
        <Row Age="9.0" Source="7.0" Score="1-" />
        <Row Age="9.0" Source="8.0" Score="1-" />
        <Row Age="9.0" Source="9.0" Score="1-" />
        <Row Age="9.0" Source="10.0" Score="1-" />
        <Row Age="9.0" Source="11.0" Score="1-" />
        <Row Age="9.0" Source="12.0" Score="1-" />
        <Row Age="9.0" Source="13.0" Score="1-" />
        <Row Age="9.0" Source="14.0" Score="1-" />
        <Row Age="9.0" Source="15.0" Score="1-" />
        <Row Age="9.0" Source="16.0" Score="1-" />
        <Row Age="9.0" Source="17.0" Score="1-" />
        <Row Age="9.0" Source="18.0" Score="1.0" />
        <Row Age="9.0" Source="19.0" Score="1.0" />
        <Row Age="9.0" Source="20.0" Score="1.0" />
        <Row Age="9.0" Source="21.0" Score="2.0" />
        <Row Age="9.0" Source="22.0" Score="3.0" />
        <Row Age="9.0" Source="23.0" Score="4.0" />
        <Row Age="9.0" Source="24.0" Score="5.0" />
        <Row Age="9.0" Source="25.0" Score="8.0" />
        <Row Age="9.0" Source="26.0" Score="10.0" />
        <Row Age="9.0" Source="27.0" Score="14.0" />
        <Row Age="9.0" Source="28.0" Score="19.0" />
        <Row Age="9.0" Source="29.0" Score="27.0" />
        <Row Age="9.0" Source="30.0" Score="34.0" />
        <Row Age="9.0" Source="31.0" Score="45.0" />
        <Row Age="9.0" Source="32.0" Score="58.0" />
        <Row Age="9.0" Source="33.0" Score="68.0" />
        <Row Age="9.0" Source="34.0" Score="77.0" />
        <Row Age="9.0" Source="35.0" Score="84.0" />
        <Row Age="9.0" Source="36.0" Score="91+" />
    </Table>
</Mapping>
    `;
}

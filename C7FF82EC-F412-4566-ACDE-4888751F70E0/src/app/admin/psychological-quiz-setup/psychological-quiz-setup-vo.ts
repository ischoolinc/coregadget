import * as node2json from 'nodexml';

// 心理測驗題目
export class Quiz {
    uid: string;
    QuizName: string;
    xmlSource: string;
    QuizItemList: QuizItem[] = [];
    // 常模對照表
    MappingTable: string;
    // 使用對照表
    UseMappingTable: boolean;

    QuizDataFieldXML: string = "";

    // 取得測驗類型
    GetQuizType() {
        if (this.UseMappingTable) {
            return '常模轉換';
        } else {
            return '自訂項目';
        }
    }
    parseXML() {

        // 當使用常模，固定寫入
        if (this.UseMappingTable) {
            this.QuizItemList = [];
            let qi1: QuizItem = new QuizItem();
            qi1.QuizName = '原始分數';
            qi1.QuizOrder = 1;
            let qi2: QuizItem = new QuizItem();
            qi2.QuizName = '常模分數';
            qi2.QuizOrder = 2;
            
            let qi3: QuizItem = new QuizItem();
            qi3.QuizName = '年齡';
            qi3.QuizOrder = 3;

            let qi4: QuizItem = new QuizItem();
            qi4.QuizName = '性別';
            qi4.QuizOrder = 4;

            this.QuizItemList.push(qi1);
            this.QuizItemList.push(qi2);
            this.QuizItemList.push(qi3);
            this.QuizItemList.push(qi4);
        }

        if (this.QuizItemList.length > 0) {           
            let dataList = [];
            this.QuizItemList.forEach(item => {
                let data = { '@name': item.QuizName, '@order': item.QuizOrder };
                dataList.push(data);
            });
            let x1 = { Field: dataList }
            let d1 = node2json.obj2xml(x1, "");
            let dr1 = d1.split('\n')
            let dr2 = [];
            this.QuizDataFieldXML = '';
            if (dr1.length > 2) {
                for (let x = 1; x < dr1.length - 1; x++) {
                    dr2.push(dr1[x]);
                }
                this.QuizDataFieldXML = dr2.join('');
            }
        }
    }
}

// 心測題目答案項目
export class QuizItem {
    QuizName: string;
    QuizOrder: number;
    Value: string;
}

export class MappingTable {
    Name: string;
    ContentXML: string;
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

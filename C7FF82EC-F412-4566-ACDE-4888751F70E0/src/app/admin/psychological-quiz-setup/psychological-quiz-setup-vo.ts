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

    // 檢查欄位名稱是否重複
    CheckQuizItemSame() {
        let  value = false;
        let tmp: string[] =[];
        
        this.QuizItemList.forEach(item => {
            if (tmp.includes(item.QuizName))
            {
                value = true;
            }else
            {
                tmp.push(item.QuizName);
            }
        });

        return value;
    }

    // 取得測驗類型
    GetQuizType() {
        if (this.UseMappingTable) {
            return '系統預設';
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
    UID: string;
    Name: string;
    ContentXML: string;
    UseMappingTable: boolean;
    isChecked: boolean;
}


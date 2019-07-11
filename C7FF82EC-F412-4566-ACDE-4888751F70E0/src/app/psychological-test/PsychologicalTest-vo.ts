
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
    HasQuizCountList: ItemCount [] = [];

    GetQuizCount(name: string) {
        let val:number = 0;
        this.HasQuizCountList.forEach( item => {
            if (item.Name === name)
            {
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
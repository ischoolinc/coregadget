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
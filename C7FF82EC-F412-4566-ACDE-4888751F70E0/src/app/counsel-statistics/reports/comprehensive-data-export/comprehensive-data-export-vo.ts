/**
 *
 * QuestionSubject -vo
 * @export
 * @class QuestionSubject
 */
export class QuestionSubject {
    constructor(questionInfo: QuestionInfo) {
        this.AddGroup(questionInfo);
        this.SubjectText = questionInfo.QuestionSubject;
    }
    SubjectText: string;
    IsChecked: boolean;
    QuestionGroup: QuestionGroup[] = [];
    QuestionGroupMap: Map<string, QuestionGroup> = new Map<string, QuestionGroup>();
    SelectQuestionID: string[];

    /**
     *
     * 看看有沒有GroupName
     * @memberof QuestionSubject
     */
    HasGroupName(groupName: string): boolean {
        return this.QuestionGroupMap.has(groupName);

    }

    GetQuestionGroups(): QuestionGroup[] {


        return Array.from(this.QuestionGroupMap.values());


    }


    /**
     *
     *加入Group
     * @param {QuestionInfo} questionInfo
     * @memberof QuestionSubject
     */
    public AddGroup(questionInfo: QuestionInfo) {
        // tslint:disable-next-line: no-use-before-declare
        if (!this.QuestionGroupMap.has(questionInfo.QuestionGroup)) {
            this.QuestionGroupMap.set(questionInfo.QuestionGroup, new QuestionGroup(questionInfo));
            this.QuestionGroup.push(new QuestionGroup(questionInfo));

        } else {

            const questionGroup: QuestionGroup = this.QuestionGroupMap.get(questionInfo.QuestionGroup);
            questionGroup.AddQuery(questionInfo);

        }
    }

    /**
     * 顯示是不是要 顯示勾勾
     */
    public ShowCheck(): boolean {
        return (this.IsChecked && this.QuestionGroupMap.size == 0);
    }
    /**
     * 取得
     * 
     * @param {boolean} isChecked
     * @memberof QuestionSubject
     */
    public CheckChildIsChecked(isChecked: boolean) {

        this.IsChecked = !isChecked;
        [].concat(Array.from(this.QuestionGroupMap.values())).forEach((questionGroup: QuestionGroup) => {
            // questionGroup.IsChecked = true;
            questionGroup.CheckChildIsChecked(isChecked);

        });



    }
}
/**
 *
 * QuestionGroup -vo
 * @export
 * @class QuestionGroup
 */
export class QuestionGroup {
    constructor(questionInfo: QuestionInfo) {
        this.GroupText = questionInfo.QuestionGroup;
        this.AddQuery(questionInfo);
    }
    GroupText: string;
    IsChecked: boolean = false;
    QuestionQuery: QuestionQuery[] = [];
    QuestionQueryMap: Map<string, QuestionQuery> = new Map<string, QuestionQuery>();
    /**
     *
     * 看看有沒有GroupName
     * @memberof QuestionSubject
     */
    HasQueryName(groupName: string): boolean {
        return this.QuestionQueryMap.has(groupName);
    }
    /**
     *
     *加入Group
     * @param {QuestionInfo} questionInfo
     * @memberof QuestionSubject
     */
    AddQuery(questionInfo: QuestionInfo) {
        if (!this.QuestionQueryMap.has(questionInfo.QuestionQuery)) {
            this.QuestionQuery.push(new QuestionQuery(questionInfo));
            this.QuestionQueryMap.set(questionInfo.QuestionQuery, new QuestionQuery(questionInfo));

        } else {


            const questionQuery: QuestionQuery = this.QuestionQueryMap.get(questionInfo.QuestionQuery);

            questionQuery.AddQuestionText(questionInfo);




        }

    }

    GetQuestionQuerys(): QuestionQuery[] {


        return Array.from(this.QuestionQueryMap.values());


    }

    public CheckChildIsChecked(isChecked: boolean) {

        this.IsChecked = !isChecked;
        [].concat(Array.from(this.QuestionQueryMap.values())).forEach((questionQuery: QuestionQuery) => {

            questionQuery.CheckChildIsChecked(isChecked);
        });

    }
}

export class QuestionQuery {
    constructor(questionInfo: QuestionInfo) {
        this.QueryText = questionInfo.QuestionQuery;
        this.AddQuestionText(questionInfo);
    }
    QueryText: string;
    IsChecked: boolean = false;
    hasChild: boolean = false;
    ShowChecked: boolean = false;
    QuestionText: QuestionText[] = [];
    QuestionTextMap: Map<string, QuestionText> = new Map<string, QuestionText>(); // question_code

    /**
    *
    * 看看有沒有GroupName
    * @memberof QuestionSubject
    */
    HasQueryName(groupName: string): boolean {
        return this.QuestionTextMap.has(groupName);
    }
    /**
     *
     *加入Group
     * @param {QuestionInfo} questionInfo
     * @memberof QuestionSubject
     */
    AddQuestionText(questionInfo: QuestionInfo) {

        if (questionInfo.QuestionText) {
            this.hasChild = true;
        }
        if (!this.QuestionTextMap.has(questionInfo.QuestionCode)) {
            this.QuestionTextMap.set(questionInfo.QuestionCode, new QuestionText(questionInfo));
            this.QuestionText.push(new QuestionText(questionInfo));
        } else {


        }
    }
    GetQuestionText(): QuestionText[] {
        return Array.from(this.QuestionTextMap.values());
    }


    public ShowCheck(): boolean {

        return (this.IsChecked && this.hasChild);
    }

    public CheckChildIsChecked(IsCheck: boolean) {
        this.IsChecked = !IsCheck;
        this.ShowChecked = !IsCheck && !this.hasChild;
        [].concat(Array.from(this.QuestionTextMap.values())).forEach((questionText: QuestionText) => {

            questionText.CheckChildIsChecked(IsCheck);

        });


    }
}

export class QuestionText {
    constructor(questionInfo: QuestionInfo) {
        this.QuestionText = questionInfo.QuestionText;
        this.QuestionCode = questionInfo.QuestionCode;
    }
    QuestionText: string;
    IsChecked: boolean = false;
    ShowDetail: boolean = false;

    QuestionCode: string;
    public CheckChildIsChecked(IsCheck: boolean) {
        this.IsChecked = !IsCheck;

    }
}



export interface QuestionInfo {
    QuestionCode: string;
    QuestionSubject: string;
    QuestionGroup: string;
    QuestionQuery: string;
    QuestionText: string;
}


export interface SectionInfo {
    SectionID: string;
    SectionName: string;
    Respondent: string;
} 
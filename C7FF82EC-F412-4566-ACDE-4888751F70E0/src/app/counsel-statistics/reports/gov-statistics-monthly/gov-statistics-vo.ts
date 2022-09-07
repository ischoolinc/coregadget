// 當月個案
export class CaseMonthlyStatistics {
    constructor() { }
    OccurDate: string;
    /**個案類別(副) */
    Category: string;
    /** 個案類別(主) */
    CaseMainCategory:string ;
    TeacherCounselNumber;
    StudentID: string;
    TeacherName: string;
    GradeYear: string;
    StudentGender: string;
    Status: string; // 新或舊
    Count: number = 0;
    CategoryValue: any[] = [];
    MainCategoryValue :any[] =[];
    OtherCount: number = 0; // 其他服務
    OtherDetailCount: CaseMonthlyItemCount[] = [];
    CLevel: string; // 一級或二級輔導
    TeacherID: string;
    TeacherNickName: string;
    TeacherRole: string;   
    CaseNo :string  ;

    // 取得單項其他數量
    GetOtherDetailCount(name: string) {
        let value = 0;
        this.OtherDetailCount.forEach(item => {
            if (item.ItemName === name) {
                value = item.Count;
            }
        });

        return value;
    }

    AddOtherDetailCount(name: string) {
        let addValue: boolean = true;
        this.OtherDetailCount.forEach(item => {
            if (item.ItemName === name) {
                item.Count = item.Count + 1;
                addValue = false;
            }
        });
        if (addValue) {
            let item: CaseMonthlyItemCount = new CaseMonthlyItemCount();
            item.ItemName = name;
            item.Count = 1;
            this.OtherDetailCount.push(item);
        }
    }

    // 計算其他總數
    SumOtherDetailCount() {
        let value = 0;

        this.OtherDetailCount.forEach(item => {
            value = value + item.Count;
        });
        return value;
    }
}

// 報表2統計使用
export class CaseMonthlyStatistics2 {
    constructor() { }
    TeacherID: string;
    TeacherNickName: string;
    TeacherCounselNumber :string ;
    TeacherRole: string;    
    OccurDate: string;
    StudentID: string;
    TeacherName: string;
    // StudentGender: string;
    ContactItem: string;
    ServiceItem: string;
    ContactName: string;
    CLevel: string; // 一級或二級輔導
    BoyCount: number = 0;
    GirlCount: number = 0;
}

export class CaseMonthlyItemCount {
    constructor() {
    }
    ItemName: string;
    Count: number = 0;
}


/** 產生報表時  教師代碼用  因為報表很多張(要分開去改 servie 很麻煩 一定從這邊抓) */
export interface TeacherCounselRole{
     TeacherID :string ;
     TeacherName :string ;
     Role :string ;
     TeacherCounselNumber ;
}

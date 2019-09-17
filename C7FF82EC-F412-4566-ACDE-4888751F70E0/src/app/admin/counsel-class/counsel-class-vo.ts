export class CounselTeacherClass {
    constructor() { }
    TeacherID: string;
    TeacherName: string;
    Role: string;
    Order: number;    
    ClassNames: string []= [];
    SetClassButtonDisable: boolean = true;
    parseOrder() {
        if (this.Role === '輔導主任') {
            this.Order = 1;
        }else if (this.Role === '輔導組長')
        {
            this.Order = 2;
        }else if (this.Role === '專任輔導')
        {
            this.Order = 3;
        }else if (this.Role === '兼任輔導')
        {
            this.Order = 4;
        }else if (this.Role === '認輔老師')
        {
            this.Order = 5;
        }else {
            this.Order = 999;
        }
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
    Checked: boolean = false;
    ClassItems: CounselClass[] = [];
    id: string ='';
    SetGradeYearCheck(){
        this.Checked = !this.Checked;
    }
}
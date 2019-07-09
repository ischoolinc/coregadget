export class CounselTeacherClass {
    constructor() { }
    TeacherID: string;
    TeacherName: string;
    Role: string;
    ClassNames: string;
}

export class CounselClass {
    constructor() { }
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

    SetGradeYearCheck(){
        this.Checked = !this.Checked;
    }
}
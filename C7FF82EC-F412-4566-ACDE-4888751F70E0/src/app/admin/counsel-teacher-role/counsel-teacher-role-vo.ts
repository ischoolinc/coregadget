export class TeacherCounselRole {
    constructor() { }


    TeacherID: string;
    Role: string;
    TeacherName: string;
    isChage: boolean = false;
    Order: number;

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
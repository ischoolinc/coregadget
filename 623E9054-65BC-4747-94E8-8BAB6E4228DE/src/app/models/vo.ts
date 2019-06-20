
export class ClassInfo {
    classID: any;
    className: string;

    constructor(id: any, name: string) {
        this.classID = id ;
        this.className = name ;
    }
}

export class StudInfo {
    id: string;
    name: string;
    seat_no: number;
    ref_class_id: string;
}

export class BehaviorRecord {
    id : string ;
    stud_id: string;
    stud_name: string;
    comment: string;
    is_detention: boolean ;
    occur_date: Date;
    teacher_id: string ;
    teacher_name: string ;
    is_good : boolean ;

    constructor(id : string ,
        stud_id: string,
        stud_name: string,
        comment: string,
        is_detention: boolean ,
        occur_date: Date,
        teacher_id: string ,
        teacher_name: string ,
        is_good : boolean  ) {
            this.id = id ;
            this.stud_id = stud_id;
            this.stud_name = stud_name;
            this.comment = comment ;
            this.is_detention = is_detention ;
            this.occur_date = occur_date ;
            this.teacher_id = teacher_id ;
            this.teacher_name = teacher_name ;
            this.is_good = is_good ;
        }
}
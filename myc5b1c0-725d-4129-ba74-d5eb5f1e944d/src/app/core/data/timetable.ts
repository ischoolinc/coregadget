
export interface Course {
    uid:       string;
    course_id: string;
    period:    Period[];
}

export interface Period {
    weekday: string;
    period:  string;
}

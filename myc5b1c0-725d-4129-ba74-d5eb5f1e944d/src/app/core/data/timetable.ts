
export interface Course {
    uid:       string;
    course_id: string;
    periods:    Period[];
}

export interface Period {
    weekday: string;
    period:  string;
}


export interface Course {
  uid:       string;
  course_id: string | number;
  periods:    Period[];
}

export interface Period {
  weekday: string | number;
  period:  string | number;
}

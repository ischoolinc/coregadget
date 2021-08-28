import { Course } from "../data/timetable";

export namespace Timetable {

    /** 取得所有課程的節次。 */
    export class FetchAll {
        static readonly type = '[Timetable] FetchAll';
    }

    export class FetchCourse {
        static readonly type = '[Timetable] FetchCourse';

        constructor(
            public payload: string | number
        ) {}
    }

    /** 設定指定課程的節次資料。 */
    export class SetCourse {
        static readonly type = '[Timetable] SetCourse';

        constructor(
            public payload: Omit<Course, 'uid'>
        ) {}
    }
}
import { Course } from "../data/timetable";

export namespace Timetable {

    /** 取得所有課程的節次。 */
    export class FetchAll {
        static readonly type = '[Timetable] FetchAll';
    }

    /** 設定指定課程的節次資料。 */
    export class SetPeriods {
        static readonly type = '[Timetable] SetPeriods';

        constructor(
            public payload: Omit<Course, 'uid'>
        ) {}
    }
}
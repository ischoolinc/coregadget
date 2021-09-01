import { ServiceConf } from "../data/service-conf";

export namespace Conf {

    /** 取得所有課程的節次。 */
    export class FetchAll {
        static readonly type = '[Conf] FetchAll';
    }

    /** 取得單一課程設定。 */
    export class FetchConf {
        static readonly type = '[Conf] FetchConf';

        constructor(
            public payload: Pick<ServiceConf, 'course_id'>
        ) {}
    }

    /** 設定指定單一課程設定。 */
    export class SetConf {
        static readonly type = '[Conf] SetConf';

        constructor(
            public payload: Partial<Omit<ServiceConf, 'uid'>>
        ) {}
    }
}
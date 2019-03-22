import { Wish } from "./wish";
import { Attend } from "./attend";

export class SubjectType{
    
    /**課程時段(類別) */
    SubjectType: string;

    /**修課紀錄 */
    Attend: Attend;

    /**志願序 */
    Wish: Wish[];

    /**是否開放選課 */
    IsOpenType: string;
}
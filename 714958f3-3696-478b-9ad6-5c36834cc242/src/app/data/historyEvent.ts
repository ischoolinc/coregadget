import { SimpleEvent } from './simple-event';
import { Rank } from './rank';

/**比賽項目 */
export class HistoryEvent extends SimpleEvent {

    /**名次 */
    public ranks: Rank[];

    [x: string]: any;
}

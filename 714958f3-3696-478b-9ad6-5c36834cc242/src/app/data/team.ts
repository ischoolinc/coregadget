import {Player} from './player';

/**參賽隊伍 */
export class Team {

  /**隊伍系統編號 */
  public uid: string;

  /**隊伍名稱 */
  public name: string;

  /**抽籤號 */
  public lot_no: string;

  /**建立者帳號 */
  public created_by: string;

  /**建立日期 */
  public last_update: string;

  /**隊伍選手 */
  public players: Player[];

  [x:string]: any;
}

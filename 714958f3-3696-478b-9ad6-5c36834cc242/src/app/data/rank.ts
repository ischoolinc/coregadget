/**歷史賽事名次 */
export class Rank {

  /**系統編號 */
  public uid: string;

  /**年度比賽項目編號 */
  public ref_event_id: string;

  /**名次 */
  public rank: string;

  /**選手姓名 */
  public players: HistoricalPlayer[];

  /**隊伍名稱 */
  public team_name: string;
}

export interface HistoricalPlayer {

  /**學生編號 */
  ref_student_id: string;

  /**姓名 */
  name: string;

  /**當時班級名稱 */
  class_name: string;

  /**當時座號 */
  seat_no: string;
}
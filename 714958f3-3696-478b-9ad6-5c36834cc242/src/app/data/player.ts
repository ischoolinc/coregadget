/**參賽選手 */
export class Player {

  /**系統編號 */
  public uid: string;

  /**學生編號 */
  public ref_student_id: string;

  /**姓名 */
  public name: string;

  /**當時班級名稱 */
  public class_name: string;

  /**當時座號 */
  public seat_no: string;

  /**是否是隊長 */
  public is_team_leader: string;

  /**抽籤號 */
  public lot_no: string;

  /**建立者帳號 */
  public created_by: string;

  /**建立日期 */
  public last_update: string;

  /**是否為我自己 */
  public is_myself: string;

  [x:string]: any;
}
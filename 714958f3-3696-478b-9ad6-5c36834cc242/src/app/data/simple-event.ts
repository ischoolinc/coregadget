/**比賽項目簡易資料 */
export class SimpleEvent {

  /**系統編號 */
  public uid: string;

  /**類別 */
  public category: string;

  /**名稱 */
  public name: string;

  /**組別編號 */
  public ref_group_type_id: string;

  /**是否團體賽 */
  public is_team: string;

  /**活動開始時間 */
  public event_start_date: string;

  /**活動結束時間 */
  public event_end_date: string;

  /**組別名稱 */
  public group_types_name: string;
}
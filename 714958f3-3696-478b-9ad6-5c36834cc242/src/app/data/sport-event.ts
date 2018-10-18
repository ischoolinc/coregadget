import { SimpleEvent } from './simple-event';

/**比賽項目 */
export class SportEvent extends SimpleEvent {

  /**系統編號 */
  // public uid: string;

  /**類別 */
  // public category: string;

  /**名稱 */
  // public name: string;

  /**組別編號 */
  // public ref_group_type_id: string;

  /**賽制編號 */
  public ref_game_type_id: string;

  /**計分方式 */
  public ref_score_type_id: string;

  /**是否團體賽 */
  // public is_team: string;

  /**一隊最多人數 */
  public max_member_count: string;

  /**一隊最少人數 */
  public min_member_count: string;

  /**僅能體育股長報名 */
  public athletic_only: string;

  /**報名開始時間 */
  public reg_start_date: string;

  /**報名結束時間 */
  public reg_end_date: string;

  /**活動開始時間 */
  // public event_start_date: string;

  /**活動結束時間 */
  // public event_end_date: string;

  /**是否抽籤 */
  public is_draw_lots: string;

  /**抽籤開始日期 */
  public draw_lots_start_date: string;

  /**抽籤結束日期 */
  public draw_lots_end_date: string;

  /**比賽說明 */
  public event_description: string;

  /**是否運動會 */
  public is_sport_meet: string;

  /**是否全校報名 */
  public is_reg_all: string;

  /**是否僅限制人員 */
  public is_reg_limit: string;

  /**組別名稱 */
  // public group_types_name: string;

  /**性別限定 */
  public group_types_gender: string;

  /**年級限定 */
  public group_types_grade: string;

  /**賽制名稱 */
  public game_types_name: string;

  /**賽制代號 */
  public game_types_key: string;

  /**計分方式名稱 */
  public score_types_name: string;

  /**計分方式代號 */
  public score_types_key: string;

  /**是否已報名 */
  public is_joined: string;

  /**是否為特定人員 */
  public is_registration: string;

}

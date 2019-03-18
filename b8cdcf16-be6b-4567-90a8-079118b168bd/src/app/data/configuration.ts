/**退選訊息、Mail樣版 */
export class Configuration {

  /**第一階段選課提醒文字 */
  cs_content1_template: string;

  /**第二階段選課提醒文字 */
  cs_content2_template: string;

  /**第一階段退選提醒文字 */
  cs_cancel1_content_template: string;

  /**第二階段退選提醒文字 */
  cs_cancel2_content_template: string;

  /**選課最終確定說明文字 */
  cs_final_message: string;

  /**加退選課記錄表注意事項文字 */
  retreat_notices_word: string;

  /**第一階段選課結果email通知(Email內文) */
  email_content1_template: string;

  /**第二階段選課結果email通知(Email內文) */
  email_content2_template: string;

  /**第一階段選課結果email通知(Email標題) */
  email_content1_template_subject: string;

  /**第二階段選課結果email通知(Email標題) */
  email_content2_template_subject: string;

  /**點數選課規則說明文字 */
  button_mod_communicate_point_selection_rules: string;
};
/**階段開啟關閉資訊 */
export class OpeningInfo {

  /**學年度 */
  SchoolYear: string;

  /**學期 */
  Semester: string;

  /**格式化選課開始時間 YYYY-MM-DD */
  StartDate: string;

  /**格式化選課結束時間 YYYY-MM-DD */
  EndDate: string;

  /**選課開始時間 */
  BeginTime: string;

  /**選課結束時間 */
  EndTime: string;

  /**第一階段公告開始時間 */
  AnnouncementStartDate: string;

  /**第一階段公告結束時間 */
  AnnouncementEndDate: string;

  /**第二階段遞補開始時間 */
  IncrementStartDate: string;

  /**第二階段遞補結束時間 */
  IncrementEndDate: string;

  /**目前階段 */
  Status: OpenState;
}

/**
 * 目前階段
 *
 * 'beforeChoose': 再度轉換為
 *    's5': 開放選課前五天。可選課程=目前尚未開放選課,課程總表+衝堂課程=正常顯示
 * 'choose': 選課中
 * 'afterChoose': 選課後尚未第一階段公告。尚未公告選課最終結果
 * 'announcement': 第一階段公告中
 * 'afterAnnouncement': 第一階段公告結束~第二階段尚未公告
 * 'increment': 第二階段遞補中
 * 'afterIncrement': 第二階段遞補結束
*/
export type OpenState =
  | 'beforeChoose'
  | 's5'
  | 'choose'
  | 'afterChoose'
  | 'announcement'
  | 'afterAnnouncement'
  | 'increment'
  | 'afterIncrement';

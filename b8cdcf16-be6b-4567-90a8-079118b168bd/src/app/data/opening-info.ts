/**階段開啟關閉資訊 */
export class OpeningInfo {
  /**開始時間 */
  BeginTime: string;

  /**結束時間 */
  EndTime: string;

  /**階段 */
  Item: '1' | '2' | '0';

  /**學年度 */
  SchoolYear: string;

  /**學期 */
  Semester: string;

  /**開啟狀態 */
  Status: string;
}

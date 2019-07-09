/** 日常生活表現成績輸入時間 */
export class DailyLifeInputConfig {
  SchoolYear: string;
  Semester: string;
  Time: {Grade: string, Start: string, End: string}[];
}
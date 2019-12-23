import * as moment from 'moment';

// 放時間
export class FillInSectionInfo {
    FillInSectionID: string = "";
    SchoolYear: string = "";
    Semester: string = "";
    // 開始時間
    StartTime: string = "";
    // 結束時間
    EndTime: string = "";
    // 名稱
    SectionName: string = "";
    // 型態是班導師或家長學生 hr_teacher,student
    Respondent: string = "";
    // 是否在開放時間內 t 是 
    IsPassTime: string = "";
}
import { Injectable } from '@angular/core';
import { DsaService } from './dsa.service';
import { SemesterInfo } from './counsel/counsel-vo';
import * as node2json from 'nodexml';

@Injectable({
  providedIn: 'root'
})
export class CounselStudentDataService {

  constructor(
    private dsaSrv: DsaService
  ) { }

  /**取得節次對照表 */
  async getPeriodList(): Promise<PeriodRecord[]> {
    const rsp = await this.dsaSrv.send('GetPeriodList', {});
    const periodList: PeriodRecord[] = rsp.Periods || [];

    return periodList;
  }

  /**取得假別對照表 */
  async getAbsenceList(): Promise<AbsenceRecord[]> {
    const rsp = await this.dsaSrv.send('GetAbsenceList', {});
    const absenceList: AbsenceRecord[] = rsp.Absences || [];

    return absenceList;
  }

  /**取得有缺曠資料的學年度學期 */
  async getSchoolYearSemester(body: any): Promise<SemesterInfo[]> {
    const rsp = await this.dsaSrv.send('GetStudentDataSS', body);
    const ssList: SemesterInfo[] = rsp.SemesterInfo || [];

    return ssList;
  }

  /**取得缺曠資料 */
  async getAttendance(body: any): Promise<AttendanceRecord[]> {
    const rsp = await this.dsaSrv.send('GetStudentAttendance', body);
    const attList: AttendanceRecord[] = [].concat(rsp.Attendance || [] as AttendanceRecord[]);

    attList.forEach((att: AttendanceRecord) => {
      const date = new Date(att.OccurDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      att.OccurDate = `${year}/${month}/${day}`;
    });

    return attList;
  }

  /**取得獎懲資料 */
  async getDiscipline(body: any): Promise<DisciplineRecord[]> {
    const rsp = await this.dsaSrv.send('GetStudentDiscipline', body);
    const disList: DisciplineRecord[] = rsp.Discipline || [] as DisciplineRecord[];

    return disList;
  }

  /**取得moral score與非明細資料 */
  async getMoralScore(body: any) {
    const rsp: any = await this.dsaSrv.send('GetStudentMoralScore', body);

    return rsp;
  }

  /**取得日常生活表現評量設定 */
  async getDLBehaviorConfig() {
    const rsp = await this.dsaSrv.send('GetDLBehaviorConfig', {});
    const result = node2json.xml2obj(rsp.Config);
    const examList: ExamTemplate[] = [];

    if (result) {
      [].concat(result.Configurations.Configuration || []).forEach(config => {
        const exam: ExamTemplate = {
          ExamID: config.Name,
          Name: config[config.Name].Name,
          HasItems: config[config.Name].Item ,
          Items: config[config.Name].Item || []
        };
        examList.push(exam);
      });
    }

    return examList;
  }
}

/** Record */

/**假別名稱對照 */
export class AbsenceRecord {
  Name: string;
  Abbr: string;
}

/**缺曠資料 */
export class AttendanceRecord {
  /**日期 */
  OccurDate: string;
  /**缺曠類別 */
  AbsenceType: string;
  /**節次 */
  Period: string;
}

/**節次資料 */
export class PeriodRecord {
  /**節次名稱 */
  Name: string;
  /**類型 */
  Type: string;
  /**顯示順序 */
  Order: string;
}

/** 評量項目 */
export class ExamTemplate {
  ExamID: string;
  Name: string;
  HasItems: boolean;
  Items: { Index: string, Name: string}[];
}

/**獎懲資料 */
export class DisciplineRecord {
  /**日期 */
  Occurdate: string;
  /**類型 */
  Type: string;
  /**大功 */
  MeritA: number;
  /**小功 */
  MeritB: number;
  /**嘉獎 */
  MeritC: number;
  /**獎勵事由 */
  MeritReason: string;
  /**大過 */
  DemeritA: number;
  /**小過 */
  DemeritB: number;
  /**警告 */
  DemeritC: number;
  /**已銷過 */
  DemeritIsClear: boolean;
  /**銷過日期 */
  DemeritClearDate: string;
  /**銷過事由 */
  DemeritClearReason: string;
  /**懲戒資訊 畫面呈現用 */
  Detail: string;
}

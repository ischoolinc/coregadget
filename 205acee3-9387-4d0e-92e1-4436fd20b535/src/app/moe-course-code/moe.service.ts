import { GadgetService } from './../core/gadget.service';
 import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export enum ListName {
  /** 課程類型 */
  SCH = 'SCH',

  /** 群別 */
  GRP = 'GRP',

  /** 科別 */
  DEP = 'DEP',

  /** 班群碼 */
  CLA = 'CLA',

  /** 課程類別 */
  CAT = 'CAT',

  /** 開課方式 */
  MOD = 'MOD',

  /** 科目屬性 */
  ATT1 = 'ATT1',

  /** 領域名稱 */
  FLD = 'FLD',

  /** 科目固定編碼 */
  CATATT = 'CATATT',
}

@Injectable({
  providedIn: 'root'
})
export class MOEService {

  constructor(
    private http: HttpClient,
    private gadget: GadgetService
  ) { }

  /** 課程類型 */
  public getList(name: ListName) {
    return this.http.get<any>(`https://console.1campus.net/api/moeproxy/code_table/${name.toString()}`);
  }

  /** 取得群組的前 16 碼相同的所有科目代碼。 */
  public async getCourseCodeTable(groupCode: string): Promise<SixteenResponse> {
    const gp = await this.gadget.getContract('1campus.graduation_plan');
    return await gp.send('MOE.GetCourseCodeTable', {
      GroupCode: groupCode,
    });
  }
}

export interface SixteenResponse {
  Response: CodeList;
}

export interface CodeList {
  Code: CodeData[];
}

export interface CodeData {
  group_code: string;
  course_code: string;
  subject_name: string;
  credits: string;
}

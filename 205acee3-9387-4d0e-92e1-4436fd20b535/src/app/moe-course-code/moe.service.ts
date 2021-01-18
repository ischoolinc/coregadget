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
    private http: HttpClient
  ) { }

  /** 課程類型 */
  public getList(name: ListName) {
    return this.http.get<any>(`https://console.1campus.net/api/moeproxy/code_table/${name.toString()}`);
  }
}

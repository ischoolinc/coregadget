import { StudentRecord } from './student';

/** 目前物件 */
export interface TargetRecord {

    // 學生物件
    Student: StudentRecord;
    // 評分項目
    ItemName: string;
    // 是否需要設定座號
    NeedSetSeatNo: boolean;
    // element tag 是否 focus
    SetFocus: boolean;
  }
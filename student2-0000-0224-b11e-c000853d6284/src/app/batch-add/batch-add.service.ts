import { Injectable } from '@angular/core';
import { CoreService } from '../core.service';
import { FieldName, ImportMode } from '../data/import-config';
import { Enumerate, FieldRules, IsNumber, MatchAndReset, MatchTo, MaxLength, NotEmpty, NotMatchTo, RowValidator, Unique } from '../shared/validators';

@Injectable({
  providedIn: 'root'
})
export class BatchAddService {

  // 欄位名稱對照，一律轉為英文欄位名
  mappingKeys = [
    { name: 'StudentId', mapping: ['student_id', '學生系統編號'] },
    { name: 'StudentName', mapping: ['student_name', '學生姓名'] },
    { name: 'Gender', mapping: ['gender', '性別'] },
    { name: 'StudentNumber', mapping: ['student_number', '學號'] },
    { name: 'SeatNo', mapping: ['seatNo', '座號'] },
    // { name: 'IDNumber', mapping: ['id_number', '身分證號'] },
    { name: 'LinkAccount', mapping: ['sa_login_name', '登入帳號'] },
    { name: 'StudentCode', mapping: ['student_code', '學生代碼'] },
    { name: 'ParentCode', mapping: ['parent_code', '家長代碼'] },
    { name: 'ClassName', mapping: ['class_name', '班級名稱'] },
    { name: 'StudentStatus', mapping: ['student_status', '狀態'] },
  ];

  constructor(
    private coreSrv: CoreService,
  ) { }

  // 將 JSON 內容轉換為對照的英文欄位名
  public convertObject(source: any[]): { mappingTable: any, newSource: any[] } {
    let fMappingTable = [];
    const rMappingTable = {}; // 新舊對照 {新: 舊}

    const newSource = source.map((v, idx) => {
      v.狀態 = '1';

      if (idx === 0) {
        const keys = Object.getOwnPropertyNames(v);
        fMappingTable = keys.map(key => {
          const out = this.mappingKeys.find(m => (m.mapping.indexOf(key) > -1));
          const newKey = (out) ? out.name : key;

          rMappingTable[newKey] = key;

          return {
            key,
            newKey,
          }
        });
      }

      const newObj = {};
      fMappingTable.forEach(kt => {
        newObj[kt.newKey] = v[kt.key];
      });
      return newObj;
    });

    return {
      mappingTable: rMappingTable,
      newSource
    }
  }

  // 建立檢查規則
  public makeRules(mode: ImportMode, identifyField: FieldName[], importField: FieldName[], students: any) {

    const fieldRules: FieldRules = {
      StudentId: [],
      StudentName: [],
      Gender: [],
      StudentNumber: [],
      SeatNo: [],
      LinkAccount: [],
      StudentCode: [],
      ParentCode: [],
      ClassName: [],
      StudentStatus: [],
    };
    const rowRules: RowValidator[] = [];

    switch (mode) {
      case 'ADD':
        fieldRules['StudentName'].push(new NotEmpty());
        fieldRules['StudentName'].push(new MaxLength(50));

        if (importField.includes('StudentStatus')) {
          fieldRules['StudentStatus'].push(new NotEmpty());
          fieldRules['StudentStatus'].push(new Enumerate(['1']));
        }

        if (importField.includes('StudentNumber')) {
          fieldRules['StudentNumber'].push(new MaxLength(12));
          rowRules.push(new Unique({ fieldNames: ['StudentNumber', 'StudentStatus'], skipEmpty: true, skipFieldNames: ['StudentNumber'] }));
          rowRules.push(new NotMatchTo({ fieldNames: ['StudentNumber', 'StudentStatus'], data: students,
            skipEmpty: true, skipFieldNames: ['StudentNumber'], message: '資料庫有重複內容' }));
        }

        if (importField.includes('Gender')) {
          fieldRules['Gender'].push(new Enumerate(['男', '女', '']));
        }

        if (importField.includes('SeatNo')) {
          fieldRules['SeatNo'].push(new IsNumber());
        }

        if (importField.includes('ClassName')) {
          rowRules.push(new MatchTo({ fieldNames: ['ClassName'], data: this.coreSrv.getClassList(), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('ClassId')) {
          rowRules.push(new MatchTo({ fieldNames: ['ClassId'], data: this.coreSrv.getClassList(), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new MaxLength(200));
          rowRules.push(new Unique({ fieldNames: ['LinkAccount'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['LinkAccount'], data: students, message: '資料庫有重複內容' }));
        }

        if (importField.includes('StudentCode')) {
          fieldRules['StudentCode'].push(new MaxLength(150));
          rowRules.push(new Unique({ fieldNames: ['StudentCode'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['StudentCode'], data: students, message: '資料庫有重複內容' }));
        }

        if (importField.includes('ParentCode')) {
          fieldRules['ParentCode'].push(new MaxLength(150));
          rowRules.push(new Unique({ fieldNames: ['ParentCode'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['ParentCode'], data: students, message: '資料庫有重複內容' }));
        }

        break;
      case 'EDIT':
        fieldRules['StudentName'].push(new NotEmpty());
        fieldRules['StudentName'].push(new MaxLength(50));

        if (importField.includes('StudentStatus')) {
          fieldRules['StudentStatus'].push(new NotEmpty());
          fieldRules['StudentStatus'].push(new Enumerate(['1', '2', '4', '8', '16', '256']));
        }

        if (importField.includes('StudentNumber')) {
          fieldRules['StudentNumber'].push(new MaxLength(12));
          rowRules.push(new Unique({ fieldNames: ['StudentNumber', 'StudentStatus'], skipEmpty: true, skipFieldNames: ['StudentNumber'] }));
          rowRules.push(new NotMatchTo({ fieldNames: ['StudentNumber', 'StudentStatus'], data: students,
            identifyField, skipEmpty: true, skipFieldNames: ['StudentNumber'],  message: '資料庫有重複內容' } ));
        }

        if (importField.includes('Gender')) {
          fieldRules['Gender'].push(new Enumerate(['男', '女', '']));
        }

        if (importField.includes('SeatNo')) {
          fieldRules['SeatNo'].push(new IsNumber());
        }

        if (importField.includes('ClassName')) {
          rowRules.push(new MatchTo({ fieldNames: ['ClassName'], data: this.coreSrv.getClassList(), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('ClassId')) {
          rowRules.push(new MatchTo({ fieldNames: ['ClassId'], data: this.coreSrv.getClassList(), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new MaxLength(200));
          rowRules.push(new Unique({ fieldNames: ['LinkAccount'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['LinkAccount'], data: students, identifyField, message: '資料庫有重複內容' }));
        }

        if (importField.includes('StudentCode')) {
          fieldRules['StudentCode'].push(new MaxLength(150));
          rowRules.push(new Unique({ fieldNames: ['StudentCode'] }));
          rowRules.push(new NotMatchTo({ fieldNames: ['StudentCode'], data: students, identifyField, message: '資料庫有重複內容' }));
        }

        if (importField.includes('ParentCode')) {
          fieldRules['ParentCode'].push(new MaxLength(150));
          rowRules.push(new Unique({ fieldNames: ['ParentCode'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['ParentCode'], data: students, identifyField, message: '資料庫有重複內容' }));
        }

        if (identifyField.includes('StudentId')) {
          fieldRules['StudentId'].push(new NotEmpty());
          rowRules.push(new Unique({ fieldNames: ['StudentId'], skipEmpty: false }));
          rowRules.push(new MatchTo({ fieldNames: ['StudentId'], data: students, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('StudentNumber')) {
          fieldRules['StudentNumber'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['StudentNumber', 'StudentStatus'], data: students, skipEmpty: false,  message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['LinkAccount'], data: students, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('StudentCode')) {
          fieldRules['StudentCode'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['StudentCode'], data: students, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        break;
      case 'DELETE':
        if (importField.includes('StudentNumber')) {
          fieldRules['StudentNumber'].push(new MaxLength(12));
          rowRules.push(new Unique({ fieldNames: ['StudentNumber'], skipEmpty: true, skipFieldNames: ['StudentNumber'] }));
        }

        if (importField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new MaxLength(200));
          rowRules.push(new Unique({ fieldNames: ['LinkAccount'], skipEmpty: true }));
        }

        if (identifyField.includes('StudentId')) {
          fieldRules['StudentId'].push(new NotEmpty());
          rowRules.push(new Unique({ fieldNames: ['StudentId'], skipEmpty: false }));
          rowRules.push(new MatchTo({ fieldNames: ['StudentId'], data: students, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('StudentNumber')) {
          fieldRules['StudentNumber'].push(new NotEmpty());
          rowRules.push(new MatchAndReset({ fieldNames: ['StudentNumber', 'StudentStatus'], data: students, skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue) => { rowValue.StudentId = matchValue.StudentId }
          }));
        }

        if (identifyField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new NotEmpty());
          rowRules.push(new MatchAndReset({ fieldNames: ['LinkAccount'], data: students, skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue) => { rowValue.StudentId = matchValue.StudentId }
          }));
        }

        break;
    }

    return {
      fieldRules,
      rowRules,
    }
  }
}

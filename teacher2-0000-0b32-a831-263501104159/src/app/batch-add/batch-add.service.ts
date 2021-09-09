import { Injectable } from '@angular/core';
import { FieldName, ImportMode } from '../data/import-config';
import { Enumerate, FieldRules, MatchTo, MaxLength, NotEmpty, NotMatchTo, RowValidator, Unique } from '../shared/validators';

@Injectable({
  providedIn: 'root'
})
export class BatchAddService {

  // 欄位名稱對照，一律轉為英文欄位名
  mappingKeys = [
    { name: 'TeacherId', mapping: ['teacher_id', '教師系統編號'] },
    { name: 'TeacherName', mapping: ['teacher_name', '教師姓名'] },
    { name: 'Nickname', mapping: ['nickname', '暱稱'] },
    { name: 'Gender', mapping: ['gender', '性別'] },
    // { name: 'IDNumber', mapping: ['id_number', '身分證號'] },
    { name: 'LinkAccount', mapping: ['st_login_name', '登入帳號'] },
    { name: 'TeacherCode', mapping: ['teacher_code', '教師代碼'] },
  ];

  constructor() { }

  // 將 JSON 內容轉換為對照的英文欄位名
  public convertObject(source: any[]): { mappingTable: any, newSource: any[] } {
    let fMappingTable = [];
    const rMappingTable = {}; // 新舊對照 {新: 舊}

    const newSource = source.map((v, idx) => {
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
  public makeRules(mode: ImportMode, identifyField: FieldName[], importField: FieldName[], teachers: any) {

    const fieldRules: FieldRules = {
      'TeacherId': [],
      'TeacherName': [],
      'Nickname': [],
      'Gender': [],
      'LinkAccount': [],
      'TeacherCode': [],
    };
    const rowRules: RowValidator[] = [];

    switch (mode) {
      case 'ADD':
        fieldRules['TeacherName'].push(new NotEmpty());
        fieldRules['TeacherName'].push(new MaxLength(50));

        rowRules.push(new Unique({ fieldNames: ['TeacherName', 'Nickname'], skipEmpty: false }));
        rowRules.push(new NotMatchTo({ fieldNames: ['TeacherName', 'Nickname'], data: teachers, message: '資料庫有重複內容' }));

        if (importField.includes('Gender')) {
          fieldRules['Gender'].push(new Enumerate(['男', '女', '']));
        }

        if (importField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new MaxLength(200));
          rowRules.push(new Unique({ fieldNames: ['LinkAccount'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['LinkAccount'], data: teachers, message: '資料庫有重複內容' }));
        }

        if (importField.includes('TeacherCode')) {
          fieldRules['TeacherCode'].push(new MaxLength(150));
          rowRules.push(new Unique({ fieldNames: ['TeacherCode'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['TeacherCode'], data: teachers, message: '資料庫有重複內容' }));
        }

        break;
      case 'EDIT':
        fieldRules['TeacherName'].push(new NotEmpty());
        fieldRules['TeacherName'].push(new MaxLength(50));

        rowRules.push(new Unique({ fieldNames: ['TeacherName', 'Nickname'], skipEmpty: false }));
        rowRules.push(new NotMatchTo({ fieldNames: ['TeacherName', 'Nickname'], data: teachers, identifyField, message: '資料庫有重複內容' }));

        if (importField.includes('Gender')) {
          fieldRules['Gender'] = [new Enumerate(['男', '女', ''])];
        }

        if (importField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new MaxLength(200));
          rowRules.push(new Unique({ fieldNames: ['LinkAccount'], skipEmpty: true }));
          rowRules.push(new NotMatchTo({ fieldNames: ['LinkAccount'], data: teachers, identifyField, message: '資料庫有重複內容' }));
        }

        if (importField.includes('TeacherCode')) {
          fieldRules['TeacherCode'].push(new MaxLength(150));
          rowRules.push(new Unique({ fieldNames: ['TeacherCode'] }));
          rowRules.push(new NotMatchTo({ fieldNames: ['TeacherCode'], data: teachers, identifyField, message: '資料庫有重複內容' }));
        }

        if (identifyField.includes('TeacherId')) {
          fieldRules['TeacherId'].push(new NotEmpty());
          rowRules.push(new Unique({ fieldNames: ['TeacherId'] }));
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId'], data: teachers, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('TeacherName')) {
          rowRules.push(new MatchTo({ fieldNames: ['TeacherName', 'Nickname'], data: teachers, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['LinkAccount'], data: teachers, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        break;
    }

    return {
      fieldRules,
      rowRules,
    }
  }
}

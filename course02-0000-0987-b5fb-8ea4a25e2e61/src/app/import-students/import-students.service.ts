import { Injectable } from '@angular/core';
import { SourceCourse } from '../data/course';
import { ImportMode, StudentFieldName } from '../data/import-config';
import { StudentRec } from '../data/student';
import { Enumerate, FieldRules, IsNumber, MatchAndReset, MatchTo, MaxLength, NotEmpty, RowValidator, Unique } from '../shared/validators';


@Injectable({
  providedIn: 'root'
})
export class ImportStudentService {

  // 欄位名稱對照，一律轉為英文欄位名
  mappingKeys = [
    { name: 'CourseId', mapping: ['course_id', '課程系統編號'] },
    { name: 'CourseName', mapping: ['course_name', '課程名稱'] },
    { name: 'SchoolYear', mapping: ['school_year', '學年度'] },
    { name: 'Semester', mapping: ['semester', '學期'] },
    { name: 'StudentId', mapping: ['student_id', '學生系統編號'] },
    { name: 'StudentNumber', mapping: ['student_number', '學號'] },
    { name: 'StudentStatus', mapping: ['student_status', '狀態'] },
    { name: 'LinkAccount', mapping: ['sa_login_name', '登入帳號'] },
  ];

  constructor() { }

  // 將 JSON 內容轉換為對照的英文欄位名
  public convertObject(source: any[], schoolYear: string, semester: string): { mappingTable: any, newSource: any[] } {
    let fMappingTable: any[] = [];
    const rMappingTable: any = {}; // 新舊對照 {新: 舊}

    const newSource = source.map((v, idx) => {
      v.學年度 = schoolYear;
      v.學期 = semester;
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

      const newObj: any = {};
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
  public makeRules(mode: ImportMode, identifyField: StudentFieldName[], importField: StudentFieldName[], sourceCourses: SourceCourse[], sourceStudents: StudentRec[]) {

    const fieldRules: FieldRules = {
      CourseId: [],
      CourseName: [],
      SchoolYear: [],
      Semester: [],
      StudentId: [],
      StudentNumber: [],
      StudentStatus: [],
      LinkAccount: [],
    };
    const rowRules: RowValidator[] = [];

    switch (mode) {
      case 'ADD':
        if (identifyField.includes('CourseId')) {
          fieldRules['CourseId'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['CourseId'], data: sourceCourses, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('SchoolYear')) {
          fieldRules['SchoolYear'].push(new NotEmpty());
          fieldRules['SchoolYear'].push(new IsNumber());
        }

        if (identifyField.includes('Semester')) {
          fieldRules['Semester'].push(new NotEmpty());
          fieldRules['Semester'].push(new IsNumber());
        }

        if (identifyField.includes('CourseName')) {
          rowRules.push(new MatchAndReset({ fieldNames: ['CourseName', 'SchoolYear', 'Semester'], data: sourceCourses, skipEmpty: false, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: SourceCourse) => { rowValue.CourseId = matchValue.CourseId }
          }));
        }

        if (identifyField.includes('StudentId')) {
          fieldRules['StudentId'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['StudentId'], data: sourceStudents, skipEmpty: false, message: '資料庫無符合內容' }));
          fieldRules['StudentId'].push(new NotEmpty());
        }

        if (identifyField.includes('StudentStatus')) {
          fieldRules['StudentStatus'].push(new NotEmpty());
          fieldRules['StudentStatus'].push(new Enumerate(['1', '2', '4', '8', '16', '256']));
        }

        if (identifyField.includes('StudentNumber')) {
          fieldRules['StudentNumber'].push(new NotEmpty());
          fieldRules['StudentNumber'].push(new MaxLength(12));
          rowRules.push(new MatchAndReset({ fieldNames: ['StudentNumber', 'StudentStatus'], data: sourceStudents, skipEmpty: false,  message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: StudentRec) => { rowValue.StudentId = matchValue.StudentId }
          }));
        }

        if (identifyField.includes('LinkAccount')) {
          fieldRules['LinkAccount'].push(new NotEmpty());
          rowRules.push(new MatchTo({ fieldNames: ['LinkAccount'], data: sourceStudents, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        break;
    }

    return {
      fieldRules,
      rowRules,
    }
  }
}

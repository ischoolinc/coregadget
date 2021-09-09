import { Injectable } from '@angular/core';
import { ClassRec, CoreService } from '../core.service';
import { SourceCourse } from '../data/course';
import { CourseFieldName, ImportMode } from '../data/import-config';
import { TeacherRec } from '../data/teacher';
import { FieldRules, IsNumber, MatchAndReset, MatchTo, MaxLength, NotEmpty, NotMatchTo, RowValidator, Unique, UniqueTeacher } from '../shared/validators';


@Injectable({
  providedIn: 'root'
})
export class ImportCoursesService {

  // 欄位名稱對照，一律轉為英文欄位名
  mappingKeys = [
    { name: 'CourseId', mapping: ['course_id', '課程系統編號'] },
    { name: 'CourseName', mapping: ['course_name', '課程名稱'] },
    { name: 'SchoolYear', mapping: ['school_year', '學年度'] },
    { name: 'Semester', mapping: ['semester', '學期'] },
    { name: 'ClassName', mapping: ['class_name', '修課班級'] },
    { name: 'RefClassId', mapping: ['class_id', 'RefClassId'] },
    { name: 'TeacherId1', mapping: ['teacher_id1', 'TeacherId1'] },
    { name: 'TeacherId2', mapping: ['teacher_id2', 'TeacherId2'] },
    { name: 'TeacherId3', mapping: ['teacher_id3', 'TeacherId3'] },
    { name: 'TeacherName1', mapping: ['teacher_name1', '授課教師1'] },
    { name: 'TeacherName2', mapping: ['teacher_name2', '授課教師2'] },
    { name: 'TeacherName3', mapping: ['teacher_name3', '授課教師3'] },
  ];

  constructor(
    private coreSrv: CoreService,
  ) { }

  // 將 JSON 內容轉換為對照的英文欄位名
  public convertObject(source: any[], schoolYear: string, semester: string): { mappingTable: any, newSource: any[] } {
    let fMappingTable: any[] = [];
    const rMappingTable: any = {}; // 新舊對照 {新: 舊}

    const newSource = source.map((v, idx) => {
      v.學年度 = schoolYear;
      v.學期 = semester;

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
  public makeRules(mode: ImportMode, identifyField: CourseFieldName[], importField: CourseFieldName[], sourceCourses: SourceCourse[]) {

    const fieldRules: FieldRules = {
      'CourseId': [],
      'CourseName': [],
      'SchoolYear': [],
      'Semester': [],
      'RefClassId': [],
      'TeacherId1': [],
      'TeacherId2': [],
      'TeacherId3': [],
      'TeacherName1': [],
      'TeacherName2': [],
      'TeacherName3': [],
    };
    const rowRules: RowValidator[] = [];
    let importTeachers = [];

    switch (mode) {
      case 'ADD':
        fieldRules['CourseName'].push(new NotEmpty());
        fieldRules['CourseName'].push(new MaxLength(50));

        fieldRules['SchoolYear'].push(new NotEmpty());
        fieldRules['SchoolYear'].push(new IsNumber());

        fieldRules['Semester'].push(new NotEmpty());
        fieldRules['Semester'].push(new IsNumber());

        rowRules.push(new Unique({ fieldNames: ['CourseName', 'SchoolYear', 'Semester'], skipEmpty: false }));
        rowRules.push(new NotMatchTo({ fieldNames: ['CourseName', 'SchoolYear', 'Semester'], data: sourceCourses, message: '資料庫有重複內容' }));

        if (importField.includes('ClassName')) {
          rowRules.push(new MatchAndReset({ fieldNames: ['ClassName'], data: this.coreSrv.classList, skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: ClassRec) => { rowValue.RefClassId = matchValue.ClassId }
          }));
        }

        if (importField.includes('RefClassId')) {
          rowRules.push(new MatchTo({ fieldNames: ['RefClassId'], data: this.coreSrv.classList.map(v => { return { RefClassId: v.ClassId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherId1')) {
          importTeachers.push('TeacherId1');
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId1'], data: this.coreSrv.teacherList.map(v => { return { TeacherId1: v.TeacherId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherId2')) {
          importTeachers.push('TeacherId2');
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId2'], data: this.coreSrv.teacherList.map(v => { return { TeacherId2: v.TeacherId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherId3')) {
          importTeachers.push('TeacherId3');
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId3'], data: this.coreSrv.teacherList.map(v => { return { TeacherId3: v.TeacherId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherName1')) {
          importTeachers.push('TeacherName1');
          rowRules.push(new MatchAndReset({ fieldNames: ['TeacherName1'],
            data: this.coreSrv.teacherList.map(v => { return { ...v, TeacherName1: (v.Nickname) ? `${v.TeacherName}(${v.Nickname})`: v.TeacherName }})
            , skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: TeacherRec) => { rowValue.TeacherId1 = matchValue.TeacherId }
          }));
        }

        if (importField.includes('TeacherName2')) {
          importTeachers.push('TeacherName2');
          rowRules.push(new MatchAndReset({ fieldNames: ['TeacherName2'],
            data: this.coreSrv.teacherList.map(v => { return { ...v, TeacherName2: (v.Nickname) ? `${v.TeacherName}(${v.Nickname})`: v.TeacherName }})
            , skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: TeacherRec) => { rowValue.TeacherId2 = matchValue.TeacherId }
          }));
        }

        if (importField.includes('TeacherName3')) {
          importTeachers.push('TeacherName3');
          rowRules.push(new MatchAndReset({ fieldNames: ['TeacherName3'],
            data: this.coreSrv.teacherList.map(v => { return { ...v, TeacherName3: (v.Nickname) ? `${v.TeacherName}(${v.Nickname})`: v.TeacherName }})
            , skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: TeacherRec) => { rowValue.TeacherId3 = matchValue.TeacherId }
          }));
        }

        if (importTeachers.length) {
          rowRules.push(new UniqueTeacher({ fieldNames: importTeachers, skipEmpty: true }))
        }

        break;
      case 'EDIT':
        fieldRules['CourseName'].push(new NotEmpty());
        fieldRules['CourseName'].push(new MaxLength(50));

        fieldRules['SchoolYear'].push(new NotEmpty());
        fieldRules['SchoolYear'].push(new IsNumber());

        fieldRules['Semester'].push(new NotEmpty());
        fieldRules['Semester'].push(new IsNumber());

        rowRules.push(new Unique({ fieldNames: ['CourseName', 'SchoolYear', 'Semester'], skipEmpty: false }));
        rowRules.push(new NotMatchTo({ fieldNames: ['CourseName', 'SchoolYear', 'Semester'], data: sourceCourses,
          identifyField, message: '資料庫有重複內容' }));

        if (importField.includes('ClassName')) {
          rowRules.push(new MatchAndReset({ fieldNames: ['ClassName'], data: this.coreSrv.classList, skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: ClassRec) => { rowValue.RefClassId = matchValue.ClassId }
          }));
        }

        if (importField.includes('RefClassId')) {
          rowRules.push(new MatchTo({ fieldNames: ['RefClassId'], data: this.coreSrv.classList.map(v => { return { RefClassId: v.ClassId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherId1')) {
          importTeachers.push('TeacherId1');
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId1'], data: this.coreSrv.teacherList.map(v => { return { TeacherId1: v.TeacherId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherId2')) {
          importTeachers.push('TeacherId2');
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId2'], data: this.coreSrv.teacherList.map(v => { return { TeacherId2: v.TeacherId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherId3')) {
          importTeachers.push('TeacherId3');
          rowRules.push(new MatchTo({ fieldNames: ['TeacherId3'], data: this.coreSrv.teacherList.map(v => { return { TeacherId3: v.TeacherId }}), skipEmpty: true, message: '資料庫無符合內容' }));
        }

        if (importField.includes('TeacherName1')) {
          importTeachers.push('TeacherName1');
          rowRules.push(new MatchAndReset({ fieldNames: ['TeacherName1'],
            data: this.coreSrv.teacherList.map(v => { return { ...v, TeacherName1: (v.Nickname) ? `${v.TeacherName}(${v.Nickname})`: v.TeacherName }})
            , skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: TeacherRec) => { rowValue.TeacherId1 = matchValue.TeacherId }
          }));
        }

        if (importField.includes('TeacherName2')) {
          importTeachers.push('TeacherName2');
          rowRules.push(new MatchAndReset({ fieldNames: ['TeacherName2'],
            data: this.coreSrv.teacherList.map(v => { return { ...v, TeacherName2: (v.Nickname) ? `${v.TeacherName}(${v.Nickname})`: v.TeacherName }})
            , skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: TeacherRec) => { rowValue.TeacherId2 = matchValue.TeacherId }
          }));
        }

        if (importField.includes('TeacherName3')) {
          importTeachers.push('TeacherName3');
          rowRules.push(new MatchAndReset({ fieldNames: ['TeacherName3'],
            data: this.coreSrv.teacherList.map(v => { return { ...v, TeacherName3: (v.Nickname) ? `${v.TeacherName}(${v.Nickname})`: v.TeacherName }})
            , skipEmpty: true, message: '資料庫無符合內容'
            , callback: (rowValue, matchValue: TeacherRec) => { rowValue.TeacherId3 = matchValue.TeacherId }
          }));
        }

        if (importTeachers.length) {
          rowRules.push(new UniqueTeacher({ fieldNames: importTeachers, skipEmpty: true }))
        }

        if (identifyField.includes('CourseId')) {
          fieldRules['CourseId'].push(new NotEmpty());
          rowRules.push(new Unique({ fieldNames: ['CourseId'] }));
          rowRules.push(new MatchTo({ fieldNames: ['CourseId'], data: sourceCourses, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        if (identifyField.includes('CourseName')) {
          rowRules.push(new MatchTo({ fieldNames: ['CourseName', 'SchoolYear', 'Semester'], data: sourceCourses, skipEmpty: false, message: '資料庫無符合內容' }));
        }

        break;
    }

    return {
      fieldRules,
      rowRules,
    }
  }
}

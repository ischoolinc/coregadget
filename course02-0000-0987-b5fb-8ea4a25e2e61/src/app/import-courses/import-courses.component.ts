import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ImportCoursesService } from './import-courses.service';
import { DocumentValidator, JsonRowSource } from '../shared/validators';
import { CourseFieldName, ImportFieldRec, ImportMode } from '../data/import-config';
import { CoreService } from '../core.service';
import { SourceCourse } from '../data/course';
// import sample from './sample/sample-edit-by-id.json';

@Component({
  selector: 'app-import-courses',
  templateUrl: './import-courses.component.html',
  styleUrls: ['./import-courses.component.scss']
})
export class ImportCoursesComponent implements OnInit {

  currentState: '' | 'validating' | 'validationFinish' | 'importing' | 'importFinish' = '';
  rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
  targetFile: any;
  limitRec = 1000;

  // 匯入檔案名稱
  fileName = '';
  // 匯入的 excel 轉成 json 及轉欄位名稱後的結果
  source: any[] = [];
  // 超過最大筆數上限
  exceedLimit = false;
  // 匯入的檔案提取欄位名
  sourceFields: string[] = [];
  // 檔案讀取成功
  loadSuccess = true;
  // 驗證錯誤結果
  errorResult: Map<number, any> = new Map();
  // 驗證錯誤訊息
  validationMsg = '';
  // 驗證成功
  validSuccess = false;
  // 匯入是否成功
  importSuccess = false;
  // 錯誤訊息
  importMsg = '';
  // 父視窗是否需要重載
  needRefresh = false;

  myForm!: FormGroup;
  imptItems: ImportFieldRec[] = [
    { name: '課程系統編號', value: 'CourseId', selected: false, disabled: false, hidden: true },
    { name: '課程名稱', value: 'CourseName', selected: true, disabled: true, hidden: false },
    { name: '授課教師1', value: 'TeacherName1', selected: false, disabled: false, hidden: false },
    { name: '授課教師2', value: 'TeacherName2', selected: false, disabled: false, hidden: false },
    { name: '授課教師3', value: 'TeacherName3', selected: false, disabled: false, hidden: false },
    { name: '所屬班級', value: 'ClassName', selected: false, disabled: false, hidden: false }
  ];

  @ViewChild('fileInput') fileInput!: ElementRef;

  curSchoolYear = '';
  curSemester = '';

  constructor(
    public dialogRef: MatDialogRef<ImportCoursesComponent>,
    private importCoursesSrv: ImportCoursesService,
    private coreSrv: CoreService,
  ) { }

  ngOnInit() {
    this.curSchoolYear = this.coreSrv.curSchoolYear$.value;
    this.curSemester = this.coreSrv.curSemester$.value;

    this.createFormInputs();
    this.dialogRef.backdropClick().subscribe(e => {
      this.dialogRef.close({ state: (this.needRefresh ? 'refresh' : '') });
    });
  }

  getFormCtrl(name: string) {
    return this.myForm.get(name)! as FormControl;
  }

  getFromAry(name: string) {
    return this.myForm.get(name)! as FormArray;
  }

  async getSourceCourseList(): Promise<SourceCourse[]> {
    try {
      return await this.coreSrv.getCourses({ SchoolYear: this.coreSrv.curSchoolYear$.value, Semester: this.coreSrv.curSemester$.value });
    } catch (error) {
      throw new Error('取得比對清單發生錯誤！');
    }
  }

  createFormInputs() {
    this.myForm = new FormGroup({
      mode: new FormControl('ADD'), // ADD | EDIT
      idt: new FormControl('CourseId'),
      impts: this.createImportFields(this.imptItems),
    });
  }

  changeMode() {
    this.currentState = '';
    this.validSuccess = false;
    this.resetPreImportState();
  }

  /**
   * 改變匯入方式(ADD | EDIT)及上傳匯入檔時，調整匯入欄位「必勾選」狀態
   * ADD: 隱藏 - 教師系統編號；必選 - 教師姓名
   * EDIT: 必選 - 識別欄位
   * 並將匯入檔中的符合的欄位變成預勾選狀態
   */
  resetPreImportState() {
    const mode: ImportMode = this.getFormCtrl('mode').value;
    const ctrls = this.getFromAry('impts')['controls'];
    ctrls.forEach(ctrl => {
      const item = ctrl.value;
      if (mode === 'ADD') {
        item.hidden = (item.value === 'CourseId');
        item.disabled = (item.value === 'CourseName');
        item.disabled = (item.value === 'SchoolYear');
        item.disabled = (item.value === 'Semester');
        if (item.value === 'CourseName') item.selected = true;
        if (item.value === 'SchoolYear') item.selected = true;
        if (item.value === 'Semester') item.selected = true;
      } else {
        const identifyField: CourseFieldName[] = (this.getFormCtrl('idt').value || '').split('^');
        item.hidden = (item.value === 'CourseId') ? !identifyField.includes('CourseId') : false;
        item.disabled = identifyField.includes(item.value as CourseFieldName);
        if (identifyField.includes(item.value as CourseFieldName)) { item.selected = true; }
      }

      if (!item.disabled && !item.hidden) {
        if (this.sourceFields.includes(item.value)) {
          item.selected = true;
        } else {
          item.selected = false;
          item.disabled = true;
        }
      }
      ctrl.setValue(item);
    });
  }

  /** 建立 formContrl */
  createImportFields(items: any[]) {
    const arr = items.map(v => {
      return new FormControl(v);
    });
    return new FormArray(arr);
  }

  // 點選選擇檔案，清空當前指向的實體檔路徑
  inputClick(event: any) {
    event.target.value = '';
    this.loadSuccess = true;
    this.source = [];
    this.currentState = '';
    this.validSuccess = false;
  }

  onFileChange(event: any) {
    this.exceedLimit = false;

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.fileName = file.name;
      this.targetFile = file;
      if (this.targetFile) {
        const reader = new FileReader();
        if (this.rABS) {
          reader.readAsBinaryString(this.targetFile);
        } else {
          reader.readAsArrayBuffer(this.targetFile);
        }

        reader.onload = (e) => {
          // 1. 讀取 xlsx 的資料，並轉換為 json 格式
          // 2. 做出 json 的 key(中文) 對照表，因為驗證時是用英文欄位名
          let data: any = reader.result;
          if (!this.rABS) { data = new Uint8Array(data as any); }

          /* read workbook */
          const wb: XLSX.WorkBook = XLSX.read(data, {type: this.rABS ? 'binary' : 'array'});

          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          // const list: NewAccount[] = XLSX.utils.sheet_to_json(ws, { range: 1, header: ['account'] });
          const jsonSource: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
          // console.log(jsonSource);
          // 轉換匯入的資料欄位，使用英文欄位名
          const newData = this.importCoursesSrv.convertObject(jsonSource as [] || [], this.curSchoolYear, this.curSemester);
          // const newData = this.importCoursesSrv.convertObject(sample, this.curSchoolYear, this.curSemester); // !!!!!!開發用!!!!!!
          // console.log(newData);
          const source = newData.newSource;
          if (source.length > this.limitRec) {
            this.exceedLimit = true;
            throw new Error('超過筆數上限！');
          }
          this.sourceFields = Object.keys(source[0]);
          // console.log(this.sourceFields);
          this.source = source;
          this.resetPreImportState();
        };

        reader.onerror = (e) => { this.loadSuccess = false; }
      } else {
        this.source = [];
      }
    }
  }

  async onValidate() {
    if (this.currentState === 'validating') return;

    this.currentState = 'validating';
    this.validSuccess = false;
    this.validationMsg = '';
    this.errorResult.clear();
    this.importSuccess = false;
    this.importMsg = '';

    try {
      if (!this.source.length) {
        throw new Error('無可分析的資料');
      } else {
        const mode: ImportMode = this.getFormCtrl('mode').value;
        const identifyField: CourseFieldName[] = (mode === 'EDIT') ? (this.getFormCtrl('idt').value || '').split('^') : [];
        const importField: CourseFieldName[] = this.getFormCtrl('impts').value.filter((v: any) => v.selected && !!!v.hidden).map((v: any) => v.value);
        // console.log(importField);

        // 確認是否缺少識別欄位
        const checkIdxFieldFail = identifyField.filter(v => !!!this.source[0].hasOwnProperty(v));
        if (checkIdxFieldFail.length) throw new Error('匯入的資料缺少識別欄位');

        const sourceCourseList = await this.getSourceCourseList();
        const rule = this.importCoursesSrv.makeRules(mode, identifyField, importField, sourceCourseList);
        // console.log(rule);

        const jsonRowSrc = new JsonRowSource(this.source);

        const docValid = new DocumentValidator(rule.fieldRules, rule.rowRules);
        docValid.validate(jsonRowSrc);
        this.errorResult = jsonRowSrc.getErrors();
        this.validSuccess = (this.errorResult.size === 0);
        // console.log(this.errorResult);
        // console.log(jsonRowSrc);
      }
    } catch (error:any ) {
      // console.log(error);
      this.validationMsg = error?.message || '分析發生錯誤！';
    } finally {
      this.currentState = 'validationFinish';
    }
  }

  // 查看錯誤報告
  previewErrorResult() {
    const content = this.source.map((v, idx) => {
      if (this.errorResult.has(idx)) {
        const row = this.errorResult.get(idx);
        const fieldErrors = Object.keys(row).map(field => {
          return `${this.coreSrv.replaceMappingFieldName(field)}: ${row[field].join('、')}`;
        });
        return `<td>${idx + 1}</td><td style="color: red">${fieldErrors.join('<br />')}</td>`;
      } else {
        return `<td>${idx + 1}</td><td>正確</td>`;
      }
    });

    const newWin = window.open('', 'validation_results');
    newWin!.document.body.innerHTML = `
      <html>
        <head>
          <title>Result</title>
          <style type="text/css">
            table {
              border-collapse: collapse;
              border-spacing: 0px;
              margin: 30px 0 0 30px;
            }
            table, th, td {
              padding: 5px;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <table><tr><td>No.</td><td>驗證結果</td></tr><tr>${content.join('</tr><tr>')}</tr></table>
        </body>
      </html>
    `;
  }

  // 匯入資料
  async importData() {
    if (!this.validSuccess) { return; }
    if (this.currentState === 'importing') { return; }
    if (!!this.validationMsg || this.errorResult.size > 0 || this.source.length === 0) { return; }
    this.currentState = 'importing';

    try {
      const mode: ImportMode = this.getFormCtrl('mode').value;
      const identifyField: CourseFieldName[] = (mode === 'EDIT') ? (this.getFormCtrl('idt').value || '').split('^') : [];
      const importField: CourseFieldName[] = this.getFormCtrl('impts').value.filter((v: any) => v.selected && !!!v.hidden).map((v: any) => v.value);
      const finalData = this.source.map(v => {
        const item: any = {};
        item.SchoolYear = this.curSchoolYear;
        item.Semester = this.curSemester;

        importField.forEach(key => {
          switch (key) {
            case 'ClassName':
              item['RefClassId'] = v['RefClassId'];
              break;
            case 'TeacherName1':
              item['TeacherId1'] = v['TeacherId1'];
              break;
            case 'TeacherName2':
              item['TeacherId2'] = v['TeacherId2'];
              break;
            case 'TeacherName3':
              item['TeacherId3'] = v['TeacherId3'];
              break;
            default:
              item[key] = v[key];
          }
        });
        return item;
      });
      // console.log(identifyField, finalData);

      if (mode === 'EDIT') {
        await this.coreSrv.updateCourseAndTeacher(identifyField, finalData, false);
      } else {
        await this.coreSrv.addCourseAndTeacher(finalData, false);
      }

      try {
        if (mode === 'EDIT') {
          await this.coreSrv.addLog('Import', '批次變更課程', `已進行「匯入課程異動」操作。\n詳細資料：${JSON.stringify({identifyField, finalData})}`);
        } else {
          await this.coreSrv.addLog('Import', '批次新增課程', `已進行「匯入新增課程」操作。\n詳細資料：${JSON.stringify({identifyField, finalData})}`);
        }
      } catch (error:any) { }

      this.importSuccess = true;
      this.needRefresh = true;
    } catch (error:any) {
      // console.log(error);
      this.importMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
      this.importSuccess = false;
    } finally {
      this.currentState = 'importFinish';
    }
  }

  closeDialog() {
    this.dialogRef.close({ state: (this.needRefresh ? 'refresh' : '') });
  }

}

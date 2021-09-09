import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassRec, CoreService } from '../core.service';
import { ClassFieldName, ImportMode } from '../data/import-config';
import { DocumentValidator, JsonRowSource } from '../shared/validators';
import { TeacherRec } from '../data/teacher';
import { EditClassService } from './edit-class.service';

@Component({
  selector: 'app-edit-class-modal',
  templateUrl: './edit-class-modal.component.html',
  styleUrls: ['./edit-class-modal.component.scss']
})
export class EditClassModalComponent implements OnInit {

  mode: 'add' | 'edit' = 'add';
  saving = false;
  errMsg = '';
  cRec: ClassRec = {} as ClassRec;
  className = '';
  teacherList: TeacherRec[] = [];
  teacherId?: string;

  constructor(
    public dialogRef: MatDialogRef<EditClassModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { class: ClassRec, sourceClasses: ClassRec[] },
    private coreSrv: CoreService,
    public dialog: MatDialog,
    private editClassSrv: EditClassService,
  ) {
    this.className = data.class.ClassName;
    this.cRec = data.class;
    this.mode = (this.cRec.ClassId ? 'edit' : 'add');
    this.teacherList = this.coreSrv.teacherList;
    this.teacherId = data.class.TeacherId;
  }

  ngOnInit(): void {
  }

  async validate() {
    try {
      const mode: ImportMode = (this.cRec.ClassId) ? 'EDIT' : 'ADD';
      const identifyField: ClassFieldName[] = (mode === 'EDIT') ? ['ClassId'] : [];
      const importField: ClassFieldName[] = ['ClassId', 'ClassName', 'GradeYear', 'TeacherId'];
      // console.log(importField);

      const sourceClassList = this.data.sourceClasses;
      const rule = this.editClassSrv.makeRules(mode, identifyField, importField, sourceClassList);
      // console.log(rule);

      const jsonRowSrc = new JsonRowSource([{
        ClassId: this.cRec.ClassId,
        ClassName: this.cRec.ClassName,
        GradeYear: this.cRec.GradeYear,
        TeacherId: this.teacherId,
      }]);

      const docValid = new DocumentValidator(rule.fieldRules, rule.rowRules);
      docValid.validate(jsonRowSrc);
      const errorResult = jsonRowSrc.getErrors();
      // console.log(errorResult);
      // console.log(this.cRec);
      return this.formatErrorResult(errorResult);
    } catch (error) {
      return { info: 'error', errorMsg: (error || '分析發生錯誤！') }
    }
  }

  // 格式化驗證結果
  formatErrorResult(errorResult: Map<number, any>) {
    if (errorResult.has(0)) {
      const row = errorResult.get(0);
      const fieldErrors = Object.keys(row).map(field => {
        return `${this.coreSrv.replaceMappingFieldName(field)}: ${row[field].join('、')}`;
      });
      return { info: 'error', errorMsg: fieldErrors.join('、') };
    } else {
      return { info: 'success' };
    }
  }

  async updateClass() {
    this.errMsg = '';
    if (this.saving) { return; }

    // 驗證資料正確性
    const valid = await this.validate();
    if (valid.info === 'error') { this.errMsg = valid.errorMsg; return; }

    try {
      this.saving = true;
      let newData = {
        ClassId: this.cRec.ClassId,
        ClassName: this.cRec.ClassName,
        GradeYear: this.cRec.GradeYear,
        TeacherId: this.teacherId,
      };

      if (this.cRec.ClassId) {
        await this.coreSrv.updateClass(['ClassId'], [newData]);
      } else {
        await this.coreSrv.addClass([newData]);
      }

      try {
        if (this.cRec.ClassId) {
          await this.coreSrv.addLog('Record', '變更班級', `班級系統編號：${this.cRec.ClassId}。\n詳細資料：${JSON.stringify(this.cRec)}`);
        } else {
          await this.coreSrv.addLog('Record', '新增班級', `班級名稱：${this.cRec.ClassName}。\n詳細資料：${JSON.stringify(this.cRec)}`);
        }
      } catch (error) { }

      this.dialogRef.close({ state: this.mode });
    } catch (error) {
      // console.log(error);
      this.errMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
    } finally {
      this.saving = false;
    }
  }

  setTeacherId(teacherId: string | undefined) {
    this.teacherId = teacherId;
  }
}

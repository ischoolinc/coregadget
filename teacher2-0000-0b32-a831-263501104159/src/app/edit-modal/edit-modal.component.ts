import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BatchAddService } from '../batch-add/batch-add.service';
import { CoreService } from '../core.service';
import { FieldName, ImportMode } from '../data/import-config';
import { TeacherRec } from '../data/teacher';
import { ConfirmDialogService } from '../shared/dialog/confirm-dialog.service';
import { ModalSize } from '../shared/dialog/confirm-dialog/confirm-dialog';
import { DocumentValidator, JsonRowSource } from '../shared/validators';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  mode: 'add' | 'edit' = 'add';
  saving = false;
  errMsg = '';
  tRec: TeacherRec = {} as TeacherRec;
  teacherName = '';
  nickname = '';

  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teacher: TeacherRec, teachers: TeacherRec[] },
    private coreSrv: CoreService,
    public dialog: MatDialog,
    public confirmSrv: ConfirmDialogService,
    private batchAddSrv: BatchAddService,
  ) {
    this.tRec = data.teacher;
    this.mode = (this.tRec.TeacherId ? 'edit' : 'add');
    this.teacherName = data.teacher.TeacherName;
    this.nickname = data.teacher.Nickname;
  }

  ngOnInit(): void {
  }

  async getNewCode() {
    this.errMsg = '';
    if (this.saving) { return; }

    try {
      this.saving = true;
      const code = await this.coreSrv.getNewCode();
      this.tRec.TeacherCode = code;
    } catch (error) {
      // console.log(error);
      this.errMsg = (error.dsaError && error.dsaError.message) ? error.dsaError.message : '發生錯誤';
    } finally {
      this.saving = false;
    }
  }

  validate() {
    try {
      const mode: ImportMode = (this.tRec.TeacherId) ? 'EDIT' : 'ADD';
      const identifyField: FieldName[] = (mode === 'EDIT') ? ['TeacherId'] : [];
      const importField: FieldName[] = ['TeacherName', 'Nickname', 'Gender', 'LinkAccount', 'TeacherCode'];
      // console.log(importField);

      const rule = this.batchAddSrv.makeRules(mode, identifyField, importField, this.data.teachers);
      // console.log(rule);

      const jsonRowSrc = new JsonRowSource([this.tRec]);

      const docValid = new DocumentValidator(rule.fieldRules, rule.rowRules);
      docValid.validate(jsonRowSrc);
      const errorResult = jsonRowSrc.getErrors();
      return this.formatErrorResult(errorResult);
    } catch (error) {
      return { info: 'error', errorMsg: (error || '分析發生錯誤！') }
    }
  }

  // 格式化驗證結果
  formatErrorResult(errorResult) {
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

  async updateTeacher() {
    this.errMsg = '';
    if (this.saving) { return; }

    // 驗證資料正確性
    const valid = this.validate();
    if (valid.info === 'error') { this.errMsg = valid.errorMsg; return; }

    try {
      this.saving = true;

      if (this.tRec.TeacherId) {
        await this.coreSrv.updateTeacher(['TeacherId'], {
          TeacherId: this.tRec.TeacherId,
          TeacherName: this.tRec.TeacherName,
          Nickname: this.tRec.Nickname,
          Gender: this.tRec.Gender,
          LinkAccount: this.tRec.LinkAccount,
          TeacherCode: this.tRec.TeacherCode,
        });
      } else {
        await this.coreSrv.addTeacher({
          TeacherName: this.tRec.TeacherName,
          Nickname: this.tRec.Nickname,
          Gender: this.tRec.Gender,
          LinkAccount: this.tRec.LinkAccount,
          TeacherCode: this.tRec.TeacherCode,
        });
      }

      try {
        if (this.tRec.TeacherId) {
          await this.coreSrv.addLog('Record', '變更教師', `教師系統編號：${this.tRec.TeacherId}。\n詳細資料：${JSON.stringify(this.tRec)}`);
        } else {
          await this.coreSrv.addLog('Record', '新增教師', `教師姓名：${this.tRec.TeacherName}。\n詳細資料：${JSON.stringify(this.tRec)}`);
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

  confirmDel() {
    this.confirmSrv.show({
      message: '永久刪除無法回復，您確定要刪除嗎？',
      header: '刪除教師',
      acceptLabel: '刪除',
      rejectLabel: '取消',
      accept: () => this.delTeacher(),
      acceptButtonStyleClass: 'bg-warning hover:bg-warning hover:bg-opacity-30',
      rejectButtonStyleClass: '',
      modalSize: ModalSize.MD,
    });
  }

  async delTeacher() {
    this.errMsg = '';
    if (this.saving) { return; }

    try {
      this.saving = true;
      await this.coreSrv.delTeacher(this.tRec.TeacherId);

      try {
        await this.coreSrv.addLog('Record', '刪除教師', `教師系統編號：${this.tRec.TeacherId}。\n詳細資料：${JSON.stringify(this.tRec)}`);
      } catch (error) { }

      this.confirmSrv.hide();
      this.dialogRef.close({ state: 'del' });
    } catch (error) {
      this.errMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
    } finally {
      this.saving = false;
    }
  }

}

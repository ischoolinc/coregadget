import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BatchAddService } from '../batch-add/batch-add.service';
import { CoreService } from '../core.service';
import { FieldName, ImportMode } from '../data/import-config';
import { StudentRec } from '../data/student';
import { ConfirmDialogService } from '../shared/dialog/confirm-dialog.service';
import { ModalSize } from '../shared/dialog/confirm-dialog/confirm-dialog';
import { DocumentValidator, JsonRowSource } from '../shared/validators';
import { StudentManage } from '../student-manage';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  mode: 'add' | 'edit' = 'add';
  saving = false;
  errMsg = '';
  sRec: StudentRec = {} as StudentRec;
  studentName = '';

  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: StudentRec },
    private coreSrv: CoreService,
    public dialog: MatDialog,
    public confirmSrv: ConfirmDialogService,
    private batchAddSrv: BatchAddService,
    private sm: StudentManage,
  ) {
    this.sRec = data.student;
    this.mode = (this.sRec.StudentId ? 'edit' : 'add');
    this.studentName = data.student.StudentName;
  }

  ngOnInit(): void {
  }

  async getNewCode(role: 'student' | 'parent') {
    this.errMsg = '';
    if (this.saving) { return; }

    try {
      this.saving = true;
      const code = await this.coreSrv.getNewCode();
      if (role === 'student') {
        this.sRec.StudentCode = code;
      } else {
        this.sRec.ParentCode = code;
      }
    } catch (error) {
      this.errMsg = (error.dsaError && error.dsaError.message) ? error.dsaError.message : '發生錯誤';
    } finally {
      this.saving = false;
    }
  }

  setClassId(classId: string | undefined) {
    this.sRec.ClassId = classId;
  }

  validate() {
    try {
      const mode: ImportMode = (this.sRec.StudentId) ? 'EDIT' : 'ADD';
      const identifyField: FieldName[] = (mode === 'EDIT') ? ['StudentId'] : [];
      const importField: FieldName[] = ['StudentName', 'Gender', 'StudentNumber', 'SeatNo', 'LinkAccount', 'StudentCode', 'ParentCode', 'ClassId', 'StudentStatus'];
      // console.log(importField);

      const rule = this.batchAddSrv.makeRules(mode, identifyField, importField, this.sm.students);
      // console.log(rule);

      const jsonRowSrc = new JsonRowSource([this.sRec]);

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
      return { info: 'error', errorMsg: fieldErrors.join('、')}
    } else {
      return { info: 'success' };
    }
  }

  async updateStudent() {
    this.errMsg = '';
    if (this.saving) { return; }

    // 驗證資料正確性
    const valid = this.validate();
    if (valid.info === 'error') { this.errMsg = valid.errorMsg; return; }

    try {
      this.saving = true;
      if (this.sRec.StudentId) {
        await this.coreSrv.updateStudent(['StudentId'], {
          StudentId: this.sRec.StudentId,
          StudentName: this.sRec.StudentName,
          StudentNumber: this.sRec.StudentNumber,
          Gender: this.sRec.Gender,
          SeatNo: this.sRec.SeatNo,
          LinkAccount: this.sRec.LinkAccount,
          StudentCode: this.sRec.StudentCode,
          ParentCode: this.sRec.ParentCode,
          ClassId: this.sRec.ClassId,
          StudentStatus: this.sRec.StudentStatus,
        });
      } else {
        await this.coreSrv.addStudent({
          StudentName: this.sRec.StudentName,
          StudentNumber: this.sRec.StudentNumber,
          Gender: this.sRec.Gender,
          SeatNo: this.sRec.SeatNo,
          LinkAccount: this.sRec.LinkAccount,
          StudentCode: this.sRec.StudentCode,
          ParentCode: this.sRec.ParentCode,
          ClassId: this.sRec.ClassId,
          StudentStatus: '1',
        });
      }

      try {
        if (this.sRec.StudentId) {
          await this.coreSrv.addLog('Record', '變更學生', `學生系統編號：${this.sRec.StudentId}。\n詳細資料：${JSON.stringify(this.sRec)}`);
        } else {
          await this.coreSrv.addLog('Record', '新增學生', `學生姓名：${this.sRec.StudentName}。\n詳細資料：${JSON.stringify(this.sRec)}`);
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
      message: '您確定要刪除嗎？',
      header: '刪除學生',
      acceptLabel: '刪除',
      rejectLabel: '取消',
      accept: () => this.delStudent(),
      acceptButtonStyleClass: 'bg-warning hover:bg-warning hover:bg-opacity-30',
      rejectButtonStyleClass: '',
      modalSize: ModalSize.MD,
    });
  }

  async delStudent() {
    this.errMsg = '';
    if (this.saving) { return; }

    try {
      this.saving = true;
      await this.coreSrv.setStudent256(['StudentId'], {
        StudentId: this.sRec.StudentId
      });

      try {
        await this.coreSrv.addLog('Record', '刪除學生', `學生系統編號：${this.sRec.StudentId}。\n詳細資料：${JSON.stringify(this.sRec)}`);
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

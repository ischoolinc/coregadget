import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core.service';
import { SchoolClassRec } from '../data/school-class';
import { StudentRec } from '../data/student';
import { StudentParent } from '../data/student-parent';
import { ConfirmDialogService } from '../shared/dialog/confirm-dialog.service';
import { ModalSize } from '../shared/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-edit-parent',
  templateUrl: './edit-parent.component.html',
  styleUrls: ['./edit-parent.component.scss']
})
export class EditParentComponent implements OnInit {

  mode: 'add' | 'edit' = 'add';
  saving = false;
  errMsg = '';
  pRec: StudentParent = {} as StudentParent;
  classList: SchoolClassRec[] = [];
  filteredClasses: SchoolClassRec[] = [];
  studentName = '';

  constructor(
    public dialogRef: MatDialogRef<EditParentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parent: StudentParent, student: StudentRec },
    private coreSrv: CoreService,
    public dialog: MatDialog,
    public confirmSrv: ConfirmDialogService,
  ) {
    this.pRec = data.parent;
    this.mode = (this.pRec.RelationId ? 'edit' : 'add');
    this.studentName = data.student.StudentName;
  }

  ngOnInit(): void {
  }

  async updateParent() {
    this.errMsg = '';
    if (this.saving) { return; }
    if (!this.data.student && this.data.student.StudentId) { this.errMsg = '缺少對應的學生資料'; return; }
    if (!this.pRec.LinkAccount) { this.errMsg = '登入帳號必填！'; return; }

    try {
      this.saving = true;

      if (this.pRec.RelationId) {
        await this.coreSrv.updateParent([{
          RelationId: this.pRec.RelationId,
          LastName: this.pRec.LastName,
          FirstName: this.pRec.FirstName,
          RelationName: this.pRec.RelationName,
          LinkAccount: this.pRec.LinkAccount,
        }]);
      } else {
        await this.coreSrv.addParent({
          StudentId: this.data.student.StudentId,
          LastName: this.pRec.LastName,
          FirstName: this.pRec.FirstName,
          RelationName: this.pRec.RelationName,
          LinkAccount: this.pRec.LinkAccount,
        });
      }

      try {
        if (this.pRec.RelationId) {
          await this.coreSrv.addLog('Record', '變更家長', `家長系統編號：${this.pRec.RelationId}。\n詳細資料：${JSON.stringify(this.pRec)}`);
        } else {
          await this.coreSrv.addLog('Record', '新增家長', `學生系統編號：${this.data.student.StudentId}。\n詳細資料：${JSON.stringify(this.pRec)}`);
        }
      } catch (error) { }

      this.dialogRef.close({ state: this.mode });
    } catch (error) {
      // console.log(error);

      let message = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
      const patt = new RegExp(' unique ');
      message = (patt.test(message)) ? `登入帳號「${this.pRec.LinkAccount}」重複` : message.replace('LinkAccount', '登入帳號');
      this.errMsg = message;
    } finally {
      this.saving = false;
    }
  }

  confirmDel() {
    this.confirmSrv.show({
      message: '永久刪除無法回復，您確定要刪除嗎？',
      header: '刪除家長',
      acceptLabel: '刪除',
      rejectLabel: '取消',
      accept: () => this.delParent(),
      acceptButtonStyleClass: 'bg-warning hover:bg-warning hover:bg-opacity-30',
      rejectButtonStyleClass: '',
      modalSize: ModalSize.MD,
    });
  }

  async delParent() {
    this.errMsg = '';
    if (this.saving) { return; }

    try {
      this.saving = true;
      await this.coreSrv.delParent(this.pRec.RelationId);

      try {
        await this.coreSrv.addLog('Record', '刪除家長', `家長系統編號：${this.pRec.RelationId}。\n詳細資料：${JSON.stringify(this.pRec)}`);
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

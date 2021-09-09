import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassRec, CoreService } from '../core.service';

@Component({
  selector: 'app-delete-class',
  templateUrl: './delete-class.component.html',
  styleUrls: ['./delete-class.component.scss']
})
export class DeleteClassComponent {

  deling = false;
  delErrMsg = '';
  doubleCheckValue = '';

  @ViewChild('checkInput') checkInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DeleteClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { classes: ClassRec[], mode: 'BATCH' | 'SINGLE' },
    private coreSrv: CoreService,
  ) { }

  async delClass() {
    this.delErrMsg = '';
    if (this.deling) { return; }
    if (!this.data.classes.length) { return; }
    if (this.doubleCheckValue !== '確認刪除') {
      this.delErrMsg = '請先輸入“確認刪除”後再點擊「刪除」鈕';
      this.checkInput.nativeElement.focus();
      return;
    }

    try {
      this.deling = true;
      await this.coreSrv.delClass(this.data.classes.map(v => v.ClassId));

      try {
        await this.coreSrv.addLog('Record', '刪除班級', `班級系統編號：${this.data.classes.map(v => v.ClassId).join(', ')}}。\n詳細資料：${JSON.stringify(this.data.classes)}`);
      } catch (error) { }

      this.dialogRef.close({ state: 'success' });
    } catch (error) {
      let msg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
      this.delErrMsg = msg;
    } finally {
      this.deling = false;
    }
  }
}

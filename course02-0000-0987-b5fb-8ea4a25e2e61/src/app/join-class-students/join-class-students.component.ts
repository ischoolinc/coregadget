import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core.service';
import { CourseRec } from '../data/course';

@Component({
  selector: 'app-join-class-students',
  templateUrl: './join-class-students.component.html',
  styleUrls: ['./join-class-students.component.scss']
})
export class JoinClassStudentsComponent {

  saving = false;
  joinErrMsg = '';
  doubleCheckValue = '';

  @ViewChild('checkInput') checkInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<JoinClassStudentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courses: CourseRec[], mode: 'BATCH' | 'SINGLE' },
    private coreSrv: CoreService,
  ) { }

  async joinStudent() {
    this.joinErrMsg = '';
    if (this.saving) { return; }
    if (!this.data.courses.length) { return; }
    if (this.doubleCheckValue !== '確認加入') {
      this.joinErrMsg = '請先輸入“確認加入”後再點擊「加入」鈕';
      this.checkInput.nativeElement.focus();
      return;
    }

    try {
      this.saving = true;
      await this.coreSrv.updateCourseAndTeacher(['CourseId'], this.data.courses.map(v => {
        return { CourseId: v.CourseId }
      }), true);

      try {
        await this.coreSrv.addLog('Record', '批次加入學生修課', `課程系統編號：${this.data.courses.map(v => v.CourseId).join(', ')}}。\n詳細資料：${JSON.stringify(this.data.courses)}`);
      } catch (error) { }

      this.dialogRef.close({ state: 'success' });
    } catch (error) {
      const msg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
      this.joinErrMsg = msg;
    } finally {
      this.saving = false;
    }
  }

}

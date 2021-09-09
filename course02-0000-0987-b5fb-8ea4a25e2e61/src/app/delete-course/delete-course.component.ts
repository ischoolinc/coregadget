import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core.service';
import { CourseRec } from '../data/course';

@Component({
  selector: 'app-delete-course',
  templateUrl: './delete-course.component.html',
  styleUrls: ['./delete-course.component.scss']
})
export class DeleteCourseComponent {

  deling = false;
  delErrMsg = '';
  doubleCheckValue = '';
  sceTakeTotal = 0;
  courseStudentTotal = 0;

  @ViewChild('checkInput') checkInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DeleteCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courses: CourseRec[], mode: 'BATCH' | 'SINGLE' },
    private coreSrv: CoreService,
  ) {
    this.sceTakeTotal = data.courses.reduce((acc: number, cur) => {
      return acc + (cur.SCETakeCount ? +cur.SCETakeCount : 0);
    }, 0);

    this.courseStudentTotal = data.courses.reduce((acc: number, cur) => {
      return acc + (cur.CourseStudentCount ? +cur.CourseStudentCount : 0);
    }, 0);
  }

  async delCourse() {
    this.delErrMsg = '';
    if (this.deling) { return; }
    if (!this.data.courses.length) { return; }
    if (this.doubleCheckValue !== '確認刪除') {
      this.delErrMsg = '請先輸入“確認刪除”後再點擊「刪除」鈕';
      this.checkInput.nativeElement.focus();
      return;
    }

    try {
      this.deling = true;
      await this.coreSrv.delCourse(this.data.courses.map(v => v.CourseId));

      try {
        await this.coreSrv.addLog('Record', '刪除課程', `課程系統編號：${this.data.courses.map(v => v.CourseId).join(', ')}}。\n詳細資料：${JSON.stringify(this.data.courses)}`);
      } catch (error) { }

      this.dialogRef.close({ state: 'success' });
    } catch (error) {
      this.delErrMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
    } finally {
      this.deling = false;
    }
  }
}

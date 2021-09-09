import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core.service';
import { CourseRec } from '../data/course';
import { StudentRec } from '../data/student';

@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.scss']
})
export class DeleteStudentComponent {

  deling = false;
  delErrMsg = '';
  doubleCheckValue = '';
  sceTakeTotal = 0;

  @ViewChild('checkInput') checkInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DeleteStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: CourseRec,  students: StudentRec[], mode: 'BATCH' | 'SINGLE' },
    private coreSrv: CoreService,
  ) {
    this.sceTakeTotal = data.students.reduce((acc: number, cur) => {
      return acc + (cur.SCETakeCount ? +cur.SCETakeCount : 0);
    }, 0);
  }

  async delStudent() {
    this.delErrMsg = '';
    if (this.deling) { return; }
    if (!this.data.students.length) { return; }
    if (this.doubleCheckValue !== '確認刪除') {
      this.delErrMsg = '請先輸入“確認刪除”後再點擊「刪除」鈕';
      this.checkInput.nativeElement.focus();
      return;
    }

    try {
      this.deling = true;
      await this.coreSrv.delCourseStudent(this.data.course.CourseId, this.data.students.map(v => v.StudentId));

      try {
        await this.coreSrv.addLog('Record', '刪除學生修課', `
          課程系統編號：${this.data.course.CourseId}
          \n學生系統編號：${this.data.students.map(v => v.StudentId).join(', ')}}。
          \n詳細資料：
          \n課程：${JSON.stringify(this.data.course)}
          \n修課學生：${JSON.stringify(this.data.students)}`);
      } catch (error) { }

      this.dialogRef.close({ state: 'success' });
    } catch (error) {
      this.delErrMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
    } finally {
      this.deling = false;
    }
  }
}

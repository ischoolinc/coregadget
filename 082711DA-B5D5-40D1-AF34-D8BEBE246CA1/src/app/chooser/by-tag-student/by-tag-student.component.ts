import { MatSnackBar } from '@angular/material/snack-bar';
import { TagPrefix } from './../data/tag';
import { Component, InjectionToken, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseService } from '../base.service';
import { SelectionResult, StudentRecord, StudentSelection } from '../data';
import { DialogActionService } from '../dialog-action.service';
import { ReceiversService } from '../receivers.service';
import { StudentsService } from '../students.service';

export const ByTagStudentComponent_INJECT_DATA = new InjectionToken<any>('app-by-tagstudent-inject-data');

@Component({
  selector: 'app-by-tag-student',
  templateUrl: './by-tag-student.component.html',
  styleUrls: ['./by-tag-student.component.scss']
})
export class ByTagStudentComponent implements OnInit {

  loading = false;
  processing = false;

  message: {text: string, msgClass: string | string[]} = {text: '', msgClass: ''};

  tagPrefixes: TagPrefix[];

  records: any;

  constructor(
    private dsa: BaseService,
    private students: StudentsService,
    private dialogActionSrv: DialogActionService,
    private receiversSrv: ReceiversService,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.loading = true;

    await this.students.ready();
    this.students.resetSelection();

    this.tagPrefixes = await this.dsa
      .getTags('STUDENT')
      .toPromise()

    this.tagPrefixes = this.tagPrefixes.sort((x, y) => {
      const xx = `${+x.DisplayOrder || Number.MAX_VALUE}:${x.ClassName}`;
      const yy = `${+y.DisplayOrder || Number.MAX_VALUE}:${y.ClassName}`;

      return xx.localeCompare(yy);
    });

    for(const cls of this.tagPrefixes) {
      cls.more=false;
      cls.students = cls
      .MemberIds.map(s => {
        return this.students.get(+s);
      })
      .sort((x,y) => {
        const xx = +x.SeatNo || Number.MAX_VALUE;
        const yy = +y.SeatNo || Number.MAX_VALUE;

        return xx - yy;
      });
    }

    this.loading = false;
  }

  @ViewChild('tplOuterDialogAction') set outerDialogAction(val: TemplateRef<any>) {
    this.dialogActionSrv.action$.next(val);
  }


  classBtnClick(cls: TagPrefix) {
    cls.students = cls.students.map(stu => {
      stu.checked = cls.checked;
      return stu;
    });
  }

  calcSelectedCount() {

  }

  confirm() {
    if (this.processing) { return; }

    this.processing = true;
    this.message = { text: '處理中...', msgClass: '' };

    this.records = this.students.getSelectedStudents();

    const selections: SelectionResult[] = [];
    for (const item of this.records) {
      if (!!item.checked) {
        selections.push(new StudentSelection(item as StudentRecord));
      }
    }

    if (selections.length) {
      this.receiversSrv.addReceivers(selections);
      this.message = { text: '加入完成！', msgClass: 'text-success' };
      this.snackBar.open("加入完成!", "", {
        duration: 2000,
      });
      this.processing = false;

    } else {
      this.processing = false;
    }
  }
    /**
   * 顯示要不要show 學生
   */
  toggleShow(classrRecord :TagPrefix)
  {
    classrRecord.more =  !classrRecord.more;
  }
}

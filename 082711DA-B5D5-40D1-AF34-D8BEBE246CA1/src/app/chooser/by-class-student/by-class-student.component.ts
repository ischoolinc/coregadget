import { StudentsService } from './../students.service';
import { StudentRecord } from './../data/student';
import { ClassRecord } from './../data/class';
import { BaseService } from './../base.service';
import { Component, InjectionToken, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogActionService } from '../dialog-action.service';
import { SelectionResult, StudentSelection } from '../data';
import { ReceiversService } from '../receivers.service';
import { DialogTitleService } from '../dialog-title.service';

export const ByClassStudentComponent_INJECT_DATA = new InjectionToken<any>('app-by-classstudent-inject-data');

@Component({
  selector: 'app-by-class-student',
  templateUrl: './by-class-student.component.html',
  styleUrls: ['./by-class-student.component.scss']
})
export class ByClassStudentComponent implements OnInit {

  loading = false;
  processing = false;

  message: {text: string, msgClass: string | string[]} = {text: '', msgClass: ''};

  classes: ClassRecord[];

  records: any;

  constructor(
    private dsa: BaseService,
    private students: StudentsService,
    private dialogActionSrv: DialogActionService,
    private receiversSrv: ReceiversService,
  ) { }

  @ViewChild('tplOuterDialogAction') set outerDialogAction(val: TemplateRef<any>) {
    this.dialogActionSrv.action$.next(val);
  }

  async ngOnInit(){
    this.loading = true;

    await this.students.ready();
    this.students.resetSelection();

    this.classes = await this.dsa
      .getAllClasses()
      .toPromise()

    this.classes = this.classes.sort((x, y) => {
      const xx = `${+x.DisplayOrder || Number.MAX_VALUE}:${x.ClassName}`;
      const yy = `${+y.DisplayOrder || Number.MAX_VALUE}:${y.ClassName}`;

      return xx.localeCompare(yy);
    });

    for(const cls of this.classes) {
      cls.students = cls
      .StudentIds.map(s => {
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

  classBtnClick(cls: ClassRecord) {
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
      setTimeout(() => {
        this.processing = false;
      }, 3000);
    } else {
      this.processing = false;
    }
  }
}

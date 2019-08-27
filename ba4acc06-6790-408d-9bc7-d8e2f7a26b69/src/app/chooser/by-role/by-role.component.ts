import { Component, OnInit, InjectionToken, Inject, ViewChild, TemplateRef } from '@angular/core';
import { InjectData, AllStudentSelection, AllTeacherSelection } from '../../data';
import { BaseService, ReceiversService, DialogTitleService, DialogActionService } from '../../core';
import { TeacherRecord, StudentRecord } from '../../data';

export const ByRoleComponent_INJECT_DATA = new InjectionToken<any>('app-by-role-inject-data');

@Component({
  selector: 'app-by-role',
  templateUrl: './by-role.component.html',
  styleUrls: ['./by-role.component.scss']
})
export class ByRoleComponent implements OnInit {
  loading = false;
  processing = false;
  message: {text: string, msgClass: string | string[]} = {text: '', msgClass: ''};
  selectionCount = 0;
  targetRole: string;
  records: TeacherRecord[] & StudentRecord[] = [];

  constructor(
    @Inject(ByRoleComponent_INJECT_DATA) private injectData: InjectData,
    private baseSrv: BaseService,
    private receiversSrv: ReceiversService,
    private dialogTitleSrv: DialogTitleService,
    private dialogActionSrv: DialogActionService,
  ) { }

  @ViewChild('tplOuterDialogTitle') set outerDialogTitle(val: TemplateRef<any>) {
    this.dialogTitleSrv.title$.next(val);
  }

  @ViewChild('tplOuterDialogAction') set outerDialogAction(val: TemplateRef<any>) {
    this.dialogActionSrv.action$.next(val);
  }

  async ngOnInit() {
    try {
      this.loading = true;
      let rsp;
      if (this.injectData.target === 'TEACHER') {
        this.targetRole = '全校老師';
        rsp = await this.baseSrv.getTeachers('All', '').toPromise();
      } else {
        this.targetRole = '全校學生';
        rsp = await this.baseSrv.getStudents('All', '').toPromise();
      }
      this.records = rsp;
      this.selectionCount = rsp.length;
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  confirm() {
    if (this.processing) { return; }

    this.processing = true;
    this.message = { text: '處理中...', msgClass: '' };

    if (this.injectData.target === 'TEACHER') {
      this.receiversSrv.addReceivers([new AllTeacherSelection(this.records)]);
    } else {
      this.receiversSrv.addReceivers([new AllStudentSelection(this.records)]);
    }

    this.message = { text: '加入完成！', msgClass: 'text-success' };
    setTimeout(() => {
      this.processing = false;
    }, 3000);
  }
}

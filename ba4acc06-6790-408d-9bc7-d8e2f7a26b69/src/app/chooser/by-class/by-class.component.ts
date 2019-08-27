import { Component, OnInit, InjectionToken, Inject, ViewChild, TemplateRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { InjectData, ClassRecord, SelectionResult, ClassSelection, AllGreadYearSelection } from '../../data';
import { BaseService, ReceiversService, DialogTitleService, DialogActionService } from '../../core';

export const ByClassComponent_INJECT_DATA = new InjectionToken<any>('app-by-class-inject-data');

export interface GradeYearMap {
  checked: boolean;
  gradeYear: string;
  count: number;
  classes: ClassRecord[];
}

@Component({
  selector: 'app-by-class',
  templateUrl: './by-class.component.html',
  styleUrls: ['./by-class.component.scss']
})
export class ByClassComponent implements OnInit {

  loading = false;
  processing = false;
  message: {text: string, msgClass: string | string[]} = {text: '', msgClass: ''};

  grades: GradeYearMap[];
  selectionCount = 0;
  targetRole: string;

  constructor(
    @Inject(ByClassComponent_INJECT_DATA) private injectData: InjectData,
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
    this.targetRole = this.injectData.target === 'TEACHER' ? '班導師' : '學生';
    try {
      this.loading = true;
      this.grades = await this.baseSrv.getAllClasses().pipe(
        map(classes => this.class2GradeRecords(classes))
      ).toPromise();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  private class2GradeRecords(classes: ClassRecord[]) {
    const gradeMap: Map<string, GradeYearMap> = new Map();
    classes.forEach(v => {
      if (v.GradeYear) {
        if (!gradeMap.has(v.GradeYear)) {
          gradeMap.set(v.GradeYear , {
            gradeYear: v.GradeYear,
            checked: false,
            classes: [] as ClassRecord[],
            count: 0
          });
        }

        v.Count = (this.injectData.target === 'TEACHER') ?
          (v.TeacherId ? 1 : 0)
            :
          (v.StudentIds.length);

        gradeMap.get(v.GradeYear).classes.push(v);
        gradeMap.get(v.GradeYear).count += v.Count;
      }
    });

    return Array.from(gradeMap.values());
  }

  /** 切換全選 */
  toggleAll(item: GradeYearMap) {
    item.classes.forEach(cls => {
      cls.checked = item.checked;
    });

    this.sumSelectionCount();
  }

  /** 單選項目後，同步變更全選狀態 */
  reflectClassSelection(item: GradeYearMap) {
    item.checked = item.classes
      .map(v => v.checked)
      .reduce((acc, cur) => acc && cur);

    this.sumSelectionCount();
  }

  /** 統計已選擇人數 */
  sumSelectionCount() {
    let total = 0;
    this.grades.forEach(value => {
      total += value.classes
        .filter(cls => cls.checked)
        .reduce((acc, cur) => acc += cur.Count, 0);
    });
    this.selectionCount = total;
  }

  confirm() {
    if (this.processing) { return; }

    this.processing = true;
    this.message = { text: '處理中...', msgClass: '' };

    const selections: SelectionResult[] = [];

    for (const item of this.grades) {
      if (!!item.checked) {
        selections.push(new AllGreadYearSelection(
          this.injectData.target,
          item.gradeYear,
          item.count,
          item.classes
        ));
        continue;
      }

      for (const cls of item.classes) {
        if (!!cls.checked) {
          selections.push(new ClassSelection(this.injectData.target, cls));
        }
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

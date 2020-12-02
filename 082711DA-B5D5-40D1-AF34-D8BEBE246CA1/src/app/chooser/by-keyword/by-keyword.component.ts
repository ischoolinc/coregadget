import { Component, OnInit, InjectionToken, Inject, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { InjectData, TeacherRecord, StudentRecord, TeacherSelection, StudentSelection, SelectionResult } from '../data';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { switchMap, debounceTime, distinctUntilChanged, startWith, filter, takeUntil } from 'rxjs/operators';
import { BaseService } from '../base.service';
import { ReceiversService } from '../receivers.service';
import { DialogTitleService } from '../dialog-title.service';
import { DialogActionService } from '../dialog-action.service';

export const ByKeywordComponent_INJECT_DATA = new InjectionToken<any>('app-by-keyword-inject-data');


@Component({
  selector: 'app-by-keyword',
  templateUrl: './by-keyword.component.html',
  styleUrls: ['./by-keyword.component.scss']
})
export class ByKeywordComponent implements OnInit, OnDestroy {

  loading = false;
  processing = false;
  message: {text: string, msgClass: string | string[]} = {text: '', msgClass: ''};
  selectionCount = 0;
  placeHolder: string;
  list: TeacherRecord[] & StudentRecord[] = []; // 篩選的結果
  records: any[]; // 加入的清單

  dispose$: Subject<any> = new Subject();
  searchControl = new FormControl('');

  constructor(
    @Inject(ByKeywordComponent_INJECT_DATA) private injectData: InjectData,
    private baseSrv: BaseService,
    private receiversSrv: ReceiversService,
    private dialogTitleSrv: DialogTitleService,
    private dialogActionSrv: DialogActionService,
  ) { }

  targetTemplate: TemplateRef<any>;
  @ViewChild('tplTeacherInfo', { static: true }) tplTeacherInfo: TemplateRef<any>;
  @ViewChild('tplStudentInfo', { static: true }) tplStudentInfo: TemplateRef<any>;

  @ViewChild('tplOuterDialogTitle') set outerDialogTitle(val: TemplateRef<any>) {
    this.dialogTitleSrv.title$.next(val);
  }

  @ViewChild('tplOuterDialogAction') set outerDialogAction(val: TemplateRef<any>) {
    this.dialogActionSrv.action$.next(val);
  }

  ngOnInit() {
    if (this.injectData.target === 'TEACHER') {
      this.placeHolder = '姓名、暱稱關鍵字';
      this.targetTemplate = this.tplTeacherInfo;
    } else {
      this.placeHolder = '姓名、學號關鍵字';
      this.targetTemplate = this.tplStudentInfo;
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(300), // 當 300 毫秒沒有新資料時，才進行搜尋
      distinctUntilChanged(), // 當「內容真正有變更」時，才進行搜尋
      filter(keyword => keyword.length > 0),
      switchMap((keyword) => {
        if (this.injectData.target === 'TEACHER') {
          return this.baseSrv.getTeachers('Keyword', keyword) as Observable<any>;
        } else {
          return this.baseSrv.getStudents('Keyword', keyword) as Observable<any>;
        }
      }),
      startWith([]),
      takeUntil(this.dispose$)
    ).subscribe(data => {
      this.list = data;
    });
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  confirm() {
    if (this.processing) { return; }

    this.processing = true;
    this.message = { text: '處理中...', msgClass: '' };

    this.records = this.list.filter((v: any) => v.checked);

    const selections: SelectionResult[] = [];
    for (const item of this.records) {
      if (!!item.checked) {
        if (this.injectData.target === 'TEACHER') {
          selections.push(new TeacherSelection(item as TeacherRecord));
        } else {
          selections.push(new StudentSelection(item as StudentRecord));
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

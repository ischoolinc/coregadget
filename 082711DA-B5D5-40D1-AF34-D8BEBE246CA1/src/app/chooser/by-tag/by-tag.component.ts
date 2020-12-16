import { Component, OnInit, InjectionToken, Inject, ViewChild, TemplateRef } from '@angular/core';
import { InjectData, ClassRecord, SelectionResult, TagPrefix, TagSelection, TagPrefixSelection } from '../data';
import { BaseService } from '../base.service';
import { DialogActionService } from '../dialog-action.service';
import { DialogTitleService } from '../dialog-title.service';
import { ReceiversService } from '../receivers.service';

export const ByTagComponent_INJECT_DATA = new InjectionToken<any>('app-by-tag-inject-data');

export interface GradeYearMap {
  checked: boolean;
  gradeYear: string;
  count: number;
  classes: ClassRecord[];
}

@Component({
  selector: 'app-by-tag',
  templateUrl: './by-tag.component.html',
  styleUrls: ['./by-tag.component.scss']
})
export class ByTagComponent implements OnInit {

  loading = false;
  processing = false;
  message: {text: string, msgClass: string | string[]} = {text: '', msgClass: ''};

  tagPrefixs: TagPrefix[];
  selectionCount = 0;
  targetRole: string;

  constructor(
    @Inject(ByTagComponent_INJECT_DATA) private injectData: InjectData,
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
      this.tagPrefixs = await this.baseSrv.getTags(this.injectData.target).toPromise();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  /** 切換全選 */
  toggleAll(item: TagPrefix) {
    item.Tags.forEach(tag => {
      tag.checked = item.checked;
    });

    this.sumSelectionCount();
  }

  /** 單選項目後，同步變更全選狀態 */
  reflectClassSelection(item: TagPrefix) {
    item.checked = item.Tags
      .map(v => v.checked)
      .reduce((acc, cur) => acc && cur);

    this.sumSelectionCount();
  }

  /** 統計已選擇人數 */
  sumSelectionCount() {
    // 將重複的 id 移除
    let allIds = [];
    this.tagPrefixs.forEach(prefix => {
      allIds = allIds.concat(prefix.Tags
        .filter(tag => tag.checked)
        .reduce((acc, cur) => acc = acc.concat(cur.MemberIds), []));
    });
    const unique = allIds.filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
    this.selectionCount = unique.length;
  }

  confirm() {
    if (this.processing) { return; }

    this.processing = true;
    this.message = { text: '處理中...', msgClass: '' };

    const selections: SelectionResult[] = [];

    for (const item of this.tagPrefixs) {
      if (!!item.checked) {
        selections.push(new TagPrefixSelection(
          this.injectData.target,
          item
        ));
        continue;
      }

      for (const tag of item.Tags) {
        if (!!tag.checked) {
          selections.push(new TagSelection(this.injectData.target, tag));
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


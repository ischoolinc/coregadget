import { Component, OnInit, Inject, Injector, TemplateRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatButtonToggleChange } from '@angular/material';

import { Portal, ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import { ByRoleComponent, ByRoleComponent_INJECT_DATA } from './by-role/by-role.component';
import { ByClassComponent, ByClassComponent_INJECT_DATA } from './by-class/by-class.component';
import { ByKeywordComponent, ByKeywordComponent_INJECT_DATA } from './by-keyword/by-keyword.component';
import { ByTagComponent, ByTagComponent_INJECT_DATA } from './by-tag/by-tag.component';
import { DialogTitleService } from '../core';
import { observeOn, takeUntil } from 'rxjs/operators';
import { asapScheduler, Subject } from 'rxjs';
import { DialogActionService } from '../core/dialog-action.service';


@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.scss'],
  providers: [DialogTitleService]
})
export class ChooserComponent implements OnInit, OnDestroy {

  dispose$ = new Subject();

  target: string;
  selectedPortal: Portal<any>;
  selectedDialogTitle: TemplateRef<any>;
  selectedDialogAction: TemplateRef<any>;
  @ViewChild('tplMain') tplMain: TemplateRef<any>;
  processing = false;
  message = '請選擇上方任一方式加入';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChooserComponent>,
    private injector: Injector,
    private dialogTitleSrv: DialogTitleService,
    private DialogActionSrv: DialogActionService,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this.target = data.target;
  }

  ngOnInit() {
    // 設定
    this.dialogTitleSrv.title$.pipe(
      observeOn(asapScheduler),
      takeUntil(this.dispose$)
    )
    .subscribe(v => {
      this.selectedDialogTitle = v;
    });

    this.DialogActionSrv.action$.pipe(
      observeOn(asapScheduler),
      takeUntil(this.dispose$)
    )
    .subscribe(v => {
      this.selectedDialogAction = v;
    });

    this.setPortal('main');
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  /** 選擇加入的方式 */
  toggleBtn(e: MatButtonToggleChange) {
    this.setPortal(e.value);
  }

  /** 切換 Portal 內容 */
  async setPortal(val: string) {
    let injector: PortalInjector;

    switch (val) {
      case 'AllTeacher':
        injector = this._createInjector(ByRoleComponent_INJECT_DATA, { dialogRef: this.dialogRef, target: this.target });
        this.selectedPortal = new ComponentPortal(ByRoleComponent, undefined, injector);
        break;
      case 'AllStudent':
        injector = this._createInjector(ByRoleComponent_INJECT_DATA, { dialogRef: this.dialogRef, target: this.target });
        this.selectedPortal = new ComponentPortal(ByRoleComponent, undefined, injector);
        break;
      case 'Class':
        injector = this._createInjector(ByClassComponent_INJECT_DATA, { dialogRef: this.dialogRef, target: this.target, type: 'Group' });
        this.selectedPortal = new ComponentPortal(ByClassComponent, undefined, injector);
        break;
      case 'Tag':
        injector = this._createInjector(ByTagComponent_INJECT_DATA, { dialogRef: this.dialogRef, target: this.target, type: 'Group' });
        this.selectedPortal = new ComponentPortal(ByTagComponent, undefined, injector);
        break;
      case 'ByKeyword':
        injector = this._createInjector(ByKeywordComponent_INJECT_DATA, { dialogRef: this.dialogRef, target: this.target });
        this.selectedPortal = new ComponentPortal(ByKeywordComponent, undefined, injector);
        break;
      default:
        this.selectedPortal = new TemplatePortal(this.tplMain, this._viewContainerRef);
    }
  }

  /** 建立包含自訂 Token 的 PortalInjector */
  private _createInjector(key: object, value: any): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(key, value);
    return new PortalInjector(this.injector, injectionTokens);
  }
}

import { Component, OnInit, OnDestroy, Injector, ViewChild, TemplateRef } from '@angular/core';
import { SelectionResult } from 'src/app/data';
import { ReceiversService } from '../../core/receivers.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-receiver-list',
  templateUrl: './receiver-list.component.html',
  styleUrls: ['./receiver-list.component.scss']
})
export class ReceiverListComponent implements OnInit, OnDestroy {

  dispose$ = new Subject();

  constructor(
    private receiversSrv: ReceiversService,
    private injector: Injector,
    private dialog: MatDialog,
  ) { }

  receivers: SelectionResult[];
  @ViewChild('tplLoading') tplLoading: TemplateRef<any>;

  ngOnInit() {
    // 訂閱收件者清單
    this.receiversSrv.receivers$.pipe(
      takeUntil(this.dispose$)
    ).subscribe(receivers => {
      this.receivers = receivers;
    });
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  removeSelectionItem(item: SelectionResult) {
    this.receiversSrv.removeReceiver(item);
  }

  async showDetail(item: SelectionResult) {

    if (!item.previewable) { return; }

    const loadingDialog = this.dialog.open(this.tplLoading);
    await item.previewData(this.injector);
    loadingDialog.close();
  }

}

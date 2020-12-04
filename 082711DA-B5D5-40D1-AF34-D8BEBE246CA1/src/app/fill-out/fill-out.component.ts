import { DatesLeaveInfo, Period } from './../vo';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contract, GadgetService } from '../gadget.service';
import { LeavePeriodInfo } from '../vo';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SelectionResult } from '../chooser/data';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ReceiversService } from '../chooser/receivers.service';
import { takeUntil } from 'rxjs/operators';
import { ChooserComponent } from '../chooser/chooser.component';

@Component({
  selector: 'app-fill-out',
  templateUrl: './fill-out.component.html',
  styleUrls: ['./fill-out.component.scss']
})
export class FillOutComponent implements OnInit, OnDestroy {

  con: Contract | undefined;
  Periods: Period[] = [];
  LeaveDateInfos: DatesLeaveInfo[] = [];
  SelectDate = '';
  showInfoSection = false;

  items: SelectionResult[];

  constructor(
    private dsa: GadgetService,
    private dialog: MatDialog,
    private receiver: ReceiversService
    ) {
  }

  dispose: Subscription;

  async ngOnInit(): Promise<void> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    this.loadPeriod(); // 1.取得節次對照表

    this.dispose = this.receiver.receivers$
      .subscribe(v => {
        console.log(v);
        this.items = v;
      });
  }

  ngOnDestroy() {
    this.dispose.unsubscribe();
  }

  /**
   * 取得 節次對照表
   */
  async loadPeriod(): Promise<void> {
    const resp = await this.con?.send('GetPeriodTable');
    this.Periods = [].concat(resp.Periods.Period);
  }
  /**
   * 加入日期後顯示於上面
   * @param event ??
   */
  addDate(event: MatDatepickerInputEvent<Date>): void {

    const datesLeaveInfo: DatesLeaveInfo = new DatesLeaveInfo(event.value?.toString() || '', this.Periods);
    this.LeaveDateInfos.push(datesLeaveInfo);

  }


  /**
   * 點選請公假
   */
  toggle(target: LeavePeriodInfo): void {
    if (target.Abbreviation === '-') {
      target.Absence = '公假';
      target.Abbreviation = '公';
    } else if (target.Abbreviation === '公') {
      target.Absence = '';
      target.Abbreviation = '-';
    }

    console.log(target);
  }

  /**
   * 點選日期時全部選取
   */
  selectAllPeriod(DateInfo: DatesLeaveInfo): void {
    if (DateInfo.getCheckCount() !== DateInfo.getLeaveInfosLen()) // 如果都沒有選就全選
    {
      DateInfo.LeaveInfos.forEach(period => {
        period.Abbreviation = '公';
      });
    } else {
      DateInfo.LeaveInfos.forEach(period => {
        period.Abbreviation = '-';
      });


    }
  }

  /**
   * 刪除日期
   */
  removeAllDate(dateInfo: DatesLeaveInfo): void {
    console.log('dateInfo', dateInfo);
    const index = this.LeaveDateInfos.findIndex(
      (period) => period.Date === dateInfo.Date
    );

    this.LeaveDateInfos.splice(index, 1);
  }
  async save(): Promise<any>{
    // debugger
    console.log('json', JSON.stringify(this.LeaveDateInfos));
    const resp = await this.con?.send('_.GetPeriodTable', {
      Content: JSON.stringify(this.LeaveDateInfos)
    });
  }
  /**
   * 顯示資訊
   */
  infoShow(): void {
    this.showInfoSection = true;
  }

  infoHidden(): void {
    this.showInfoSection = false;
  }

  chooseStudent(): void {
    this.dialog.open<ChooserComponent, {}, SelectionResult[]>(ChooserComponent, {
      data: { target: 'STUDENT' },
      width: '80%',
      disableClose: false,
    });
  }

  removeItem(item: SelectionResult) {
    this.receiver.removeReceiver(item);
  }
}

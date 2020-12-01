import { DatesLeaveInfo, Period } from './../vo';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Contract, GadgetService } from '../gadget.service';
import { LeavePeriodInfo } from '../vo';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-fill-out',
  templateUrl: './fill-out.component.html',
  styleUrls: ['./fill-out.component.scss']
})
export class FillOutComponent implements OnInit {

  con: Contract | undefined;
  Periods: Period[] = [];
  LeavveDateInfos: DatesLeaveInfo[] = [];
  SelectDate = '';
  showInfoSection = false ;

  constructor(private dsa: GadgetService) {
  }

  async ngOnInit(): Promise<void> {
    this.con = await this.dsa.getContract('ischool.leave.teacher');
    this.loadPeriod(); // 1.取得節次對照表


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
   * @param event
   */
  addDate(event: MatDatepickerInputEvent<Date>): void {

    const datesLeaveInfo: DatesLeaveInfo = new DatesLeaveInfo(event.value?.toString() || '', this.Periods);
    this.LeavveDateInfos.push(datesLeaveInfo);

  }


  /**
   * 點選請公假
   */
  toggle(target: LeavePeriodInfo): void {
    if (target.Abbreviation === '-') {
      target.Abbreviation = '公';
    } else if (target.Abbreviation === '公') {
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
    console.log("dateInfo",dateInfo);
   const index = this.LeavveDateInfos.findIndex(
      (period) => period.Date === dateInfo.Date
    );

    this.LeavveDateInfos.splice(index,1);
  }


  /**
   * 顯示資訊
   */
  infoShow(): void {
  this.showInfoSection = true ;
  }

  infoHidden(): void {
    this.showInfoSection = false ;
  }
}

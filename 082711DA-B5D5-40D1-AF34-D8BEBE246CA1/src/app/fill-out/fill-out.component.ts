import { ListControlService } from './../front-page/ListControl.service';
import { FrontPageComponent } from './../front-page/front-page.component';
import { ClassStudentRecord } from './../chooser/data/class-student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentRecord } from './../chooser/data/student';
import { DatesInfo, Record, Period, PeriodInfo, Student } from './../vo';
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
import { stringify } from 'querystring';
import { DataService } from '../Service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fill-out',
  templateUrl: './fill-out.component.html',
  styleUrls: ['./fill-out.component.scss']
})
export class FillOutComponent implements OnInit, OnDestroy {

  con: Contract | undefined;
  ActionType: string;

  // LeaveDateInfos: DatesLeaveInfo[] = [];
  /**
   * 存放申請過的歷史資料
   */
  CurrentRecordForedit: Record;
  HisRecords: Record[] = [];
  SelectDate = '';
  showInfoSection = false;
  items: SelectionResult[]; // 選取得學生從 receiver 來的
  SelectStudentlist: StudentRecord[] = []; // 選取的學生
  // item_Json: string;
  constructor(
    private dsa: GadgetService,
    private dialog: MatDialog,
    private receiver: ReceiversService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private listCtl: ListControlService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private receiversSrv: ReceiversService
  ) {
  }

  dispose: Subscription; // 訂閱的事件
  async ngOnInit(): Promise<void> {

    // 判斷新增或編輯
    this.route.paramMap.subscribe(param => {
      this.ActionType = param.get('action');
    });

    // rxjs
    this.dispose = this.receiver.receivers$
      .subscribe(v => {
        this.items = v;
        // this.packStudentData();
      });


    this.con = await this.dsa.getContract('ischool.leave.teacher'); // 取得con
    // 1.如果是編輯

    await this.setMainRecord();

  }


  ngOnDestroy(): void {
    this.dispose.unsubscribe();
  }

  /**
   * 初始化 CurrentRecord 物件
   */
  async setMainRecord() {


    if (this.ActionType === 'edit') {
      this.CurrentRecordForedit = await this.dataService.getCurrentRecord();
      this.CurrentRecordForedit.contentObj.Reason = await this.CurrentRecordForedit.contentObj.Reason;
    } else {
      // 新增的secction
      this.CurrentRecordForedit = new Record();

      await this.loadPeriod(); // 1.取得節次對照表
    }

  }




  /**
   * 取得 節次對照表
   */
  async loadPeriod(): Promise<void> {
    const resp = await this.con?.send('GetPeriodTable');
    this.CurrentRecordForedit.contentObj.PeriodShow = ([].concat(resp.Periods.Period)).map(period => period.Name);
  }
  /**
   * 加入日期後顯示於上面
   * @param event ??
   */
  addDate(event: MatDatepickerInputEvent<Date>): void {

    const datesLeaveInfo: DatesInfo = new DatesInfo(event.value?.toString() || '', this.CurrentRecordForedit.contentObj.PeriodShow);
    this.CurrentRecordForedit.contentObj.Dates.push(datesLeaveInfo);


  }


  /**
   * 點選後顯示 '公'或是 '-'
   */
  toggle(target: LeavePeriodInfo): void {
    if (target.Abbreviation === '-' || target.Abbreviation === '') {
      target.Absence = '公假';
      target.Abbreviation = '公';
    } else if (target.Abbreviation === '公') {
      target.Absence = '';
      target.Abbreviation = '-';
    }
  }

  /**
   *
   * 選擇所有節次
   * @memberof FillOutComponent
   */
  selectEachDateSPeriod(periodSelect: string) {
    let totalCount = this.CurrentRecordForedit.contentObj.Dates.length;
    let checkCount = 0;

    this.CurrentRecordForedit.contentObj.Dates.forEach(date => {
      date.Periods.forEach(period => {
        if (period.Period === periodSelect) {
          if (period.Abbreviation === '公') {
            checkCount++;
          }
        }
      });
    });

    // 開始做切換
    this.CurrentRecordForedit.contentObj.Dates.forEach(date => {
      date.Periods.forEach(period => {
        if (period.Period === periodSelect) {
          if (checkCount === totalCount) {
            date.MapPeriods.get(period.Period).Abbreviation ='-'
            date.MapPeriods.get(period.Period).Absence =''
            period.Absence = ''
            period.Abbreviation = ''
          } else {
            period.Absence = '公假'
            period.Abbreviation = '公'
            date.MapPeriods.get(period.Period).Abbreviation ='公'
            date.MapPeriods.get(period.Period).Absence ='公假'
          }
        }
      });
    });

  }

  /**
   * 點選日期時全部選取
   */
  selectAllPeriod(dateInfo: DatesInfo): void {
    let checkCount: number = 0;
    let pariodInfoaccount: number = dateInfo.Periods.length;

    // 算一下總共有選多少  如果目前沒有權選就可以全選
    dateInfo.Periods.forEach(period => {
      if (period.Abbreviation === '公') {
        checkCount++;
      }
    });
    if (checkCount !== pariodInfoaccount) // 如果都沒有選就全選
    {
      dateInfo.Periods.forEach(period => {
        dateInfo.MapPeriods.get(period.Period).Abbreviation ='公'
        dateInfo.MapPeriods.get(period.Period).Absence ='公假'
        period.Abbreviation = '公';
        period.Absence='公假';
      });
    } else {
      dateInfo.Periods.forEach(period => {
        period.Abbreviation = '-';
        period.Absence='';
        dateInfo.MapPeriods.get(period.Period).Abbreviation ='-'
        dateInfo.MapPeriods.get(period.Period).Absence =''

      });
    }
  }

  /**
   * 刪除日期
   */
  removeAllDate(dateInfo: DatesInfo): void {
    const index = this.CurrentRecordForedit.contentObj.Dates.findIndex(
      (period) => period.Date === dateInfo.Date
    );
    this.CurrentRecordForedit.contentObj.Dates.splice(index, 1);
  }
  /**
   * 按下儲存
   */
  async save(): Promise<any> {

    if (!this.checkData()) {
      return;
    }
    const result = this.getSendData(this.items, this.CurrentRecordForedit); // 整理資料
    if (this.ActionType === 'edit') { // 如果是編輯
      const resp = await this.con?.send('_.UpdateAnnualLeaveRecord', {
        UID: this.CurrentRecordForedit.uid,
        Content: JSON.stringify(result)
      });
    } else // 如果是新增
    {
      const resp = await this.con?.send('_.AddAnnualLeaveRecord', {
        Content: JSON.stringify(result)
      });
    }

    if (this.ActionType == 'edit') {
      this.router.navigate(['']);
    } else {
      this.setMainRecord();
      this.listCtl.refreshList();
    }
    // reload 畫面
  }

  /**
   *
   * 確認是否該填寫的都填寫了
   * @memberof FillOutComponent
   */
  checkData(): boolean {
    if (this.CurrentRecordForedit.contentObj.Dates.length === 0) {
      this.openSnackBar('請選擇日期!', '確定');
      return false;
    } else if (this.items.length === 0) {

      this.openSnackBar('請選擇學生!', '確定');
      return false;
    }else if(!this.CurrentRecordForedit.contentObj.Reason )
    {

      this.openSnackBar('請填寫事由!', '確定');
      return false;
    }
    return true
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
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



  /**
   * 整理要send 出去得物件
   *
   * @memberof FillOutComponent
   */
  getSendData(selectStuds: SelectionResult[], record: Record): any {
    const content = {
      Reason: record.contentObj.Reason,
      Students: [],
      Dates: []
    };
    const Students: any[] = [];
    const Dates: any[] = [];

    // 1.打包學生
    selectStuds.forEach(stu => {

      content.Students.push({
        id: stu['student']['Id'],
        student_number: stu['student']['StudentNumber'],
        seat_no: stu['student']['SeatNo'],
        name: stu['student']['StudentName'],
        class_name: stu['student']['ClassName']
      });
    });

    // 2.打包日期
    record.contentObj.Dates.forEach(date => {
      const periods = [];
      date.Periods.forEach(period => {
        periods.push({
          Period: period.Period,
          Absence: period.Abbreviation !== '-' ? '公假' : '',
          Abbreviation: period.Abbreviation !== '-' ? period.Abbreviation : ''
        });
      });
      content.Dates.push({
        Date: date.Date,
        Periods: periods
      });

    });
    return content;
  }


  /**
   *
   *
   * @memberof FillOutComponent
   */
  getPeriodInfo(period: string, periodMap: Map<string, PeriodInfo>): PeriodInfo {
    let result: any;
    if (periodMap.has(period)) {
      result = periodMap.get(period);
    }
    return result;
  }
}

import { HelperService } from './../Service/helper.service';
import { ListControlService } from './../front-page/ListControl.service';
import { FrontPageComponent } from './../front-page/front-page.component';
import { ClassStudentRecord } from './../chooser/data/class-student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentRecord } from './../chooser/data/student';
import { DatesInfo, Record, Period, PeriodInfo, Student, IStudent } from './../vo';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-fill-out',
  templateUrl: './fill-out.component.html',
  styleUrls: ['./fill-out.component.scss']
})
export class FillOutComponent implements OnInit, OnDestroy {

  con: Contract | undefined;
  actionType: string;
  recordId: string;

  // LeaveDateInfos: DatesLeaveInfo[] = [];
  /**
   * 存放申請過的歷史資料
   */
  selectDate = new FormControl(null); // 初始化DatePicker 的日期
  seletDate='';
  currentRecordForedit: Record;
  hisRecords: Record[] = [];
  showInfoSection = false;
  items: SelectionResult[]; // 選取得學生從 receiver 來的
  SelectStudentlist: StudentRecord[] = []; // 選取的學生
  // item_Json: string;
  constructor(
    private dialog: MatDialog,
    private dsa: GadgetService,
    private receiver: ReceiversService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private listCtl: ListControlService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private receiversSrv: ReceiversService,
    public helperService:HelperService,


  ) { }

  dispose: Subscription; // 訂閱的事件

  async ngOnInit(): Promise<void> {

    this.receiver.resetReceivers();

    // 判斷新增或編輯
    this.route.paramMap.subscribe(async param => {
      this.actionType = param.get('action');
      this.recordId = param.get('id');

      this.con = await this.dsa.getContract('ischool.leave.teacher'); // 取得con
      await this.setMainRecord(this.recordId);
    });

    // rxjs
    this.dispose = this.receiver.receivers$
      .subscribe(v => {
        // 學生沒有
        this.items = v.filter(stu => {
          return this.couldBeAdded(stu['student']['Id']);
        }
        );
      });
  }

  ngOnDestroy(): void {
    this.dispose.unsubscribe();
  }

  /**
   * 初始化 CurrentRecord 物件
   */
  async setMainRecord(id?: string) {

    if (this.actionType === 'edit') {
      const record = this.dataService.HisRecords.find(v => v.uid == id);
      this.currentRecordForedit = record
      this.currentRecordForedit.contentObj.Reason = this.currentRecordForedit.contentObj.Reason;
    } else {
      // 新增的secction
      this.currentRecordForedit = new Record();
      this.items = [];
      this.selectDate =new FormControl(null);
      await this.loadPeriod(); // 1.取得節次對照表
    }
  }

  /**
   * 取得 節次對照表
   */
  async loadPeriod(): Promise<void> {
    const resp = await this.con?.send('GetPeriodTable');
    this.currentRecordForedit.contentObj.PeriodShow = ([].concat(resp.Periods.Period)).map(period => period.Name);
  }

  /**
   * 加入日期後顯示於上面
   * @param event ??
   */
  addDate(event: MatDatepickerInputEvent<Date>): void {

    this.selectDate=new FormControl(event.value);

    console.log('546',this.selectDate);
    console.log('546',event.value?.toString() );

    const datesLeaveInfo: DatesInfo = new DatesInfo(event.value?.toString() || '', this.currentRecordForedit.contentObj.PeriodShow);
    this.currentRecordForedit.contentObj.Dates.push(datesLeaveInfo);
  }


  /**
   * 點選後顯示 '公'或是 '-'
   */
  toggle(target: LeavePeriodInfo): void {
    if (target.Abbreviation === ''  ) {
      target.Absence = '公假';
      target.Abbreviation = '公';
    } else if (target.Abbreviation === '公') {
      target.Absence = '';
      target.Abbreviation = '';
    }
  }

  /**
   *
   * 選擇所有節次
   * @memberof FillOutComponent
   */
  selectEachDateSPeriod(periodSelect: string) {
    let totalCount = this.currentRecordForedit.contentObj.Dates.length;
    let checkCount = 0;

    this.currentRecordForedit.contentObj.Dates.forEach(date => {
      date.Periods.forEach(period => {
        if (period.Period === periodSelect) {
          if (period.Abbreviation === '公') {
            checkCount++;
          }
        }
      });
    });

    // 開始做切換
    this.currentRecordForedit.contentObj.Dates.forEach(date => {
      date.Periods.forEach(period => {
        if (period.Period === periodSelect) {
          if (checkCount === totalCount) {
            date.MapPeriods.get(period.Period).Abbreviation = ''
            date.MapPeriods.get(period.Period).Absence = ''
            period.Absence = ''
            period.Abbreviation = ''
          } else {
            period.Absence = '公假'
            period.Abbreviation = '公'
            date.MapPeriods.get(period.Period).Abbreviation = '公'
            date.MapPeriods.get(period.Period).Absence = '公假'
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
    checkCount = this.getSelectPeriodCount(dateInfo.Periods);

    if (checkCount !== pariodInfoaccount) // 如果都沒有選就全選
    {
      dateInfo.Periods.forEach(period => {
        dateInfo.MapPeriods.get(period.Period).Abbreviation = '公'
        dateInfo.MapPeriods.get(period.Period).Absence = '公假'
        period.Abbreviation = '公';
        period.Absence = '公假';
      });
    } else {
      dateInfo.Periods.forEach(period => {
        period.Abbreviation = '';
        period.Absence = '';
        dateInfo.MapPeriods.get(period.Period).Abbreviation = ''
        dateInfo.MapPeriods.get(period.Period).Absence = ''

      });
    }
  }

  /**
   * 刪除日期
   */
  removeAllDate(dateInfo: DatesInfo): void {
    const index = this.currentRecordForedit.contentObj.Dates.findIndex(
      (period) => period.Date === dateInfo.Date
    );
    this.currentRecordForedit.contentObj.Dates.splice(index, 1);
  }

  /**
   * 取消
   */
  cancel() {
    this.router.navigate(['']);
  }
  /**
   * 按下儲存
   */
  async save(): Promise<any> {



    // 1.檢查資料
    if (!this.checkData()) {
      return;
    }

    if(this.actionType==='edit'){ //如果是編輯模式
      if (!window.confirm("修改假單內容會使「假單編號」改變，若不修改假單內容請按「取消」")) {
       return ;
      }
    }

    const result = this.getSendData(this.items, this.currentRecordForedit); // 整理資料
    if (this.actionType === 'edit') { // 如果是編輯

      try {
        const resp = await this.con?.send('_.UpdateAnnualLeaveRecord', {
          UID: this.currentRecordForedit.uid,
          Content: JSON.stringify(result)
        });
      } catch (ex) {
        alert('編輯發生錯誤!');
      }

      this.router.navigate(['']);

    } else // 如果是新增
    {
      try {
        const resp = await this.con?.send('_.AddAnnualLeaveRecord', {
          Content: JSON.stringify(result)
        });
      } catch {
        alert('新增發生錯誤!');
      }
      this.setMainRecord();
      this.listCtl.refreshList();
    }
  }

  /**
   *
   * 檢查是否該填寫的都填寫了
   * @memberof FillOutComponent
   */
  checkData(): boolean {

    if (this.currentRecordForedit.contentObj.Dates.length === 0) {
      this.openSnackBar('請選擇日期!', '確定');
      return false;
    } else if (this.items.length === 0 && this.currentRecordForedit.contentObj.Students.length === 0) {

      this.openSnackBar('請選擇學生!', '確定');
      return false;
    } else if (!this.currentRecordForedit.contentObj.Reason) {

      this.openSnackBar('請填寫事由!', '確定');
      return false;
    }

    // 確認所有日期下有沒有選擇 公假 如果有某個日期下的節次沒有選的話就要

    const periodErrorMessage: string[] = [];
    this.currentRecordForedit.contentObj.Dates.forEach(date => {
      const checkedCount = this.getSelectPeriodCount(date.Periods);
      if (checkedCount == 0) {
        periodErrorMessage.push(` ${this.helperService.getFormatDateString(date.Date)} `);
      }
    });

    if (periodErrorMessage.length > 0) {

      this.openSnackBar(`請勾選${periodErrorMessage.join('、')}節次 !`, '確定');
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

  removeItemDB(item: IStudent) {
    const { contentObj: { Students } } = this.currentRecordForedit;

    this.currentRecordForedit.contentObj.Students = Students.filter(v => v.id !== item.id);

  }


  /**
   * 整理要send 出去得物件
   *
   * @memberof FillOutComponent
   */
  getSendData(selectStuds: SelectionResult[], record: Record): any {
    const content = {
      Reason: record.contentObj.Reason,
      Students: [...record?.contentObj?.Students] || [], //處理原本學生
      Dates: []
    };
    const Students: any[] = [];
    const Dates: any[] = [];

    // 1.打包學生
    selectStuds.forEach(stu => {
      // 確認是否有勾選
      const student = content.Students.find(student => {
        student.id == stu['student']['Id'];
      });

      //如果是編輯

      content.Students.push({
        id: stu['student']['Id'],
        student_number: stu['student']['StudentNumber'],
        seat_no: stu['student']['SeatNo'],
        name: stu['student']['StudentName'],
        class_name: stu['student']['ClassName']
      });

      // content.Students.push({
      //   id: stu['student']['Id'],
      //   student_number: stu['student']['StudentNumber'],
      //   seat_no: stu['student']['SeatNo'],
      //   name: stu['student']['StudentName'],
      //   class_name: stu['student']['ClassName']
      // });

    });

    // 2.打包日期
    record.contentObj.Dates.forEach(date => {
      const periods = [];
      date.Periods.forEach(period => {
        periods.push({
          Period: period.Period,
          Absence: period.Abbreviation !== '' ? '公假' : '',
          Abbreviation: period.Abbreviation !== '' ? period.Abbreviation : ''
        });
      });
      content.Dates.push({
        Date: date.Date,
        Periods: periods
      });

    });
    return content;
  }

  get students(): IStudent[] {
    return this.currentRecordForedit?.contentObj?.Students || [];
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


  /**
  * 取得有點選公假的數量
  */
  getSelectPeriodCount(leavePeriodInfo: LeavePeriodInfo[]): number {
    let checkedCount = 0;
    leavePeriodInfo.forEach(periodInfo => {
      if (periodInfo.Abbreviation === '公') {
        checkedCount++;
      }
    });
    return checkedCount;
  }

  /**
  * 確認是否舊資料已經有選擇此學生
  */
  couldBeAdded(selectionItemID: string): boolean {
    let result  ;
    result = this.students.find(x => x.id == selectionItemID);
    if (!result) {// 原本沒有才可以加
      return true ;
    }else{

      return false ;
    }

  }
}

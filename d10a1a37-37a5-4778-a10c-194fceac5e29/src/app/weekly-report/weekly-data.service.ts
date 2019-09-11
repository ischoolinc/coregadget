import { Injectable } from '@angular/core';
import { WeeklyReportEntry } from './weekly_report/weeklyReportEntry';
import { GadgetService, Contract } from 'src/app/gadget.service';

@Injectable({
  providedIn: 'root'
})
export class WeeklyDataService {

  contract: Contract;

  constructor(private gadget: GadgetService) {        
    this.getTeacherInfo() ;

  }

  async getTeacherInfo() {
   
    this.contract = await this.gadget.getContract('kcis');

    try {
      // 呼叫 service。

      // const data = await this.contract.send('weekly.GetMyInfo');

      const rsp = await this.contract.send('weekly.GetMyInfo', {
        Request: {         
        }
      })

      this.teacherName = rsp.TeacherName;
      // console.log(rsp.TeacherName);

    } catch (err) {
      console.log(err);
    } finally {
      
    }
    
  }

  // 教師名稱
  public teacherName: string = "";

  // 已讀統計
  public weeklyReportHasReadCountLst: any;

  // 目前課程WeeklyReport
  public currentCousreWeeklyReportList: any;

  public addWeeklyReportEntry: WeeklyReportEntry;

  public studentWeeklyDataList: any;

  // Add 使用的學生
  public addStudentsList: any;

  // Add 使用的學生評語
  public addBehavoirList: any;

  // Add 使用的Gradebook
  public addGradebookList: any;

  // 使用這畫面已選
  public addSelectdGradebook: any;

  // Add 畫面1 Button 是否可以使用
  public addS1ButtonEnable: boolean = true;
  // Add 畫面2 Button 是否可以使用
  public addS2ButtonEnable: boolean = true;

  // 在編輯過程中存的uid
  public selectWeeklyReportUID = "";

  // 在編輯過程用到上次資料庫取得資料
  public selectWeeklyData: any;
}

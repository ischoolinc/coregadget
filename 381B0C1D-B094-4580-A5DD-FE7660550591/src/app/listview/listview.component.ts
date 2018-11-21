import { GadgetService, Contract } from '../gadget.service'
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; 

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.css']
})
export class ListviewComponent implements OnInit {

  count:number = 0;
  uid:any;
  inputDateString : string;
  loading: boolean;
  error: any;
  dataRow: any[];
  colKeys: string[];
  contract : Contract;
  columns = {
    StudentNumber:'學號',
    StudentName:'學生姓名',
    ClassName:'班級',
    ClassTeacher:'班導師',
    ClassTeacherEmail:'班導師郵件',
    CourseName:'課程名稱',
    TeacherWhoWrite:'紀錄老師',
    Comment:'評論',
    RequiresAttention:'需注意',
    NotifySchool:'需通知學校',
    NotifyParent:'需通知家長',
    MailSendSchool:'已通知學校',
    MailSendParent:'已通知家長',
    CreateDate:'建立日期',
    LastUpdate:'最後修改日期',
  };

  constructor(private gadget: GadgetService) {
  }

  async ngOnInit() {

    this.inputDateString = moment().format('YYYY-MM-DD');

    this.colKeys = Object.keys(this.columns);
    try{
    
      this.loading = true;
      // 取得 contract 連線。
      console.log(" === connect to contract ====");
      this.contract = await this.gadget.getContract('behavior.notification');

      this.loadData();
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }

  async loadData() {
    try{
    
      this.loading = true;
      
      // 呼叫 service。
      this.dataRow = (await this.contract.send('_.GetBehavior', {OccurDate: this.inputDateString})).Result;

      // datetick convert to date
      this.dataRow.forEach(function(data){
        data.CreateDate = new Date(data.CreateDate/1000).toLocaleDateString();
        data.LastUpdate = new Date(data.LastUpdate/1000).toLocaleDateString();
      });
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }

  onDateChanged = function() {
    this.loadData();
  }
  

  clickEvent(data:any){
    this.uid = data.UID;
  }
}

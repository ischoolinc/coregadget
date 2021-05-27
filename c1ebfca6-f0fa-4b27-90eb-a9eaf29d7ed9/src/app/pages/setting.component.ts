import { Component, OnInit } from '@angular/core';
import { DSAService, RollCallRecord, PeriodConf, AbsenceConf, Schedule, CourseConf, ConfigData } from './../service/dsa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../service/config.service';
import { AlertService } from '../service/alert.service';
import { RollCallRateDenominator } from './vo';


@Component({
  selector: 'gd-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../common.css']

})
export class SettingComponent implements OnInit {

  //頁面分為兩部分， 1 點名設定 2.設定小幫手    

  showPicture: boolean;
  teacherSetting: any;
  objectKeys = Object.keys;
  loading: boolean;
  settingList: any;

  classList: any[];
  courseList: any[];

  //顯示母數 
  denominatorString : string  = '未設定';
  peiord :string ='未設定';
  weekCount :string = '未設定';
  showAbsenceRate : boolean ;
  // 如果設定採用 上課週數*節數 但是課程上卻沒有設節次 調出提醒字眼
  reminderMessage : string ;
  isUseWeekFromCourse :boolean ;
  
  constructor(
    private dsa: DSAService,
    private router: Router,
    private config: ConfigService,
    private alert: AlertService
  ) { }

  async ngOnInit() {
    await this.Init();
  }
  async Init() {

    this.loading = true;
    try {
      //取得老師設定
      this.teacherSetting = await this.dsa.getTeacherSetting();
      this.settingList = this.objectKeys(this.teacherSetting);
      //取得班級、課程資料
      var rsp = await this.dsa.send("GetClassHelper");
      this.classList = [].concat(rsp.Class || []);
      this.courseList = [].concat(rsp.Course || []);

      // 取得點名母數 
     this.isUseWeekFromCourse  =   await this.dsa.getAbsenRateDenominatorDepen() ;
   
    } catch (error) {
       console.log("發生錯誤!");
    } finally {
      this.loading = false;
    }
  }





  async openTeacherHelper(course: CourseConf) {

    this.router.navigate(['/teacher-helper', course.CourseID, course.CourseName]);
  }


  async settingChange(settingKey: any, settingValue: boolean) {
    this.teacherSetting[settingKey] = settingValue;
  }
  async saveSetting() {

    const dialog = this.alert.waiting("儲存中...");
    try {
      await this.dsa.setTeacherSetting(this.teacherSetting);
      this.alert.snack("儲存成功");
    } catch (error) {
      this.alert.json(error);
    } finally {
      dialog.close();
    }
  }

}

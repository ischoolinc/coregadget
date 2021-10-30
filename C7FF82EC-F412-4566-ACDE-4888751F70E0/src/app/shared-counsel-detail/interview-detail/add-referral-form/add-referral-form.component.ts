import { IReferralForm } from './../../counsel-vo';
import { Component, Input, OnChanges, OnInit, Optional, SimpleChange } from '@angular/core';
import { homedir } from 'os';
import { CounselStudentService } from 'src/app/counsel-student.service';
import { DsaService } from 'src/app/dsa.service';
import { CounselDetailComponent } from '../..';
import { CounselInterview, ReferralForm } from '../../counsel-vo';
import { promise } from 'protractor';

@Component({
  selector: 'app-add-referral-form',
  templateUrl: './add-referral-form.component.html',
  styleUrls: ['./add-referral-form.component.css']
})
export class AddReferralFormComponent implements OnInit {
  _readonly :boolean ; 
  @Input() _CounselInterview: CounselInterview;
  _counselInterview: CounselInterview;
  @Input() currentinterviewID: string;
  currentReferal: ReferralForm =new ReferralForm();
  strategys: any[];
  _editMode: string | undefined;
  exitReferralForm: IReferralForm;
  editModeString: string | undefined;
  _studentName: string;
  isCancel: boolean;
  constructor(
    private dsaService: DsaService,
    private counselStudentService: CounselStudentService,
    //   @Optional()
    // private counselDetailComponent: CounselDetailComponent
  ) { }

  async ngOnInit() {

  }
  /** 取得 資訊 */
  async loadingInitInfo(actionType :string) {
    if(actionType=="view"){ // ready only
      this._readonly = true ;
      await this.getReferralFormByInterviewID(this.currentinterviewID); // 判斷是新增還是修改 
      await this.loadDefaultData();
      this.editModeString =""
    }else // 新增或編輯
    {
      await this.getReferralFormByInterviewID( this._CounselInterview.UID); // 判斷是新增還是修改 
      if (true) {
        await this.loadDefaultData();
       
      }
    }
  }

  /** 儲存 */
  async save() {
    try {
      this.isCancel = false;
      this.currentReferal.isSaveDisable = true;
      this.currentReferal.Strategy = JSON.stringify(this.currentReferal._stratgy); //
 
      await this.SetReferralForm(this.currentReferal);
    
      $("#referralForm").modal("hide");
      this.currentReferal.isSaveDisable = false;
    } catch (error) {
      alert(error);
      this.currentReferal.isSaveDisable = false;
    }

  }
  /**取消 */
  cancel() {
    this.isCancel = true;
    $("#referralForm").modal("hide");
  }
  /** */
  checkChange(item, item2) {

  }

  /**載入預設資料*/
  loadDefaultData() {
    if (true) {
      if (this._editMode === "edit") {
        // 修改
        this.editModeString = "修改";
        if (true) {
          this.currentReferal = new ReferralForm(this.exitReferralForm);
          // 帶入日期與輸入者
          let dt1 = new Date(this.currentReferal.HomeTeacherStartDate);
          this.currentReferal.HomeTeacherStartDate = this.currentReferal.parseDate(dt1);
          let dt2 = new Date(this.currentReferal.HomeTeacherEndDate);
          this.currentReferal.HomeTeacherEndDate = this.currentReferal.parseDate(dt2);
          this.currentReferal.AuthorName = this.counselStudentService.teacherInfo.Name;
        }
      } else {
        // 新增
        this.editModeString = "新增";
        this.currentReferal = new ReferralForm();
        // 帶入日期與輸入者
        let dt = new Date();
        this.currentReferal.HomeTeacherStartDate = "";
        this.currentReferal.HomeTeacherEndDate = "";
        this.currentReferal.AuthorName = this.counselStudentService.teacherInfo.Name;
        this.currentReferal.useQuestionOptionTemplate();
      }
      // 檢查是否有值
    }
  }


  /** 取得轉介單資訊 判斷是新增OR修改*/
  async getReferralFormByInterviewID(counselInterviewUID :string) {
    // request 
    let req = {
      InterviewID:counselInterviewUID
    }
    try {
      const rsp = await this.dsaService.send('referral.GetReferalRormByInterviewID', {
        Request: req
      });
    
      if (rsp.ReferralForm) { //如果已經有資料就是編輯
        this.exitReferralForm = rsp.ReferralForm;
        this._editMode = "edit";
       
      } else {//如果沒有資料就是新增
        this._editMode = "add";
      }
    } catch (ex) {
      alert('取得轉介單發生錯誤!' + ex)
      console.log(ex)
    }
  }


  /**新增晤談紀錄資料 */
  async SetReferralForm(data: ReferralForm) {
    // request 
    let req = {  
      UID: data.UID,
      HomeStartDate: data.HomeTeacherStartDate,
      HomeEndDate: data.HomeTeacherEndDate,
      Strategy: data.Strategy,
      ProbblemAndExpectation: data.ProbblemAndExpectation,
      RefInterViewID: this._CounselInterview.UID
    }
    try {
      let resp = await this.dsaService.send("referral.SetReferalForm", {
        Request: req
      });

    } catch (err) {
      alert('無法新增：' + err.dsaError.message);
    }
  }
}

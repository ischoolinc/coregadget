import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../app.component";
import { GrantModalComponent } from "./grant-modal/grant-modal.component";
import { DsaService } from "../dsa.service";
import { ReferralStudent } from "./referral-student";

@Component({
  selector: "app-referral",
  templateUrl: "./referral.component.html",
  styleUrls: ["./referral.component.css"]
})
export class ReferralComponent implements OnInit {
  _data;

  @ViewChild("grant_modal") grant_modal: GrantModalComponent;

  ReferralStudentList: ReferralStudent[];
  isLoading: boolean = false;
  selectStatus: string = "全部";
  constructor(
    private dsaService: DsaService,
    @Optional()
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
    if (this.appComponent) this.appComponent.currentComponent = "referral";
    this.loadData();
  }

  setGrantModal(refStudent: ReferralStudent) {
    this.grant_modal.referralStudent = refStudent;
    // 處理預設值
    if (!this.grant_modal.referralStudent.ReferralReplyDate)
    {
      let dt = new Date();
      this.grant_modal.referralStudent.ReferralReplyDate = this.grant_modal.referralStudent.parseDate(dt);
    }
    $("#grant_modal").modal("show");
  }

  loadData() {
    this.GetReferralStudent();
  }

  // 已處理
  Processed(status: string) {
    this.selectStatus = status;
    this.ReferralStudentList.forEach(data => {
      if (data.GetReferralStatus() === status) {
        data.isDisplay = true;
      } else {
        data.isDisplay = false;
      }
    });
  }

  async GetReferralStudent() {
    this.isLoading = true;
    let resp = await this.dsaService.send("GetReferralStudent", {
      Request: {}
    });

    this.ReferralStudentList = [];
    [].concat(resp.ReferralStudent || []).forEach(studRec => {
      // 建立轉介學生資料
      let rec: ReferralStudent = new ReferralStudent();
      rec.UID = studRec.UID;
      rec.isDisplay = true;
      rec.ClassName = studRec.ClassName;
      rec.SeatNo = studRec.SeatNo;
      rec.Name = studRec.Name;
      rec.Gender = studRec.Gender;
      rec.TeacherName = studRec.TeacherName;
      let n1 = Number(studRec.OccurDate);
      let d1 = new Date(n1);
      rec.OccurDate = rec.parseDate(d1);
      rec.ReferralDesc = studRec.ReferralDesc;
      rec.ReferralReply = studRec.ReferralReply;
      rec.ReferralStatus = studRec.ReferralStatus;
      rec.ReferralReplyDate = studRec.ReferralReplyDate;

      this.ReferralStudentList.push(rec);
    });
    this.isLoading = false;
  }
}

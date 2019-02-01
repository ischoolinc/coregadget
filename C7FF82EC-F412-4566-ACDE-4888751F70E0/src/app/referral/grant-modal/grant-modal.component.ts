import { Component, OnInit, Input } from "@angular/core";
import { ReferralStudent } from "../referral-student";
import { DsaService } from "../../dsa.service";
@Component({
  selector: "app-grant-modal",
  templateUrl: "./grant-modal.component.html",
  styleUrls: ["./grant-modal.component.css"]
})
export class GrantModalComponent implements OnInit {
  //@Input('test') masterName: string;

  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  referralStudent: ReferralStudent;

  selectValue = "";
  constructor(private dsaService: DsaService) {}

  ngOnInit() {
    this.referralStudent = new ReferralStudent();
  }

  loadDefault() {
    // 處理授理狀況
    let rp = this.referralStudent.ReferralStatus;
    if (rp === "未處理") {
      this.check1 = true;
    } else if (rp === "處理中") {
      this.check2 = true;
    } else if (rp === "已處理") {
      this.check3 = true;
    } else {
      this.check1 = this.check2 = this.check3 = false;
    }

    // 處理預設值
    if (!this.referralStudent.ReferralReplyDate) {
      let dt = new Date();
      this.referralStudent.ReferralReplyDate = this.referralStudent.parseDate(
        dt
      );
      // console.log(this.referralStudent.UID);
    }
  }

  select(value: string) {
    this.selectValue = value;
  }
  save() {
    // 儲存資料
    try {
      this.referralStudent.ReferralStatus = this.selectValue;
      this.SetReferralStudent(this.referralStudent);
      $("#grant_modal").modal("hide");
    } catch (error) {
      alert(error);
    }
  }

  async SetReferralStudent(data: ReferralStudent) {
    let req = {
      UID: data.UID,
      ReferralReply: data.ReferralReply,
      ReferralStatus: data.ReferralStatus,
      ReferralReplyDate: data.ReferralReplyDate,
      ReferralReplyDesc: data.ReferralReplyDesc
    };
    console.log(req);

    let resp = await this.dsaService.send("SetReferralStudent", {
      Request: req
    });
    // console.log(resp);
  }
}

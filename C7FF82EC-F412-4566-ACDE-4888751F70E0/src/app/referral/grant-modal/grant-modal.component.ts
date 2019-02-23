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

  referralStudent: ReferralStudent;

  constructor(private dsaService: DsaService) {}

  ngOnInit() {
    this.referralStudent = new ReferralStudent();
  } 

  async save() {
    // 儲存資料
    try {
      
      await this.SetReferralStudent(this.referralStudent);
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
    // console.log(req);

    let resp = await this.dsaService.send("SetReferralStudent", {
      Request: req
    });
    // console.log(resp);
  }
}

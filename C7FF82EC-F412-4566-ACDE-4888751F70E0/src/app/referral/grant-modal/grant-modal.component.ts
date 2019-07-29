import { Component, OnInit, Input } from "@angular/core";
import { ReferralStudent } from "../referral-student";
import { DsaService } from "../../dsa.service";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent
} from "../../counsel-student.service";

@Component({
  selector: "app-grant-modal",
  templateUrl: "./grant-modal.component.html",
  styleUrls: ["./grant-modal.component.css"]
})
export class GrantModalComponent implements OnInit {
  //@Input('test') masterName: string;

  isCancel: boolean = true;
  referralStudent: ReferralStudent;

  constructor(private dsaService: DsaService,
    public counselStudentService: CounselStudentService) { }

  ngOnInit() {
    this.referralStudent = new ReferralStudent();
  }

  cancel() {
    this.isCancel = true;
    $("#grant_modal").modal("hide");
  }

  async save() {
    this.isCancel = false;
    // 儲存資料
    try {

      await this.SetReferralStudent(this.referralStudent);
      $("#grant_modal").modal("hide");
    } catch (error) {
      alert(error);
    }
  }

  async SetReferralStudent(data: ReferralStudent) {

    // 處理當設定狀態後同步到輔導學生主畫面
    this.counselStudentService.guidanceStudent.forEach(rstud => {
      if (rstud.StudentID === data.StudentID) {
        rstud.ReferralStatus = data.ReferralStatus;
      }
    });

    this.counselStudentService.studentMap.forEach(
      (value: CounselStudent, key: string) => {
        if (value.StudentID === data.StudentID) {
          value.ReferralStatus = data.ReferralStatus;
        }
      }
    );

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

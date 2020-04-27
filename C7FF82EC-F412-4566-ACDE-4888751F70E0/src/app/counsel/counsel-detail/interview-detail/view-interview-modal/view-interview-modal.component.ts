import { Component, OnInit, Inject } from "@angular/core";
// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CounselStudentService } from "../../../../counsel-student.service";
import { CounselInterview } from "../../../counsel-vo";

@Component({
  selector: "app-view-interview-modal",
  templateUrl: "./view-interview-modal.component.html",
  styleUrls: ["./view-interview-modal.component.css"]
})
export class ViewInterviewModalComponent implements OnInit {

  public referralVisible: boolean = false;

  _CounselInterview: CounselInterview;
  _id = "viewInterview";
  constructor(private counselStudentService: CounselStudentService) {}

  ngOnInit() {
    this.referralVisible = false;
    if (gadget.params.system_counsel_position === 'referral') {
      this.referralVisible = true;
    }
    this._CounselInterview = new CounselInterview();
  }

  // 取消
  cancel() {
    // this.dialogRef.close();
  }

  // // 儲存
  // async save() {
  //   try {
  //     this.dialogRef.close({ msg: "hello response!" });
  //   } catch (error) {
  //     alert(error);
  //   }
  // }
}

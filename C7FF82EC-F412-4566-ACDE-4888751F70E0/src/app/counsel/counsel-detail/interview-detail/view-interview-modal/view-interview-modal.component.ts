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

  _CounselInterview: CounselInterview;

  constructor(private counselStudentService: CounselStudentService) {}

  ngOnInit() {
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

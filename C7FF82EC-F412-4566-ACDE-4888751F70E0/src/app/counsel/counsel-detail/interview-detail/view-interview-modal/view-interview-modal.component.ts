import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  CounselStudentService,
  CounselInterview
} from "../../../../counsel-student.service";

@Component({
  selector: "app-view-interview-modal",
  templateUrl: "./view-interview-modal.component.html",
  styleUrls: ["./view-interview-modal.component.css"]
})
export class ViewInterviewModalComponent implements OnInit {
  _CounselInterview: CounselInterview;
  _editMode: string = 'view';
  constructor(
    private counselStudentService: CounselStudentService,
    private dialogRef: MatDialogRef<ViewInterviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any    
  ) {
    console.log(this.dialogRef);
    console.log(data);
    if (data.CounselRec)
    {
      this._editMode = data.editMode;
      this._CounselInterview = data.CounselRec as CounselInterview;
    }
  }

  ngOnInit() {}

  // 取消
  cancel() {
    this.dialogRef.close();
  }

  // 儲存
  async save() {
    try {
      this.dialogRef.close({ msg: "hello response!" });
    } catch (error) {
      alert(error);
    }
  }
}

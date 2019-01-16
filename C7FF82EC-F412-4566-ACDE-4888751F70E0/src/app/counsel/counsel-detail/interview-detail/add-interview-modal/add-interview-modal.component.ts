import { Component, OnInit, Input, NgModule, ViewChild, ElementRef, Inject } from "@angular/core";
import { CounselStudentService, CounselInterview } from "../../../../counsel-student.service";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { formatPercent } from "@angular/common";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: "app-add-interview-modal",
  templateUrl: "./add-interview-modal.component.html",
  styleUrls: ["./add-interview-modal.component.css"]
})
export class AddInterviewModalComponent implements OnInit {
  constructor(
    private counselStudentService: CounselStudentService,
    private dialogRef: MatDialogRef<AddInterviewModalComponent>,
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
  _editMode: string = 'add';
  editModeString: string = '新增';
  _fgFrom: FormGroup;
  _studentName: string;

  // 輔導紀錄
  _CounselInterview: CounselInterview;  

  ngOnInit() {

    
    

    // console.log(this.counselStudentService.currentStudent.StudentName);
    if (this.counselStudentService.currentStudent) {
      if (this._editMode === 'edit' && this._CounselInterview)
      {
        // 修改
        this.editModeString = '修改';
        console.log(this._CounselInterview);
      } else
      {
        // 新增
        this._CounselInterview = new CounselInterview();
        this._studentName = this.counselStudentService.currentStudent.StudentName;
        this._CounselInterview.StudentID = this.counselStudentService.currentStudent.StudentID;
        this._CounselInterview.SchoolYear = 107;
        this._CounselInterview.Semester = 1;
      }
    }
  }

  // 設定訪談方式
  setCounselType(value: string) {
    this._CounselInterview.CounselType = value;
  }

  // click 取消
  cancel() {
    // console.log("Cancel");
    this.dialogRef.close();
  }
  // click 儲存
  async save() {

    try {
      await this.counselStudentService.SetCounselInterview(this._CounselInterview);
      this.dialogRef.close({msg: 'hello response!'});
    } catch (error) {
      alert(error);
    }
  }

}

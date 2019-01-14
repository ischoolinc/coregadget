import { Component, OnInit, Input,NgModule,ViewChild, ElementRef} from "@angular/core";
import { CounselStudentService,CounselInterview } from "../../../../counsel-student.service";
import { FormGroup, FormControl, Validators,NgForm } from "@angular/forms";
import { formatPercent } from "@angular/common";

@Component({
  selector: "app-add-interview-modal",
  templateUrl: "./add-interview-modal.component.html",
  styleUrls: ["./add-interview-modal.component.css"]
})
export class AddInterviewModalComponent implements OnInit {
  constructor(private counselStudentService: CounselStudentService) {}
 _fgFrom:FormGroup;
  _studentName: string;

  // 輔導紀錄
  _CounselInterview: CounselInterview;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  ngOnInit() {
    this._CounselInterview = new CounselInterview();
    
    //console.log(this.counselStudentService.currentStudent.StudentName);
    if (this.counselStudentService.currentStudent) {
      this._studentName = this.counselStudentService.currentStudent.StudentName;
      this._CounselInterview.StudentID = this.counselStudentService.currentStudent.StudentID;
      this._CounselInterview.SchoolYear = 107;
      this._CounselInterview.Semester = 1;
      this._CounselInterview.CounselType
      //this._CounselInterview.OccurDate
    }
  }

  // 設定訪談方式
  setCounselType(value: string)
  {
    this._CounselInterview.CounselType = value;
  }
  

  // click 取消
  cancel() {
    console.log("Cancel");
  }
  // click 儲存
  async save() {    
      let x = await this.counselStudentService.SetCounselInterview(this._CounselInterview);
      console.log(this._CounselInterview);
      this.closeModal();    
  }

  private closeModal(): void {
    $("#addInterview").modal('hide');
    // this.closeBtn.nativeElement.click();
}
}

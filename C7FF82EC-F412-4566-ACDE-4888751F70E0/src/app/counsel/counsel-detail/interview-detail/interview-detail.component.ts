import { Component, OnInit } from "@angular/core";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent,
  SemesterInfo,
  CounselInterview
} from "../../../counsel-student.service";
import { TypeModifier } from "@angular/compiler/src/output/output_ast";
import { MatDialog } from '@angular/material';
import { AddInterviewModalComponent } from './add-interview-modal/add-interview-modal.component';
import {ViewInterviewModalComponent} from './view-interview-modal/view-interview-modal.component';

@Component({
  selector: "app-interview-detail",
  templateUrl: "./interview-detail.component.html",
  styleUrls: ["./interview-detail.component.css"]
})
export class InterviewDetailComponent implements OnInit {
  enableReferal: boolean = false;
  _semesterInfo: SemesterInfo[] = [];
  _counselInterview: CounselInterview[] = [];

  constructor(private counselStudentService: CounselStudentService, 
    private dialog: MatDialog) {}

  ngOnInit() {
    console.log(
      "StudentID:" + this.counselStudentService.currentStudent.StudentID
    );
    if (
      this.counselStudentService.currentStudent.Role.indexOf("輔導老師") >= 0
    ) {
      this.enableReferal = true;
    }

    this.loadCounselInterview();
  }


  // 取得學生輔導資料
  async loadCounselInterview() {
    this._semesterInfo = [];
    let tmp = [];
    // 取得學生輔導資料
    this._counselInterview = await this.counselStudentService.GetCounselInterviewByStudentID(
      this.counselStudentService.currentStudent.StudentID
    );

    this._counselInterview.forEach( data =>{
      let key = `${data.SchoolYear}_${data.Semester}`;
      if (!tmp.includes(key))
      {
        let sms: SemesterInfo = new SemesterInfo();
        sms.SchoolYear = data.SchoolYear;
        sms.Semester = data.Semester;
        this._semesterInfo.push(sms);
        tmp.push(key);
      }
    });
  }

  // 新增
  addInterview() {
    const ref = this.dialog.open(AddInterviewModalComponent, {data: 'hello args'});
    ref.afterClosed().subscribe(rsp => {
      console.log(rsp);
    });
  }

  // 修改
  editInterview(rec:CounselInterview){
    
    const ref = this.dialog.open(ViewInterviewModalComponent,{data:{editMode:'edit',CounselRec:rec}});
    ref.afterClosed().subscribe(rsp => {
      console.log(rsp);
    });
  }

  // 檢視
  viewInterview(rec:CounselInterview){
    const ref = this.dialog.open(ViewInterviewModalComponent,{data:{editMode:'view',CounselRec:rec}});
    ref.afterClosed().subscribe(rsp => {
      console.log(rsp);
    });
  }
  
}

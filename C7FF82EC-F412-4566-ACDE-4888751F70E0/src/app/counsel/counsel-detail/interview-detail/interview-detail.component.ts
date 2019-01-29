import { Component, OnInit, ViewChild, Optional } from "@angular/core";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent,
  SemesterInfo
} from "../../../counsel-student.service";
import { CounselInterview } from "../../counsel-vo";
import { TypeModifier } from "@angular/compiler/src/output/output_ast";
import { AddInterviewModalComponent } from "./add-interview-modal/add-interview-modal.component";
// import { MatDialog } from '@angular/material';
import { DsaService } from "../../../dsa.service";
import { ViewInterviewModalComponent } from "./view-interview-modal/view-interview-modal.component";
import { CounselDetailComponent } from "../counsel-detail.component";

@Component({
  selector: "app-interview-detail",
  templateUrl: "./interview-detail.component.html",
  styleUrls: ["./interview-detail.component.css"]
})
export class InterviewDetailComponent implements OnInit {
  enableReferal: boolean = false;
  _semesterInfo: SemesterInfo[] = [];
  _counselInterview: CounselInterview[] = [];
  _StudentID: string = "";
  isLoading = false;
  @ViewChild("addInterview") _addInterview: AddInterviewModalComponent;
  @ViewChild("viewInterview") _viewInterview: ViewInterviewModalComponent;

  constructor(
    private counselStudentService: CounselStudentService,
    private dsaService: DsaService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent
  ) {}

  ngOnInit() {
    this._StudentID = "";

    if (
      this.counselDetailComponent.currentStudent.Role &&
      this.counselDetailComponent.currentStudent.Role.indexOf("認輔老師") >= 0
    ) {
      this.enableReferal = true;
    }
    this._StudentID = this.counselDetailComponent.currentStudent.StudentID;

    this.loadCounselInterview(
      this.counselDetailComponent.currentStudent.StudentID
    );
  }

  // 取得學生輔導資料
  async loadCounselInterview(StudentID: string) {
    this._counselInterview = [];
    this.isLoading = true;
    this._StudentID = StudentID;
    this._semesterInfo = [];
    let tmp = [];
    // 取得學生輔導資料
    this._counselInterview = await this.GetCounselInterviewByStudentID(
      this._StudentID
    );

    this._counselInterview.forEach(data => {
      let key = `${data.SchoolYear}_${data.Semester}`;
      if (!tmp.includes(key)) {
        let sms: SemesterInfo = new SemesterInfo();
        sms.SchoolYear = data.SchoolYear;
        sms.Semester = data.Semester;
        this._semesterInfo.push(sms);
        tmp.push(key);
      }
    });
    this.isLoading = false;
  }

  // 檢視
  viewInterviewModal(counselView: CounselInterview) {
    this._viewInterview._CounselInterview = counselView;
    $("#viewInterview").modal("show");
    $("#viewInterview").on("hide.bs.modal", function(e) {
      // do something...
    });
  }

  // 新增
  addInterviewModal() {
    this._addInterview._editMode = "add";
    this._addInterview.loadDefaultData();
    $("#addInterview").modal("show");

    // 關閉畫面
    $("#addInterview").on("hide.bs.modal", () => {
      // 重整資料
      this.loadCounselInterview(this._StudentID);
    });
  }

  // 修改
  editInterviewModal(counselView: CounselInterview) {
    this._addInterview._editMode = "edit";
    this._addInterview._CounselInterview = counselView;
    this._addInterview.loadDefaultData();
    $("#addInterview").modal("show");
  }

  // 取得透過學生系統編號取得學生輔導資料
  async GetCounselInterviewByStudentID(StudentID: string) {
    let data: CounselInterview[] = [];

    let resp = await this.dsaService.send("GetStudentCounselInterview", {
      Request: {
        StudentID: StudentID
      }
    });

    [].concat(resp.CounselInterview || []).forEach(counselRec => {
      // 建立輔導資料
      let rec: CounselInterview = new CounselInterview();
      rec.UID = counselRec.UID;
      rec.StudentName = counselRec.StudentName;
      rec.SchoolYear = parseInt(counselRec.SchoolYear);
      rec.Semester = parseInt(counselRec.Semester);
      let dN = Number(counselRec.OccurDate);
      let x = new Date(dN);
      rec.OccurDate = rec.parseDate(x);
      rec.ContactName = counselRec.ContactName;
      rec.AuthorName = counselRec.AuthorName;
      rec.CounselType = counselRec.CounselType;
      rec.CounselTypeOther = counselRec.CounselTypeOther;
      rec.isPrivate = counselRec.isPrivate;
      rec.StudentID = counselRec.StudentID;
      rec.isReferral = counselRec.isReferral;
      rec.ReferralDesc = counselRec.ReferralDesc;
      rec.ReferralReply = counselRec.ReferralReply;
      rec.ReferralStatus = counselRec.ReferralStatus;
      rec.ReferralReplyDate = counselRec.ReferralReplyDate;
      rec.Content = counselRec.Content;
      rec.ContactItem = counselRec.ContactItem;
      data.push(rec);
    });
    return data;
  }
}

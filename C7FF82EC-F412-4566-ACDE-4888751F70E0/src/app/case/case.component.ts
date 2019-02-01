import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { RoleService } from "../role.service";
import { AppComponent } from "../app.component";
import { CaseStudent } from "./case-student";
import { DsaService } from "../dsa.service";

@Component({
  selector: "app-case",
  templateUrl: "./case.component.html",
  styleUrls: ["./case.component.css"]
})
export class CaseComponent implements OnInit {
  
   // 個案資料
   caseList: CaseStudent[];
   isLoading = false;
  constructor(
    private roleService: RoleService,
    private dsaService: DsaService,
    @Optional()
    private appComponent: AppComponent
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "case";
  }

  ngOnInit() {
    this.caseList = [];
    this.GetCase();
  }

    // 取得個案
    async GetCase() {
      this.isLoading = true;
      let data: CaseStudent[] = [];
  
      let resp = await this.dsaService.send("GetCase", {
        Request: {        
        }
      });
  
      [].concat(resp.Case || []).forEach(caseRec => {
        // 建立認輔資料
        let rec: CaseStudent = new CaseStudent();
        rec.UID = caseRec.UID;
        rec.SchoolYear = caseRec.SchoolYear;
        rec.Semester = caseRec.Semester;
        let x = Number(caseRec.OccurDate);
        let dt = new Date(x);
        rec.OccurDate = rec.parseDate(dt);
        rec.CaseNo = caseRec.CaseNo;
        rec.StudentIdentity = caseRec.StudentIdentity;
        rec.PossibleSpecialCategory = caseRec.PossibleSpecialCategory;
        rec.SpecialLevel = caseRec.SpecialLevel;
        rec.SpecialCategory = caseRec.SpecialCategory;
        rec.HasDisabledBook = caseRec.HasDisabledBook;
        rec.DeviantBehavior = caseRec.DeviantBehavior;
        rec.ProblemCategory = caseRec.ProblemCategory;
        rec.ProbleDescription = caseRec.ProbleDescription;
        rec.SpecialSituation = caseRec.SpecialSituation;
        rec.EvaluationResult = caseRec.EvaluationResult;
        rec.IsClosed = caseRec.IsClosed;
        rec.CloseDate = caseRec.CloseDate;
        rec.ClosedByTeacherID = caseRec.ClosedByTeacherID;
        rec.CloseDescription = caseRec.CloseDescription;
        rec.StudentID = caseRec.StudentID;
        rec.CaseSource = caseRec.CaseSource;
  
        rec.TeacherName = caseRec.TeacherName;
        if (caseRec.TeacherNickName != "") {
          rec.TeacherName = `${rec.TeacherName}(${caseRec.TeacherNickName})`;
        }
        data.push(rec);
      });
      this.caseList = data;
    }
}

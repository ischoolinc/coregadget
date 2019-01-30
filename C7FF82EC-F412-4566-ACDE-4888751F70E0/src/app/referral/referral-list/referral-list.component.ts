import { Component, Optional, OnInit, ViewChild } from "@angular/core";
import { AppComponent } from "../../app.component";
import { GrantModalComponent } from "../grant-modal/grant-modal.component";
import { NewCaseModalComponent } from "../../case/new-case-modal/new-case-modal.component";
import { DsaService } from "../../dsa.service";
import { ReferralStudent } from "../referral-student";
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RoutesRecognized
} from "@angular/router";

@Component({
  selector: "app-referral-list",
  templateUrl: "./referral-list.component.html",
  styleUrls: ["./referral-list.component.css"]
})
export class ReferralListComponent implements OnInit {
  isLoading: boolean = false;
  public mod: string;
  public itemList: string[];
  public selectItem: string;
  // 目前選擇轉介學生
  currentReferralStudent: ReferralStudent;
  @ViewChild("grant_modal") grant_modal: GrantModalComponent;
  @ViewChild("case_modal") case_modal: NewCaseModalComponent;
  ReferralStudentList: ReferralStudent[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService
  ) {}

  ngOnInit() {
    this.currentReferralStudent = new ReferralStudent();
    this.itemList = [];
    this.itemList.push("未結案");
    this.itemList.push("已結案");
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.mod = params.get("mod");
        // 填入預設
        this.selectItem = params.get("target");
        this.loadData();
      }
    );
  }

  setSelectItem(item: string) {
    this.selectItem = item;
    if (this.selectItem === "已結案") {
      this.ReferralStudentList.forEach(data => {
        if (data.GetReferralStatus() === "已處理") {
          data.isDisplay = true;
        } else {
          data.isDisplay = false;
        }
      });
    }

    if (this.selectItem === "未結案") {
      this.ReferralStudentList.forEach(data => {
        if (data.GetReferralStatus() !== "已處理") {
          data.isDisplay = true;
        } else {
          data.isDisplay = false;
        }
      });
    }
  }

  // 到學生輔導紀錄
  toCounselDetail(refStudent: ReferralStudent) {
    this.currentReferralStudent = refStudent;
    this.router.navigate(
      ["/referral", "detail", refStudent.StudentID, refStudent.UID],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  setNewCaseMmodal(refStudent: ReferralStudent) {
    this.case_modal.loadData();
    this.case_modal.setCaseFromReferral(refStudent);
    $("#case_modal").modal("show");
    // 關閉畫面
    $("#case_modal").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
    });
  }

  setGrantModal(refStudent: ReferralStudent) {
    this.grant_modal.referralStudent = refStudent;
    this.grant_modal.loadDefault();
    $("#grant_modal").modal("show");
    // 關閉畫面
    $("#grant_modal").on("hide.bs.modal", () => {
      // 重整資料
      this.loadData();
    });
  }

  loadData() {
    this.GetReferralStudent();
  }

  async GetReferralStudent() {
    this.isLoading = true;
    let resp = await this.dsaService.send("GetReferralStudent", {
      Request: {}
    });

    this.ReferralStudentList = [];
    [].concat(resp.ReferralStudent || []).forEach(studRec => {
      // 建立轉介學生資料
      let rec: ReferralStudent = new ReferralStudent();
      rec.UID = studRec.UID;
      rec.StudentID = studRec.StudentID;
      rec.ClassName = studRec.ClassName;
      rec.SeatNo = studRec.SeatNo;
      rec.Name = studRec.Name;
      rec.Gender = studRec.Gender;
      rec.TeacherName = studRec.TeacherName;
      let n1 = Number(studRec.OccurDate);
      let d1 = new Date(n1);
      rec.OccurDate = rec.parseDate(d1);
      rec.ReferralDesc = studRec.ReferralDesc;
      rec.ReferralReply = studRec.ReferralReply;
      rec.ReferralStatus = studRec.ReferralStatus;
      rec.ReferralReplyDate = studRec.ReferralReplyDate;
      rec.ReferralReplyDesc = studRec.ReferralReplyDesc;
      rec.isDisplay = false;
      if (this.selectItem === "已結案") {
        if (rec.ReferralStatus === "已處理") {
          rec.isDisplay = true;
        }
      } else {
        rec.isDisplay = true;
      }

      this.ReferralStudentList.push(rec);
    });

    this.isLoading = false;
  }
}

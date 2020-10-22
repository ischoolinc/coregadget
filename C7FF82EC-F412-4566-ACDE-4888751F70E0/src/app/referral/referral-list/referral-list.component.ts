import { Component, OnInit, ViewChild } from "@angular/core";
import { GrantModalComponent } from "../grant-modal/grant-modal.component";
import { NewCaseModalComponent } from "../../case/new-case-modal/new-case-modal.component";
import { DsaService } from "../../dsa.service";
import { ReferralStudent } from "../referral-student";
import {
  ActivatedRoute,
  ParamMap,
  Router,
} from "@angular/router";

@Component({
  selector: "app-referral-list",
  templateUrl: "./referral-list.component.html",
  styleUrls: ["./referral-list.component.css"]
})
export class ReferralListComponent implements OnInit {
  // 2019-03-15 和佳樺討論後，將未結案、已結案 改回原來三項：未處理、處理中、已處理

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
  ) { }

  async ngOnInit() {
    this.currentReferralStudent = new ReferralStudent();
    this.itemList = [];
    // this.itemList.push("未結案");
    // this.itemList.push("已結案");
    this.itemList.push("未處理");
    this.itemList.push("處理中");
    this.itemList.push("已處理");
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.mod = params.get("mod");
        // 填入預設
        this.selectItem = params.get("target");
      }
    );
    await this.loadData();
  }

  setSelectItem(item: string) {
    this.selectItem = item;
    this.ReferralStudentList.forEach(data => {
      if (data.ReferralStatus === item) {
        data.isDisplay = true;
      } else {
        data.isDisplay = false;
      }
    });

    // }
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
    this.case_modal.isAddMode = true;
    $("#newCase").modal("show");
    // 關閉畫面
    $("#newCase").on("hide.bs.modal", () => {
      // 重整資料
      if (!this.case_modal.isCancel)
        this.loadData();
      $("#newCase").off("hide.bs.modal");
    });
  }

  setGrantModal(refStudent: ReferralStudent) {
    this.grant_modal.referralStudent = refStudent;

    this.grant_modal.loadDefault();

    $("#grant_modal").modal("show");
    // 關閉畫面
    $("#grant_modal").on("hide.bs.modal", () => {
      // 重整資料
      if (!this.grant_modal.isCancel)
        this.loadData();

      $("#grant_modal").off("hide.bs.modal");
    });
  }

  async loadData() {
    await this.GetReferralStudent();
  }

  async GetReferralStudent() {
    this.isLoading = true;

    try {
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
        rec.RefCaseID = studRec.CaseID;
        rec.PhotoUrl = `${
          this.dsaService.AccessPoint
          }/GetStudentPhoto?stt=Session&sessionid=${
          this.dsaService.SessionID
          }&parser=spliter&content=StudentID:${rec.StudentID}`;
        rec.isDisplay = false;

        if (this.selectItem === rec.ReferralStatus) {
          rec.isDisplay = true;
        }

        rec.checkValue();
        this.ReferralStudentList.push(rec);
      });

      // this.setSelectItem("未結案");
      this.setSelectItem("未處理");
    } catch (err) {
      alert('無法GetReferralStudent：' + err.dsaError.message);
    }


    this.isLoading = false;
  }
}

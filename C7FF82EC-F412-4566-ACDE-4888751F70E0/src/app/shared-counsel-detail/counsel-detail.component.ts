import { Component, OnInit, Optional, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { CounselStudentService, CounselStudent } from "../counsel-student.service";
import { CounselComponent } from '../counsel/counsel.component';
import { DsaService } from '../dsa.service';
import { SetCounselInterviewPrintItemComponent } from './set-counsel-interview-print-item/set-counsel-interview-print-item.component';
import { GlobalService } from "../global.service";

@Component({
  selector: "app-counsel-detail",
  templateUrl: "./counsel-detail.component.html",
  styleUrls: ["./counsel-detail.component.css"]
})
export class CounselDetailComponent implements OnInit {
  deny: boolean = false;
  private studentID: string;
  private currentItem: string;
  currentStudent: CounselStudent;

  public baseVisible: boolean = false;
  public counselVisible: boolean = false;
  public setCounselPrintItemVisible: boolean = false;
  public coubselReferralVisible: boolean = false;
  public comprehensiveStr: string = "綜合紀錄表";

  // 顯示輔導紀錄
  _interviewEnable: boolean = false;
  // 顯示認輔紀錄
  _counselEnable: boolean = false;
  // 顯示心理測驗
  _psychological_testEnable: boolean = false;

  printDocument: any[];

  @ViewChild("setCounselInterviewPrintItem") _setCounselInterviewPrintItem: SetCounselInterviewPrintItemComponent;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public counselStudentService: CounselStudentService,
    private dsaService: DsaService,
    public globalService: GlobalService,
    @Optional()
    private counselComponent: CounselComponent
  ) { }

  ngOnInit() {
    this.baseVisible = false;
    this.counselVisible = false;
    this.coubselReferralVisible = false;

    // 預設
    this.comprehensiveStr = "綜合紀錄表";

    if (gadget.params.system_counsel_position === 'referral' || gadget.params.system_counsel_position === 'counselor' || gadget.params.system_counsel_position === 'freshman') {
      this.baseVisible = true;
    }

    if (gadget.params.system_counsel_position === 'referral' || gadget.params.system_counsel_position === 'counselor') {
      this.counselVisible = true;
    }

    if (gadget.params.system_counsel_position === 'referral') {
      this.coubselReferralVisible = true;
    }

    if (gadget.params.system_counsel_position === 'freshman') {
      // 新生特有
      this.comprehensiveStr = "填報資料";
    }

    // 判斷 個人輔導紀錄 功能只有管理者才可以使用
    this.setCounselPrintItemVisible = false;
    if (this.counselVisible) {
      if (this.globalService.MyCounselTeacherRole === '輔導主任' || this.globalService.MyCounselTeacherRole === '輔導組長') {
        this.setCounselPrintItemVisible = true;
      }
    }


    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.studentID = params.get("studentID");
        this.loadStudent();
      }
    );
  }

  loadStudent() {
    // this.counselStudentService.currentStudent = null;
    if (!this.counselStudentService.isLoading) {
      this.deny = false;
      if (this.counselStudentService.studentMap.has(this.studentID)) {
        this.currentStudent = this.counselStudentService.studentMap.get(
          this.studentID
        );
        // this.counselStudentService.currentStudent = this.currentStudent;

        if (this.counselComponent != null) {
          if (
            this.currentStudent.Role.indexOf("班導師") >= 0 ||
            this.currentStudent.Role.indexOf("輔導老師") >= 0
          ) {
            this.counselComponent.setSelectItem(this.currentStudent.ClassName);
          } else {
            this.counselComponent.setSelectItem("認輔學生");
          }
        }

        if (
          this.currentStudent.Role.indexOf("班導師") >= 0 ||
          this.currentStudent.Role.indexOf("輔導老師") >= 0
        ) {
          this._interviewEnable = true;
        }
        if (
          this.currentStudent.Role.indexOf("認輔老師") >= 0 ||
          this.currentStudent.Role.indexOf("輔導老師") >= 0
        ) {
          this._counselEnable = true;
        }

        if (
          this.currentStudent.Role.indexOf("班導師") >= 0 ||
          this.currentStudent.Role.indexOf("輔導老師") >= 0
        ) {
          this._psychological_testEnable = true;
        }

      } else {
        this.deny = true;
      }

      // 檢查認輔學生
      if (
        this.counselStudentService.guidanceStudent.length &&
        this.counselStudentService.guidanceStudent.length > 0
      ) {
        // 比對現在所選學生
        this.counselStudentService.guidanceStudent.forEach(data => {
          if (data.StudentID === this.studentID) {
            this.currentStudent = data;
          }
        });

        if (this.currentStudent.Role.indexOf("認輔老師") >= 0) {
          this._counselEnable = true;
          this.deny = false;
        }
      }

      this.loadPrintDocument();
    } else {
      setTimeout(this.loadStudent, 100);
    }
  }

  routeTo(to) {
    //讓特效跑
    setTimeout(
      function () {
        this.router.navigate([].concat(to || []), {
          relativeTo: this.activatedRoute
        });
      }.bind(this),
      200
    );
  }

  public setCurrentItem(item: string) {
    setTimeout(() => {
      this.currentItem = item;
    });
  }

  async loadPrintDocument() {
    var rsp = await this.dsaService.send("GetPrintDocumentTemplate");
    this.printDocument = [].concat(rsp.PrintDocument || []);
  }

  // 設定學生個人輔導紀錄列印功能
  setCounselPrintItem(studentID: string) {
    this._setCounselInterviewPrintItem.studentID = studentID;

    $("#setCounselInterviewdocPrintItem").modal("show");

    // 關閉畫面
    $("#setCounselInterviewdocPrintItem").on("hide.bs.modal", () => {
      // 重整資料
      if (!this._setCounselInterviewPrintItem.isCancel)
        this.loadStudent();
      $("#setCounselInterviewdocPrintItem").off("hide.bs.modal");
    });

  }

}

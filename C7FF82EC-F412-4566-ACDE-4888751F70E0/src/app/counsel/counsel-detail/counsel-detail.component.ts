import { Component, OnInit, Optional } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  ParamMap,
  RoutesRecognized
} from "@angular/router";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent
} from "../../counsel-student.service";
import { CounselComponent } from "../counsel.component";

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

  // 顯示輔導紀錄
  _interviewEnable: boolean = false;
  // 顯示認輔紀錄
  _counselEnable: boolean = false;
  // 顯示心理測驗
  _psychological_testEnable: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public counselStudentService: CounselStudentService,
    @Optional()
    private counselComponent: CounselComponent
  ) { }

  ngOnInit() {
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
}

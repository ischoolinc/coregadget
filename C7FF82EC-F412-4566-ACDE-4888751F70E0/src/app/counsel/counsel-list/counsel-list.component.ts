import { Component, OnInit, Optional } from "@angular/core";
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RoutesRecognized
} from "@angular/router";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent,
  SemesterInfo
} from "../../counsel-student.service";
import { CounselComponent } from "../counsel.component";
import { AppComponent } from "../../app.component";
import { GlobalService} from "../../global.service";
@Component({
  selector: "app-counsel-list",
  templateUrl: "./counsel-list.component.html",
  styleUrls: ["./counsel-list.component.css"]
})
export class CounselListComponent implements OnInit {
  public deny: boolean;
  public mod: string;
  public target: string;
  public targetList: CounselStudent[];
  currentSchoolYear: number;
  currentSemester: number;

  _semesterInfo: SemesterInfo[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private counselStudentService: CounselStudentService,
    private globalService: GlobalService,
    @Optional()
    private counselComponent: CounselComponent,
    @Optional()
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.mod = params.get("mod");
        this.target = params.get("target");

        this._semesterInfo = [];
        this.getList();
      }
    );
  }

  getList() {
    if (!this.counselStudentService.isLoading) {
      this.currentSchoolYear = this.counselStudentService.currentSchoolYear;
      this.currentSemester = this.counselStudentService.currentSemester;
      this.deny = false;
      // 如果是班導認輔老師轉介個案都無法使用
      if (this.appComponent.roleService) {
        this.appComponent.roleService.SetEnableReferral(false);
        this.appComponent.roleService.SetEnableCase(false);
      }

      if (this.mod === "class") {
        if (this.counselStudentService.classMap.has(this.target)) {
          this.targetList = this.counselStudentService.classMap.get(
            this.target
          ).Student;
          if (this.counselComponent != null) {
            this.counselComponent.setSelectItem(
              this.counselStudentService.classMap.get(this.target).ClassName
            );
            this.globalService.selectTarget = this.target;

            // 細項檢查權限
            if (this.counselStudentService.classMap.get(this.target).Role) {
              if (
                this.counselStudentService.classMap.get(this.target).Role[0] ===
                "班導師"
              ) {
                // 使用轉介,個案
                this.appComponent.roleService.SetEnableCase(false);
                this.appComponent.roleService.SetEnableReferral(false);
              }
              if (
                this.counselStudentService.classMap.get(this.target).Role[0] ===
                "輔導老師"
              ) {
                // 使用轉介,個案
                this.appComponent.roleService.SetEnableCase(true);
                this.appComponent.roleService.SetEnableReferral(true);
              }
            }
          }
        } else {
          this.deny = true;
        }
      }
      if (this.mod === "guidance") {
        if (this.counselComponent != null) {
          if (this.target === "g") {
            this.counselComponent.setSelectItem("認輔學生");
          }
        }
        let tmp = [];
        this.counselStudentService.guidanceStudent.forEach(data => {
          let key = `${data.SchoolYear}_${data.Semester}`;
          if (!tmp.includes(key)) {
            let sms: SemesterInfo = new SemesterInfo();
            sms.SchoolYear = data.SchoolYear;
            sms.Semester = data.Semester;
            this._semesterInfo.push(sms);
            tmp.push(key);
          }
        });
        this.targetList = this.counselStudentService.guidanceStudent;
      }

      if (this.mod === "search") {
        this.targetList = [];
        this.counselStudentService.studentMap.forEach(
          (value: CounselStudent, key: string) => {
            //console.log(value.StudentName);

            if (value.StudentName.indexOf(this.target) > -1) {
              console.log(this.target, value.StudentName);
              this.targetList.push(value);
            }
          }
        );

        if (this.counselComponent != null) {
          this.counselComponent.setSelectItem("搜尋");
        }
      }
    } else {
      if (this.counselComponent != null) {
        this.counselComponent.setSelectItem("");
      }
      setTimeout(this.getList, 100);
    }
  }
}

import { Component, OnInit, Optional } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { CounselStudentService, CounselStudent, SemesterInfo } from "../../counsel-student.service";
import { CounselComponent } from "../counsel.component";
import { AppComponent } from "../../app.component";
import { GlobalService } from "../../global.service";

@Component({
  selector: "app-counsel-list",
  templateUrl: "./counsel-list.component.html",
  styleUrls: ["./counsel-list.component.css"]
})
export class CounselListComponent implements OnInit {
  public deny: boolean;
  public mod: string;
  public target: string;
  /**顯示的list <可能有條件塞選>(view use) */ 
  public targetList: CounselStudent[];
  /**來源<無條件塞選> */
  public scrList: CounselStudent[];
  currentSchoolYear: number;
  currentSemester: number;

  searchMessage: string = "";


  _semesterInfo: SemesterInfo[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public counselStudentService: CounselStudentService,
    private globalService: GlobalService,
    @Optional()
    private counselComponent: CounselComponent,
    @Optional()
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.mod = params.get("mod");
        this.target = params.get("target");

        this._semesterInfo = [];
        this.getList();
      }
    );


    console.log("mod",this.mod);
    console.log("target",this.target)
  }

  async getList() {
    if (!this.counselStudentService.isLoading) {
      this.currentSchoolYear = this.counselStudentService.currentSchoolYear;
      this.currentSemester = this.counselStudentService.currentSemester;
      this.deny = false;
      // // 如果是班導認輔老師轉介個案都無法使用
      // if (this.appComponent.roleService) {
      //   this.appComponent.roleService.SetEnableReferral(false);
      //   this.appComponent.roleService.SetEnableCase(false);
      // }

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

            // // 細項檢查權限
            // if (this.counselStudentService.classMap.get(this.target).Role) {
            //   if (
            //     this.counselStudentService.classMap.get(this.target).Role[0] ===
            //     "班導師"
            //   ) {
            //     // 使用轉介,個案
            //     this.appComponent.roleService.SetEnableCase(false);
            //     this.appComponent.roleService.SetEnableReferral(false);
            //   }
            //   if (
            //     this.counselStudentService.classMap.get(this.target).Role[0] ===
            //     "輔導老師"
            //   ) {
            //     // 使用轉介,個案
            //     this.appComponent.roleService.SetEnableCase(true);
            //     this.appComponent.roleService.SetEnableReferral(true);
            //   }
            // }
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
        // debugger 
        // console.log(' this.counselStudentService.guidanceStudent', this.counselStudentService.guidanceStudent)
        this.counselStudentService.guidanceStudent.forEach(data => {
          let key = `${data.SchoolYearVG}_${data.SemesterVG}`;
          if (!tmp.includes(key)) {
            let sms: SemesterInfo = new SemesterInfo();
            if (data.SchoolYearVG) {
              sms.SchoolYear = data.SchoolYearVG;
              sms.Semester = data.SemesterVG;
              this._semesterInfo.push(sms);
              tmp.push(key);
            }

          }
        });
        this.targetList = this.counselStudentService.guidanceStudent; 
        this.scrList = this.counselStudentService.guidanceStudent ;// 可以塞選
      }

      if (this.mod === "search") {
        this.targetList = [];
        this.searchMessage ="";
        if (this.target.replace('/ /ig', "").length > 0) {
          this.searchMessage = "搜尋中 ...";
          await this.counselStudentService.SearchText(this.target);
          this.targetList = this.counselStudentService.searchStudent;
          if (this.targetList.length === 0) {
            this.searchMessage = "沒有資料。";
          }else
          {
            this.searchMessage = "";
          }
        }



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




  /**依所選條件 選取*/
  getListByCondition(){
  
  // 暫存起來後
  let  temp  = Object.assign({},this.targetList);
  // asign 給 要顯示的 targetList 
  if(temp && temp.length>0){
 

  }

  }
}

import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RoutesRecognized } from '@angular/router';
import { CounselStudentService, CounselClass, CounselStudent } from "../../counsel-student.service";
import { CounselComponent } from "../counsel.component";

@Component({
  selector: 'app-counsel-list',
  templateUrl: './counsel-list.component.html',
  styleUrls: ['./counsel-list.component.css']
})
export class CounselListComponent implements OnInit {
  private deny: boolean;
  private mod: string;
  private target: string;
  private targetList: CounselStudent[];
  currentSchoolYear: number;
  currentSemester: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private counselStudentService: CounselStudentService,
    @Optional()
    private counselComponent: CounselComponent
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap): void => {
      this.mod = params.get("mod");
      this.target = params.get("target");
      this.getList();
    });
  }

  getList() {
    if (!this.counselStudentService.isLoading) {
      this.currentSchoolYear = this.counselStudentService.currentSchoolYear;
      this.currentSemester = this.counselStudentService.currentSemester;
      this.deny = false;
      if (this.mod === "class") {
        if (this.counselStudentService.classMap.has(this.target)) {
          this.targetList = this.counselStudentService.classMap.get(this.target).Student;
          if (this.counselComponent != null) { this.counselComponent.setSelectItem(this.counselStudentService.classMap.get(this.target).ClassName); }
        }
        else {
          this.deny = true;
        }
      }
      if (this.mod === "guidance") {
        if (this.counselComponent != null) { this.counselComponent.setSelectItem("認輔學生"); }
      }
      if (this.mod === "search") {
       
        this.targetList = [];
        this.counselStudentService.studentMap.forEach((value: CounselStudent,key: string)=>{
          //console.log(value.StudentName);
          
          if (value.StudentName.indexOf(this.target)> -1)
          {
            console.log(this.target,value.StudentName);
            this.targetList.push(value);
          }
        });

        console.log(this.targetList);
       
        if (this.counselComponent != null) { this.counselComponent.setSelectItem("搜尋"); }
      }
    }
    else {
      if (this.counselComponent != null) { this.counselComponent.setSelectItem(""); }
      setTimeout(this.getList, 100);
    }
  }
}
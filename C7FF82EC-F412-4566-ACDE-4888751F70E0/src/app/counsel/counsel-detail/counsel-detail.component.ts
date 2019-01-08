import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RoutesRecognized } from '@angular/router';
import { CounselStudentService, CounselClass, CounselStudent } from "../../counsel-student.service";
import { CounselComponent } from "../counsel.component";

@Component({
  selector: 'app-counsel-detail',
  templateUrl: './counsel-detail.component.html',
  styleUrls: ['./counsel-detail.component.css']
})
export class CounselDetailComponent implements OnInit {
  private deny: boolean;
  private studentID: string;
  private currentItem: string;
  private currentStudent: CounselStudent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private counselStudentService: CounselStudentService,
    @Optional()
    private counselComponent: CounselComponent
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap): void => {
      this.studentID = params.get("studentID");
      this.loadStudent();
    });
  }

  loadStudent() {
    if (!this.counselStudentService.isLoading) {
      this.deny = false;
      if (this.counselStudentService.studentMap.has(this.studentID)) {
        this.currentStudent = this.counselStudentService.studentMap.get(this.studentID);

        if (this.counselComponent != null) {
          if (this.currentStudent.Role.indexOf('班導師') >= 0 || this.currentStudent.Role.indexOf('輔導老師') >= 0)
            this.counselComponent.setSelectItem(this.currentStudent.ClassName);
          else
            this.counselComponent.setSelectItem("認輔學生");
        }
      }
      else {
        this.deny = true;
      }
    }
    else {
      setTimeout(this.loadStudent, 100);
    }
  }

  routeTo(to) {
    //讓特效跑
    setTimeout(function () {
      this.router.navigate([].concat(to || []), {
        relativeTo: this.activatedRoute
      });
    }.bind(this), 200);
  }

  public setCurrentItem(item: string) {
    setTimeout(() => { this.currentItem = item; });
  }
}

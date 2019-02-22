import { Component, OnInit } from "@angular/core";
import {
  CounselStudentService,
  CounselClass,
  CounselStudent
} from "../../counsel-student.service";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";

@Component({
  selector: "app-counsel-routing",
  templateUrl: "./counsel-routing.component.html",
  styleUrls: ["./counsel-routing.component.css"]
})
export class CounselRoutingComponent implements OnInit {
  constructor(
    private counselStudentService: CounselStudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routing();
  }

  routing() {
    let classID = "";
    if (!this.counselStudentService.isLoading) {
      if (this.counselStudentService.counselClass.length > 0) {
       
        if (!this.counselStudentService.selectTarget) {
          classID = this.counselStudentService.counselClass[0].ClassID;
        } else {
          classID = this.counselStudentService.selectTarget;
        }
        this.router.navigate(["list", "class", classID], {
          relativeTo: this.route,
          skipLocationChange: true
        });
      }
      if (this.counselStudentService.guidanceStudent.length > 0) {
        if (!classID){
          this.router.navigate(["list", "guidance", ""], {
            relativeTo: this.route,
            skipLocationChange: true
          });
        }    
      }
    } else {
      setTimeout(this.routing, 100);
    }
  }
}

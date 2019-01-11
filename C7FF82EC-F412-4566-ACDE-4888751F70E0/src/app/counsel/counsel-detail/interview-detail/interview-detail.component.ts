import { Component, OnInit } from '@angular/core';
import { CounselStudentService, CounselClass, CounselStudent } from "../../../counsel-student.service";
@Component({
  selector: 'app-interview-detail',
  templateUrl: './interview-detail.component.html',
  styleUrls: ['./interview-detail.component.css']
})
export class InterviewDetailComponent implements OnInit {
  enableReferal:boolean = false;
  constructor(
    private counselStudentService: CounselStudentService
  ) { }

  ngOnInit() {
    console.log("StudentID:" + this.counselStudentService.currentStudent.StudentID);
    if (this.counselStudentService.currentStudent.Role.indexOf('輔導老師') >= 0)
    {
      this.enableReferal = true;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { DsaService } from "../../../dsa.service";
import { TeacherCounselRole } from "../counsel-teacher-role-vo";

@Component({
  selector: 'app-del-counsel-teacher-role-modal',
  templateUrl: './del-counsel-teacher-role-modal.component.html',
  styleUrls: ['./del-counsel-teacher-role-modal.component.css']
})
export class DelCounselTeacherRoleModalComponent implements OnInit {

  teacherCounselRole: TeacherCounselRole = new TeacherCounselRole();
  constructor(private dsaService: DsaService) { }

  ngOnInit() {
  }

  cancel() {
    $("#delCounselTeacherRole").modal("hide");
  }

  del() {
    this.DelTeachersCounselRole();

  }

  async DelTeachersCounselRole() {
    try {
      let resp = await this.dsaService.send("DelTeachersCounselRole", {
        Request: {
          TeacherID: this.teacherCounselRole.TeacherID
        }
      });
     
      $("#delCounselTeacherRole").modal("hide");
    } catch (err) {
      alert("無法刪除:"+ err.dsaError.message);
    }
  }
}

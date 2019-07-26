import { Component, OnInit } from '@angular/core';
import { DsaService } from "../../../../dsa.service";
import { CaseInterview } from "../case-interview-vo";
@Component({
  selector: 'app-del-case-interview-modal',
  templateUrl: './del-case-interview-modal.component.html',
  styleUrls: ['./del-case-interview-modal.component.css']
})
export class DelCaseInterviewModalComponent implements OnInit {

  caseInterview: CaseInterview;
  isCancel: boolean = true;
  constructor(private dsaService: DsaService) { }

  ngOnInit() {
    this.caseInterview = new CaseInterview();
    this.isCancel = true;
  }

  cancel() {
    this.isCancel = true;
    $("#delCaseInterview").modal("hide");
  }

  del() {
    this.isCancel = false;
    this.DelCaseInterviewByUID();
  }

  async DelCaseInterviewByUID() {
    try {
      let resp = await this.dsaService.send("DelCaseInterviewByUID", {
        Request: {
          UID: this.caseInterview.UID
        }
      });
      $("#delCaseInterview").modal("hide");
    } catch (err) {
      alert(err);
    }
  }
}

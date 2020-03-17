import { Component, OnInit } from '@angular/core';
import { DsaService } from "../../dsa.service";
import { CaseStudent } from "../case-student";

@Component({
  selector: 'app-del-case-modal',
  templateUrl: './del-case-modal.component.html',
  styleUrls: ['./del-case-modal.component.css']
})

// 刪除個案記錄
export class DelCaseModalComponent implements OnInit {

  _CaseStudent: CaseStudent = new CaseStudent();
  isCancel: boolean = false;

  constructor(private dsaService: DsaService) { }

  ngOnInit() {
  }

  del() {
    this.isCancel = false;
    this.DelCaseByUID();
  }

  cancel() {
    this.isCancel = true;
    $("#delCaseModal").modal("hide");
  }

  async DelCaseByUID() {
    try {

      let resp = await this.dsaService.send("DelCaseByUID", {
        Request: {
          UID: this._CaseStudent.UID
        }
      });
      $("#delCaseModal").modal("hide");
    } catch (err) {
      alert(err);
    }

  }
}

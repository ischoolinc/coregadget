import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
// import { NewCaseModalComponent } from '../case/new-case-modal/new-case-modal.component';
import { NewWorkModalComponent } from "../work-service/new-work-modal/new-work-modal.component";
@Component({
  selector: 'app-work-service',
  templateUrl: './work-service.component.html',
  styleUrls: ['./work-service.component.css']
})
export class WorkServiceComponent implements OnInit {
  @ViewChild("work_modal") work_modal:NewWorkModalComponent ;
  constructor(  @Optional()
  private appComponent: AppComponent) { }

  ngOnInit() {
  }

  /**建立工作項目 */
  addNewWorkService()
  {

    $("#newWork").modal("show");
    // 關閉畫面
    $("#newWork").on("hide.bs.modal", () => {
      // 重整資料
      if (true)
        this.loadData();
      $("#newWork").off("hide.bs.modal");
    });



    
  }
  /**載入資料 */
  loadData()
  {

  }


}

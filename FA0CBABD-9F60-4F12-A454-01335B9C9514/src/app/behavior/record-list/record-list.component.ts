import { Component, OnInit } from '@angular/core';
import { GadgetService, Contract } from "src/app/gadget.service"; //連線資料庫
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styles: []
})
export class RecordListComponent implements OnInit {

  contract: Contract;
  BahaviorRecordList :any ;
 
  constructor(
    private gadget: GadgetService, ) { }

  async ngOnInit() {
    this.contract = await this.gadget.getContract('kcis.student');
    this.getBehaviorRecordsByStudentID();
  }

  /*取得該學生之behavior*/
  async getBehaviorRecordsByStudentID() {
    const req = await this.contract.send('_.GetBehaviorRecordsByStudentID')
    this.BahaviorRecordList=req.BehaviorData;
  }
}

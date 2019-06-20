import { Component, OnInit } from '@angular/core';
import { GadgetService, Contract } from "src/app/gadget.service"; //連線資料庫
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styles: []
})
export class RecordListComponent implements OnInit {

  contract: Contract;
  BahaviorRecordList: any;
  StudentID: string;
  StudentName: string;
  constructor(
    private route: ActivatedRoute,
    private gadget: GadgetService, ) { }

  async ngOnInit() {
    this.contract = await this.gadget.getContract('kcis.parent');
    this.StudentID = this.route.snapshot.paramMap.get('studentID');
    this.StudentName = this.route.snapshot.paramMap.get('studentName');
    this.getBehaviorRecordsByStudentID();
  }

  /*取得該學生之behavior*/
  async getBehaviorRecordsByStudentID() {
    try {
      const req = await this.contract.send('_.GetBehaviorRecordByStudentID'
        , {
          Request: {
            StudentID: this.StudentID
          }
        }
      )
      this.BahaviorRecordList = req.BehaviorData;
    }
    catch (err) 
    {
      alert(( err.dsaError && err.dsaError.message) ? err.dsaError.message : '發生錯誤');
    }finally
    {

    }
  }
}
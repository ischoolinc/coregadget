import { Component, OnInit, Input } from '@angular/core';
import { Contract, GadgetService } from 'src/app/gadget.service';
@Component({
  selector: 'app-child-behavior',
  templateUrl: './child-behavior.component.html',
  styles: []
})
export class ChildBehaviorComponent implements OnInit {

  @Input() child: any;
  contract: Contract;
  childStudentID: string; //抓學生ID 
  BehaviorRecordLimit: any; //
  constructor(private gadget: GadgetService,
  ) { }

  async ngOnInit() {

    //1.取得學生id
    this.contract = await this.gadget.getContract('ksic.parent');
    this.childStudentID = this.child.StudentID;
    this.getStudentBehaviorRecord();
  }


  /* 取得前6筆 */
  async getStudentBehaviorRecord() {

    const rsp = await this.contract.send("_.GetBehaviorRecordLimit"
      , {
        Request: {
          StudentID:this.childStudentID
        }
      }
    );
    console.log("rsp",rsp)
    this.BehaviorRecordLimit = rsp.BehaviorData;
  }
}

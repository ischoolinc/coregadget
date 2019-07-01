import { Component, OnInit } from '@angular/core';
import { GadgetService, Contract } from 'src/app/gadget.service';
import { Utils } from 'src/app/util';

@Component({
  selector: 'app-parent-main',
  templateUrl: './parent-main.component.html',
  styles: []
})
export class ParentMainComponent implements OnInit {
  contract: Contract;
  // ChildsBahaviorRecordList :any;
  ChildrenInfo: any;

  constructor(private gadget: GadgetService, ) { }

  async ngOnInit() {
    this.contract = await this.gadget.getContract('kcis.parent');
    this.getChildrenStudentID();
  }


  //取得小孩
  async getChildrenStudentID() {
    const rsp = await this.contract.send('_.GetChildren');
    this.ChildrenInfo = Utils.array(rsp, "Response/StudentID");
    console.log("req", this.ChildrenInfo);

  }
}

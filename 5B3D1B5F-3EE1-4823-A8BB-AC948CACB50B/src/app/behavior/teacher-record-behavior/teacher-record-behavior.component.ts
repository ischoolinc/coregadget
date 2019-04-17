import { Component, OnInit } from '@angular/core';
import { GadgetService, Contract } from 'src/app/gadget.service';
import { Utils } from 'src/app/util';
@Component({
  selector: 'app-teacher-record-behavior',
  templateUrl: './teacher-record-behavior.component.html',
  styles: []
})
export class TeacherRecordBehaviorComponent implements OnInit {

  private behaviorRecords: any;
  private contract: any;

  constructor(private gadget: GadgetService) { }

  async ngOnInit() {
    this.contract = await this.gadget.getContract('kcis');
    this.getBehaviorData();
  }
  async getBehaviorData() {
    try {

      const rsp = await this.contract.send("behaviorForAll.GetBehaviorRecordByTeacher");
      this.behaviorRecords = Utils.array(rsp, "Response/BehaviorData");

    }
    catch (err) { console.log(err) }
    finally { }
  }
}

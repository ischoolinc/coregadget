import { Component, OnInit, Input } from '@angular/core';
import { ClassInfo, BehaviorRecord } from 'src/app/models/vo';
import { Contract, GadgetService } from 'src/app/gadget.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../dialog-service.service';
import { Utils } from 'src/app/util';

@Component({
  selector: 'app-class-behavior',
  templateUrl: './class-behavior.component.html',
  styles: []
})
export class ClassBehaviorComponent implements OnInit {

  @Input() cls: ClassInfo;

  BehaviorRecords: any;
  private classID: any;
  private contract: Contract;
  constructor(
    private gadget: GadgetService,
  ) { }

  async ngOnInit() {
    //1.取得班級ID
    this.contract = await this.gadget.getContract('kcis');
    this.classID = this.cls.classID;
    //2.依班級ID 取得行為表現紀錄
    this.getClassBehaviorRecords();
  }

  async  getClassBehaviorRecords() {
    //一班級ID 取得該班行為表現紀錄 (前6筆)
    const rsp = await this.contract.send("behaviorForAll.GetBehaviorDataByClassLimit"
      , {
        Request: {
          ClassID: this.classID
        }
      }
    );
    this.BehaviorRecords = Utils.array(rsp, "Response/BehaviorData");
  }
}

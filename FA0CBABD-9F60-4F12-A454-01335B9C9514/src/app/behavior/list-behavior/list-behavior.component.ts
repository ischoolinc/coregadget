import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GadgetService, Contract } from "src/app/gadget.service";
import { Utils } from "src/app/util";

@Component({
  selector: 'app-list-behavior',
  templateUrl: './list-behavior.component.html',
  styles: []
})
export class ListBehaviorComponent implements OnInit {

  classID: any;
  className;
  behaviorDataList: any;
  listMyRecord: any;
  contract: Contract;

  constructor(
    private route: ActivatedRoute,
    private gadget: GadgetService,
  ) { }

  async ngOnInit() {
    this.contract = await this.gadget.getContract('kcis');
    this.classID = this.route.snapshot.paramMap.get('classID');
    this.className = this.route.snapshot.paramMap.get('className');
    
  }

  /**
   * 取得指定班級的 Behavior records
   */
  //連線
  async  getClassBehaviorRecordsByClass() {
    //班級
    const RspBehaviorDataList = await this.contract.send("behaviorForAll.GetBehaviorDataByClassID"
      , {
        Request: {
          ClassID: this.classID
        }
      }
    );
    this.behaviorDataList = Utils.array(RspBehaviorDataList, "Response/BehaviorData");

  }

  /**
   * 取得我紀錄的 Behavoir records
  */
  //




}

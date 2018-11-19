import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GadgetService, Contract } from '../gadget.service';

@Component({
  selector: 'app-detailview',
  templateUrl: './detailview.component.html',
  styleUrls: ['./detailview.component.css']
})
export class DetailviewComponent implements OnInit {
  private uid: string;
  private loading: boolean = true;
  private connection: Contract;
  private behavior: any;

  constructor(
    private route: ActivatedRoute
    , private gadget: GadgetService
  ) { }

  ngOnInit() {
    // 從網址取得UID
    this.route.paramMap.subscribe(async pm => {
      this.uid = pm.get("uid");
      this.connection = await this.gadget.getContract("behavior.notification");
      this.behavior = (await this.connection.send("GetBehaviorByUID", { UID: this.uid })).Behavior;
      this.loading = false;
    });
  }

  getString(){
    return JSON.stringify(this.behavior);
  }
}

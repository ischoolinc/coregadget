import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GadgetService, Contract } from '../gadget.service';

@Component({
  selector: 'app-detailview',
  templateUrl: './detailview.component.html',
  styleUrls: ['./detailview.component.css']
})
export class DetailviewComponent implements OnInit {
  private uid: string;
  loading: boolean = true;
  private connection: Contract;
  private behavior: any;
  private error: any;

  constructor(
    private route: ActivatedRoute
    , private gadget: GadgetService
    , private location: Location
  ) { }

  ngOnInit() {
    // 從網址取得UID
    this.route.paramMap.subscribe(async pm => {
      this.uid = pm.get("uid");
      this.connection = await this.gadget.getContract("behavior.notification");
      this.behavior = (await this.connection.send("GetBehaviorByUID", { UID: this.uid })).Behavior;
      this.behavior.NotifyParent = this.behavior.NotifyParent == "true";
      this.behavior.NotifyStudent = this.behavior.NotifyStudent == "true";
      this.behavior.MailSendParent = this.behavior.MailSendParent == "true";
      this.behavior.MailSendStudent = this.behavior.MailSendStudent == "true";

      var createDate = new Date(Number(this.behavior.CreateDate));
      this.behavior.CreateDate = createDate.getFullYear() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getDate();

      this.loading = false;
    });
  }

  getString() {
    return JSON.stringify(this.behavior);
  }

  goBack(): void {
    this.location.back();
  }

  async save() {
    this.loading = true;
    try {
      await this.connection.send("SetNotifyConfig", { UID: this.uid, NotifyParent: this.behavior.NotifyParent, NotifyStudent: this.behavior.NotifyStudent });
    }
    catch (err) {
      this.error = err;
    }
    this.loading = false;
  }
}

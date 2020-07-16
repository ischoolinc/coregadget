import { Component, Optional, OnInit } from "@angular/core";
import { AppComponent } from "../app.component";
import { RoleService } from "../role.service";
import {ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-referral",
  templateUrl: "./referral.component.html",
  styleUrls: ["./referral.component.css"]
})
export class ReferralComponent implements OnInit {
  public selectItem: string;
  public itemList: string[] = [];
  // 搜尋文字
  searchText: string = "";
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public roleService: RoleService,
    @Optional()
    private appComponent: AppComponent
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "referral";
  }

  ngOnInit() {
    this.routing();
  }

  routing() {
    this.router.navigate(["list", "未結案"], {
      relativeTo: this.activatedRoute,
      skipLocationChange: true
    });
  }
}

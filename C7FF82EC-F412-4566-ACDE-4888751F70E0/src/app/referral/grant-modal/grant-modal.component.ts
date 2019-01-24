import { Component, OnInit, Input } from "@angular/core";
import { ReferralStudent } from "../referral-student";

@Component({
  selector: "app-grant-modal",
  templateUrl: "./grant-modal.component.html",
  styleUrls: ["./grant-modal.component.css"]
})
export class GrantModalComponent implements OnInit {
  //@Input('test') masterName: string;

  referralStudent: ReferralStudent;

  constructor() {}

  ngOnInit() {}

save(){
  alert("Save!");
}
}

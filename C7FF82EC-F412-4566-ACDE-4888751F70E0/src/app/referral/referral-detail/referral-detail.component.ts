import { Component, OnInit, Optional } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  ParamMap,
  RoutesRecognized
} from "@angular/router";
import { ReferralStudent } from "../referral-student";
import { DsaService } from "../../dsa.service";

@Component({
  selector: "app-referral-detail",
  templateUrl: "./referral-detail.component.html",
  styleUrls: ["./referral-detail.component.css"]
})
export class ReferralDetailComponent implements OnInit {
  referralStudent: ReferralStudent;
  studentID: string;
  interviewID: string;
  isLoading: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,    
  ) {}

  ngOnInit() {
    this.referralStudent = new ReferralStudent();
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.studentID = params.get("studentID");
        this.interviewID = params.get("interviewID");
      }
    );
    this.loadReferralStudent();
  }

  loadReferralStudent()
  {
    this.GetReferralStudentByUid();
  }
  
  async GetReferralStudentByUid() {
   this.isLoading = true;
    let resp = await this.dsaService.send("GetReferralStudentByUid", {
      Request: {
        UID: this.interviewID
      }
    });
    
    [].concat(resp.ReferralStudent || []).forEach(studRec => {
      // 建立轉介學生資料
      let rec: ReferralStudent = new ReferralStudent();
      rec.UID = studRec.UID;
      rec.StudentID = studRec.StudentID;
      rec.ClassName = studRec.ClassName;
      rec.SeatNo = studRec.SeatNo;
      rec.Name = studRec.Name;
      rec.Gender = studRec.Gender;
      rec.TeacherName = studRec.TeacherName;
      let n1 = Number(studRec.OccurDate);
      let d1 = new Date(n1);
      rec.OccurDate = rec.parseDate(d1);
      rec.ReferralDesc = studRec.ReferralDesc;
      rec.ReferralReply = studRec.ReferralReply;
      rec.ReferralStatus = studRec.ReferralStatus;
      rec.ReferralReplyDate = studRec.ReferralReplyDate;
      rec.ReferralReplyDesc = studRec.ReferralReplyDesc;
      this.referralStudent = rec;
    });
    this.isLoading = false;
  }
  
}

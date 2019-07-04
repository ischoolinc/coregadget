import { Component, OnInit, Optional } from '@angular/core';
import { CounselDetailComponent } from "../counsel-detail.component";
import { DsaService } from "../../../dsa.service";
import { CounselStudentService } from "../../../counsel-student.service";

@Component({
  selector: 'app-semester-score-detail',
  templateUrl: './semester-score-detail.component.html',
  styleUrls: ['./semester-score-detail.component.css']
})
export class SemesterScoreDetailComponent implements OnInit {

  constructor(private counselStudentService: CounselStudentService,
    private dsaService: DsaService,
    @Optional() private counselDetailComponent: CounselDetailComponent) { }

  ngOnInit() {
    this.counselDetailComponent.setCurrentItem('semester_score');
  }

}

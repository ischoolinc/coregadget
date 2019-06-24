import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DsaService } from '../../dsa.service';
import { ComprehensiveComponent } from "../comprehensive.component";

@Component({
  selector: 'app-comprehensive-section',
  templateUrl: './comprehensive-section.component.html',
  styleUrls: ['./comprehensive-section.component.css']
})
export class ComprehensiveSectionComponent implements OnInit {

  schoolYear: string;
  semester: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    @Optional()
    private comprehensiveComponent: ComprehensiveComponent
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.schoolYear = params.get("schoolYear");
        this.semester = params.get("semester");
        this.comprehensiveComponent.semeserList.forEach(target => {
          if (target.SchoolYear == this.schoolYear && target.Semester == this.semester)
            this.comprehensiveComponent.currentSemester = target;
        });
      }
    );
  }

}

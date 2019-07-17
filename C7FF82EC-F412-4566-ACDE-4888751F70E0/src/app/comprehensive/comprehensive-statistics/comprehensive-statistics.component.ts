import { Component, OnInit, Optional, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DsaService } from '../../dsa.service';
import { ComprehensiveComponent } from "../comprehensive.component";

@Component({
  selector: 'app-comprehensive-statistics',
  templateUrl: './comprehensive-statistics.component.html',
  styleUrls: ['./comprehensive-statistics.component.css']
})
export class ComprehensiveStatisticsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    public changeDetectorRef: ChangeDetectorRef,
    @Optional()
    public comprehensiveComponent: ComprehensiveComponent) { }

  ngOnInit() {
    this.comprehensiveComponent.currentMode = "statistics";
    this.comprehensiveComponent.changeDetectorRef.detectChanges();
  }

}

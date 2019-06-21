import { Component, OnInit, Optional } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.css']
})
export class ComprehensiveComponent implements OnInit {

  deny: boolean = false;
  isLoading: boolean = false;
  currentSemester: any;
  semeserList: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional()
    private appComponent: AppComponent
  ) {

  }

  ngOnInit() {
    this.appComponent.currentComponent = "comprehensive";
    this.semeserList = [{ SchoolYear: "107", Semester: "2" }, { SchoolYear: "107", Semester: "1" }];
  }

  setCurrentSemester(semester: any) {
    this.currentSemester = semester;
  }
}

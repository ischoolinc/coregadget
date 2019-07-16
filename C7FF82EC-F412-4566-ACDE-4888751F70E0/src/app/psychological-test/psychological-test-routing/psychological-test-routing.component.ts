import { Component, OnInit,Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PsychologicalTestComponent} from '../psychological-test.component';

@Component({
  selector: 'app-psychological-test-routing',
  templateUrl: './psychological-test-routing.component.html',
  styleUrls: ['./psychological-test-routing.component.css']
})
export class PsychologicalTestRoutingComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional()
    public psychologicalTestComponent:PsychologicalTestComponent
  ) { }

  ngOnInit() {
    this.router.navigate(['psychological-test-list'], {
      relativeTo: this.activatedRoute
      , skipLocationChange: true
    });      
  }

}

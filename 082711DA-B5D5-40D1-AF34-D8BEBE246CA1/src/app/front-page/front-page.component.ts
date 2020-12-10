import { ListFormComponent } from './../list-form/list-form.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListControlService } from './ListControl.service';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss'],
  providers: [ListControlService]
})
export class FrontPageComponent implements OnInit {

  constructor(
    private data: ListControlService
  ) { }

  // @ViewChild(ListFormComponent, {static: true}) list: ListFormComponent;

  ngOnInit(): void {
    //this.data.list = this.list;
  }

  // public refreshList() {
  // }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counsel-doc2-base',
  templateUrl: './counsel-doc2-base.component.html',
  styleUrls: ['./counsel-doc2-base.component.css']
})
export class CounselDoc2BaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("#appcomponent").remove();
  }

}

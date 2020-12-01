import { Component, OnInit } from '@angular/core';
import { GadgetService } from '../gadget.service';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {
  LeavveDateInfos:[] =[];
  constructor(private dsa: GadgetService)
  {

   }


  ngOnInit(): void {
  }


  /**
   *
   */
  loadDate()
  {


  }
}

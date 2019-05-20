import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SelectionResult, ClassSelection } from '../selection-result';
import { ClassRecord } from '../chooser.component';

@Component({
  selector: 'app-seleted-detail',
  templateUrl: './selected-detail.component.html',
  styleUrls: ['./selected-detail.component.scss']
})
export class SelectedDetailComponent implements OnInit {

  record: ClassRecord;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SelectionResult
  ) {
    this.record = (data as ClassSelection).record;
  }

  ngOnInit() {
  }

}

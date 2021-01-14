import { Component, Input, OnInit } from '@angular/core';
import { SubjectRec } from 'src/app/data';
import { MatDialog } from '@angular/material/dialog';
import { PlanEditorComponent } from '../plan-editor/plan-editor.component';

@Component({
  selector: 'app-plan-info',
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit {

  @Input() dataSource: SubjectRec[] = [];
  @Input() columns: string[] = [];

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openEditor() {
    this.dialog.open(PlanEditorComponent, {});
  }

}

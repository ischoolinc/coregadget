import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChooserComponent } from '../chooser.component';
import { SelectionResult } from '../data';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openChooser() {
    this.dialog.open<ChooserComponent, {}, SelectionResult[]>(ChooserComponent, {
      data: { target: 'STUDENT' },
      width: '80%',
      disableClose: false,
    });
  }

}

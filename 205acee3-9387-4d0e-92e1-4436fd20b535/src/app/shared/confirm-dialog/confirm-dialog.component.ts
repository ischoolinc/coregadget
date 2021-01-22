import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmRec
  ) { }

  ngOnInit(): void {
  }

  yes() {
    this.dialogRef.close({result: true});
  }

  no() {
    this.dialogRef.close({result: false});
  }

}

interface ConfirmRec {
  title: string;
  confirmContent: string;
  yesBtnText: string;
  noBtnText: string;
}

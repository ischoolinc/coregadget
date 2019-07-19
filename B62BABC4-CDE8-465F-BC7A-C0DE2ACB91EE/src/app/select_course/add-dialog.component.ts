import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styles: []
})
export class AddDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  buttonText: string = '';

  ngOnInit() {
    if (this.data.mode == '志願序') {
      this.buttonText = '加入志願';
    } else if (this.data.mode == '先搶先贏') {
      this.buttonText = '選課';
    } else {
      this.buttonText = '';
    }
  }

  join() {
    this.dialogRef.close({
      // 回傳 subject
      subject: this.data.subject,
    })
  }

  close() {
    this.dialogRef.close()
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styles: []
})
export class EditDialogComponent implements OnInit {

  comment: string = '';
  detention: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.comment = this.data.comment;
    this.detention = this.data.detention == true;
  }

  onNoClick(): void {
    this.dialogRef.close({
      comment: '',
      detention: false,
      confirm: false,
    });
  }

  onYesClick(): void {

    if(this.comment.trim()==""||!(this.comment))
    {
      alert("請輸入事由");
    }else{
    this.dialogRef.close({
      comment: this.comment,
      detention: this.detention,
      confirm: true,
    });
  }
  }
}

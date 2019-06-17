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
  isGoodBehavior :boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.comment = this.data.comment;
    this.detention = this.data.detention == true;
    this.isGoodBehavior = this.data.isGoodBehavior == true ;
  }

  onNoClick(): void {
    this.dialogRef.close({
      comment: '',
      detention: false,
      isGoodBehavior :false,
      confirm: false,
    });
  }

  onYesClick(): void {

    if(this.isGoodBehavior && this.detention)
  {
    alert("Good and Detention can't be selected in the same time")
    return ;
  }

    this.dialogRef.close({
      comment: this.comment,
      detention: this.detention,
      isGoodBehavior : this.isGoodBehavior,
      confirm: true,
    });




  }
}

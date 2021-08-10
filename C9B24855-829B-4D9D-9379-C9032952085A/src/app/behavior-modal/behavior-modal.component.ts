import { CurrentItem } from './../vo/vo';
import { Component, Inject, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Behavior, ModalData } from '../vo/vo';

@Component({
  selector: 'app-behavior-modal',
  templateUrl: './behavior-modal.component.html',
  styleUrls: ['./behavior-modal.component.scss']
})
export class BehaviorModalComponent implements OnInit {

  showItem : Behavior | undefined ;
  currentIndex : number  =0 ;
  constructor(
    public dialogRef: MatDialogRef<BehaviorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) { }

  ngOnInit(): void {
    this.currentIndex = this.data.currentIndex ;
    this.showItem = this.data.BehaviorList[ this.currentIndex];

  }

  prev(){
      if((this.currentIndex-1) <0 ){
        return ;
      }
      this.currentIndex =this.currentIndex -1;
      this.showItem = this.data.BehaviorList[ this.currentIndex];
  }

  next(){
    if((this.currentIndex+1)>this.data.BehaviorList.length-1){
        return ;
      }
      this.currentIndex = this.currentIndex+1;
      this.showItem = this.data.BehaviorList[ this.currentIndex];
    }
}

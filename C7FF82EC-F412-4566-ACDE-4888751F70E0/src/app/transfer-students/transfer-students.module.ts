import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferStudentsComponent } from './transfer-students.component';
import { TransferStudentsRoutingModule } from './transfer-students-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TransferInComponent } from './transfer-in/transfer-in.component';
import { TransferOutComponent } from './transfer-out/transfer-out.component';

@NgModule({
  declarations: [
    TransferStudentsComponent,
    TransferInComponent,
    TransferOutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransferStudentsRoutingModule,
  ]
})
export class TransferStudentsModule { }

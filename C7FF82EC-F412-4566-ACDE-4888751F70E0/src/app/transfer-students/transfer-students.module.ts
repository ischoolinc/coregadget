import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferStudentsComponent } from './transfer-students.component';
import { TransferStudentsRoutingModule } from './transfer-students-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TransferInComponent } from './transfer-in/transfer-in.component';
import { TransferOutComponent } from './transfer-out/transfer-out.component';
import { RegTransferInModalComponent } from './transfer-in/reg-transfer-in-modal/reg-transfer-in-modal.component';
import { CheckTransferOutModalComponent } from './transfer-out/check-transfer-out-modal/check-transfer-out-modal.component';
import { CancelTransferInModalComponent } from './transfer-in/cancel-transfer-in-modal/cancel-transfer-in-modal.component';

@NgModule({
  declarations: [
    TransferStudentsComponent,
    TransferInComponent,
    TransferOutComponent,
    RegTransferInModalComponent,
    CheckTransferOutModalComponent,
    CancelTransferInModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransferStudentsRoutingModule,
  ]
})
export class TransferStudentsModule { }

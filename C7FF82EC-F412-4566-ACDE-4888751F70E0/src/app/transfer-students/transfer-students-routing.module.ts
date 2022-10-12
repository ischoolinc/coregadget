import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferInComponent } from './transfer-in/transfer-in.component';
import { TransferOutComponent } from './transfer-out/transfer-out.component';
import { TransferStudentsComponent } from './transfer-students.component';

const routes: Routes = [
  {
    path: '', component: TransferStudentsComponent,
    children: [
      { path: 'transfer_in', component: TransferInComponent },
      { path: 'transfer_out', component: TransferOutComponent },
      { path: '', pathMatch: 'full', redirectTo: 'transfer_in' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferStudentsRoutingModule { }

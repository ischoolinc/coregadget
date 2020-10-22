import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferralComponent } from './referral.component';
import { ReferralListComponent } from './referral-list/referral-list.component';
import { ReferralDetailComponent } from './referral-detail/referral-detail.component';

const routes: Routes = [
  { path: "list/:target", component: ReferralListComponent },
  {
    path: "detail/:studentID/:interviewID",
    component: ReferralDetailComponent,
    loadChildren: './counsel-detail/counsel-detail.module#CounselDetailModule'
  },
  { path: "", component: ReferralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefferralRoutingModule { }

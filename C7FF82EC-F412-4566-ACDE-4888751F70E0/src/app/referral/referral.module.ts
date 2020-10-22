import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SharedCounselDetailModule } from '../shared-counsel-detail/shared-counsel-detail.module';
import { ReferralComponent } from './referral.component';
import { GrantModalComponent } from './grant-modal/grant-modal.component';
import { ReferralDetailComponent } from './referral-detail/referral-detail.component';
import { ReferralListComponent } from './referral-list/referral-list.component';
import { CaseModule } from '../case/case.module';
import { RefferralRoutingModule } from './referral-routing.module';

@NgModule({
  declarations: [
    ReferralComponent,
    GrantModalComponent,
    ReferralDetailComponent,
    ReferralListComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    RefferralRoutingModule,
    SharedCounselDetailModule,
    CaseModule,
  ]
})
export class ReferralModule { }

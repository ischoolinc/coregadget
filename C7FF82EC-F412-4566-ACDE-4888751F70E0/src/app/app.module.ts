import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReferralListComponent } from './referral/referral-list/referral-list.component';
import { CounselStatisticsComponent } from './statistics/counsel-statistics/counsel-statistics.component';
import { CaseListComponent } from './case/case-list/case-list.component';
import { CounselListComponent } from './counsel/counsel-list/counsel-list.component';
import { GrantModalComponent } from './referral/grant-modal/grant-modal.component';
import { MatModuleModule } from './mat-module/mat-module.module';
import { InterviewStatisticsComponent } from './statistics/interview-statistics/interview-statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    ReferralListComponent,
    CounselStatisticsComponent,
    CaseListComponent,
    CounselListComponent,
    GrantModalComponent,
    InterviewStatisticsComponent
  ],
  imports: [
    BrowserModule,
    MatModuleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

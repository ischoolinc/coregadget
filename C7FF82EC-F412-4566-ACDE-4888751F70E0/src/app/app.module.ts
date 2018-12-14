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
import { AppRoutingModule } from './app-routing.module';
import { AddInterviewModalComponent } from './counsel/counsel-detail/interview-detail/add-interview-modal/add-interview-modal.component';
import { ViewInterviewModalComponent } from './counsel/counsel-detail/interview-detail/view-interview-modal/view-interview-modal.component';
import { NewCaseModalComponent } from './case/new-case-modal/new-case-modal.component';
import { MainComponent } from './main/main.component';
import { CounselComponent } from './counsel/counsel.component';
import { CounselDetailComponent } from './counsel/counsel-detail/counsel-detail.component';
import { InterviewDetailComponent } from './counsel/counsel-detail/interview-detail/interview-detail.component';
import { PsychologicalTestDetailComponent } from './counsel/counsel-detail/psychological-test-detail/psychological-test-detail.component';
import { AbsentDetailComponent } from './counsel/counsel-detail/absent-detail/absent-detail.component';
import { ExamScoreDetailComponent } from './counsel/counsel-detail/exam-score-detail/exam-score-detail.component';
import { SemesterScoreDetailComponent } from './counsel/counsel-detail/semester-score-detail/semester-score-detail.component';
import { CounselItemDetailComponent } from './counsel/counsel-detail/counsel-item-detail/counsel-item-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ReferralListComponent,
    CounselStatisticsComponent,
    CaseListComponent,
    CounselListComponent,
    GrantModalComponent,
    InterviewStatisticsComponent,
    AddInterviewModalComponent,
    ViewInterviewModalComponent,
    NewCaseModalComponent,
    MainComponent,
    CounselComponent,
    CounselDetailComponent,
    InterviewDetailComponent,
    PsychologicalTestDetailComponent,
    AbsentDetailComponent,
    ExamScoreDetailComponent,
    SemesterScoreDetailComponent,
    CounselItemDetailComponent
  ],
  imports: [
    BrowserModule,
    MatModuleModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

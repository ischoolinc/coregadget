import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

import { AppComponent } from './app.component';
import { CounselStatisticsComponent } from './counsel-statistics/counsel-statistics.component';
import { CounselListComponent } from './counsel/counsel-list/counsel-list.component';
import { GrantModalComponent } from './referral/grant-modal/grant-modal.component';
import { InterviewStatisticsComponent } from './interview-statistics/interview-statistics.component';
import { AppRoutingModule } from './app-routing.module';
import { AddInterviewModalComponent } from './counsel/counsel-detail/interview-detail/add-interview-modal/add-interview-modal.component';
import { ViewInterviewModalComponent } from './counsel/counsel-detail/interview-detail/view-interview-modal/view-interview-modal.component';
import { NewCaseModalComponent } from './case/new-case-modal/new-case-modal.component';
import { CounselComponent } from './counsel/counsel.component';
import { CounselDetailComponent } from './counsel/counsel-detail/counsel-detail.component';
import { InterviewDetailComponent } from './counsel/counsel-detail/interview-detail/interview-detail.component';
import { PsychologicalTestDetailComponent } from './counsel/counsel-detail/psychological-test-detail/psychological-test-detail.component';
import { AbsentDetailComponent } from './counsel/counsel-detail/absent-detail/absent-detail.component';
import { ExamScoreDetailComponent } from './counsel/counsel-detail/exam-score-detail/exam-score-detail.component';
import { SemesterScoreDetailComponent } from './counsel/counsel-detail/semester-score-detail/semester-score-detail.component';
import { CounselItemDetailComponent } from './counsel/counsel-detail/counsel-item-detail/counsel-item-detail.component';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { CaseComponent } from './case/case.component';
import { ReferralComponent } from './referral/referral.component';
import { CounselRoutingComponent } from './counsel/counsel-routing/counsel-routing.component';
import { DetailRoutingComponent } from './counsel/counsel-detail/detail-routing/detail-routing.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { ReferralListComponent } from './referral/referral-list/referral-list.component';
import { ReferralDetailComponent } from './referral/referral-detail/referral-detail.component';
import { AddCaseInterviewModalComponent } from './counsel/counsel-detail/counsel-item-detail/add-case-interview-modal/add-case-interview-modal.component';
import { ViewCaseInterviewModalComponent } from './counsel/counsel-detail/counsel-item-detail/view-case-interview-modal/view-case-interview-modal.component';
import { ComprehensiveDetailComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive.component";
import { RenderModule } from './render';
import { ComprehensiveRoutingComponent } from './counsel/counsel-detail/comprehensive-detail/comprehensive-routing.component';
import { ComprehensiveViewComponent } from './counsel/counsel-detail/comprehensive-detail/comprehensive-view/comprehensive-view.component';
import { ComprehensiveEditComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive-edit/comprehensive-edit.component";
import { AdminComponent } from './admin/admin.component';
import { CounselTeacherRoleComponent } from './admin/counsel-teacher-role/counsel-teacher-role.component';
import { AdminRoutingComponent } from './admin/admin-routing/admin-routing.component';
import { CounselClassComponent } from './admin/counsel-class/counsel-class.component';
import { ComprehensiveComponent } from "./comprehensive/comprehensive.component";

@NgModule({
  declarations: [
    AppComponent,
    CounselStatisticsComponent,
    CounselListComponent,
    GrantModalComponent,
    InterviewStatisticsComponent,
    AddInterviewModalComponent,
    ViewInterviewModalComponent,
    NewCaseModalComponent,
    CounselComponent,
    CounselDetailComponent,
    InterviewDetailComponent,
    PsychologicalTestDetailComponent,
    AbsentDetailComponent,
    ExamScoreDetailComponent,
    SemesterScoreDetailComponent,
    CounselItemDetailComponent,
    PermissionDeniedComponent,
    CaseComponent,
    ReferralComponent,
    CounselRoutingComponent,
    DetailRoutingComponent,
    ReferralListComponent,
    ReferralDetailComponent,
    AddCaseInterviewModalComponent,
    ViewCaseInterviewModalComponent,
    ComprehensiveDetailComponent,
    ComprehensiveRoutingComponent,
    ComprehensiveViewComponent,
    ComprehensiveEditComponent,
    AdminComponent,
    CounselTeacherRoleComponent,
    AdminRoutingComponent,
    CounselClassComponent,
    ComprehensiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RenderModule,
    TextareaAutosizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }

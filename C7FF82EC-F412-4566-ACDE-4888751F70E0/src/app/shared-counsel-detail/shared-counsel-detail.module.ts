import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CounselDetailComponent } from './counsel-detail.component';
import { AbsentDetailComponent } from './absent-detail/absent-detail.component';
import { BaseInfoDetailComponent } from './base-info-detail/base-info-detail.component';
import { CounselItemDetailComponent } from './counsel-item-detail/counsel-item-detail.component';
import {AddServiceModalComponent} from '../teacher-service/add-service-modal/add-service-modal.component'
import { AddCaseInterviewModalComponent } from './counsel-item-detail/add-case-interview-modal/add-case-interview-modal.component';
import { ViewCaseInterviewModalComponent } from './counsel-item-detail/view-case-interview-modal/view-case-interview-modal.component';
import { DelCaseInterviewModalComponent } from './counsel-item-detail/del-case-interview-modal/del-case-interview-modal.component';
import { DetailRoutingComponent } from './detail-routing/detail-routing.component';
import { ExamScoreDetailComponent } from './exam-score-detail/exam-score-detail.component';
import { InterviewDetailComponent } from './interview-detail/interview-detail.component';
import { AddInterviewModalComponent } from './interview-detail/add-interview-modal/add-interview-modal.component';
import { ViewInterviewModalComponent } from './interview-detail/view-interview-modal/view-interview-modal.component';
import { DelInterviewModalComponent } from './interview-detail/del-interview-modal/del-interview-modal.component';
import { PsychologicalTestDetailComponent } from './psychological-test-detail/psychological-test-detail.component';
import { SemesterScoreDetailComponent } from './semester-score-detail/semester-score-detail.component';
import { SharedModule } from '../shared/shared.module';
import { RenderModule } from '../render';
import { SetCounselInterviewPrintItemComponent } from './set-counsel-interview-print-item/set-counsel-interview-print-item.component';
import {MatIconModule} from '@angular/material/icon';
import { AddReferralFormComponent } from './interview-detail/add-referral-form/add-referral-form.component';
// import { AddReferralFormComponent } from './interview-detail/add-referral-form/add-referral-form.component';
// import { SharedCounselDetailComponent } from './shared-counsel-detail.component';
// import { AddReferralFormComponent } from './interview-detail/add-referral-form/add-referral-form.component';
@NgModule({
  declarations: [
    CounselDetailComponent,
    AbsentDetailComponent,
    BaseInfoDetailComponent,
    CounselItemDetailComponent,
    AddCaseInterviewModalComponent,
    ViewCaseInterviewModalComponent,
    DelCaseInterviewModalComponent,
    DetailRoutingComponent,
    ExamScoreDetailComponent,
    InterviewDetailComponent,
    AddInterviewModalComponent,
    ViewInterviewModalComponent,
    DelInterviewModalComponent,
    PsychologicalTestDetailComponent,
    SemesterScoreDetailComponent,
    SetCounselInterviewPrintItemComponent,
    // SharedCounselDetailComponent,
    AddReferralFormComponent,
    AddServiceModalComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    RenderModule,
    MatIconModule
  ],
  exports: [
    CounselDetailComponent,
    AbsentDetailComponent,
    BaseInfoDetailComponent,
    CounselItemDetailComponent,
    AddCaseInterviewModalComponent,
    ViewCaseInterviewModalComponent,
    DelCaseInterviewModalComponent,
    DetailRoutingComponent,
    ExamScoreDetailComponent,
    InterviewDetailComponent,
    AddInterviewModalComponent,
    ViewInterviewModalComponent,
    DelInterviewModalComponent,
    PsychologicalTestDetailComponent,
    SemesterScoreDetailComponent,
    AddReferralFormComponent,
    AddServiceModalComponent

  ]
})
export class SharedCounselDetailModule { }

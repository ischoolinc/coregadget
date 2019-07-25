import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { ReferralListComponent } from './referral/referral-list/referral-list.component';
import { ReferralDetailComponent } from './referral/referral-detail/referral-detail.component';
import { AddCaseInterviewModalComponent } from './counsel/counsel-detail/counsel-item-detail/add-case-interview-modal/add-case-interview-modal.component';
import { ViewCaseInterviewModalComponent } from './counsel/counsel-detail/counsel-item-detail/view-case-interview-modal/view-case-interview-modal.component';
import { ComprehensiveDetailComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive.component";
import { RenderModule } from './render';
import { ComprehensiveViewComponent } from './counsel/counsel-detail/comprehensive-detail/comprehensive-view/comprehensive-view.component';
import { ComprehensiveEditComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive-edit/comprehensive-edit.component";
import { AdminComponent } from './admin/admin.component';
import { CounselTeacherRoleComponent } from './admin/counsel-teacher-role/counsel-teacher-role.component';
import { AdminRoutingComponent } from './admin/admin-routing/admin-routing.component';
import { CounselClassComponent } from './admin/counsel-class/counsel-class.component';

import { ComprehensiveComponent } from "./comprehensive/comprehensive.component";
import { ComprehensiveDetailRoutingComponent } from './counsel/counsel-detail/comprehensive-detail/comprehensive-detail-routing/comprehensive-detail-routing.component';
import { ComprehensiveRoutingComponent } from './comprehensive/comprehensive-routing/comprehensive-routing.component';
import { ComprehensiveSectionComponent } from './comprehensive/comprehensive-section/comprehensive-section.component';
import { SimplePageComponent } from './simple-page/simple-page.component';
import { CounselDocComponent } from './simple-page/print/counsel-doc/counsel-doc.component';
import { CounselDocEditorComponent } from './simple-page/editor/counsel-doc-editor/counsel-doc-editor.component';
import { ComprehensiveEditorComponent } from './simple-page/editor/comprehensive-editor/comprehensive-editor.component';
import { PsychologicalTestComponent } from './psychological-test/psychological-test.component';

import { AddCounselTeacherModalComponent } from './admin/counsel-class/add-counsel-teacher-modal/add-counsel-teacher-modal.component';
import { AddCounselTeacherRoleModalComponent } from './admin/counsel-teacher-role/add-counsel-teacher-role-modal/add-counsel-teacher-role-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DelCounselTeacherRoleModalComponent } from './admin/counsel-teacher-role/del-counsel-teacher-role-modal/del-counsel-teacher-role-modal.component';
import { ComprehensiveFillComponent } from './simple-page/comprehensive-fill/comprehensive-fill.component';
import { ComprehensiveClassViewComponent } from './comprehensive/comprehensive-class-view/comprehensive-class-view.component';

import { ImportQuizDataComponent } from './psychological-test/import-quiz-data/import-quiz-data.component';
import { CadreDetailComponent } from './counsel/counsel-detail/cadre-detail/cadre-detail.component';
import { ServiceLearningDetailComponent } from './counsel/counsel-detail/service-learning-detail/service-learning-detail.component';
import { StudentQuizDataComponent } from './psychological-test/student-quiz-data/student-quiz-data.component';
import { PsychologicalTestRoutingComponent } from './psychological-test/psychological-test-routing/psychological-test-routing.component';
import { PsychologicalTestListComponent } from './psychological-test/psychological-test-list/psychological-test-list.component';
import { ComprehensiveStatisticsComponent } from './comprehensive/comprehensive-statistics/comprehensive-statistics.component';
import { PsychologicalQuizSetupComponent } from './admin/psychological-quiz-setup/psychological-quiz-setup.component';
import { AddPsychologicalQuizDataComponent } from './admin/psychological-quiz-setup/add-psychological-quiz-data/add-psychological-quiz-data.component';
import { DelPsychologicalQuizDataComponent } from './admin/psychological-quiz-setup/del-psychological-quiz-data/del-psychological-quiz-data.component';
import { DelInterviewModalComponent } from './counsel/counsel-detail/interview-detail/del-interview-modal/del-interview-modal.component';
import { DelCaseInterviewModalComponent } from './counsel/counsel-detail/counsel-item-detail/del-case-interview-modal/del-case-interview-modal.component';


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
    ComprehensiveViewComponent,
    ComprehensiveEditComponent,
    AdminComponent,
    CounselTeacherRoleComponent,
    AdminRoutingComponent,
    CounselClassComponent,
    ComprehensiveComponent,
    ComprehensiveDetailRoutingComponent,
    ComprehensiveRoutingComponent,
    ComprehensiveSectionComponent,
    SimplePageComponent,
    CounselDocComponent,
    CounselDocEditorComponent,
    ComprehensiveEditorComponent,
    PsychologicalTestComponent,
    AddCounselTeacherModalComponent,
    AddCounselTeacherRoleModalComponent,
    DelCounselTeacherRoleModalComponent,
    ComprehensiveFillComponent,
    ComprehensiveClassViewComponent,
    ImportQuizDataComponent,
    CadreDetailComponent,
    ServiceLearningDetailComponent,
    StudentQuizDataComponent,
    PsychologicalTestRoutingComponent,
    PsychologicalTestListComponent,
    ComprehensiveStatisticsComponent,
    PsychologicalQuizSetupComponent,
    AddPsychologicalQuizDataComponent,
    DelPsychologicalQuizDataComponent,
    DelInterviewModalComponent,
    DelCaseInterviewModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    RenderModule,
    TextareaAutosizeModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CounselComponent } from "./counsel/counsel.component";
import { CaseComponent } from "./case/case.component";
import { CounselDetailComponent } from "./counsel/counsel-detail/counsel-detail.component";
import { CounselItemDetailComponent } from "./counsel/counsel-detail/counsel-item-detail/counsel-item-detail.component";
import { InterviewDetailComponent } from "./counsel/counsel-detail/interview-detail/interview-detail.component";
import { PsychologicalTestDetailComponent } from "./counsel/counsel-detail/psychological-test-detail/psychological-test-detail.component";
import { AbsentDetailComponent } from "./counsel/counsel-detail/absent-detail/absent-detail.component";
import { ExamScoreDetailComponent } from "./counsel/counsel-detail/exam-score-detail/exam-score-detail.component";
import { SemesterScoreDetailComponent } from "./counsel/counsel-detail/semester-score-detail/semester-score-detail.component";
import { CounselListComponent } from "./counsel/counsel-list/counsel-list.component";
import { ReferralComponent } from "./referral/referral.component";
import { CounselStatisticsComponent } from "./counsel-statistics/counsel-statistics.component";
import { InterviewStatisticsComponent } from "./interview-statistics/interview-statistics.component";
import { PermissionDeniedComponent } from "./permission-denied/permission-denied.component";
import { CounselRoutingComponent } from "./counsel/counsel-routing/counsel-routing.component";
import { DetailRoutingComponent } from "./counsel/counsel-detail/detail-routing/detail-routing.component";
import { ReferralListComponent } from "./referral/referral-list/referral-list.component";
import { ReferralDetailComponent } from "./referral/referral-detail/referral-detail.component";
import { ComprehensiveDetailComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive.component";
import { ComprehensiveDetailRoutingComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive-detail-routing/comprehensive-detail-routing.component";
import { ComprehensiveViewComponent } from "./counsel/counsel-detail/comprehensive-detail/comprehensive-view/comprehensive-view.component";
import { ComprehensiveEditComponent } from './counsel/counsel-detail/comprehensive-detail/comprehensive-edit/comprehensive-edit.component';
// import { CaseRoleGuard, CounselRoleGuard, CounselStatisticsRoleGuard, ReferralRoleGuard, InterviewStatisticsRoleGuard } from "./role.guard";
import { AdminComponent } from "./admin/admin.component";
import { AdminRoutingComponent } from "./admin/admin-routing/admin-routing.component";
import { CounselTeacherRoleComponent } from "./admin/counsel-teacher-role/counsel-teacher-role.component";
import { CounselClassComponent } from "./admin/counsel-class/counsel-class.component";
import { ComprehensiveComponent } from "./comprehensive/comprehensive.component";
import { ComprehensiveRoutingComponent } from "./comprehensive/comprehensive-routing/comprehensive-routing.component";
import { ComprehensiveSectionComponent } from "./comprehensive/comprehensive-section/comprehensive-section.component";
import { PsychologicalTestComponent } from "./psychological-test/psychological-test.component";



import { SimplePageComponent } from "./simple-page/simple-page.component";
import { CounselDocComponent } from "./simple-page/print/counsel-doc/counsel-doc.component";
import { CounselDocEditorComponent } from "./simple-page/editor/counsel-doc-editor/counsel-doc-editor.component";
import { ComprehensiveEditorComponent } from "./simple-page/editor/comprehensive-editor/comprehensive-editor.component";
import { ComprehensiveFillComponent } from "./simple-page/comprehensive-fill/comprehensive-fill.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "counsel" },
  { path: "permission_denied", component: PermissionDeniedComponent },
  {
    path: "counsel",
    component: CounselComponent,
    children: [
      { path: "", pathMatch: "full", component: CounselRoutingComponent },
      { path: "list/:mod/:target", component: CounselListComponent },
      {
        path: "detail/:studentID",
        component: CounselDetailComponent,
        children: [
          { path: "", pathMatch: "full", component: DetailRoutingComponent },
          { path: "counsel", component: CounselItemDetailComponent },
          { path: "interview", component: InterviewDetailComponent },
          {
            path: "psychological_test",
            component: PsychologicalTestDetailComponent
          },
          { path: "absent", component: AbsentDetailComponent },
          { path: "exam_score", component: ExamScoreDetailComponent },
          { path: "semester_score", component: SemesterScoreDetailComponent },
          {
            path: "comprehensive",
            component: ComprehensiveDetailComponent,
            children: [
              { path: "", pathMatch: "full", component: ComprehensiveDetailRoutingComponent },
              { path: "view/:schoolYear/:semester", component: ComprehensiveViewComponent },
              { path: "edit/:sectionID", component: ComprehensiveEditComponent }
            ]
          }
        ]
      }
    ]
  },
  { path: "counsel_statistics", component: CounselStatisticsComponent },
  {
    path: "referral",
    component: ReferralComponent,
    children: [
      { path: "", pathMatch: "full", component: ReferralComponent },
      { path: "list/:target", component: ReferralListComponent },
      {
        path: "detail/:studentID/:interviewID",
        component: ReferralDetailComponent,
        children: [
          { path: "", pathMatch: "full", component: DetailRoutingComponent },
          { path: "counsel", component: CounselItemDetailComponent },
          { path: "interview", component: InterviewDetailComponent },
          {
            path: "psychological_test",
            component: PsychologicalTestDetailComponent
          },
          { path: "absent", component: AbsentDetailComponent },
          { path: "exam_score", component: ExamScoreDetailComponent },
          { path: "semester_score", component: SemesterScoreDetailComponent }
        ]
      }
    ]
  },
  { path: "case", component: CaseComponent },
  { path: "interview_statistics", component: InterviewStatisticsComponent },
  { path: "psychological_test", component: PsychologicalTestComponent },
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "", pathMatch: "full", component: AdminRoutingComponent },
      { path: "counsel_teacher_role", component: CounselTeacherRoleComponent },
      { path: "counsel_class", component: CounselClassComponent }
    ]
  }, {
    path: "comprehensive",
    component: ComprehensiveComponent,
    children: [
      { path: "", pathMatch: "full", component: ComprehensiveRoutingComponent },
      { path: "section/:schoolYear/:semester", component: ComprehensiveSectionComponent }
    ]
  },
  {
    outlet: "simple-page",
    path: "simple-page",
    component: SimplePageComponent,
    children: [
      { path: "editor/counsel_doc_editor", component: CounselDocEditorComponent },
      { path: "editor/comprehensive_editor", component: ComprehensiveEditorComponent },
      { path: "print/counsel_doc/:studentID/:printDocumentID", component: CounselDocComponent },
      { path: ":dsns/comprehensive_fill", component: ComprehensiveFillComponent },
      { path: ":dsns/comprehensive_fill/:fill_in_key", component: ComprehensiveFillComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

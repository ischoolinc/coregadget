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
// import { CaseRoleGuard, CounselRoleGuard, CounselStatisticsRoleGuard, ReferralRoleGuard, InterviewStatisticsRoleGuard } from "./role.guard";

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
          { path: "comprehensive", loadChildren: './counsel/counsel-detail/comprehensive/comprehensive.module#ComprehensiveModule' }
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
  { path: "interview_statistics", component: InterviewStatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

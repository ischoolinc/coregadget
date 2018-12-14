import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { MainComponent } from './main/main.component';
import { CounselComponent } from "./counsel/counsel.component";
import { CaseListComponent } from './case/case-list/case-list.component';
import { CounselDetailComponent } from "./counsel/counsel-detail/counsel-detail.component";
import { CounselItemDetailComponent } from "./counsel/counsel-detail/counsel-item-detail/counsel-item-detail.component";
import { InterviewDetailComponent } from "./counsel/counsel-detail/interview-detail/interview-detail.component";
import { PsychologicalTestDetailComponent } from "./counsel/counsel-detail/psychological-test-detail/psychological-test-detail.component";
import { AbsentDetailComponent } from "./counsel/counsel-detail/absent-detail/absent-detail.component";
import { ExamScoreDetailComponent } from "./counsel/counsel-detail/exam-score-detail/exam-score-detail.component";
import { SemesterScoreDetailComponent } from "./counsel/counsel-detail/semester-score-detail/semester-score-detail.component";
import { CounselListComponent } from './counsel/counsel-list/counsel-list.component';
import { ReferralListComponent } from './referral/referral-list/referral-list.component';
import { CounselStatisticsComponent } from './statistics/counsel-statistics/counsel-statistics.component';
import { InterviewStatisticsComponent } from './statistics/interview-statistics/interview-statistics.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'counsel' },
  {
    path: 'counsel', component: CounselComponent,
    children: [
      { path: '', component: CounselListComponent },
      {
        path: 'detail/:sid', component: CounselDetailComponent,
        children: [
          { path: '', component: CounselItemDetailComponent },
          { path: 'counsel', component: CounselItemDetailComponent },
          { path: 'interview', component: InterviewDetailComponent },
          { path: 'psychological_test', component: PsychologicalTestDetailComponent },
          { path: 'absent', component: AbsentDetailComponent },
          { path: 'exam_score', component: ExamScoreDetailComponent },
          { path: 'semester_score', component: SemesterScoreDetailComponent }
        ]
      }
    ]
  },
  { path: 'counsel_statistics', component: CounselStatisticsComponent },
  { path: 'referral', component: ReferralListComponent },
  { path: 'case', component: CaseListComponent },
  { path: 'interview_statistics', component: InterviewStatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
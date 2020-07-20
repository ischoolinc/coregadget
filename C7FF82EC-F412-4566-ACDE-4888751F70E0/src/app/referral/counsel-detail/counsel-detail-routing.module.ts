import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DetailRoutingComponent,
  BaseInfoDetailComponent,
  CounselItemDetailComponent,
  InterviewDetailComponent,
  PsychologicalTestDetailComponent,
  AbsentDetailComponent,
  ExamScoreDetailComponent,
  SemesterScoreDetailComponent
} from '../../shared-counsel-detail';

const routes: Routes = [
  { path: "", pathMatch: "full", component: DetailRoutingComponent },
  { path: "base_info_detail", component: BaseInfoDetailComponent },
  { path: "counsel", component: CounselItemDetailComponent },
  { path: "interview", component: InterviewDetailComponent },
  { path: "psychological_test", component: PsychologicalTestDetailComponent },
  { path: "absent", component: AbsentDetailComponent },
  { path: "exam_score", component: ExamScoreDetailComponent },
  { path: "semester_score", component: SemesterScoreDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounselDetailRoutingModule { }

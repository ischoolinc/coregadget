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
  SemesterScoreDetailComponent,
  CounselDetailComponent} from '../../shared-counsel-detail';
import {
  CadreDetailComponent,
  ServiceLearningDetailComponent,
  ComprehensiveDetailComponent,
  ComprehensiveDetailRoutingComponent,
  ComprehensiveViewComponent,
  ComprehensiveEditComponent } from '.';

const routes: Routes = [
  { path: "",
    component: CounselDetailComponent,
    children: [
      { path: "", pathMatch: "full", component: DetailRoutingComponent },
      { path: "base_info_detail", component: BaseInfoDetailComponent },
      { path: "counsel", component: CounselItemDetailComponent },
      { path: "interview", component: InterviewDetailComponent },
      { path: "psychological_test", component: PsychologicalTestDetailComponent },
      { path: "absent", component: AbsentDetailComponent },
      { path: 'cadre', component: CadreDetailComponent },
      { path: 'service_learning', component: ServiceLearningDetailComponent },
      { path: "exam_score", component: ExamScoreDetailComponent },
      { path: "semester_score", component: SemesterScoreDetailComponent },
      { path: "comprehensive", component: ComprehensiveDetailComponent,
        children: [
          { path: "", pathMatch: "full", component: ComprehensiveDetailRoutingComponent },
          { path: "view/:schoolYear/:semester", component: ComprehensiveViewComponent },
          { path: "edit/:sectionID", component: ComprehensiveEditComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounselDetailRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CounselComponent } from './counsel/counsel.component';
import { CaseComponent } from "./case/case.component";
import { CounselListComponent } from './counsel/counsel-list/counsel-list.component';
import { CounselStatisticsComponent } from './counsel-statistics/counsel-statistics.component';
import { InterviewStatisticsComponent } from './interview-statistics/interview-statistics.component';
import { PermissionDeniedComponent } from './shared';
import { CounselRoutingComponent } from './counsel/counsel-routing/counsel-routing.component';
// tslint:disable-next-line: max-line-length
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingComponent } from './admin/admin-routing/admin-routing.component';
import { CounselTeacherRoleComponent } from './admin/counsel-teacher-role/counsel-teacher-role.component';
import { CounselClassComponent } from './admin/counsel-class/counsel-class.component';
import { ComprehensiveComponent } from './comprehensive/comprehensive.component';
import { ComprehensiveRoutingComponent } from './comprehensive/comprehensive-routing/comprehensive-routing.component';
import { ComprehensiveSectionComponent } from './comprehensive/comprehensive-section/comprehensive-section.component';
import { ComprehensiveClassViewComponent } from './comprehensive/comprehensive-class-view/comprehensive-class-view.component';
import { ComprehensiveStatisticsComponent } from './comprehensive/comprehensive-statistics/comprehensive-statistics.component';
import { PsychologicalTestComponent } from './psychological-test/psychological-test.component';
import { SimplePageComponent } from './simple-page/simple-page.component';
import { CounselDocComponent } from './simple-page/print/counsel-doc/counsel-doc.component';
import { CounselDocEditorComponent } from './simple-page/editor/counsel-doc-editor/counsel-doc-editor.component';
import { ComprehensiveEditorComponent } from './simple-page/editor/comprehensive-editor/comprehensive-editor.component';
import { ComprehensiveFillComponent } from './simple-page/comprehensive-fill/comprehensive-fill.component';
import { StudentQuizDataComponent } from './psychological-test/student-quiz-data/student-quiz-data.component';
import { PsychologicalTestRoutingComponent } from './psychological-test/psychological-test-routing/psychological-test-routing.component';
import { PsychologicalTestListComponent } from './psychological-test/psychological-test-list/psychological-test-list.component';
import { PsychologicalQuizSetupComponent } from './admin/psychological-quiz-setup/psychological-quiz-setup.component';
import { CounselHistoryComponent } from './simple-page/print/counsel-history/counsel-history.component';
import { CounselDoc2BatComponent } from './counsel-statistics/reports/counsel-doc2-bat/counsel-doc2-bat.component';
import { CounselInterviewDocComponent } from './simple-page/print/counsel-interview-doc/counsel-interview-doc.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "counsel" },
  { path: "pd", component: PermissionDeniedComponent },
  { path: "permission_denied", component: PermissionDeniedComponent },
  {
    path: "counsel",
    component: CounselComponent,
    children: [
      { path: "", pathMatch: "full", component: CounselRoutingComponent },
      { path: "list/:mod/:target", component: CounselListComponent },
      {
        path: "detail/:studentID",
        loadChildren: './counsel/counsel-detail/counsel-detail.module#CounselDetailModule'
      }
    ]
  },
  {
    path: "counsel_statistics", component: CounselStatisticsComponent

  },
  { 
    path: "counsel_doc2/:classID/:printDocumentID/:title", component: CounselDoc2BatComponent },

  { path: "referral", loadChildren: './referral/referral.module#ReferralModule' },
  { path: "case", component: CaseComponent },
  { path: "interview_statistics", component: InterviewStatisticsComponent },
  {
    path: "psychological_test",
    component: PsychologicalTestComponent,
    children: [
      { path: "", pathMatch: "full", component: PsychologicalTestRoutingComponent },
      { path: "psychological-test-list", component: PsychologicalTestListComponent },
      { path: "student-quiz-data/:quiz_id/:class_id", component: StudentQuizDataComponent }
    ]
  },
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "", pathMatch: "full", component: AdminRoutingComponent },
      { path: "counsel_teacher_role", component: CounselTeacherRoleComponent },
      { path: "counsel_class", component: CounselClassComponent },
      { path: "psychological_quiz_setup", component: PsychologicalQuizSetupComponent }
    ]
  }, {
    path: "comprehensive",
    component: ComprehensiveComponent,
    children: [
      { path: "", pathMatch: "full", component: ComprehensiveRoutingComponent },
      { path: "view/all/section/:fill_in_section_id", component: ComprehensiveSectionComponent },
      { path: "view/:class_id/section/:fill_in_section_id", component: ComprehensiveClassViewComponent },
      { path: "statistics", component: ComprehensiveStatisticsComponent }
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
      { path: "print/counsel_history/:studentID", component: CounselHistoryComponent },
      { path: "print/counsel-interview-doc/:studentID/:p/:sd/:ed/:co", component:CounselInterviewDocComponent},
      { path: ":dsns/comprehensive_fill", component: ComprehensiveFillComponent },
      { path: ":dsns/comprehensive_fill/:fill_in_key", component: ComprehensiveFillComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

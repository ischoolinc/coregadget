import { StudentSummaryComponent } from './ui/student-summary/student-summary.component';
import { ClassSummaryComponent } from './ui/class-summary/class-summary.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: ClassSummaryComponent},
  {path: 'student-summary', component: StudentSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { ClassSummaryComponent } from './ui/class-summary/class-summary.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentDetailComponent } from './ui/student-detail/student-detail.component';

const routes: Routes = [
  {path: '', component: ClassSummaryComponent},
  {path: 'student-detail', component: StudentDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

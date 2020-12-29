import { FormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCourseCodeComponent } from './view-course-code/view-course-code.component';

const routes: Routes = [
  {path: '', component: ViewCourseCodeComponent},
  {path: 'upload', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

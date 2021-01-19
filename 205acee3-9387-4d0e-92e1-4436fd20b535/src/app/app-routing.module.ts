import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanGuard } from './core/plan.guard';
import { PlanComponent } from './plan/plan.component';

const routes: Routes = [
  { path: 'plan/:id', component: PlanComponent, canActivate: [PlanGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

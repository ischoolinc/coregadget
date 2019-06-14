import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { IndexComponent } from './index.component';
import { ComprehensiveFillComponent } from './comprehensive-fill/comprehensive-fill.component';

const routes: Routes = [
  { path: '', component: ComprehensiveFillComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprehensiveRoutingModule { }
 
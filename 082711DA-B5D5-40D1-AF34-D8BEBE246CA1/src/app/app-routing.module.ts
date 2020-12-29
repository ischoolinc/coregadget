import { PrintComponent } from './print/print.component';
// import { EditFormComponent } from './edit-form/edit-form.component';
import { DemoComponent } from './chooser/demo/demo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FillOutComponent } from './fill-out/fill-out.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { HistoryResolver } from './Service/history.resolver';

const routes: Routes = [
  { path: '', component: FrontPageComponent, resolve: { records: HistoryResolver } }
  , { path: 'edit_record/:action/:id', component: FillOutComponent, resolve: { records: HistoryResolver } }
  , {
    path: 'print',
    outlet: 'print',
    component: PrintComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

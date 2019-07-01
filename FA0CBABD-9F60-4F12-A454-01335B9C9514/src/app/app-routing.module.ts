import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBehaviorComponent } from './behavior/list-behavior/list-behavior.component';
import { TemplateComponent} from "./template/template.component";
import { RecordListComponent } from "./behavior/record-list/record-list.component";
const routes: Routes = [
  { path: '', component: RecordListComponent },
  {
    path: 'behavior/list/:classID/:className',
    component: ListBehaviorComponent
  },
  {
    path: 'behavior/list',
    component: ListBehaviorComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

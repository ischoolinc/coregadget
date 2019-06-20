import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { TemplateComponent} from "./template/template.component";
import { RecordListComponent } from "./behavior/record-list/record-list.component";
import { ParentMainComponent  } from "./behavior/parent-main/parent-main.component";
const routes: Routes = [
  { path: '', component: ParentMainComponent },
  {
    path: 'behavior/list/:studentID/:studentName',
    component: RecordListComponent
  },
  {
    path: 'behavior/list',
    component: RecordListComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

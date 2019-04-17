import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./main/main.component";
import { AddBehaviorComponent } from './behavior/add-behavior/add-behavior.component';
import { ListBehaviorComponent } from './behavior/list-behavior/list-behavior.component';
import { TemplateComponent} from "./template/template.component";
const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'behavior/add/:classID/:className',
    component: AddBehaviorComponent
  },
  {
    path: 'behavior/add',
    component: AddBehaviorComponent
  },
  {
    path: 'behavior/list/:classID/:className',
    component: ListBehaviorComponent
  },
  {
    path: 'behavior/list',
    component: ListBehaviorComponent
  },
  {
    path: 'template',
    component: TemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListviewComponent } from './listview/listview.component';
import { DetailviewComponent } from './detailview/detailview.component';

const routes: Routes = [
  { path: '', component: ListviewComponent }
  , { path: 'list', component: ListviewComponent }
  // , { path: 'detail', component: DetailviewComponent }
  , { path: 'detail/:uid', component: DetailviewComponent }
  //, { path: 'detail/:dsns/:uid', component: DetailviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

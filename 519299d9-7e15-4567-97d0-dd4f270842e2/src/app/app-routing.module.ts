import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticeMainComponent } from './notice-main/notice-main.component';
import { NoticeSummaryComponent } from './notice-summary/notice-summary.component';
import { NoticePushComponent } from './notice-push/notice-push.component';

const routes: Routes = [
  { path: '', component: NoticeMainComponent },
  { path: 'notice_summary/:id', component: NoticeSummaryComponent },
  { path: 'notice_push', component: NoticePushComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

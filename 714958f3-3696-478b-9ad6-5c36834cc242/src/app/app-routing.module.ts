import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyComponent } from './apply/apply.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { HistoryComponent } from './history/history.component';
import { ApplySingleComponent } from './apply-single/apply-single.component';
import { ApplyGroupComponent } from './apply-group/apply-group.component';

const routes: Routes = [
  { path: '', redirectTo: 'apply', pathMatch: 'full'},
  { path: 'apply', component: ApplyComponent },
  { path: 'apply/single/:event_id', component: ApplySingleComponent },
  { path: 'apply/group/:event_id', component: ApplyGroupComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    /** 如果調整設定，redirect 會受響影, 例如 login。 */
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

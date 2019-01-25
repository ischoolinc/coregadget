import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'apply', pathMatch: 'full'},
  // { path: 'apply', component: ApplyComponent },
  // { path: 'apply/single/:event_id', component: ApplySingleComponent },
  // { path: 'apply/group/:event_id', component: ApplyGroupComponent },
  // { path: 'schedule', component: ScheduleComponent },
  // { path: 'history', component: HistoryComponent },
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

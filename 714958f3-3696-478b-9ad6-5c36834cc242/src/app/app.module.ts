import { GadgetService } from './gadget.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplyComponent } from './apply/apply.component';
import { ApplySingleComponent } from './apply-single/apply-single.component';
import { ApplyGroupComponent } from './apply-group/apply-group.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { HistoryComponent } from './history/history.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ApplyComponent,
    ApplySingleComponent,
    ApplyGroupComponent,
    ScheduleComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [GadgetService],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

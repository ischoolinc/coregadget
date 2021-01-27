import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';

// ngxs
import { NgxsModule } from '@ngxs/store';
import { PlanState } from './state/plan.state';

import { PlanComponent } from './plan/plan.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanInfoComponent } from './plan/plan-info/plan-info.component';
import { PlanConfigComponent } from './plan/plan-config/plan-config.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { NewPlanComponent } from './plan-list/new-plan/new-plan.component';
import { MoeCourseModule } from '@1campus/moe-course';

@NgModule({
  declarations: [
    AppComponent,
    PlanListComponent,
    PlanInfoComponent,
    PlanConfigComponent,
    PlanComponent,
    LoadingScreenComponent,
    NewPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MoeCourseModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([PlanState], {developmentMode: !environment.production}),
    SharedModule
  ],
  entryComponents: [
    NewPlanComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MOECourseCodeModule } from './moe-course-code/moe-course-code.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngxs
import { NgxsModule } from '@ngxs/store';
import { PlanState } from './state/plan.state';

// angular material
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { PlanComponent } from './plan/plan.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanInfoComponent } from './plan/plan-info/plan-info.component';
import { PlanConfigComponent } from './plan/plan-config/plan-config.component';
import { PlanEditorComponent } from './plan/plan-editor/plan-editor.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanListComponent,
    PlanInfoComponent,
    PlanConfigComponent,
    PlanComponent,
    PlanEditorComponent,
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MOECourseCodeModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgxsModule.forRoot([PlanState], {developmentMode: !environment.production}),
    MatInputModule,
    MatDialogModule
  ],
  entryComponents: [
    PlanEditorComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

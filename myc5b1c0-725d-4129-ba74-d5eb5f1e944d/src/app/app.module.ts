import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DSUtilNgModule } from './dsutil-ng/dsutil-ng.module';
import { DSA_ACCESSTOKEN } from './dsutil-ng/credential_provider';
import { RootAccessTokenService } from './root-access-token.service';
import { CoreModule } from './core/core.module';
import { SelectModule } from './shared/select/select.module';
import { SnackbarModule } from './shared/snackbar/snackbar.module';
import { environment } from '../environments/environment';
import { AddGoogleClassroomComponent } from './add-google-classroom/add-google-classroom.component';
import { EditGoogleClassroomComponent } from './edit-google-classroom/edit-google-classroom.component';
import { AsyncGoogleClassroomComponent } from './async-google-classroom/async-google-classroom.component';
import { CustomizeServiceManageComponent } from './customize-service-manage/customize-service-manage.component';
import { DialogModule } from './shared/dialog/dialog.module';
import { LauncherOhaComponent } from './launcher-oha/launcher-oha.component';
import { LauncherGoogleClassroomComponent } from './launcher-google-classroom/launcher-google-classroom.component';
import { LauncherCustomizeComponent } from './launcher-customize/launcher-customize.component';
import { TimetableManageComponent } from './timetable-manage/timetable-manage.component';
import { BadgePeriodComponent } from './badge-period/badge-period.component';
import { PipesModule } from './shared/pipe/pipes.module';

@NgModule({
  declarations: [
    AppComponent,
    AddGoogleClassroomComponent,
    EditGoogleClassroomComponent,
    AsyncGoogleClassroomComponent,
    CustomizeServiceManageComponent,
    LauncherOhaComponent,
    LauncherGoogleClassroomComponent,
    LauncherCustomizeComponent,
    TimetableManageComponent,
    BadgePeriodComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    DSUtilNgModule,
    CoreModule,
    MatDialogModule,
    MatMenuModule,
    MatSlideToggleModule,
    SnackbarModule,
    SelectModule,
    DialogModule,
    PipesModule,
  ],
  providers: [{
    provide: DSA_ACCESSTOKEN,
    useClass: RootAccessTokenService
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
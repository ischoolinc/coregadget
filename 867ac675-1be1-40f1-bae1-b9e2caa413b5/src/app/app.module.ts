import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DSAService } from './attendance/service/dsa.service';
import { PeriodChooserComponent } from './attendance/modal/period-chooser.component';
import { AlertService } from './attendance/service//alert.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GadgetService } from './gadget.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ConfirmDialogComponent } from './behavior/confirm-dialog.component';
import { ConfirmCancelComponent } from './behavior/confirm-cancel.component';
import { FormsModule } from '@angular/forms';
import { EditDialogComponent } from './behavior/edit-dialog.component';
import { SubstituteComponent } from './attendance/substitute/substitute.component';
import { MatSnackBar } from '@angular/material';
import { ConfigService } from './attendance/service/config.service';
import { CourseSelcComponent } from './attendance/substitute/course-selc.component';
import { StudentPickComponent } from './attendance/attendance/student-pick.component';
@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    ConfirmCancelComponent,
    EditDialogComponent,
    SubstituteComponent,
    CourseSelcComponent,
    PeriodChooserComponent ,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [GadgetService,DSAService,AlertService,MatSnackBar,ConfigService],
  bootstrap: [AppComponent],
  entryComponents: [

    ConfirmDialogComponent,
    ConfirmCancelComponent,
    EditDialogComponent,
    PeriodChooserComponent 

  ]
})
export class AppModule { }

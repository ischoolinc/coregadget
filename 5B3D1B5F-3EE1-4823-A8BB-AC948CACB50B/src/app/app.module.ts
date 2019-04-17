import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GadgetService } from './gadget.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule } from '@angular/material/datepicker';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { MatSnackBar,MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import { MainComponent } from './main/main.component';
import { ClassBehaviorComponent } from './behavior/class-behavior/class-behavior.component';
import { TeacherRecordBehaviorComponent } from './behavior/teacher-record-behavior/teacher-record-behavior.component';
import { AddBehaviorComponent } from './behavior/add-behavior/add-behavior.component';
import { ListBehaviorComponent } from './behavior/list-behavior/list-behavior.component';
import {MatCardModule} from '@angular/material/card';
import { EditDialogComponent } from './behavior/edit-dialog.component';
import { ConfirmDialogComponent } from './behavior/confirm-dialog.component';
import { TemplateComponent } from './template/template.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ClassBehaviorComponent,
    TeacherRecordBehaviorComponent,
    AddBehaviorComponent,
    ListBehaviorComponent,
    EditDialogComponent,
    ConfirmDialogComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatCardModule
  ],
  providers: [GadgetService,
              MatSnackBar
            ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditDialogComponent,
    ConfirmDialogComponent

  ]
})
export class AppModule { }

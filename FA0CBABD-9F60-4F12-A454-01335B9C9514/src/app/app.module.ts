import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GadgetService } from './gadget.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import { ListBehaviorComponent } from './behavior/list-behavior/list-behavior.component';
import { MatCardModule } from '@angular/material/card';
import { TemplateComponent } from './template/template.component';
import { RecordListComponent } from './behavior/record-list/record-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ListBehaviorComponent,
    TemplateComponent,
    RecordListComponent
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

  ]
})
export class AppModule { }

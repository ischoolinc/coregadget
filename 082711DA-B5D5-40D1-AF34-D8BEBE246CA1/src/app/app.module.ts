import { ListControlService } from './front-page/ListControl.service';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ChooserModule } from './chooser/chooser.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FillOutComponent } from './fill-out/fill-out.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ListFormComponent } from './list-form/list-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
// import { EditFormComponent } from './edit-form/edit-form.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { PrintComponent } from './print/print.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
@NgModule({
  declarations: [
    AppComponent,
    FillOutComponent,
    ListFormComponent,
    // EditFormComponent,
    FrontPageComponent,
    PrintComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // MatCardModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
    , MatIconModule
    , ChooserModule
    , MatDialogModule
    , MatChipsModule
    , MatButtonModule
    , FormsModule
    , NgxBarcodeModule
    , MatFormFieldModule
    ,ReactiveFormsModule
    ,CommonModule
    ,MatMomentDateModule
  ,
  ],
  providers: [ListControlService,

  { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

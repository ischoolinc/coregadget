import { ListControlService } from './front-page/ListControl.service';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ChooserModule } from './chooser/chooser.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FillOutComponent } from './fill-out/fill-out.component';
// import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { ListFormComponent } from './list-form/list-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
// import { EditFormComponent } from './edit-form/edit-form.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { PrintComponent } from './print/print.component';
import { NgxBarcodeModule } from 'ngx-barcode';

@NgModule({
  declarations: [
    AppComponent,
    FillOutComponent,
    ListFormComponent,
    // EditFormComponent,
    FrontPageComponent,
    PrintComponent
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
  ],
  providers: [ListControlService],
  bootstrap: [AppComponent],
})
export class AppModule { }

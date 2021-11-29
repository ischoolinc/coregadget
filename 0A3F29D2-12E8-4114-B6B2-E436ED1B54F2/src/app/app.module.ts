import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GadgetService } from './gadget.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import { ExamSelectedHelper } from './helper/examSelectHelper';
import {MatIconModule} from '@angular/material/icon';
import { CustomizeLogyHelper } from './helper/CustomizeLogyHelper';
@NgModule({
  declarations: [

    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatIconModule
  ],
  providers: [GadgetService,ExamSelectedHelper,CustomizeLogyHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }

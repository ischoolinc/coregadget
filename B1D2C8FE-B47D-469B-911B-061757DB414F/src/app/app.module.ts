import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GadgetService } from './gadget.service';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from './shared/radio-button/radio-button.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RadioButtonModule
  ],
  providers: [GadgetService],
  bootstrap: [AppComponent]
})
export class AppModule { }

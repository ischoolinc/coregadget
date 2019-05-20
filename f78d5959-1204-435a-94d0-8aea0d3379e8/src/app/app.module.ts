import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BsDatepickerModule } from '../../node_modules/ngx-bootstrap/datepicker';
import { GadgetService } from './gadget.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [GadgetService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { GadgetService } from './gadget.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { PaymentListComponent } from './payment-list/payment-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PaymentListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [GadgetService],
  entryComponents: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

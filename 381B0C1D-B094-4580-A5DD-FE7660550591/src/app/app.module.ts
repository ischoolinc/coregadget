import { GadgetService } from './gadget.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ListviewComponent } from './listview/listview.component';
import { AppRoutingModule } from './app-routing.module';
import { DetailviewComponent } from './detailview/detailview.component';

@NgModule({
  declarations: [
    AppComponent,
    ListviewComponent,
    DetailviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [GadgetService],
  bootstrap: [AppComponent]
})
export class AppModule { }

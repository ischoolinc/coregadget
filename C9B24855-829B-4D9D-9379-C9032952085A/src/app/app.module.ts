import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GadgetService } from './gadget.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoreSectionComponent } from './score-section/score-section.component';
import { BehaviorSectionComponent } from './behavior-section/behavior-section.component';
import {MatDialogModule} from '@angular/material/dialog';
import { BehaviorModalComponent } from './behavior-modal/behavior-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ScoreSectionComponent,
     BehaviorSectionComponent,
     BehaviorModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule





  ],
  providers: [GadgetService],

  bootstrap: [AppComponent]
})
export class AppModule { }

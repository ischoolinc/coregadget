import { GadgetService } from './gadget.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFilterPipe } from './pipes/text-filter.pipe';
import { ScorePassPipe } from './pipes/score-pass.pipe';
import { avgPipe } from './pipes/avgPipe.pipe';
import { ScoreTypeDirective } from './directive/score-type.directive';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    TextFilterPipe,
    ScorePassPipe,
    avgPipe,
    ScoreTypeDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ModalModule.forRoot(),
  ],
  providers: [GadgetService],
  bootstrap: [AppComponent]
})
export class AppModule { }

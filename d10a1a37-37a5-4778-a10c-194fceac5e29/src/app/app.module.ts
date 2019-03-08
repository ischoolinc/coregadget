import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GadgetService } from './gadget.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ConfirmDialogComponent } from './behavior/confirm-dialog.component';
import { ConfirmCancelComponent } from './behavior/confirm-cancel.component';
import { FormsModule } from '@angular/forms';
import { EditDialogComponent } from './behavior/edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    ConfirmCancelComponent,
    EditDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [GadgetService],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialogComponent,
    ConfirmCancelComponent,
    EditDialogComponent
  ]
})
export class AppModule { }

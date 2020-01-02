import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

import { MapsToArrayPipe } from './pipes/maps-to-array.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SimpleModalComponent } from './component/simple-modal/simple-modal.component';
import { MaterialModule } from '../../material-module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    MapsToArrayPipe,
    SafeHtmlPipe,
    SimpleModalComponent,
  ],
  exports: [
    MapsToArrayPipe,
    SafeHtmlPipe,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    MaterialModule,
  ],
  entryComponents: [
    SimpleModalComponent,
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule, AccordionModule, TooltipModule, BsDatepickerModule } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { zhCnLocale } from 'ngx-bootstrap/locale';
defineLocale('zh-cn', zhCnLocale);


import { MapsToArrayPipe } from './pipes/maps-to-array.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SemesterFormatPipe } from './pipes/semester-format.pipe';
import { SimpleModalComponent } from './component/simple-modal/simple-modal.component';
import { AddQuitButtonsComponent } from './component/add-quit-buttons/add-quit-buttons.component';
import { FinialButtonsComponent } from './component/finial-buttons/finial-buttons.component';
import { AdmissionListComponent } from './component/admission-list/admission-list.component';
import { MyAdmissionListComponent } from './component/my-admission-list/my-admission-list.component';
import { PaymentFormModalComponent } from './component/payment-form-modal/payment-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    MapsToArrayPipe,
    SafeHtmlPipe,
    SemesterFormatPipe,
    SimpleModalComponent,
    AddQuitButtonsComponent,
    FinialButtonsComponent,
    AdmissionListComponent,
    MyAdmissionListComponent,
    PaymentFormModalComponent,
  ],
  exports: [
    MapsToArrayPipe,
    SafeHtmlPipe,
    SemesterFormatPipe,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AddQuitButtonsComponent,
    FinialButtonsComponent,
    AdmissionListComponent,
    MyAdmissionListComponent,
    TooltipModule,
    ModalModule,
    AccordionModule,
  ],
  entryComponents: [
    SimpleModalComponent,
    PaymentFormModalComponent,
  ]
})
export class SharedModule { }

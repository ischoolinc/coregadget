import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, AccordionModule, TooltipModule } from 'ngx-bootstrap';

import { MapsToArrayPipe } from './pipes/maps-to-array.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { CourseTypeBadgeDirective } from './directive/course-type-badge.directive';
import { SemesterFormatPipe } from './pipes/semester-format.pipe';
import { SimpleModalComponent } from './component/simple-modal/simple-modal.component';
import { AddQuitButtonsComponent } from './component/add-quit-buttons/add-quit-buttons.component';
import { FinialButtonsComponent } from './component/finial-buttons/finial-buttons.component';
import { CourseTypeFormatPipe } from './pipes/course-type.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
  ],
  declarations: [
    MapsToArrayPipe,
    SafeHtmlPipe,
    SemesterFormatPipe,
    CourseTypeFormatPipe,
    CourseTypeBadgeDirective,
    SimpleModalComponent,
    AddQuitButtonsComponent,
    FinialButtonsComponent,
  ],
  exports: [
    MapsToArrayPipe,
    SafeHtmlPipe,
    SemesterFormatPipe,
    CourseTypeFormatPipe,
    CourseTypeBadgeDirective,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AddQuitButtonsComponent,
    FinialButtonsComponent,
    TooltipModule,
    ModalModule,
    AccordionModule,
    PopoverModule,
  ],
  entryComponents: [
    SimpleModalComponent,
  ]
})
export class SharedModule { }

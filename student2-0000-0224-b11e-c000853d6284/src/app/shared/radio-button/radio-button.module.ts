import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button.component';
import { RadioGroupDirective } from './radio-group.directive';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RadioButtonComponent,
    RadioGroupDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    RadioButtonComponent,
    RadioGroupDirective,
  ]
})
export class RadioButtonModule { }

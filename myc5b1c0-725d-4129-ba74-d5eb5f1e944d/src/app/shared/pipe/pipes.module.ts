import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsToArrayPipe } from './maps-to-array.pipe';
import { WeekdayFormatPipe } from './weekdayFormat.pipe';

@NgModule({
  declarations: [
    MapsToArrayPipe,
    WeekdayFormatPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MapsToArrayPipe,
    WeekdayFormatPipe,
  ]
})
export class PipesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { MapsToArrayPipe } from './maps-to-array.pipe';

@NgModule({
  declarations: [
    SafePipe,
    MapsToArrayPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafePipe,
    MapsToArrayPipe,
  ]
})
export class PipesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { MapsToArrayPipe } from './maps-to-array.pipe';
import { StatusPipe } from './status.pipe';

@NgModule({
  declarations: [
    SafePipe,
    MapsToArrayPipe,
    StatusPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafePipe,
    MapsToArrayPipe,
    StatusPipe,
  ]
})
export class PipesModule { }

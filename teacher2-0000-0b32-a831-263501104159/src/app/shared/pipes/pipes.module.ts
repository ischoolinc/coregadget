import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { MapsToArrayPipe } from './maps-to-array.pipe';
import { ClassNamesPipe } from './classnames.pipe';

@NgModule({
  declarations: [
    SafePipe,
    MapsToArrayPipe,
    ClassNamesPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafePipe,
    MapsToArrayPipe,
    ClassNamesPipe,
  ]
})
export class PipesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { ContextState } from './states/context.state';
import { TimetableState } from './states/timetable.state';
import { CourseConfState } from './states/conf.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forFeature([ContextState, TimetableState, CourseConfState])
  ]
})
export class CoreModule { }

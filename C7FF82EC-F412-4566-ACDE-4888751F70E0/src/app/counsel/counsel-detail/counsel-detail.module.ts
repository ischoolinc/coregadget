import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { CounselDetailRoutingModule } from './counsel-detail-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedCounselDetailModule } from '../../shared-counsel-detail';
import {
  CadreDetailComponent,
  ComprehensiveDetailComponent,
  ServiceLearningDetailComponent,
  ComprehensiveDetailRoutingComponent,
  ComprehensiveEditComponent,
  ComprehensiveViewComponent
} from '.';

@NgModule({
  declarations: [
    CadreDetailComponent,
    ComprehensiveDetailComponent,
    ServiceLearningDetailComponent,
    ComprehensiveDetailRoutingComponent,
    ComprehensiveEditComponent,
    ComprehensiveViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CounselDetailRoutingModule,
    SharedCounselDetailModule,
    MatIconModule
  ]
})
export class CounselDetailModule { }

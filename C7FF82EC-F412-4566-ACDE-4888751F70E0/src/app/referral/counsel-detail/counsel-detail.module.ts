import { NgModule } from '@angular/core';
import { CounselDetailRoutingModule } from './counsel-detail-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedCounselDetailModule } from '../../shared-counsel-detail';
import {MatIconModule} from '@angular/material/icon'
@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CounselDetailRoutingModule,
    SharedCounselDetailModule,
    MatIconModule
  ]
})
export class CounselDetailModule { }

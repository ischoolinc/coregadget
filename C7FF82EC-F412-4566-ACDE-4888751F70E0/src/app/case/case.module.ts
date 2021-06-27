import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CaseComponent } from './case.component';
import { NewCaseModalComponent } from './new-case-modal/new-case-modal.component';
import { DelCaseModalComponent } from './del-case-modal/del-case-modal.component';
import { RenderModule } from '../render';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    CaseComponent,
    NewCaseModalComponent,
    DelCaseModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RenderModule,
    MatIconModule,
  
  ],
  exports: [
    NewCaseModalComponent,
  ]
})
export class CaseModule { }

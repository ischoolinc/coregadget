import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index.component';
import { ComprehensiveRoutingModule } from './comprehensive-routing.module';
import { ComprehensiveFillComponent } from './comprehensive-fill/comprehensive-fill.component';
import { RenderModule } from './../../../render/render.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    IndexComponent,
    ComprehensiveFillComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComprehensiveRoutingModule,
    CoreModule,
    RenderModule,
  ]
})
export class ComprehensiveModule { }

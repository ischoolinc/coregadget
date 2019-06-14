import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComprehensiveRoutingModule } from './comprehensive-routing.module';
import { ComprehensiveFillComponent } from './comprehensive-fill/comprehensive-fill.component';
import { RenderModule } from './../../../render/render.module';
import { CoreModule } from './core/core.module';
import { ComprehensiveComponent } from './comprehensive.component';
import { ComprehensiveRoutingComponent } from './comprehensive-routing.component';
import { ComprehensiveViewComponent } from './comprehensive-view/comprehensive-view.component';
import { ComprehensiveEditComponent } from './comprehensive-edit/comprehensive-edit.component';

@NgModule({
  declarations: [
    ComprehensiveFillComponent,
    ComprehensiveComponent,
    ComprehensiveRoutingComponent,
    ComprehensiveViewComponent,
    ComprehensiveEditComponent,
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

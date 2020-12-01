import { MatIconModule } from '@angular/material/icon';
import { ByClassComponent } from './by-class/by-class.component';
import { ByKeywordComponent } from './by-keyword/by-keyword.component';
import { ByRoleComponent } from './by-role/by-role.component';
import { ByTagComponent } from './by-tag/by-tag.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooserComponent } from './chooser.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import {PortalModule} from '@angular/cdk/portal';
import { SelectedDetailComponent } from './seleted-detail/selected-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    ChooserComponent,
    SelectedDetailComponent,
    ByTagComponent,
    ByRoleComponent,
    ByKeywordComponent,
    ByClassComponent
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class ChooserModule { }

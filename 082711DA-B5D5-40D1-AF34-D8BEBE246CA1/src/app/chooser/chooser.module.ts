import { MatInputModule } from '@angular/material/input';
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
import { PortalModule } from '@angular/cdk/portal';
import { SelectedDetailComponent } from './seleted-detail/selected-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { DemoComponent } from './demo/demo.component';
import { ByClassStudentComponent } from './by-class-student/by-class-student.component';
import { ByTagStudentComponent } from './by-tag-student/by-tag-student.component';

@NgModule({
  declarations: [
    ChooserComponent,
    SelectedDetailComponent,
    ByTagComponent,
    ByRoleComponent,
    ByKeywordComponent,
    ByClassComponent,
    DemoComponent,
    ByClassStudentComponent,
    ByTagStudentComponent
  ],
  imports: [
    MatButtonToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    PortalModule,
    ReactiveFormsModule,
  ],
  exports: [
    ChooserComponent,
    DemoComponent,
  ]
})
export class ChooserModule { }

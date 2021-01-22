import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// angular material
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    ConfirmDialogComponent,
    MatDialogModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule { }

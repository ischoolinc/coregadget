import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatDialogModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatIconModule,
} from '@angular/material';
import { FilterCategoryPipe } from './pipes/filter-category.pipe';
import { MapsToArrayPipe } from './pipes/maps-to-array.pipe';
import { TopRankPipe } from './pipes/top-rank.pipe';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { PlayerPickerDialogComponent } from './player-picker-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ConfirmDialogComponent,
    PlayerPickerDialogComponent,
    FilterCategoryPipe,
    MapsToArrayPipe,
    TopRankPipe,
  ],
  exports: [
    ConfirmDialogComponent,
    FilterCategoryPipe,
    MapsToArrayPipe,
    TopRankPipe,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    PlayerPickerDialogComponent,
  ]
})
export class SharedModule { }

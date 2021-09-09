import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GadgetService } from './gadget.service';
import { EditClassModalComponent } from './edit-class-modal/edit-class-modal.component';
import { PipesModule } from './shared/pipes/pipes.module';
import { DialogModule } from './shared/dialog/dialog.module';
import { ObjectCheckboxDirective } from './shared/object-checkbox.directive';
import { SearchBarModule } from './shared/search-bar/search-bar.module';
import { RadioButtonModule } from './shared/radio-button/radio-button.module';
import { CheckboxModule } from './shared/checkbox/checkbox.module';
import { DeleteClassComponent } from './delete-class/delete-class.component';
import { SelectAteacherComponent } from './select-ateacher/select-ateacher.component';
import { HomeComponent } from './home/home.component';
import { ImportClassesComponent } from './import-classes/import-classes.component';



@NgModule({
  declarations: [
    AppComponent,
    EditClassModalComponent,
    ObjectCheckboxDirective,
    DeleteClassComponent,
    SelectAteacherComponent,
    HomeComponent,
    ImportClassesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    PipesModule,
    DialogModule,
    SearchBarModule,
    RadioButtonModule,
    CheckboxModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
  ],
  providers: [GadgetService],
  bootstrap: [AppComponent]
})
export class AppModule { }

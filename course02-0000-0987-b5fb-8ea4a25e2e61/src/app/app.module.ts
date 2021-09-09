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
import { EditCourseModalComponent } from './edit-course-modal/edit-course-modal.component';
import { PipesModule } from './shared/pipes/pipes.module';
import { DialogModule } from './shared/dialog/dialog.module';
import { ObjectCheckboxDirective } from './shared/object-checkbox.directive';
import { SearchBarModule } from './shared/search-bar/search-bar.module';
import { RadioButtonModule } from './shared/radio-button/radio-button.module';
import { CheckboxModule } from './shared/checkbox/checkbox.module';
import { DeleteCourseComponent } from './delete-course/delete-course.component';
import { SelectAteacherComponent } from './select-ateacher/select-ateacher.component';
import { SelectAclassComponent } from './select-aclass/select-aclass.component';
import { HomeComponent } from './home/home.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { StatusHighlightDirective } from './shared/status-highlight.directive';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { ImportCoursesComponent } from './import-courses/import-courses.component';
import { ImportStudentsComponent } from './import-students/import-students.component';
import { AddCourseStudentsComponent } from './add-course-students/add-course-students.component';
import { JoinClassStudentsComponent } from './join-class-students/join-class-students.component';



@NgModule({
  declarations: [
    AppComponent,
    EditCourseModalComponent,
    ObjectCheckboxDirective,
    DeleteCourseComponent,
    SelectAteacherComponent,
    SelectAclassComponent,
    HomeComponent,
    CourseDetailComponent,
    StatusHighlightDirective,
    DeleteStudentComponent,
    ImportCoursesComponent,
    ImportStudentsComponent,
    AddCourseStudentsComponent,
    JoinClassStudentsComponent,
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

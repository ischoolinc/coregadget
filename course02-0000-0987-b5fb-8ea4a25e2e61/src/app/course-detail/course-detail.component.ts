import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { AddCourseStudentsComponent } from '../add-course-students/add-course-students.component';
import { CoreService } from '../core.service';
import { CourseRec, CourseTeacherRec } from '../data/course';
import { StudentRec } from '../data/student';
import { DeleteStudentComponent } from '../delete-student/delete-student.component';
import { ModalSize } from '../shared/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  loading = true;

  course: CourseRec = {} as CourseRec;
  mainTeacher: CourseTeacherRec = {} as CourseTeacherRec;
  coTeacher2: CourseTeacherRec = {} as CourseTeacherRec;
  coTeacher3: CourseTeacherRec = {} as CourseTeacherRec;
  allCheck: boolean = false;
  students: StudentRec[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coreSrv: CoreService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(mergeMap(async params => {
        if (params.has('id')) {
          const course = this.coreSrv.curCourse$.value;
          if ('' + course.CourseId === params.get('id')) {
            return Promise.resolve(course);
          } else {
            try {
              const sourceCourses = await this.coreSrv.getCourse(params.get('id')!);
              const sourceCourse = [ ... this.coreSrv.colCourseMap(sourceCourses).values()][0];
              return Promise.resolve(sourceCourse);
            } catch (error) {
              return Promise.resolve(null);
            }
          }
        }
        return Promise.resolve(null);
      }))
      .subscribe(async course => {
        if (course?.CourseId) {
          course.Teachers?.forEach(v => {
            switch (v.TeacherSequence) {
              case '1':
                this.mainTeacher = v;
                break;
              case '2':
                this.coTeacher2 = v;
                break;
              case '3':
                this.coTeacher3 = v;
                break;
            }
          });
          this.course = course;
          await this.getStudents();
          this.loading = false;
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  async getStudents() {
    this.students = await this.coreSrv.getCourseStudent({ CourseId: [this.course.CourseId], StudentStatus: '1, 2' });
  }

  openAddAStudent() {
    const dialogRef = this.dialog.open(AddCourseStudentsComponent, {
      maxWidth: '1050px',
      data: { course: this.course }
    });

    dialogRef.afterClosed().subscribe(async result => {
      try {
        if (result && result.state === 'refresh') {
          this.loading = true;
          await this.getStudents();
        }
      } catch (error) {

      } finally {
        this.loading = false;
      }
    });
  }

  updateAllCheck() {
    this.allCheck = this.students != null && this.students.every(t => t.Checked);
  }

  someCheck(): boolean {
    if (this.students == null) {
      return false;
    }
    return this.students.filter(t => t.Checked).length > 0 && !this.allCheck;
  }

  setAll(checked: boolean) {
    this.allCheck = checked;
    if (this.students == null) {
      return;
    }
    this.students.forEach(t => t.Checked = checked);
  }

  delCurStudent(student: StudentRec) {
    const dialogRef = this.dialog.open(DeleteStudentComponent, {
      data: {
        course: this.course,
        students: [student],
        mode: 'SINGLE',
      },
      maxWidth: ModalSize.MD,
      panelClass: ['my-dialog-border'] ,
    });

    dialogRef.afterClosed().subscribe(async result => {
      try {
        if (result && result.state === 'success') {
          this.loading = true;
          await this.getStudents();
        }
      } catch (error) {

      } finally {
        this.loading = false;
      }
    });
  }

  delCheckedStudent() {
    const delStudentList = this.students.filter(v => v.Checked);
    if (delStudentList.length) {
      const dialogRef = this.dialog.open(DeleteStudentComponent, {
        data: {
          course: this.course,
          students: delStudentList,
          mode: 'BATCH',
        },
        maxWidth: ModalSize.MD,
        panelClass: ['my-dialog-border'] ,
      });

      dialogRef.afterClosed().subscribe(async result => {
        try {
          if (result && result.state === 'success') {
            this.loading = true;
            await this.getStudents();
            this.setAll(false);
          }
        } catch (error) {

        } finally {
          this.loading = false;
        }
      });
    }
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { StudentRec } from '../data/student';
import { ImportCoursesComponent } from '../import-courses/import-courses.component';
import { ImportStudentsComponent } from '../import-students/import-students.component';
import { StatusPipe } from '../shared/pipes/status.pipe';
import { CoreService, SemesterRec } from './../core.service';
import { CourseRec, SourceCourse } from './../data/course';
import { DeleteCourseComponent } from './../delete-course/delete-course.component';
import { EditCourseModalComponent } from '../edit-course-modal/edit-course-modal.component';
import { ConfirmDialogService } from './../shared/dialog/confirm-dialog.service';
import { ModalSize } from './../shared/dialog/confirm-dialog/confirm-dialog';
import { JoinClassStudentsComponent } from '../join-class-students/join-class-students.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**分頁用 */
  // @ViewChild(MatPaginator) paginator: MatPaginator|any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  filterCoursesSlice: CourseRec[] = [];
  loading = true;
  courseErrMsg: any = '';
  delErrMsg = '';
  deling = false;
  keywordCtrl = new FormControl('');
  schoolYearList: string[] = [];
  semesterList: string[] = [];
  curSchoolYear!: string;
  curSemester!: string;
  courseMap: Map<string, CourseRec> = new Map();
  filteredCourses: CourseRec[] = [];
  allCheck: boolean = false;
  pageEvent: PageEvent | undefined;
  @ViewChild('paginator', {static : true}) paginator: MatPaginator | undefined;
  
  constructor(
    private coreSrv: CoreService,
    public dialog: MatDialog,
    public confirmSrv: ConfirmDialogService,
    private router: Router,
    ) { }
    
    async ngOnInit() {
    try {
      this.courseErrMsg = '';
      
      const promiseList = [
        this.getCourseAllSemester(),
        this.coreSrv.getCurrentSemester(),
        this.coreSrv.init()
      ];
      
      const { SchoolYear, Semester } = await promiseList[1] as SemesterRec;
      this.curSchoolYear = this.coreSrv.curSchoolYear$.value || SchoolYear;
      this.curSemester = this.coreSrv.curSemester$.value || Semester;
      this.coreSrv.curSchoolYear$.next(this.curSchoolYear);
      this.coreSrv.curSemester$.next(this.curSemester);
      
      await this.getCourses(this.curSchoolYear, this.curSemester);
      this.filterCourse('');
      this.filterCoursesSlice = this.filteredCourses.slice(0, 30)
    } catch (error) {
      this.courseErrMsg = error;
    } finally {
      this.loading = false;
    }
    
    const nullValue = null;
    this.keywordCtrl.valueChanges
    .pipe(
      startWith(nullValue),
      debounceTime(500),
      distinctUntilChanged(),
      // 分頁
      
      // tap(console.log),
      ).subscribe(term => this.filterCourse(term));
      

     
      
    }
   
    
    async getCourseAllSemester() {
      this.schoolYearList = [];
      this.semesterList = [];
      
    const allSemesterList = await this.coreSrv.getCourseAllSemester();

    const schoolYearList = [...new Set(allSemesterList.map(v => v.SchoolYear))];
    const semesterList = [...new Set(allSemesterList.map(v => v.Semester))];
    this.schoolYearList = (schoolYearList.length)
      ? [(+schoolYearList[0] + 1).toString(), ...schoolYearList]
      : Array.from({ length: 3 }, (_, i) => ((new Date().getFullYear() - 1911 + 1) - i).toString());
    this.semesterList = (semesterList.length) ? semesterList : ['1', '2', '3', '4'];
  }

  async getCourses(schoolYear: string, semester: string) {
    this.courseMap.clear();
    const rsp: SourceCourse[] = await this.coreSrv.getCourses({
      SchoolYear: schoolYear,
      Semester: semester,
      StudentStatus: '1, 2',
    });
    this.courseMap = this.coreSrv.colCourseMap(rsp);
  }

  OnPageChenge(event?: PageEvent) {
    let startIndex = 0 ;
    /** 本頁最結束的數 */
    let endIndex = 30 ;
    if(event){
      startIndex = event.pageIndex * event.pageSize
       endIndex = startIndex + event.pageSize;
    }
    if (endIndex > this.filteredCourses.length) {
        endIndex = this.filteredCourses.length
     
   
      // this.filterCoursesSlice = this.filteredCourses.slice(startIndex, endIndex)
    }else{ // 如果 不是大於


    }

    this.filteredCourses.forEach((course, index) => {
      if (index >= startIndex && index < endIndex) {
        course.IsShowOnCurrentPage = true
      }
      else { course.IsShowOnCurrentPage = false }
    })
  }


  filterCourse(keyword: string) {

  
    if (keyword) {
      this.filteredCourses = [...this.courseMap.values()].filter(v => v.CourseName.indexOf(keyword) > -1 || (v.ClassName ? v.ClassName : '').indexOf(keyword) > -1 || v.Teachers?.map(t => t.TeacherName).toString().indexOf(keyword) != -1 );
    } else {
      this.filteredCourses = [...this.courseMap.values()];
    }

    this.OnPageChenge()
  }

  modifyCourse(course: CourseRec) {
    if (course && course.CourseId) {
      this.openModifyCourseDialog({ ...course });
    }
  }

  openModifyCourseDialog(course: CourseRec) {
    const dialogRef = this.dialog.open(EditCourseModalComponent, {
      maxWidth: '1050px',
      data: { course: course },
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log("ss",result)
      if(result?.isShowExportDia){
        this.importCourse();
      }
      if (result && result.state) {
        try {
          this.loading = true;
          this.courseErrMsg = '';

          await Promise.all([
            this.getCourseAllSemester(),
            this.getCourses(this.curSchoolYear, this.curSemester)
          ]);
          this.filterCourse(this.keywordCtrl.value);
         
       
        } catch (error) {
          this.courseErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  detailCourse(course: CourseRec) {
    if (course && course.CourseId) {
      this.coreSrv.curCourse$.next(course);
      this.router.navigate(['/course-detail/', course.CourseId]);
    }
  }

  addCourse() {
    this.openModifyCourseDialog({ SchoolYear: this.curSchoolYear, Semester: this.curSemester } as CourseRec);
  }

  importCourse() {
    const dialogRef = this.dialog.open(ImportCoursesComponent, {
      maxWidth: '1050px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state === 'refresh') {
        try {
          this.loading = true;
          this.courseErrMsg = '';

          await this.getCourses(this.curSchoolYear!, this.curSemester!);
          this.filterCourse(this.keywordCtrl.value);

        } catch (error) {
          this.courseErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  async exportCourse() {
    const content: any[] = [];
    this.courseMap.forEach(v => {
      const courseTeachers: string[] = [];
    // v.Teachers?.forEach(t => t.TeacherName ? courseTeachers.push(`${t.TeacherName}(${t.TeacherSequence})`) : null);
      v.Teachers?.forEach(t => t.TeacherName ? courseTeachers.push(`${t.TeacherName}${t.TeacherNickname ? '('+t.TeacherNickname+')' : ''}`) : null);
      content.push({
        '課程系統編號': v.CourseId,
        '課程名稱': v.CourseName,
        '授課教師1': courseTeachers[0],
        '授課教師2': courseTeachers[1],
        '授課教師3': courseTeachers[2],
        '所屬班級': v.ClassName,
        '學生人數': v.CourseStudentCount || '0',
      });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(content);
    XLSX.utils.book_append_sheet(wb, ws, 'course');
    XLSX.writeFile(wb, `${this.curSchoolYear}學年度${this.curSemester}學期 課程 course.xlsx`);

    try {
      await this.coreSrv.addLog('Export', '匯出課程名單', `已進行「匯出名單」操作。`);
    } catch (error) { }
  }

  async changeSemester() {
    if (this.loading) { return; }

    try {
      this.loading = true;
      this.courseErrMsg = '';

      await this.getCourses(this.curSchoolYear, this.curSemester);
      this.filterCourse('');
      this.coreSrv.curSchoolYear$.next(this.curSchoolYear);
      this.coreSrv.curSemester$.next(this.curSemester);
      this.setAll(false);
    } catch (error) {
      this.courseErrMsg = error;
    } finally {
      this.loading = false;
    }
  }

  updateAllCheck() {
    this.allCheck = this.filteredCourses != null && this.filteredCourses.every(t => t.Checked);
  }

  someCheck(): boolean {
    if (this.filteredCourses == null) {
      return false;
    }
    return this.filteredCourses.filter(t => t.Checked).length > 0 && !this.allCheck;
  }

  setAll(checked: boolean) {
    this.allCheck = checked;
    if (this.filteredCourses == null) {
      return;
    }
    this.filteredCourses.forEach(t => t.Checked = checked);
  }

  /** 在校成績 */
  getCheckAmount(): number {
    let result = 0;
    this.filteredCourses.forEach(t => {
      if (t.Checked) result++;
    });
    return result;
  }

  delCurCourse(course: CourseRec) {
    const dialogRef = this.dialog.open(DeleteCourseComponent, {
      data: {
        courses: [course],
        mode: 'SINGLE',
      },
      maxWidth: ModalSize.MD,
      panelClass: ['my-dialog-border'],
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state === 'success') {
        try {
          this.loading = true;
          this.courseErrMsg = '';

          await Promise.all([
            this.getCourseAllSemester(),
            this.getCourses(this.curSchoolYear, this.curSemester)
          ]);
          this.filterCourse(this.keywordCtrl.value);
        } catch (error) {
          this.courseErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  delCheckedCourse() {
    const delCourseList = this.filteredCourses.filter(v => v.Checked);
    if (delCourseList.length) {
      const dialogRef = this.dialog.open(DeleteCourseComponent, {
        data: {
          courses: delCourseList,
          mode: 'BATCH',
        },
        maxWidth: ModalSize.MD,
        panelClass: ['my-dialog-border'],
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result && result.state === 'success') {
          try {
            this.loading = true;
            this.courseErrMsg = '';

            await Promise.all([
              this.getCourseAllSemester(),
              this.getCourses(this.curSchoolYear, this.curSemester)
            ]);
            this.filterCourse(this.keywordCtrl.value);
            this.setAll(false);
          } catch (error) {
            this.courseErrMsg = error;
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }

  importCourseStudent() {
    const dialogRef = this.dialog.open(ImportStudentsComponent, {
      maxWidth: '1050px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state === 'refresh') {
        try {
          this.loading = true;
          this.courseErrMsg = '';
          await this.getCourses(this.curSchoolYear!, this.curSemester!);
          this.filterCourse(this.keywordCtrl.value);
        } catch (error) {
          this.courseErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  async exportCourseStudent() {
    const courseStudents = await this.coreSrv.getCourseStudent({
      SchoolYear: this.curSchoolYear,
      Semester: this.curSemester,
      StudentStatus: '1, 2',
    });

    const content: any[] = [];
    new Array().concat(courseStudents || []).forEach((v: StudentRec) => {
      content.push({
        '課程系統編號': v.CourseId,
        '課程名稱': v.CourseName,
        '學年度': v.SchoolYear,
        '學期': v.Semester,
        '學生系統編號': v.StudentId,
        '學號': v.StudentNumber,
        '姓名': v.StudentName,
        '座號': v.SeatNo,
        '班級': v.ClassName,
        '帳號': v.LinkAccount,
      });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(content);
    XLSX.utils.book_append_sheet(wb, ws, 'course_student');
    XLSX.writeFile(wb, 'course_student.xlsx');

    try {
      await this.coreSrv.addLog('Export', '匯出課程學生', `已進行「匯出課程學生名單」操作。`);
    } catch (error) { }
  }

  addCheckedCourseStudent() {
    const addCourseList = this.filteredCourses.filter(v => v.Checked);
    if (addCourseList.length) {
      const dialogRef = this.dialog.open(JoinClassStudentsComponent, {
        data: {
          courses: addCourseList,
          mode: 'BATCH',
        },
        maxWidth: ModalSize.MD,
        panelClass: ['my-dialog-border-primary'],
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result && result.state === 'success') {
          try {
            this.loading = true;
            this.courseErrMsg = '';

            await Promise.all([
              this.getCourseAllSemester(),
              this.getCourses(this.curSchoolYear, this.curSemester)
            ]);
            this.filterCourse(this.keywordCtrl.value);
            this.setAll(false);
          } catch (error) {
            this.courseErrMsg = error;
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
}

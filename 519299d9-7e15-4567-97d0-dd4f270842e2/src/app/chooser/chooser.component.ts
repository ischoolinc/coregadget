import { Component, OnInit } from '@angular/core';
import {
  TeacherService,
  ClassStudentRecord as ClassStudentRecordBase,
  CourseStudentRecord as CourseStudentRecordBase
} from '../teacher.service';
import { map, concatMap, filter } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { SelectionResult, ClassSelection, StudentSelection, CourseSelection } from './selection-result';

/** 內部使用。 */
export interface ColRecord {
  [x: string]: any;
  students: ClassStudentRecord[];
  checked?: boolean;
}

export interface ClassRecord {
  classId: string;
  className: string;
  students: ClassStudentRecord[];
  checked?: boolean;
}

export interface CourseRecord {
  courseId: string;
  courseName: string;
  courseSubject: string;
  students: CourseStudentRecord[];
  checked?: boolean;
}

export interface ClassStudentRecord extends ClassStudentRecordBase {
  checked?: boolean;
}

export interface CourseStudentRecord extends CourseStudentRecordBase {
  checked?: boolean;
}

@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.scss']
})
export class ChooserComponent implements OnInit {

  loading = false;

  classes: ColRecord | ClassRecord[] = [];
  courses: ColRecord | CourseRecord[] = [];

  selectionCount = 0;

  constructor(
    private teacher: TeacherService,
    private dialogRef: MatDialogRef<ChooserComponent>
  ) { }

  async ngOnInit() {
    try {
      this.loading = true;
      this.classes = await this.teacher.getMyClass().pipe(
        // 轉成 class id 陣列。
        map(objClasses => objClasses.map(objClass => objClass.ClassID)),
        // 如果無課程就不往下執行
        filter(cls => cls.length ? true : false),
        // 呼叫取得班級學生清單。
        concatMap(cls => this.teacher.getClassStudentsV2(cls)),
        // 轉換成 ClassRecord 格式。
        map(students => this.students2ClassRecords(students)),
      ).toPromise() || [];

      if (gadget.params.course === 'enabled') {
        this.courses = await this.teacher.getCurrentSemester().pipe(
          // 轉成 學年期物件。
          concatMap(objSemester => this.teacher.getMyCourses(objSemester.SchoolYear, objSemester.Semester)),
          // 轉成 course id 陣列。
          map(objCourses => objCourses.map(objCourse => objCourse.CourseID)),
          // 如果無課程就不往下執行
          filter(courses => courses.length ? true : false),
          // 呼叫取得課程學生清單。
          concatMap(courses => courses.length ? this.teacher.getCourseStudentV2(courses) : []),
          // 轉換成 CourseRecord 格式。
          map(students => this.students2CourseRecords(students))
        ).toPromise() || [];
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }

  /** 將學生陣列 group by。 */
  private students2ClassRecords(students: ClassStudentRecord[]) {
    const clsmap = new Map<string, ClassRecord>();

    for (const student of students) {
      const { ClassID, ClassName } = student;

      if (!!!clsmap.get(ClassID)) {
        clsmap.set(ClassID, {
          classId: ClassID,
          className: ClassName,
          students: []
        });
      }

      clsmap.get(ClassID).students.push(student);
    }
    return Array.from(clsmap.values());
  }

  private students2CourseRecords(students: CourseStudentRecord[]) {
    const coursemap = new Map<string, CourseRecord>();

    for (const student of students) {
      const { CourseID, CourseName, CourseSubject } = student;

      if (!!!coursemap.get(CourseID)) {
        coursemap.set(CourseID, {
          courseId: CourseID,
          courseName: CourseName,
          courseSubject: CourseSubject,
          students: []
        });
      }

      coursemap.get(CourseID).students.push(student);
    }
    return Array.from(coursemap.values());
  }

  toggleAll(item: ColRecord) {
    item.students.forEach(stu => {
      stu.checked = item.checked;
    });

    this.sumSelectionCount();
  }

  reflectColSelection(item: ColRecord) {
    item.checked = item.students
      .map(v => v.checked)
      .reduce((acc, cur) => acc && cur);

    this.sumSelectionCount();
  }

  sumSelectionCount() {
    let total = 0;
    for (const cls of this.classes) {
      total += cls.students
        .map(stu => stu.checked)
        .filter(selected => selected)
        .length;
    }

    for (const cls of this.courses) {
      total += cls.students
        .map(stu => stu.checked)
        .filter(selected => selected)
        .length;
    }

    this.selectionCount = total;
  }

  confirm() {
    const selections: SelectionResult[] = [];

    for (const cr of this.classes) {

      if (!!cr.checked) {
        selections.push(new ClassSelection(cr));
        continue;
      }

      for (const stud of cr.students) {
        if (!!stud.checked) {
          selections.push(new StudentSelection(stud));
        }
      }
    }

    for (const cr of this.courses) {

      if (!!cr.checked) {
        selections.push(new CourseSelection(cr));
        continue;
      }

      for (const stud of cr.students) {
        if (!!stud.checked) {
          selections.push(new StudentSelection(stud));
        }
      }
    }

    this.dialogRef.close(selections);
  }
}

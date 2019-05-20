import { Component, OnInit } from '@angular/core';
import { TeacherService, ClassStudentRecord as ClassStudentRecordBase } from '../teacher.service';
import { map, concatMap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { SelectionResult, ClassSelection, StudentSelection } from './selection-result';

/** 內部使用。 */
export interface ClassRecord {
  classId: string;
  className: string;
  students: ClassStudentRecord[];
  checked?: boolean;
}

export interface ClassStudentRecord extends ClassStudentRecordBase {
  checked?: boolean;
}

@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.scss']
})
export class ChooserComponent implements OnInit {

  loading = false;

  classes: ClassRecord[] = [];

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
        map(objClasses => {
          return objClasses.map(objClass => objClass.ClassID);
        }),
        // 呼叫取得班級學生清單。
        concatMap(cls => this.teacher.getClassStudentsV2(cls)),
        // 轉換成 ClassRecord 格式。
        map(students => this.students2ClassRecords(students))
      ).toPromise();
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

  toggleAll(cls: ClassRecord) {
    cls.students.forEach(stu => {
      stu.checked = cls.checked;
    });

    this.sumSelectionCount();
  }

  reflectClassSelection(cls: ClassRecord) {
    cls.checked = cls.students
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

    this.dialogRef.close(selections);
  }
}

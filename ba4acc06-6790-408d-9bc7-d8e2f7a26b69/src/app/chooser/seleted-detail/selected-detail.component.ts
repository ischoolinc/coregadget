import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StudentRecord, TeacherRecord } from '../../data';

class MyClass {
  students: StudentRecord[] = [];

  constructor(public className: string) {}

  addStudent(stu: StudentRecord) {
    this.students.push(stu);
  }
}

class MyGradeYear {
  classes: MyClass[] = [];

  constructor(public gradeYear: string) {}

  addClass(cls: MyClass) {
    this.classes.push(cls);
  }

  addStudent(stu: StudentRecord) {
    let cls = this.findClass(stu.ClassName);
    if (!cls) {
      cls = new MyClass(stu.ClassName);
      this.classes.push(cls);
    }

    cls.addStudent(stu);
  }

  private findClass(name: string) {
    return this.classes.find(v => v.className === name);
  }
}


@Component({
  selector: 'app-seleted-detail',
  templateUrl: './selected-detail.component.html',
  styleUrls: ['./selected-detail.component.scss']
})
export class SelectedDetailComponent implements OnInit {

  target: string;
  title: string;
  grades: MyGradeYear[] = [];
  students: StudentRecord[];
  teachers: TeacherRecord[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { target: string, title: string, records: TeacherRecord[] & StudentRecord[]}
  ) {
    this.target = data.target;
    this.title = data.title;
    this.students = data.records || [];

    if (this.target === 'STUDENT') {
      this.teachers = data.records || [];
      const grades: MyGradeYear[] = [];
      this.students.forEach(stu => {

        let grade = grades.find(g => g.gradeYear === stu.GradeYear);

        if (!grade) {
          grade = new MyGradeYear(stu.GradeYear);
          grades.push(grade);
        }

        grade.addStudent(stu);
      });
      this.grades = grades;
      // console.log(this.grades);
    } else {
      this.teachers = data.records || [];
      // console.log(this.teachers);
    }
  }

  ngOnInit() {
  }

}

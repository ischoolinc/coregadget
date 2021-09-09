import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassRec, CoreService } from '../core.service';
import { CourseFieldName, ImportMode } from '../data/import-config';
import { CourseRec, SourceCourse } from '../data/course';
import { DocumentValidator, JsonRowSource } from '../shared/validators';
import { TeacherRec } from '../data/teacher';
import { EditCourseService } from './edit-course.service';

@Component({
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.scss']
})
export class EditCourseModalComponent implements OnInit {

  mode: 'add' | 'edit' = 'add';
  saving = false;
  errMsg = '';
  cRec: CourseRec = {} as CourseRec;
  classList: ClassRec[] = [];
  teacherList: TeacherRec[] = [];
  teacherId1?: string;
  teacherId2?: string;
  teacherId3?: string;
  showTeacher3 = false;
  joinClassStudent = false;
  courseName = '';

  constructor(
    public dialogRef: MatDialogRef<EditCourseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: CourseRec },
    private coreSrv: CoreService,
    public dialog: MatDialog,
    private editCourseSrv: EditCourseService,
  ) {
    this.courseName = data.course.CourseName;
    this.cRec = data.course;
    this.mode = (this.cRec.CourseId ? 'edit' : 'add');
    this.classList = this.coreSrv.classList;
    this.teacherList = this.coreSrv.teacherList;
    this.teacherId1 = data.course.Teachers?.find(v => v.TeacherSequence === '1')?.TeacherId;
    this.teacherId2 = data.course.Teachers?.find(v => v.TeacherSequence === '2')?.TeacherId;
    this.teacherId3 = data.course.Teachers?.find(v => v.TeacherSequence === '3')?.TeacherId;
  }

  ngOnInit(): void {
  }

  async getSourceCourseList(opt: {
    CourseId?: string,
    SchoolYear?: string,
    Semester?: string,
  }): Promise<SourceCourse[]> {
    try {
      return await this.coreSrv.getCourses(opt);
    } catch (error) {
      throw new Error('取得比對清單發生錯誤！');
    }
  }

  async validate() {
    try {
      const mode: ImportMode = (this.cRec.CourseId) ? 'EDIT' : 'ADD';
      const identifyField: CourseFieldName[] = (mode === 'EDIT') ? ['CourseId'] : [];
      const importField: CourseFieldName[] = ['CourseId', 'SchoolYear', 'Semester', 'CourseName', 'RefClassId', 'TeacherId1', 'TeacherId2', 'TeacherId3'];
      // console.log(importField);

      const sourceCourseList = (mode === 'EDIT') ?
        await this.getSourceCourseList({ CourseId: this.cRec.CourseId })
        :
        await this.getSourceCourseList({ SchoolYear: this.cRec.SchoolYear, Semester: this.cRec.Semester });

      const rule = this.editCourseSrv.makeRules(mode, identifyField, importField, sourceCourseList);
      // console.log(rule);

      const jsonRowSrc = new JsonRowSource([{
        CourseId: this.cRec.CourseId,
        CourseName: this.cRec.CourseName,
        SchoolYear: this.cRec.SchoolYear,
        Semester: this.cRec.Semester,
        RefClassId: this.cRec.RefClassId,
        TeacherId1: this.teacherId1,
        TeacherId2: this.teacherId2,
        TeacherId3: this.teacherId3,
      }]);

      const docValid = new DocumentValidator(rule.fieldRules, rule.rowRules);
      docValid.validate(jsonRowSrc);
      const errorResult = jsonRowSrc.getErrors();
      // console.log(errorResult);
      // console.log(this.cRec);
      return this.formatErrorResult(errorResult);
    } catch (error) {
      return { info: 'error', errorMsg: (error || '分析發生錯誤！') }
    }
  }

  // 格式化驗證結果
  formatErrorResult(errorResult: Map<number, any>) {
    if (errorResult.has(0)) {
      const row = errorResult.get(0);
      const fieldErrors = Object.keys(row).map(field => {
        return `${this.coreSrv.replaceMappingFieldName(field)}: ${row[field].join('、')}`;
      });
      return { info: 'error', errorMsg: fieldErrors.join('、') };
    } else {
      return { info: 'success' };
    }
  }

  async updateCourse() {
    this.errMsg = '';
    if (this.saving) { return; }

    // 驗證資料正確性
    const valid = await this.validate();
    if (valid.info === 'error') { this.errMsg = valid.errorMsg; return; }

    try {
      this.saving = true;
      let newData = {
        CourseId: this.cRec.CourseId,
        CourseName: this.cRec.CourseName,
        SchoolYear: this.cRec.SchoolYear,
        Semester: this.cRec.Semester,
        RefClassId: this.cRec.RefClassId,
        TeacherId1: this.teacherId1, // TeacherId1: this.cRec.Teachers?.[0].TeacherId,
        TeacherId2: this.teacherId2,
        TeacherId3: this.teacherId3,
      };

      if (this.cRec.CourseId) {
        await this.coreSrv.updateCourseAndTeacher(['CourseId'], [newData], this.joinClassStudent);
      } else {
        await this.coreSrv.addCourseAndTeacher([newData], this.joinClassStudent);
      }

      try {
        if (this.cRec.CourseId) {
          await this.coreSrv.addLog('Record', '變更課程', `課程系統編號：${this.cRec.CourseId}。\n詳細資料：${JSON.stringify(this.cRec)}`);
        } else {
          await this.coreSrv.addLog('Record', '新增課程', `課程名稱：${this.cRec.CourseName}、學年度：${this.cRec.SchoolYear}、學期：${this.cRec.Semester}。\n詳細資料：${JSON.stringify(this.cRec)}`);
        }
      } catch (error) { }

      this.dialogRef.close({ state: this.mode });
    } catch (error) {
      // console.log(error);
      this.errMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
    } finally {
      this.saving = false;
    }
  }

  setClassId(classId: string | undefined) {
    this.cRec.RefClassId = classId;
    if (!classId) {
      this.joinClassStudent = false;
    }
  }

  setTeacherId(teacherId: string | undefined, sequence: string) {
    switch (sequence) {
      case '1':
        this.teacherId1 = teacherId;
        break;
      case '2':
        this.teacherId2 = teacherId;
        break;
      case '3':
        this.teacherId3 = teacherId;
        break;
    }
  }
}

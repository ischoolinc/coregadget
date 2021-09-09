import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreService } from '../core.service';
import { CourseRec, SourceCourse } from '../data/course';

@Component({
  selector: 'app-add-course-students',
  templateUrl: './add-course-students.component.html',
  styleUrls: ['./add-course-students.component.scss']
})
export class AddCourseStudentsComponent implements OnInit {

  currentState: '' | 'validating' | 'validationFinish' | 'importing' | 'importFinish' = '';

  // Textarea 轉成 json 及轉欄位名稱後的結果
  source: { value: string, StudentId?: string }[] = [];
  // 驗證錯誤結果
  errorResult: string[] = [];
  // 驗證錯誤訊息
  validationMsg = '';
  // 驗證成功
  validSuccess = false;
  // 匯入是否成功
  importSuccess = false;
  // 錯誤訊息
  importMsg = '';
  // 父視窗是否需要重載
  needRefresh = false;

  myForm!: FormGroup;

  inputPlaceholder = `請輸入學生資訊

斷行分隔示範：
5558791
5558792
5558793
5558794
5558795

或：
分號分隔 5558791; 5558792; 5558793; 5558794; 5558795
逗號分隔 5558791, 5558792, 5558793, 5558794, 5558795
空隔分隔 5558791 5558792 5558793 5558794 5558795
`;

  constructor(
    public dialogRef: MatDialogRef<AddCourseStudentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: CourseRec },
    private coreSrv: CoreService,
  ) { }

  getFormCtrl(name: string) {
    return this.myForm.get(name)! as FormControl;
  }

  ngOnInit() {
    this.createFormInputs();
    this.dialogRef.backdropClick().subscribe(e => {
      this.dialogRef.close({ state: (this.needRefresh ? 'refresh' : '') });
    });
  }

  async getCourses(): Promise<SourceCourse[]> {
    try {
      return await this.coreSrv.getCourses({ CourseId: this.data.course.CourseId });
    } catch (error) {
      throw new Error('取得課程比對清單發生錯誤！');
    }
  }

  createFormInputs() {
    this.myForm = new FormGroup({
      sidt: new FormControl('StudentId'),
      delimiter: new FormControl('NewLine'),
      textarea: new FormControl(''),
    });
  }

  changeMode() {
    this.currentState = '';
    this.validSuccess = false;
  }

  async onValidate() {
    if (this.currentState === 'validating') return;

    this.currentState = 'validating';
    this.validSuccess = false;
    this.validationMsg = '';
    this.errorResult = [];
    this.importSuccess = false;
    this.importMsg = '';

    try {
      const inputValue = this.getFormCtrl('textarea').value || '';
      const delimiter = this.getFormCtrl('delimiter').value;
      const identifyField: string = this.getFormCtrl('sidt').value || '';
      this.source = this.parseValues(inputValue, delimiter);

      if (!this.source.length) {
        throw new Error('無可分析的資料');
      } else {
        // console.log(this.source);
        const sourceStudents = (this.coreSrv.studentList.length ? this.coreSrv.studentList : await this.coreSrv.getStudents({ StudentStatus: ['1', '2']}));

        this.source.forEach(v => {
          let tmp;
          switch (identifyField) {
            case 'StudentId':
              tmp = sourceStudents.find(s => s.StudentId === v.value);
              if (tmp) {
                v.StudentId = tmp.StudentId;
              } else {
                this.errorResult.push(v.value);
              }
              break;
            case 'StudentNumber':
              tmp = sourceStudents.find(s => s.StudentNumber === v.value && (s.StudentStatus === '1' || s.StudentStatus === '2'));
              if (tmp) {
                v.StudentId = tmp.StudentId;
              } else {
                this.errorResult.push(v.value);
              }
              break;
            case 'LinkAccount':
              tmp = sourceStudents.find(s => s.LinkAccount === v.value);
              if (tmp) {
                v.StudentId = tmp.StudentId;
              } else {
                this.errorResult.push(v.value);
              }
              break;
          }
        });
        this.validSuccess = (this.errorResult.length === 0);
        // console.log(this.errorResult);
      }
    } catch (error) {
      // console.log(error);
      this.validationMsg = error?.message || '分析發生錯誤！';
    } finally {
      this.currentState = 'validationFinish';
    }
  }

  // 查看錯誤報告
  previewErrorResult() {
    const content = this.source.map((v) => {
      if (this.errorResult.findIndex(e => e === v.value) !== -1) {
        return `<td>${v.value}</td><td style="color: red">錯誤</td>`;
      } else {
        return `<td>${v.value}</td><td>正確</td>`;
      }
    });

    const identifyField: string = this.getFormCtrl('sidt').value || '';
    const newWin = window.open('', 'validation_results');
    newWin!.document.body.innerHTML = `
      <html>
        <head>
          <title>Result</title>
          <style type="text/css">
            table {
              border-collapse: collapse;
              border-spacing: 0px;
              margin: 30px 0 0 30px;
            }
            table, th, td {
              padding: 5px;
              border: 1px solid black;
            }
          </style>
        </head>
        <body>
          <table><tr><td>${this.mappingIdentifyField(identifyField)}</td><td>驗證結果</td></tr><tr>${content.join('</tr><tr>')}</tr></table>
        </body>
      </html>
    `;
  }

  // 匯入資料
  async importData() {
    if (!this.validSuccess) { return; }
    if (this.currentState === 'importing') { return; }
    if (!!this.validationMsg || this.errorResult.length > 0 || this.source.length === 0) { return; }
    this.currentState = 'importing';

    try {
      const unique = [...new Set(this.source.map(v => v.StudentId || ''))];
      const finalData = unique.map(v => {
        return {
          CourseId: this.data.course.CourseId,
          StudentId: v,
        };
      });
      // console.log(finalData);

      await this.coreSrv.addCourseStudent(finalData);

      try {
        const identifyField: string = this.getFormCtrl('sidt').value || '';
        await this.coreSrv.addLog('Import', '批次匯入課程學生', `已進行「匯入課程學生」操作。\n詳細資料：${JSON.stringify({identifyField, finalData})}`);
      } catch (error) { }

      this.importSuccess = true;
      this.needRefresh = true;
    } catch (error) {
      // console.log(error);
      this.importMsg = (error.dsaError && error.dsaError.message) ? this.coreSrv.replaceMappingFieldName(error.dsaError.message) : '發生錯誤';
      this.importSuccess = false;
    } finally {
      this.currentState = 'importFinish';
    }
  }

  closeDialog() {
    this.dialogRef.close({ state: (this.needRefresh ? 'refresh' : '') });
  }

  parseValues(value = '', delimiter: string): { value: string }[] {
    value = value.replace(/'/ig, '');
    value = value.replace(/"/ig, '');
    let ret: any[] = [];

    switch (delimiter) {
      case 'NewLine':
        value.split('\n').forEach(v => v.replace(/\s/ig, '') !== '' ? ret.push(v.replace(/\s/ig, '')) : false);
        break;
      case 'Semicolon':
        value = value.replace(/\s/ig, '');
        ret = value.split(';');
        break;
      case 'Comma':
        value = value.replace(/\s/ig, '');
        ret = value.split(',');
        break;
      case 'Space':
        ret = value.split(' ');
        ret.forEach(v => v = v.trim());
        break;
      default:
        ret = [value];
        break;
    }

    return ret.map(v => {
      return { value: v }
    });
  }

  mappingIdentifyField(identifyField: string) {
    switch (identifyField) {
      case 'StudentId':
        return '學生系統編號';
      case 'StudentNumber':
        return '學號';
      case 'LinkAccount':
        return '登入帳號';
      default:
        return identifyField;
    }
  }
}

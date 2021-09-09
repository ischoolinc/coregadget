import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { BatchAddComponent } from './batch-add/batch-add.component';
import { CoreService } from './core.service';
import { SourceTeacherRec, TeacherRec } from './data/teacher';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { ClassNamesPipe } from './shared/pipes/classnames.pipe';

type ViewMode = 'none' | 'mentor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  viewMode: ViewMode = 'none';
  teachers: Map<string, TeacherRec> = new Map(); // key: TeacherId
  loading = true;
  error = '';

  keywordCtrl = new FormControl('');
  filterTeachers: Map<string, { title: string, teachers: Map<string, TeacherRec> }>  = new Map();
  filterTotal = 0;
  curTeacher: TeacherRec = {} as TeacherRec;

  constructor(
    private coreSrv: CoreService,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {
    await this.getTeachers();
    this.colForTeacher('none', '');
    this.curTeacher = (this.teachers.size ? this.teachers.values().next().value : {});

    const nullValue = null;
    this.keywordCtrl.valueChanges
      .pipe(
        startWith(nullValue),
        debounceTime(300),
        distinctUntilChanged(),
        // tap(console.log),
      ).subscribe(term => this.colForTeacher(this.viewMode, term));
  }

  async getTeachers() {
    this.teachers.clear();

    try {
      const rsp: SourceTeacherRec[] = await this.coreSrv.getTeachers();
      [].concat(rsp || []).forEach(v => {
        if (!this.teachers.has(v.TeacherId)) {
          this.teachers.set(v.TeacherId, {
            TeacherId: v.TeacherId,
            TeacherName: v.TeacherName,
            Nickname: v.Nickname,
            Gender: v.Gender,
            TeacherStatus: v.TeacherStatus,
            LinkAccount: v.LinkAccount,
            TeacherCode: v.TeacherCode,
            Classes: [],
          });
        }

        const data = this.teachers.get(v.TeacherId);
        if (v.ClassId) {
          data.Classes.push({
            ClassId: v.ClassId,
            ClassName: v.ClassName,
          });
        }
      });
    } catch (error) {
      this.error = (error.dsaError && error.dsaError.message) ? error.dsaError.message : '發生錯誤';
    } finally {
      this.loading = false;
    }
  }

  colForTeacher(viewMode: ViewMode, keyword: string) {
    this.filterTeachers.clear();
    let list: TeacherRec[] = [];
    const colList: Map<string, { title: string, teachers: Map<string, TeacherRec> }>  = new Map();

    if (keyword) {
      this.teachers.forEach(v => {
        if (v.TeacherName.indexOf(keyword) > -1
          || v.Nickname.indexOf(keyword) > -1
          || v.LinkAccount.indexOf(keyword) > -1
          || v.TeacherCode.indexOf(keyword) > -1
        ) {
          list.push(v);
        };
      });
    } else {
      list = Array.from(this.teachers.values());
    }

    switch (viewMode) {
      case 'mentor':
        list.forEach(v => {
          if (v.Classes.length) {
            v.Classes.forEach(c => {
              if (!colList.has(c.ClassId)) { colList.set(c.ClassId, { title: c.ClassName, teachers: new Map() }); }
              const data = colList.get(c.ClassId);
              data.teachers.set(v.TeacherId, v);
            });
          } else {
            if (!colList.has('none')) { colList.set('none', { title: '未帶班', teachers: new Map() }); }
            const data = colList.get('none');
            data.teachers.set(v.TeacherId, v);
          }
        });

        var mapAsc = new Map([...colList.entries()].sort((a: any, b: any) => {
          if (a[0] === 'none') {
            return 1;
          }
          if (b[0] === 'none') {
            return -1;
          }
          if (a[1].title < b[1].title) {
            return -1;
          }
          if (a[1].title > b[1].title) {
            return 1;
          }
        }));
        this.filterTeachers = mapAsc;
        break;
      default:
        const data: Map<string, TeacherRec> = new Map();
        list.forEach(v => data.set(v.TeacherId, v))
        this.filterTeachers.set('ALL', { title: '全部', teachers: data });
    }

    this.filterTotal = list.length;
  }

  toggleViewMode(mode: ViewMode) {
    this.colForTeacher(mode, this.keywordCtrl.value);
  }

  openModifyDialog(teacher: TeacherRec): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '80vw',
      maxWidth: '1050px',
      data: { teacher, teachers: Array.from(this.teachers.values()) },
    });

    dialogRef.afterClosed().subscribe(async result => {
      try {
        if (result && result.state) {
          this.loading = true;
          if (result.state === 'del') {
            this.curTeacher = {} as TeacherRec;
          }
          await this.getTeachers();
          this.colForTeacher(this.viewMode, this.keywordCtrl.value);
        }
      } catch (error) {

      } finally {
        this.loading = false;
      }
    });
  }

  setCurTeacher(teacher: TeacherRec) {
    this.curTeacher = teacher;
    this.openModifyDialog({ ...teacher });
  }

  addTeacher() {
    this.openModifyDialog({} as TeacherRec);
  }

  importTeacher() {
    const dialogRef = this.dialog.open(BatchAddComponent, {
      maxWidth: '1050px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state === 'refresh') {
        await this.getTeachers();
        this.colForTeacher(this.viewMode, this.keywordCtrl.value);
      }
    });
  }

  async exportTeacher() {
    const content = [];
    this.teachers.forEach(v => {
      content.push({
        '教師系統編號': v.TeacherId,
        '教師姓名': v.TeacherName,
        '暱稱': v.Nickname,
        '性別': v.Gender,
        '登入帳號': v.LinkAccount,
        '教師代碼': v.TeacherCode,
        '帶班狀態': new ClassNamesPipe().transform(v.Classes),
      });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(content);
    XLSX.utils.book_append_sheet(wb, ws, 'teacher');
    XLSX.writeFile(wb, 'teacher.xlsx');

    try {
      await this.coreSrv.addLog('Export', '匯出教師名單', `已進行「匯出名單」操作。`);
    } catch (error) { }
  }
}

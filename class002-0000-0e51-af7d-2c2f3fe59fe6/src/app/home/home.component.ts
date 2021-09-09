import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { ImportClassesComponent } from '../import-classes/import-classes.component';
import { ClassRec, CoreService } from './../core.service';
import { DeleteClassComponent } from '../delete-class/delete-class.component';
import { EditClassModalComponent } from '../edit-class-modal/edit-class-modal.component';
import { ConfirmDialogService } from './../shared/dialog/confirm-dialog.service';
import { ModalSize } from './../shared/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = true;
  classErrMsg = '';
  delErrMsg = '';
  deling = false;
  keywordCtrl = new FormControl('');
  sourceClasses: ClassRec[] = [];
  filteredClasses: ClassRec[] = [];
  allCheck: boolean = false;

  curGradeYear = 'ALL';
  curGradeClasses: ClassRec[] = [];
  gradeYearList = [{ title: '所有班級', value: 'ALL', count: 0 }];

  constructor(
    private coreSrv: CoreService,
    public dialog: MatDialog,
    public confirmSrv: ConfirmDialogService,
  ) { }

  async ngOnInit() {
    try {
      this.classErrMsg = '';

      const promiseList = [
        this.coreSrv.init(),
        this.getClasses()
      ];
      await Promise.all(promiseList);
      this.filterGrade();
      this.filterClass('');

    } catch (error) {
      this.classErrMsg = error;
    } finally {
      this.loading = false;
    }

    const nullValue = null;
    this.keywordCtrl.valueChanges
      .pipe(
        startWith(nullValue),
        debounceTime(500),
        distinctUntilChanged(),
        // tap(console.log),
      ).subscribe(term => this.filterClass(term));
  }

  async getClasses() {
    this.sourceClasses = [];
    this.gradeYearList = [{ title: '所有班級', value: 'ALL', count: 0 }];

    this.sourceClasses = await this.coreSrv.getClasses();
    const gradeYearList = [{ title: '所有班級', value: 'ALL', count: this.sourceClasses.length }];
    this.sourceClasses.forEach(v => {
      const tmp = gradeYearList.find(g => g.value === v.GradeYear);
      if (tmp) {
        tmp.count += 1;
      } else {
        gradeYearList.push({ title: (v.GradeYear) ? v.GradeYear + '年級' : '未分年級', value: v.GradeYear || '', count: 1 });
      }
    });
    this.gradeYearList = gradeYearList;
  }

  filterGrade() {
    if (this.curGradeYear === 'ALL') {
      this.curGradeClasses = this.sourceClasses;
    } else {
      this.curGradeClasses = this.sourceClasses.filter(v => v.GradeYear === this.curGradeYear);
    }
  }

  filterClass(keyword: string) {
    if (keyword) {
      this.filteredClasses = this.curGradeClasses.filter(v => v.ClassName.indexOf(keyword) > -1);
    } else {
      this.filteredClasses = this.curGradeClasses;
    }
  }

  modifyClass(klass: ClassRec) {
    if (klass && klass.ClassId) {
      this.openModifyClassDialog({ ... klass });
    }
  }

  openModifyClassDialog(klass: ClassRec) {
    const dialogRef = this.dialog.open(EditClassModalComponent, {
      maxWidth: '1050px',
      data: { class: klass, sourceClasses: this.sourceClasses },
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state) {
        try {
          this.loading = true;
          this.classErrMsg = '';

          await this.getClasses();
          this.filterGrade();
          this.filterClass(this.keywordCtrl.value);
        } catch (error) {
          this.classErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  addClass() {
    this.openModifyClassDialog({ GradeYear: (this.curGradeYear === 'ALL' ? '' : this.curGradeYear) } as ClassRec);
  }

  importClass() {
    const dialogRef = this.dialog.open(ImportClassesComponent, {
      maxWidth: '1050px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state === 'refresh') {
        try {
          this.loading = true;
          this.classErrMsg = '';

          await this.getClasses();
          this.filterGrade();
          this.filterClass(this.keywordCtrl.value);
        } catch (error) {
          this.classErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  async exportClass() {
    const content: any[] = [];
    this.sourceClasses.forEach(v => {
      content.push({
        '班級系統編號': v.ClassId,
        '年級': v.GradeYear,
        '班級名稱': v.ClassName,
        '班導師': v.TeacherName + (v.TeacherNickname ? `(${v.TeacherNickname})` : ''),
        '學生人數': v.ClassStudentCount || '0',
      });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(content);
    XLSX.utils.book_append_sheet(wb, ws, 'class');
    XLSX.writeFile(wb, 'class.xlsx');

    try {
      await this.coreSrv.addLog('Export', '匯出班級名單', `已進行「匯出名單」操作。`);
    } catch (error) { }
  }

  changeGradeYear(gradeYear: string) {
    this.curGradeYear = gradeYear;
    this.filterGrade();
    this.filterClass(this.keywordCtrl.value);
    this.setAll(false);
  }

  updateAllCheck() {
    this.allCheck = this.filteredClasses != null && this.filteredClasses.every(t => t.Checked);
  }

  someCheck(): boolean {
    if (this.filteredClasses == null) {
      return false;
    }
    return this.filteredClasses.filter(t => t.Checked).length > 0 && !this.allCheck;
  }

  setAll(checked: boolean) {
    this.allCheck = checked;
    if (this.filteredClasses == null) {
      return;
    }
    this.filteredClasses.forEach(t => t.Checked = checked);
  }

  delCurClass(klass: ClassRec) {
    const dialogRef = this.dialog.open(DeleteClassComponent, {
      data: {
        classes: [klass],
        mode: 'SINGLE',
      },
      maxWidth: ModalSize.MD,
      panelClass: ['my-dialog-border'] ,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.state === 'success') {
        try {
          this.loading = true;
          this.classErrMsg = '';

          await this.getClasses();
          this.filterGrade();
          this.filterClass(this.keywordCtrl.value);
        } catch (error) {
          this.classErrMsg = error;
        } finally {
          this.loading = false;
        }
      }
    });
  }

  delCheckedClass() {
    const delClassList = this.filteredClasses.filter(v => v.Checked);
    if (delClassList.length) {
      const dialogRef = this.dialog.open(DeleteClassComponent, {
        data: {
          classes: delClassList,
          mode: 'BATCH',
        },
        maxWidth: ModalSize.MD,
        panelClass: ['my-dialog-border'] ,
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result && result.state === 'success') {
          try {
            this.loading = true;
            this.classErrMsg = '';

            await this.getClasses();
            this.filterGrade();
            this.filterClass(this.keywordCtrl.value);
            this.setAll(false);
          } catch (error) {
            this.classErrMsg = error;
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
}

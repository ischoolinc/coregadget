import { AddCadreDialogComponent } from './../add-cadre-dialog/add-cadre-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CadreService, CadreTypeInfo, ClassInfo, StudentInfo, CadreInfo, ClassCadreRecord } from './../../dal/cadre.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentDisciplineStatistics } from 'src/app/dal/discipline.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-class-summary',
  templateUrl: './class-summary.component.html',
  styleUrls: ['./class-summary.component.scss']
})
export class ClassSummaryComponent implements OnInit {

  cadreTypes: CadreTypeInfo[] = []; // 班級幹部類別清單
  classList = [];  // 根據教師ID取得班級清單
  studentList: StudentInfo[]; // 指定班級的學生清單
  dicStuds: { [studID: string]: StudentInfo } = {};  // 學生資料的 Dictionary 資料結構

  selectedClass: ClassInfo;  // 目前被選擇的班級
  selectedSchoolYear = 109;  // 目前選擇的學年度
  selectedSemester = 1;      // 目前選擇的學期
  maxSchoolYear = 108;       // 可選擇的最大學年度
  minSchoolYear = 108;       // 可選擇的最小學年度

  cadres: CadreInfo[] = []; // 班級幹部清單，有指定學生的幹部紀錄。
  dicCadreUsage: { [uid: string]: string } = {};  // 紀錄有哪些幹部清單已經被讀取過了

  classCadres: ClassCadreRecord[] = []; // 畫面上的班級幹部清單

  isLoading = false ;


  @ViewChild('table') table: ElementRef<HTMLDivElement>;
  @ViewChild('semester') semester: ElementRef<HTMLSelectElement>;

  constructor(
    private cadreService: CadreService,
    public dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {

    this.isLoading = true ;

    // 1. get Cadre Types
    this.cadreTypes = await this.cadreService.getCadreTypes();
    // console.log(this.cadreTypes);

    // 2. get My Classes
    await this.queryClasses();
    // 3. get Students in the first class
    await this.loadStudents();

    // 4. get semesters by class.
    await this.getCurrentSemester();

    // 5. get Class Cadres Students of the specificed semesters.
    await this.reloadCadreData();

  }

  async queryClasses() {
    this.classList = await this.cadreService.getMyClasses();
    // console.log(this.classList);
    this.selectedClass = this.classList[0];
  }

  async loadStudents() {
    if (this.selectedClass) {

      this.studentList = await this.cadreService.getStudents(this.selectedClass.ClassID);

      this.dicStuds = {}; // reset
      this.studentList.forEach(stud => {
        this.dicStuds[stud.StudentId] = stud;
      });
    }
  }

  /**
   * 取得指定班級，學年度，學期的幹部紀錄。
   */
  async reloadCadreData() {
    this.isLoading = true ;
    // await this.cadreService.getClassCadreStudents(this.selectedClass.ClassID, this.selectedSchoolYear, this.selectedSemester);
    this.cadres = await this.cadreService.getClassCadreStudents(this.selectedClass.ClassID, this.selectedSchoolYear, this.selectedSemester);
    // console.log(this.cadres);
    this.dicCadreUsage = {};  // reset ;
    this.cadres.forEach(cadre => {
      if (!this.dicCadreUsage[cadre.uid]) {
        this.dicCadreUsage[cadre.uid] = 'no';  // 尚未被讀取
      }
    });
    // console.log(this.cadres);
    this.parseCadreRecords();
    this.isLoading = false ;
  }

  async getCurrentSemester() {
    // this.semesters = await this.cadreService.getSemestersByClassID(this.selectedClass.ClassID);
    // console.log(this.semesters);
    const currentSemester = await this.cadreService.getCurrentSemester();
    // console.log(currentSemester);
    this.selectedSchoolYear = parseInt(currentSemester.Response.SchoolYear, 10);
    this.selectedSemester = parseInt(currentSemester.Response.Semester, 10);

    this.maxSchoolYear = parseInt(currentSemester.Response.SchoolYear, 10) + 1;
    this.minSchoolYear = parseInt(currentSemester.Response.SchoolYear, 10) - 6;

  }


  parseCadreRecords(): void {
    this.classCadres = [];  // reset
    this.cadreTypes.forEach(cadreType => {
      // console.log(cadreType);
      for (let i = 0; i < cadreType.Number; i++) {
        const classCadre = new ClassCadreRecord();
        classCadre.cadreType = cadreType;
        // console.log(`find type: ${cadreType.Cadrename}`)
        classCadre.cadre = this.chooseCadreRecordByType(cadreType.Cadrename);
        // console.log(classCadre.cadre);
        if (classCadre.cadre) {
          classCadre.student = this.dicStuds[classCadre.cadre.studentid];
        }
        this.classCadres.push(classCadre);
      }
    });
  }

  // 從班級幹部清單中讀取一筆指定類型的紀錄
  chooseCadreRecordByType(cadreName: string): CadreInfo {
    console.log(cadreName);
    let result: CadreInfo;
    let hasFound = false;
    this.cadres.forEach(cadre => {
      // console.log(` cadreType: ${cadreType}, cadre: ${cadre}`);
      if (!hasFound) {
        if (this.dicCadreUsage[cadre.uid] === 'no' && cadre.cadrename === cadreName) {
          result = cadre;
          // console.log(cadre);
          this.dicCadreUsage[cadre.uid] = 'yes';  // 表示已經讀取過
          hasFound = true ;
        }
      }
    });

    return result;
  }

  async removeCadre(classCadre) {
    // console.log(classCadre.cadre.uid);
    await this.cadreService.deleteCadre(classCadre.cadre.uid);
    await this.reloadCadreData();
  }

  openDialog(classCadre: ClassCadreRecord): void {
    // console.log('open dialog');
    const dialogRef = this.dialog.open(AddCadreDialogComponent, {
      width: '250px',
      data: {
        classCadre: classCadre,
        students: this.studentList,
        schoolYear: this.selectedSchoolYear,
        semester: this.selectedSemester,
        class: this.selectedClass
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      // console.log('The dialog was closed');
      // console.log(result);
      await this.reloadCadreData();
    });
  }

  /** 匯出成 Excel 檔案 */
  exportToExcel() {
    const data = [];

    this.classCadres.forEach( classCadre => {
      const item = {
        學年 : this.selectedSchoolYear,
        學期 : this.selectedSemester,
        幹部 : classCadre.cadreType.Cadrename,
        座號 : (classCadre.student ? classCadre.student.SeatNo : ''),
        姓名 : (classCadre.student ? classCadre.student.StudentName : ''),
        學生系統編號 : (classCadre.student ? classCadre.student.StudentId : ''),
      };
      data.push(item);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '班級幹部');

    /* save to file */
    const fileName = `${this.selectedClass.ClassName}班級幹部名冊.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

}


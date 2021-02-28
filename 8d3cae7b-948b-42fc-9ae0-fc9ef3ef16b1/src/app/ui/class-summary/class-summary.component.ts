import { CadreService, CadreTypeInfo, ClassInfo, SemesterInfo, StudentInfo, CadreInfo } from './../../dal/cadre.service';
import { GadgetService } from './../../dal/gadget.service';
import * as node2json from 'nodexml';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { parseXmlDiscipline, StudentDisciplineDetail, StudentDisciplineStatistics } from 'src/app/dal/discipline.service';

@Component({
  selector: 'app-class-summary',
  templateUrl: './class-summary.component.html',
  styleUrls: ['./class-summary.component.scss']
})
export class ClassSummaryComponent implements OnInit {

  cadreTypes: CadreTypeInfo[] = []; // 班級幹部類別清單
  classList = [];  // 根據教師ID取得班級清單
  studentList: StudentInfo[]; // 指定班級的學生清單
  dicStuds: { [studID: string]: StudentInfo} = {};  // 學生資料的 Dictionary 資料結構

  selectedClass: ClassInfo;  // 目前被選擇的班級
  selectedSchoolYear = 108;  // 目前選擇的學年度
  selectedSemester = 1;      // 目前選擇的學期
  maxSchoolYear = 108;       // 可選擇的最大學年度
  minSchoolYear = 108;       // 可選擇的最小學年度

  cadres: CadreInfo[] = []; // 班級幹部清單，有指定學生的幹部紀錄。
  dicCadreUsage: {[uid: string ]: boolean} = {};  // 紀錄有哪些幹部清單已經被讀取過了

  classCadres: ClassCadreRecord[] = []; // 畫面上的班級幹部清單

  /**
   * 學生對照表(key: 座號，value: 學生獎勵懲處統計) ， 未排序
   */
  studentMappingTable: Map<string, StudentDisciplineStatistics> = new Map();
  /**
   * 學生對照表(key: 座號，value: 學生獎勵懲處統計) ， 排序後
   */
  sortedMappingTable: Map<string, StudentDisciplineStatistics> = new Map();
  /**
   * 查無獎懲紀錄顯示狀態
   */
  showWarning = false;
  /**
   * 是否勾選顯示全部學生
   */
  showAllStudents = false;
  /**
   * 查無學年度學期會鎖定下拉式窗格
   */
  semestersLocked = false;
  /**
   *
   *
   * @memberof ClassSummaryComponent
   */


  /**
   *
   * 學制是否為高中 用來判斷 是否要顯示 "留校察看"
   * @type {boolean}
   * @memberof ClassSummaryComponent
   */
  isHeightSchool : boolean = true  ;

  @ViewChild('table') table: ElementRef<HTMLDivElement>;
  @ViewChild('semester') semester: ElementRef<HTMLSelectElement>;

  constructor(
    private cadreService: CadreService
    ) { }

  async ngOnInit(): Promise<void> {
    // 0. 取得學制 = "高中" OR "國中"
    // this.isHeightSchool = true;
    // await this.disciplineService.loadSchoolType() ;
    // console.log("3", this.disciplineService.schoolType);

    // this.isHeightSchool = this.disciplineService.schoolType == "高中" ;
    // console.log("isHeightSchool",this.disciplineService.schoolType);

    // 1. get Cadre Types
    this.cadreTypes = await this.cadreService.getCadreTypes();
    console.log(this.cadreTypes);

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
    console.log(this.classList);
    this.selectedClass = this.classList[0];
  }

  async loadStudents() {
    if (this.selectedClass) {

      this.studentList = await this.cadreService.getStudents(this.selectedClass.ClassID);

      this.dicStuds = {}; // reset
      this.studentList.forEach(stud => {
        this.dicStuds[stud.StudentId] = stud ;
      });
    }
  }

  /**
   * 取得指定班級，學年度，學期的幹部紀錄。
   */
  async reloadCadreData() {
    // await this.cadreService.getClassCadreStudents(this.selectedClass.ClassID, this.selectedSchoolYear, this.selectedSemester);
    this.cadres = await this.cadreService.getClassCadreStudents(this.selectedClass.ClassID, this.selectedSchoolYear, this.selectedSemester);
    this.dicCadreUsage = {};  // reset ;
    this.cadres.forEach( cadre => {
      if (!this.dicCadreUsage[cadre.uid]) {
        this.dicCadreUsage[cadre.uid] = false ;
      }
    });
    console.log(this.cadres);
    this.parseCadreRecords();
  }

  async getCurrentSemester() {
    // this.semesters = await this.cadreService.getSemestersByClassID(this.selectedClass.ClassID);
    // console.log(this.semesters);
    const currentSemester = await this.cadreService.getCurrentSemester();
    console.log(currentSemester);
    this.selectedSchoolYear = parseInt(currentSemester.Response.SchoolYear, 10);
    this.selectedSemester = parseInt(currentSemester.Response.Semester, 10);

    this.maxSchoolYear = parseInt(currentSemester.Response.SchoolYear, 10) + 1;
    this.minSchoolYear = parseInt(currentSemester.Response.SchoolYear, 10) - 6;

  }


  parseCadreRecords(): void {
    this.classCadres = [];  // reset
    this.cadreTypes.forEach(cadreType => {
      console.log(cadreType);
      for ( let i = 0; i < cadreType.Number; i++) {
        const classCadre = new ClassCadreRecord();
        classCadre.cadreType = cadreType ;
        classCadre.cadre = this.chooseCadreRecordByType(cadreType.Cadrename);
        if (classCadre.cadre) {
          classCadre.student = this.dicStuds[classCadre.cadre.studentid];
        }
        this.classCadres.push(classCadre);
      }
    });
  }

  // 從班級幹部清單中讀取一筆指定類型的紀錄
  chooseCadreRecordByType(cadreType: string): CadreInfo {
    let result: CadreInfo ;
    this.cadres.forEach( cadre => {
      console.log(` cadreType: ${cadreType}, cadre: ${cadre}`);
      if (!this.dicCadreUsage[cadre.uid] && cadre.cadrename === cadreType) {
        result = cadre ;
        this.dicCadreUsage[cadre.uid] = true ;  // 表示已經讀取過
      }
    });

    return result ;
  }

  removeCadre(classCadre, evt) {
    console.log(classCadre);
    // evt.stopPropagation();
  }

  addCadre(classCadre) {
    console.log(classCadre);
  }

}

/** 呈現出畫面上的一筆紀錄 */
class ClassCadreRecord {
  cadreType: CadreTypeInfo;
  cadre: CadreInfo ;
  student: StudentInfo ;
}

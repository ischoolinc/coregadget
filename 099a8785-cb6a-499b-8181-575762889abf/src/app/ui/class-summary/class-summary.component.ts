import { GadgetService } from './../../dal/gadget.service';
import { classIdStudents, ClassInfo, DisciplineService, parseXmlDiscipline, SemesterInfo, StudentDisciplineDetail, StudentDisciplineStatistics } from './../../dal/discipline.service';
import * as node2json from 'nodexml';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-class-summary',
  templateUrl: './class-summary.component.html',
  styleUrls: ['./class-summary.component.scss']
})
export class ClassSummaryComponent implements OnInit {

  /**
   * 根據教師ID取得班級列表
   */
  classList = [];
  /**
   * 根據班級ID取得學生獎懲列表
   */
  studentList: StudentDisciplineDetail[];
  /**
   * 目前選擇中的班級
   */
  selectedClass: ClassInfo;
  /**
   * 根據班級查詢到的學年學期列表
   */
  semesters: SemesterInfo[] = [];
  /**
   * 目前選擇中的學期
   */
  selectedSemester: SemesterInfo = {} as SemesterInfo;
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

  constructor(private disciplineService: DisciplineService
    ,private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
    // 0. 取得學制 = "高中" OR "國中"
    this.isHeightSchool = true;
    await this.disciplineService.loadSchoolType() ;
    // console.log("3", this.disciplineService.schoolType);

    this.isHeightSchool = this.disciplineService.schoolType == "高中" ;
    // console.log("isHeightSchool",this.disciplineService.schoolType);

    // 1. 取得班級資訊
    await this.getClasseInfos();

    // 2. 取得學年度學期
    await this.getSemesters();

    // // 3. get students list and parse
    // await this.queryStudentAttendance();
  }

  async getClasseInfos() {
    this.classList = await this.disciplineService.getMyClasses();
    console.log( "look what you get" ,this.classList);
    this.selectedClass = this.classList[0];
  }

  async getSemesters() {
    this.semesters = await this.disciplineService.getSemestersByClassID(this.selectedClass.ClassID);
    this.selectedSemester = this.semesters[0];
    if (this.selectedSemester) {
      await this.queryStudentAttendance();
    }
    // 查無班級缺曠獎懲紀錄
    else {
      this.sortedMappingTable.clear();
      this.showWarning = true;
    }
  }

  /** 取得學學生缺礦 */
  async queryStudentAttendance() {
    /**  */
    this.studentList = await this.disciplineService.getStudentDisciplineByClass(this.selectedClass, this.selectedSemester);
     console.log ("this.studentList", this.studentList);
    await this.parseStudentDetail(this.studentList);
  }

  async parseStudentDetail(studentList: StudentDisciplineDetail[]) {
    this.showWarning = false;
    this.studentMappingTable.clear();
    this.sortedMappingTable.clear();
    studentList.forEach((eachDetail) => {
      const detail: parseXmlDiscipline = node2json.xml2obj(Object(eachDetail.detail));
      // 已銷過的懲處不列入統計
      if ((eachDetail.merit_flag !== '0') || (detail.Discipline.Demerit.Cleared !== '是')) {
          if (!this.studentMappingTable.has(eachDetail.seat_no)) {
            const studentTempStatus = new StudentDisciplineStatistics(eachDetail.ref_student_id, eachDetail.name, eachDetail.seat_no);
            this.studentMappingTable.set(eachDetail.seat_no, studentTempStatus);
          }

          let tempStudentStatus: StudentDisciplineStatistics = this.studentMappingTable.get(eachDetail.seat_no);
          // merit_flag 判別獎勵/ 懲罰/ 留校察看
          switch (eachDetail.merit_flag) {
            case '0':
              this.accDemerit(detail, tempStudentStatus);
              break;
            case '1':
              this.accMerit(detail, tempStudentStatus);
              break;
            case '2':
              /**
               * 留校察看
               */
              tempStudentStatus.detention = '是';
              this.studentMappingTable.set(eachDetail.seat_no, tempStudentStatus);
              break;
          }
      }
    });
    // 勾選顯示全部學生
    if (this.showAllStudents) {
      const tempStudentList: classIdStudents[] = await this.disciplineService.getStudents(this.selectedClass.ClassID);
      tempStudentList.forEach((student) => {
        if (!this.studentMappingTable.has(student.seatNumber)) {
          const studentTempStatus = new StudentDisciplineStatistics(student.studentId, student.studentName, student.seatNumber);
          this.studentMappingTable.set(student.seatNumber, studentTempStatus);
        }
      })
    }
    this.sortedMap(this.studentMappingTable);
  }

  getArray() {
    return Array.from(this.sortedMappingTable);
  }

  /** 取得非明細 */
  getDescipleFromDetail(){


  }

  getSemesterString(s: SemesterInfo) {
    if (s === undefined) {
      this.semestersLocked = true;
      return;
    }
    this.semestersLocked = false;
    return `${s.school_year}學年第${s.semester}學期`;
  }

  checkMerit(content) {
    if(content === 0) {
      return ''
    }
    return content;
  }
  /**
   * @param content 本次獎勵明細
   * @param studentStatistic 紀錄於Map中的明細並累加本次獎勵的明細
   */
  accMerit(content: parseXmlDiscipline, studentStatistic: StudentDisciplineStatistics) {
    studentStatistic.merit.A += Number(content.Discipline.Merit.A);
    studentStatistic.merit.B += Number(content.Discipline.Merit.B);
    studentStatistic.merit.C += Number(content.Discipline.Merit.C);
    this.studentMappingTable.set(studentStatistic.seatNumber, studentStatistic);
  }

  /**
   * @param content 本次懲處明細
   * @param studentStatistic 紀錄於Map中的明細並累加本次懲處的明細
   */
  accDemerit(content: parseXmlDiscipline, studentStatistic: StudentDisciplineStatistics) {
    studentStatistic.demerit.A += Number(content.Discipline.Demerit.A);
    studentStatistic.demerit.B += Number(content.Discipline.Demerit.B);
    studentStatistic.demerit.C += Number(content.Discipline.Demerit.C);
    this.studentMappingTable.set(studentStatistic.seatNumber, studentStatistic);
  }

  setNewStudent(student: StudentDisciplineDetail) {
    const studentTempStatus = new StudentDisciplineStatistics(student.ref_student_id, student.name, student.seat_no);
    this.studentMappingTable.set(student.seat_no, studentTempStatus);
  }

  /**
   *
   * @param mappingTable 根據座號排序map
   */
  sortedMap(mappingTable: Map<string, StudentDisciplineStatistics>) {
    const studentNumList = [];
    mappingTable.forEach((studentDiscipline, seatNumber) => {
      studentNumList.push(seatNumber);
    });
    studentNumList.sort((a, b) => parseInt(a) > parseInt(b) ? 1: -1);
    studentNumList.forEach((seatNumber) => {
      this.sortedMappingTable.set(seatNumber, mappingTable.get(seatNumber));
    });
  }

  /**
   *
   * @param type 輸出成外部檔案(html/ xls)
   */
  exportFile(type: 'html' | 'xls'): void {

    let element = this.table.nativeElement;
    // 表格加入格線
    element.children[0].setAttribute('border', '1');

    let html = `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        </head>
        <body>
            <div>${this.selectedClass.ClassName}_${this.selectedSemester.school_year}學年第${this.selectedSemester.semester}學期</div>
            ${element.innerHTML}
        </body>
    </html>`;
    const fileName = `${this.selectedClass.ClassName}_${this.selectedSemester.school_year}學年第${this.selectedSemester.semester}學期.${type}`;
    FileSaver.saveAs(new Blob([html], { type: "application/octet-stream" }), fileName);
  }

  /**
   *
   * @param studentInfo 提供至下一頁的學生資訊
   */
  nextPage(studentInfo: StudentDisciplineStatistics) {

    this.disciplineService.fillInStudentInfo(studentInfo);
  }
}

import { classIdStudents, ClassInfo, DisciplineService, parseXmlDiscipline, SemesterInfo, StudentDisciplineDetail, StudentDisciplineStatistics } from './../../dal/discipline.service';
import * as node2json from 'nodexml';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-class-summary',
  templateUrl: './class-summary.component.html',
  styleUrls: ['./class-summary.component.scss']
})
export class ClassSummaryComponent implements OnInit {

  periodTable: any;
  absenceName: any;
  classList = [];
  studentList: StudentDisciplineDetail[];
  selectedClass: ClassInfo;
  semesters: SemesterInfo[] = [];
  selectedSemester: SemesterInfo = {} as SemesterInfo;
  studentMappingTable: Map<string, StudentDisciplineStatistics> = new Map();
  sortedMappingTable: Map<string, StudentDisciplineStatistics> = new Map();
  showWarning = false;
  showAllStudents = false;
  semestersLocked = false;
  @ViewChild('table') table: ElementRef<HTMLDivElement>;
  @ViewChild('semester') semester: ElementRef<HTMLSelectElement>;

  constructor(private disciplineService: DisciplineService) { }

  async ngOnInit(): Promise<void> {
    // 1. get my classes
    await this.queryClasses();

    // 2. get semesters by class.
    await this.querySemesters();

    // // 3. get students list and parse
    // await this.queryStudentAttendance();
  }

  async queryClasses() {
    this.classList = await this.disciplineService.getMyClasses();
    this.selectedClass = this.classList[0];
  }

  async querySemesters() {
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

  async queryStudentAttendance() {
    this.studentList = await this.disciplineService.getStudentDisciplineByClass(this.selectedClass, this.selectedSemester);
    await this.parseStudentDetail(this.studentList);
  }

  async parseStudentDetail(studentList: StudentDisciplineDetail[]) {
    this.showWarning = false;
    this.studentMappingTable.clear();
    this.sortedMappingTable.clear();
    studentList.forEach((eachDetail) => {
      const detail: parseXmlDiscipline = node2json.xml2obj(Object(eachDetail.detail));
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
          tempStudentStatus.detention = '是';
          this.studentMappingTable.set(eachDetail.seat_no, tempStudentStatus);
          break;
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

  accMerit(content: parseXmlDiscipline, studentStatistic: StudentDisciplineStatistics) {
    studentStatistic.merit.A += Number(content.Discipline.Merit.A);
    studentStatistic.merit.B += Number(content.Discipline.Merit.B);
    studentStatistic.merit.C += Number(content.Discipline.Merit.C);
    this.studentMappingTable.set(studentStatistic.seatNumber, studentStatistic);
  }

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

  // 輸出成外部檔案(html/ xls)
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

  // 提供至下一頁的學生資訊
  nextPage(studentInfo: StudentDisciplineStatistics) {
    this.disciplineService.fillInStudentInfo(studentInfo);
  }
}
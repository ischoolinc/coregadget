import { AttendanceService, classIdStudents, periodDetail, SemesterInfo, StudentAttendanceInfo, studentObj, periodTypeDetail } from './../../dal/attendance.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as node2json from 'nodexml';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-class-summary',
  templateUrl: './class-summary.component.html',
  styleUrls: ['./class-summary.component.scss']
})
export class ClassSummaryComponent implements OnInit {

  studentsInfo: leaveType[] = [];
  periodTable: any;
  absenceName: any;
  classList = [];
  selectedClass: any = {};
  semesters: SemesterInfo[] = [];
  selectedSemester: SemesterInfo = {} as SemesterInfo;
  typeList = [];
  selectedType: any;
  selectedAll = '不限';
  periodTypeMap = new Map();
  studentMappingTable: Map<string, StudentAttendanceStatistics> = new Map();
  aryStudents = [];  // 所有學生清單, 以一個 StudentAttendanceInfo 物件來代表一位學生
  showAllStudents = false;
  ready = false;
  ifNoResult = false;
  @ViewChild('table') table: ElementRef<HTMLDivElement>;

  constructor(private attendanceService: AttendanceService) { }

  async ngOnInit(): Promise<void> {
    // 1. get my classes
    await this.queryClasses();

    // 2. get semesters by class.
    await this.querySemesters();

    // 3. get absenceMapping Table
    this.absenceName = await this.attendanceService.getAbsenceMappingTable('Name');

    // 4. get periodMapping type
    await this.queryPeriodType();
    this.ready = true;

    // 4. get student attendance by class
    await this.queryStudentAttendance();
  }

  async queryClasses() {
    this.classList = await this.attendanceService.getMyClasses();
    this.selectedClass = this.classList[0];
  }

  async querySemesters() {
    this.semesters = await this.attendanceService.getSemestersByClassID(this.selectedClass.ClassID);
    this.selectedSemester = this.semesters[0];
    await this.queryPeriodType();
  }

  async queryPeriodType() {
    const tempTypeArray: periodDetail[] = await this.attendanceService.getPeriodMappingTable();
    const tempPeriodTypeList = [];
    tempTypeArray.forEach((periodDetail) => {
      this.periodTypeMap.set(periodDetail.Name, periodDetail.Type);
      tempPeriodTypeList.push(periodDetail.Type);
    });
    tempPeriodTypeList.unshift(this.selectedAll);
    this.typeList = tempPeriodTypeList.filter( (el, i, arr) => arr.indexOf(el) === i);
    this.selectedType = this.typeList[0];
    await this.queryStudentAttendance();
  }
  async queryStudentAttendance() {
    const studentList: StudentListResponse = await this.attendanceService.getStudentAttendanceByClassID(this.selectedClass, this.selectedSemester);
    this.calStudentAttendance(studentList);
  }

  async calStudentAttendance(studentList: StudentListResponse) {
    // reset
    this.studentMappingTable.clear();
    this.aryStudents = [];
    // foreach attendance record .......
    const temp: StudentAttendanceInfo[] = [].concat(studentList.result || []);
    // 勾選顯示全部學生
    if (this.showAllStudents) {
      const tempStudentList: classIdStudents[] = await this.attendanceService.getStudents(this.selectedClass.ClassID);
      tempStudentList.forEach((student) => {
        if (!this.studentMappingTable.has(student.seatNumber)) {
          const studentTempStatus = new StudentAttendanceStatistics(student.studentId, student.studentName, student.seatNumber);
          this.studentMappingTable.set(student.seatNumber, studentTempStatus);
          const studentInfo = {
            studentId: student.studentId,
            name: student.studentName,
            seat_no: student.seatNumber
          }
          this.aryStudents.push(studentInfo);
        }
      });
    }
    temp.forEach((eachStudentAttendanceInfo) => {
      // 計算各學生缺曠的統計
      if (!this.studentMappingTable.has(eachStudentAttendanceInfo.seat_no)) {
        this.studentMappingTable.set(
          eachStudentAttendanceInfo.seat_no,
          new StudentAttendanceStatistics(eachStudentAttendanceInfo.seat_no,eachStudentAttendanceInfo.name,eachStudentAttendanceInfo.seat_no));
        const studentInfo = {
          studentId: eachStudentAttendanceInfo.ref_student_id,
          name: eachStudentAttendanceInfo.name,
          seat_no: eachStudentAttendanceInfo.seat_no
        }
        this.aryStudents.push(studentInfo);
      }
      const studAttendStatistics = this.studentMappingTable.get(eachStudentAttendanceInfo.seat_no);
      studAttendStatistics.add(eachStudentAttendanceInfo, this.selectedType, this.selectedAll, this.periodTypeMap);
    });
    this.aryStudents.length === 0 ? this.ifNoResult = true : this.ifNoResult = false;
    this.aryStudents.sort((a, b) => parseInt(a.seat_no) > parseInt(b.seat_no) ? 1: -1);
  }
  // 供下一頁參考的資料
  nextPage(studentInfo: StudentAttendanceInfo) {
    this.attendanceService.fillInStudentInfo(studentInfo);
  }
  // 匯出報表
  // exportFile(type): void {



  //   // -----------------------------------------------------------------------------------------------
  //   /* table id is passed over here */
  //   let element = this.table.nativeElement;
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   const fileName = `${this.selectedClass.ClassName}_${this.selectedSemester.school_year}學年第${this.selectedSemester.semester}學期.${type}`;
  //   XLSX.utils.book_append_sheet(wb, ws, fileName);
  //   /* save to file */
  //   XLSX.writeFile(wb, fileName);


  // }
  exportFile(type): void {

    // -----------------------------------------------------------------------------------------------
    /* table id is passed over here */
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

  getSemesterString(s: SemesterInfo) {
    return `${s.school_year}學年第${s.semester}學期`;
  }
}


class StudentAttendanceStatistics {

  refStudentId: string;
  seatNumber: string;
  name: string;
  attendanceMapping: Map<string, number> = new Map(); // <key>缺曠名稱 / <value>統計數目
  attendanceRecords: StudentAttendanceInfo[] = [];

  constructor(studentId, studentName, seatNumber) {
    this.refStudentId = studentId;
    this.name = studentName;
    this.seatNumber = seatNumber;
  }


  public add(attendRecord: StudentAttendanceInfo, attendanceType: string, selectAll: string, periodTypeMap: Map<string, string>) {
    this.attendanceRecords.push(attendRecord);
    this.parseAttendance(attendRecord.detail, attendanceType, selectAll, periodTypeMap);
  }

  parseAttendance(xmlDetail: Object, attendanceType: string, selectAll: string, periodTypeMap: Map<string, string>) {
    const personalAttendance: studentObj = node2json.xml2obj(xmlDetail);
    const temp: periodTypeDetail[] = [].concat(personalAttendance.Attendance.Period || []);
    temp.forEach((period) => {
      const absType = period.AbsenceType;
      if (!this.attendanceMapping.has(absType) && ((periodTypeMap.get(period['@text']) === attendanceType) || (attendanceType === selectAll))) {
        this.attendanceMapping.set(absType, 0);
      }
      if ((attendanceType === selectAll) || (periodTypeMap.get(period['@text']) === attendanceType)) {
        this.attendanceMapping.set(absType, this.attendanceMapping.get(absType) + 1);
      }
    });
  }

}

interface StudentListResponse {
  result: {
    ref_student_id: string;
    seat_no: string;
    name: string;
    school_year: string;
    semester: string;
    occur_date: string;
    detail: string;
  }[]
}

interface leaveType {
  StudentID: string;
  StudentName: string;
  SeatNumber: string;
  DetailList: {
    OccurDate: string;
    Period: {
      text: string;
      AbsenceType: string;
    }[];
  }[];
}

interface addPeriodType {

}

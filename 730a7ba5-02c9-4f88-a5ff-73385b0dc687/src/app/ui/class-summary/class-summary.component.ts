import { AttendanceService, SemesterInfo, StudentAttendanceInfo, studentObj } from './../../dal/attendance.service';
import { Component, OnInit } from '@angular/core';
import * as node2json from 'nodexml';

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
  studentMappingTable: Map<string,StudentAttendanceStatistics> = new Map();
  aryStudents: StudentAttendanceInfo[] = [];  // 所有學生清單, 以一個 StudentAttendanceInfo 物件來代表一位學生


  constructor(private attendanceService: AttendanceService) { }

  async ngOnInit(): Promise<void> {
    // 1. get my classes
    await this.queryClass();

    // 2. get semesters by class.
    await this.querySemesters();

    // 3. get absenceMapping Table
    this.absenceName = await this.attendanceService.getAbsenceMappingTable('Name');

    // 4. get periodMapping Table
    this.periodTable = await this.attendanceService.getPeriodMappingTable('Name');

    // 5. get student attendance by class
    await this.queryStudentAttendance();
  }

  async queryClass() {
    this.classList = await this.attendanceService.getMyClasses();
    this.selectedClass = this.classList[0];
  }

  async querySemesters() {
    this.semesters = await this.attendanceService.getSemestersByClassID(this.selectedClass.ClassID);
    this.selectedSemester = this.semesters[0];
  }

  async queryStudentAttendance() {
    const studentList: StudentListResponse = await this.attendanceService.getStudentAttendanceByClassID(this.selectedClass, this.selectedSemester);
    console.log('studentList', studentList);
    this.calStudentAttendance(studentList);
  }

  calStudentAttendance(studentList: StudentListResponse) {
    // reset
    this.studentMappingTable.clear();
    this.aryStudents = [];
    // foreach attendance record .......
    const temp = [].concat(studentList.result || []);
    studentList.result.forEach((eachStudentAttendanceInfo) =>{
      // 計算各學生缺曠的統計
      if (!this.studentMappingTable.has(eachStudentAttendanceInfo.ref_student_id)) {
        this.studentMappingTable.set(eachStudentAttendanceInfo.ref_student_id, new StudentAttendanceStatistics(eachStudentAttendanceInfo));
        this.aryStudents.push(eachStudentAttendanceInfo);
      }
      const studAttendStatistics = this.studentMappingTable.get(eachStudentAttendanceInfo.ref_student_id);
      studAttendStatistics.add(eachStudentAttendanceInfo);
    });
    this.aryStudents.sort((a, b) => {
      if (parseInt(a.seat_no) > parseInt(b.seat_no)) return 1;
      return -1;
    })
    console.log('aryStudents', this.aryStudents);
  }
  nextPage(studentInfo: StudentAttendanceInfo) {
    this.attendanceService.mode = 'studentSummary';
    this.attendanceService.fillInStudentInfo(studentInfo);
  }
}


class StudentAttendanceStatistics {

  refStudentId: string;
  seatNumber: string;
  name: string;
  attendanceMapping: Map<string, number> = new Map(); // <key>缺曠名稱 / <value>統計數目
  attendanceRecords: StudentAttendanceInfo[] = [];

  constructor(studentInfo: StudentAttendanceInfo){
    this.name = studentInfo.name;
    this.refStudentId = studentInfo.ref_student_id;
    this.seatNumber = studentInfo.seat_no;
  }


  public add(attendRecord: StudentAttendanceInfo) {
    this.attendanceRecords.push(attendRecord);
    this.parseAttendance(attendRecord.detail);
  }

  parseAttendance(xmlDetail: Object) {
    const personalAttendance: studentObj= node2json.xml2obj(xmlDetail);
    const temp = [].concat(personalAttendance.Attendance.Period || []);
    temp.forEach((period) => {
      const absType = period.AbsenceType ;
      if (!this.attendanceMapping.has(absType)) {
        this.attendanceMapping.set(absType, 0);
      }

      this.attendanceMapping.set(absType, this.attendanceMapping.get(absType) + 1);
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

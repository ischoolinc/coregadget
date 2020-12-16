import { AttendanceService, studentObj } from './../../dal/attendance.service';
import { Component, OnInit } from '@angular/core';
import * as node2json from 'nodexml';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    const std = this.attendanceService;
    this.attendanceService.getStudentAttendance(std.selectedStudentID);
    console.log('selectedStudentID', this.attendanceService.selectedStudentID);
  }

  parseStudentAttendanceInfo(xmlDetail: Object) {
    const personalAttendance: studentObj= node2json.xml2obj(xmlDetail);
    const temp = [].concat(personalAttendance.Attendance.Period || []);

  }
}

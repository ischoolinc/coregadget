import { AttendanceService } from './../../dal/attendance.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-summary',
  templateUrl: './class-summary.component.html',
  styleUrls: ['./class-summary.component.scss']
})
export class ClassSummaryComponent implements OnInit {

  constructor(private attendanceService: AttendanceService) {}

  async ngOnInit(): Promise<void> {
    await this.attendanceService.getAbsenceMappingTable();
    await this.attendanceService.getPeriodMappingTable();
    await this.attendanceService.getMyClasses();
  }

}

import { AttendanceService } from './dal/attendance.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mode: 'classSummary'|'studentSummary'|'studentDetail' = 'classSummary';
  constructor(private attendanceService: AttendanceService){
    this.mode = attendanceService.mode;
  }
}

import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/dal/attendance.service';

@Component({
  selector: 'app-student-summary',
  templateUrl: './student-summary.component.html',
  styleUrls: ['./student-summary.component.scss']
})
export class StudentSummaryComponent implements OnInit {

  selectedName: string;
  studentMappingStatics: Map<string, Map<string, AbsenceRecord>> = new Map();
  sortedMappingStatics: Map<string, Map<string, AbsenceRecord>> = new Map();
  sortedStudentList: studentAbsenceType[] = [];
  semesterList: string[] = [];
  constructor(private attendanceService: AttendanceService) {
  }

  async ngOnInit(): Promise<void> {
    const std = this.attendanceService;
    this.selectedName = this.attendanceService.selectedName;
    const obj = await this.attendanceService.getStudentAttendance(this.attendanceService.selectedStudentID);
    this.parseStudentAttendanceInfo(obj);
    this.sortMap();
    console.log('this.studentMappingStatics', this.studentMappingStatics);
  }

  parseStudentAttendanceInfo(obj: StudentAttendanceList) {
    const temp: StudentAttendanceRecord[] = [].concat(obj.Response.Attendance || []);
    temp.forEach((studentAttendanceList) => {
      // 使用學年度+學期作為key
      const stdKey = studentAttendanceList.SchoolYear + '-' + studentAttendanceList.Semester;
      // 判斷是否存在此學年度學期
      if (!this.studentMappingStatics.has(stdKey)) {
        const absenceMappingStatics = new Map();
        this.studentMappingStatics.set(stdKey, absenceMappingStatics);
      }
      console.log('studentAttendanceList', studentAttendanceList);
      // 計算各類型缺曠的數目 TODO:
      const stdDetailPeriod: AbsenceDetail[] = [].concat(studentAttendanceList.Detail.Period || []);
      stdDetailPeriod.forEach((eachAbsenceType) => {
        if (!this.studentMappingStatics.get(stdKey).has(eachAbsenceType.AbsenceType)) {
          const tempAbsenceDetail = {
            count: 0,
            date: [],
            period: []
          };
          this.studentMappingStatics.get(stdKey).set(eachAbsenceType.AbsenceType, tempAbsenceDetail);
        }
        const currentDetail = this.studentMappingStatics.get(stdKey).get(eachAbsenceType.AbsenceType);
        currentDetail.date.push(studentAttendanceList.OccurDate);
        currentDetail.period.push(eachAbsenceType['@text']);
        currentDetail.count++;
        this.studentMappingStatics.get(stdKey).set(eachAbsenceType.AbsenceType, currentDetail);
      });
    });
  }
  sortMap() {
    // 重新排序Map中內容(根據學年度學期)
    this.studentMappingStatics.forEach((value, index) => {
      this.semesterList.push(index);
    });
    this.semesterList.sort((a, b) => {
      const tempA: string = a.split('-').join('');
      const tempB = b.split('-').join('');
      if (parseInt(tempA) < parseInt(tempB)) {
        return 1;
      }
      return -1;
    });
    this.semesterList.forEach((value) => {
      this.sortedMappingStatics.set(value, this.studentMappingStatics.get(value));
    })
    // 將Map轉換成陣列作為畫面顯示 TODO:
    const temp = [];
    this.sortedMappingStatics.forEach((absenceTypeStatics, semester) => {
      const eachSemester = new studentAbsenceType();
      eachSemester.semester = semester;
      absenceTypeStatics.forEach((absenceDetail, absenceType) => {
      const typeAndCount = {
        absenceType: absenceType,
        count: absenceDetail.count,
        date: absenceDetail.date,
        period: absenceDetail.period
        };
        eachSemester.statics.push(typeAndCount);
      });

      temp.push(eachSemester);
    });
    this.sortedStudentList = temp;
    this.sortedStudentList.forEach((value) => {
      const temp = value.semester.split('-');
      value.semester = `${temp[0]}學年度第${temp[1]}學期`;
    });
  }
  previousPage() {

  }
}

class studentAbsenceType {
  constructor() { this.statics = []; }
  semester: string;
  statics: {
    absenceType: string;
    count: number;
    date: string[];
    period: string[];
  }[];
}

interface AbsenceRecord {
  count: number;
  date: string[];
  period: string[];
}
interface StudentAttendanceRecord {
  '@': [],
  'Id': string,
  'OccurDate': string,
  'SchoolYear': string,
  'Semester': string,
  'Detail': {
    'Period': AbsenceDetail[]
  }
}

interface AbsenceDetail {
  '@text': string,
  '@': [],
  'AbsenceType': string,
  'AttendanceType': string
}
interface StudentAttendanceList {
  'Response': {
    'Attendance': {
      studentAttendanceRecord: StudentAttendanceRecord
    }[]
  }
}

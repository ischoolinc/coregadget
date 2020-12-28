import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/dal/attendance.service';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-student-summary',
  templateUrl: './student-summary.component.html',
  styleUrls: ['./student-summary.component.scss']
})
export class StudentSummaryComponent implements OnInit {

  selectedName: string;
  selectedId: string;
  studentMappingStatics: Map<string, Map<string, AbsenceRecord>> = new Map();
  sortedMappingStatics: Map<string, Map<string, AbsenceRecord>> = new Map();
  sortedStudentList: studentAbsenceType[] = [];
  semesterList: string[] = [];
  periodTable = [];
  constructor(private attendanceService: AttendanceService) {
  }

  async ngOnInit(): Promise<void> {
    const std = this.attendanceService;
    this.selectedName = this.attendanceService.selectedName;
    this.selectedId = this.attendanceService.selectedStudentID;

    const obj = await this.attendanceService.getStudentAttendance(this.attendanceService.selectedStudentID);
    this.parseStudentAttendanceInfo(obj);
    this.periodTable = await this.attendanceService.getPeriodMappingTable();
    this.sortMap();
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
      // 計算各類型缺曠的數目
      const stdDetailPeriod: AbsenceDetail[] = [].concat(studentAttendanceList.Detail.Period || []);
      let periodString = '';
      let absenceTypeRecord = '';
      stdDetailPeriod.forEach((eachAbsenceType) => {
        // 同一天不同假別須清除字串
        if (absenceTypeRecord !== eachAbsenceType.AbsenceType) {
          periodString = '';
          absenceTypeRecord = eachAbsenceType.AbsenceType;
        }
        if (!this.studentMappingStatics.get(stdKey).has(eachAbsenceType.AbsenceType)) {
          const tempAbsenceDetail = {
            count: 0,
            detail: new Map()
          };
          this.studentMappingStatics.get(stdKey).set(eachAbsenceType.AbsenceType, tempAbsenceDetail);
        }
        if (periodString === '') {
          periodString += eachAbsenceType['@text'];
        }
        else {
          periodString += '、' + eachAbsenceType['@text'];
        }
        let detailObj = {
          count: this.studentMappingStatics.get(stdKey).get(eachAbsenceType.AbsenceType).count,
          detail: this.studentMappingStatics.get(stdKey).get(eachAbsenceType.AbsenceType).detail.set(studentAttendanceList.OccurDate, periodString)
        }
        detailObj.count++;
        this.studentMappingStatics.get(stdKey).set(eachAbsenceType.AbsenceType, detailObj);
      });
    });
    debugger;
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
    });
    // 將Map轉換成陣列作為畫面顯示
    const temp = [];
    this.sortedMappingStatics.forEach((absenceTypeStatics, semester) => {
      const eachSemester = new studentAbsenceType();
      eachSemester.semester = semester;
      absenceTypeStatics.forEach((absenceDetail, absenceType) => {
        const periodByDate = [];
        absenceDetail.detail.forEach((period, date) => {
          const tempData = {
            date: date,
            period: period
          }
          periodByDate.push(tempData);
        });
        const typeAndCount = {
          absenceType: absenceType,
          count: absenceDetail.count,
          detail: periodByDate
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

  /**
   *
   * @param type 輸出成Excel 或Html
   */
  async exportFile(type): Promise<void> {

    const rst = await this.attendanceService.getStudentAttendance(this.attendanceService.selectedStudentID);
    const result: StudentAttendanceRecord[] = [].concat(rst.Response.Attendance || []);
    const studentInfoMap = new Map();
    result.forEach((detail) => {
      const detailMap  = new Map();
      this.periodTable.forEach(period => detailMap.set(period.Name, ''));
      const absenceType: AbsenceDetail[] = [].concat(detail.Detail.Period || []);
      absenceType.forEach((typeByPeriod) => {
          detailMap.set(typeByPeriod['@text'], typeByPeriod.AbsenceType);
      })
      const detailObj = {
        schoolYear: detail.SchoolYear,
        semester: detail.Semester,
        occurDate: detail.OccurDate,
        detailMap: detailMap
      }
      studentInfoMap.set(detail.OccurDate, detailObj);
    });
    let header = '';
    this.periodTable.forEach((period) => {
      header += `<th>${period.Name}</th>
                `;
    })
    let head = `<div>
    <div>${this.selectedName} 缺曠記錄明細表</div>
    <table border = 1>
        <thead>
            <tr>
                <th>學年度學期</th>
                <th>日期</th>
                ${header}
            </tr>
        </thead>
        <tbody>`;

    let body = '';
    studentInfoMap.forEach((absenceTypeByDate) => {
      body +=`
              <tr>
                <td>${absenceTypeByDate.schoolYear}學年第${absenceTypeByDate.semester}學期</td>
                <td>${absenceTypeByDate.occurDate}</td>
                `;
      absenceTypeByDate.detailMap.forEach((absenceType) => {
        body += `<td>${absenceType}</td>
                `;
      });
      body += `
              </tr>`;
    });
    body += `
            </tr>
          </tbody>
      </table>
    </div>`;
    let html = head + body;
    const fileName = `${this.selectedName}_缺曠紀錄明細表.${type}`;
    FileSaver.saveAs(new Blob([html], { type: "application/octet-stream" }), fileName);
  }
}

class studentAbsenceType {
  semester: string;
  statics: AbsenceInfo[] = [];

  constructor() {
  }
}

class AbsenceInfo {
  absenceType: string;
  count: number;
  detail: AbsenceDetail[] = [];

  constructor() {
  }
}

class AbsenceDetail {
  date: string;
  period: string;
}

/**
 * 各缺曠類型的詳細資料，Map<date, period>
 */
interface AbsenceRecord {
  count: number;
  detail: Map<string, string>
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
  'AbsenceType': string
  // 'AttendanceType': string
}

interface StudentAttendanceList {
  'Response': {
    'Attendance': {
      studentAttendanceRecord: StudentAttendanceRecord
    }[]
  }
}

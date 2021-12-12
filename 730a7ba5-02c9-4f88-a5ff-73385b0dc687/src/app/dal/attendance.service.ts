import { ContractService } from './contract.service';
import { GadgetService, Contract } from './gadget.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  mode :'classSummary'|'studentSummary'|'studentDetail' = 'classSummary';
  selectedStudentID: string;
  selectedSchoolYear: string;
  selectedSemester: string;
  selectedName: string;
  absenceMappingTable = new Map();
  constructor(
    private gadget: GadgetService,
    private contract: ContractService
  ) {
  }
  // 取得節次對照表
  async getPeriodMappingTable(parameter: 'Aggregated' | 'Name' | 'Sort' | 'Type' | '' = '') {
    const contract = await this.contract.getTAContract();
    const result: PeriodListResponse = await contract.send('TeacherAccess.GetPeriodMappingTable', {
      Content: {
        Field: {
          Content: {}
        }
      }
    }
    );
    const temp = [];
    result.GetPeriodListResponse.Period.forEach((value) => {
      switch (parameter) {
        case 'Aggregated':
          temp.push(value.Aggregated);
          break;
        case 'Name':
          temp.push(value.Name);
          break;
        case 'Sort':
          temp.push(value.Sort);
          break;
        case 'Type':
          temp.push(value.Type);
          break;
        default:
          temp.push(value);
      }
    });
    return temp;
  }
  // 取得缺曠對照表
  async getAbsenceMappingTable(parameter: 'Abbreviation' | 'HotKey' | 'Name' | 'NoAbsence' | '' = '') {
    const contract = await this.gadget.getContract('ta');
    const result: AbsenceListResponse = await contract.send('TeacherAccess.GetAbsenceMappingTable', {
      Content: {
        Field: {
          All: {}
        }
      }
    }
    );
    const temp = [];
    result.AbsenceMappingTableResponse.Absence.forEach((value) => {
      switch (parameter) {
        case 'Abbreviation':
          temp.push(value.Abbreviation);
          break;
        case 'HotKey':
          temp.push(value.HotKey);
          break;
        case 'Name':
          temp.push(value.Name);
          break;
        case 'NoAbsence':
          temp.push(value.NoAbsence);
          break;
        default:
          temp.push(value);
      }
    });
    return temp;
  }
  // 取得班級列表
  async getMyClasses() {
    const contract = await this.contract.getDefaultContract();
    const result: ClassListResponse = await contract.send('_.GetMyClasses', {
      Request: {}
    }
    );
    return [].concat(result.ClassList.Class);
  }

  // 取得班級學年度學期
  async getSemestersByClassID(classID) {
    const contract = await this.contract.getDefaultContract();
    const result: any = await contract.send('attendance.GetSemestersByClassID', {
      Request: {
        ClassID: classID
      }
    }
    );
    let temp = [].concat(result?.result||[]);
    return temp as SemesterInfo[];
  }

  /**取得全班缺曠 */
  async getStudentAttendanceByClassID(cls, semester: SemesterInfo) {
    if(!semester){
       return [];
    }
    const contract = await this.contract.getDefaultContract();
    const result = await contract.send('attendance.GetStudentAttendanceByClassID', {
      Request: {
        ClassID: cls.ClassID,
        SchoolYear: semester.school_year,
        Semester: semester.semester
      }
    });
    return result;
  }

  /** 取得全班非明細資料 */
  async getGetStudAttendanceNoDetailByClassID(cls, semester: SemesterInfo){
    if(!semester){
      return [];
   }
    const contract = await this.contract.getDefaultContract();
    const result = await contract.send('attendance.getAttendanceNoDetailByID', {
      Request: {
        ClassID: cls.ClassID,
        SchoolYear: semester.school_year,
        Semester: semester.semester
      }
    });
    // alert("取得非明細資料!") ;

    return result;
}


  /** 取得個別學生非明細資料 */
  async getGetStudAttendanceNoDetailByStuID(stuID){

    const contract = await this.contract.getDefaultContract();
    const result = await contract.send('attendance.getAttendanceNoDetailByStuID', {
      Request: {
     StudentID :stuID
      }
    });
    // alert("取得非明細資料!") ;

    return result;
}


  // 取得學生缺曠資料
  async getStudentAttendance(studentID) {
    const contract = await this.contract.getDefaultContract();
    const result = await contract.send('attendance.GetStudentAttendance', {
      Request: {
        Field: {
          All:''
        },
        RefStudentId: studentID
      }
    }
    );
    return result;

  }

  // 取得班級學生
  async getStudents(classID: string) {
    const contract = await this.contract.getDefaultContract();
    const rst: any = await contract.send('classroom.GetStudents', {
      Request: {
        Type: 'Class',
        UID: classID
      }
    });
    const result = [].concat(rst.Students.Student || []);
    const studentList = [];
    result.forEach((student) => {
      studentList.push(new classIdStudents(student.ID, student.Name, student.SeatNo));
    });
    // alert("s"+JSON.stringify(studentList))
    return studentList;

  }

  fillInStudentInfo(studentInfo) {
    this.selectedStudentID = studentInfo.studentId;
    // this.selectedSchoolYear = studentInfo.school_year;
    // this.selectedSemester = studentInfo.semester;
    this.selectedName = studentInfo.name;
  }
}


interface PeriodListResponse {
  GetPeriodListResponse: {
    Period: {
      Aggregated: string;
      Name: string;
      Sort: string;
      Type: string;
    }[]
  }
}
interface AbsenceListResponse {
  AbsenceMappingTableResponse: {
    Name: string;
    Absence: {
      Abbreviation: string;
      HotKey: string;
      Name: string;
      NoAbsence: string;
    }[];
  }
}

interface ClassListResponse {
  ClassList: {
    Class: {
      ClassID: string;
      ClassName: string;
    }[];
  }
}


export interface StudentAttendanceInfo {
  ref_student_id: string;
  seat_no: string;
  name: string;
  school_year: string;
  semester: string;
  occur_date: string;
  detail: string;
}

export interface SemesterInfo {
  school_year: number;
  semester: number;
}

export class classIdStudents {
  studentId: string;
  studentName: string;
  seatNumber: string;
  hasData :boolean ;

  constructor(studentId: string, studentName: string, seatNumber: string) {
    this.studentId = studentId;
    this.studentName= studentName;
    this.seatNumber = seatNumber;
    this.hasData = false  ;
  }
}

export interface studentObj {
  'Attendance': {
    'Period': periodTypeDetail[]
  }
}

export interface periodTypeDetail {
  '@text': string,
  '@': [],
  'AbsenceType': string,
  'AttendanceType': string
}

export interface studentObj {
  'Attendance': {
    'Period': {
      '@text': string,
      '@': [],
      'AbsenceType': string,
      'AttendanceType': string
    }[]
  }
}

export interface periodDetail {
  Aggregated: string;
  Name: string;
  Sort: string;
  Type: string;
}

import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {

  selectedStudentID: string;
  selectedSchoolYear: string;
  selectedSemester: string;
  selectedName: string;

  constructor(private contractService: ContractService) { }


  // 取得班級列表
  async getMyClasses() {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('_.GetMyClasses', {
      Request: {}
    }
    );
    console.log(result);
    let classes = [];
    if (Array.isArray(result.ClassList.Class)) {
      classes = result.ClassList.Class;
    } else {
      classes.push(result.ClassList.Class);
    }
    return classes as SemesterInfo[];
  }

  // 取得班級學年度學期
  async getSemestersByClassID(classID) {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('discipline.GetSemesterByClassID', {
      Request: {
        ClassID: classID
      }
    }
    );
    console.log(result.result);
    let semesters = [];
    if (Array.isArray(result.result)) {
      semesters = result.result;
    }
    else {
      semesters.push(result.result);
    }
    return semesters as SemesterInfo[];
  }

  // 取得班級學生獎懲列表
  async GetStudentDisciplineByClass(cls: ClassInfo, semester: SemesterInfo) {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('discipline.GetStudentDisciplineByClass', {
      Request: {
        ClassID: cls.ClassID,
        SchoolYear: semester.school_year,
        Semester: semester.semester
      }
    }
    );
    console.log('result', result);
    let studentDisciplineDetail = [];
    if (Array.isArray(result.result)) {
      studentDisciplineDetail = result.result;
    }
    else {
      studentDisciplineDetail.push(result.result);
    }
    console.log(studentDisciplineDetail);
    return studentDisciplineDetail as StudentDisciplineDetail[];
  }

  // 取得學生獎懲明細

  fillInStudentInfo(studentInfo: StudentDisciplineStatistics) {
    this.selectedStudentID = studentInfo.studentId;
    this.selectedName = studentInfo.name;
  }
}

export interface ClassInfo {
  ClassID: string;
  GradeYear: number;
  ClassName: string;
  StudentCount: number;
}

export interface SemesterInfo {
  school_year: number;
  semester: number;
}

export interface StudentDisciplineDetail {
  seat_no: string;
  ref_student_id: string;
  name: string;
  school_year: string;
  semester: string;
  occur_date: string;
  detail: string;
  reason: string;
  merit_flag: string;
}

export class StudentDisciplineStatistics {
  constructor(student: StudentDisciplineDetail) {
    this.seatNumber = student.seat_no;
    this.studentId = student.ref_student_id;
    this.name = student.name;
    this.merit = new discipline();
    this.demerit = new discipline();
    this.detention = '否';
  }
  studentId: string;
  seatNumber: string;
  name: string;
  merit: discipline;
  demerit: discipline;
  detention: string;

}

class discipline {
  constructor() {
    this.A = 0;
    this.B = 0;
    this.C = 0;
  }
  A: number;
  B: number;
  C: number;
}
export interface parseXmlDiscipline {
  'Discipline': {
    'Merit': {
      '@': [],
      'A': string,
      'B': string,
      'C': string
    },
    '@text':[],
    'Demerit': {
      '@': [],
      'A': string,
      'B': string,
      'C': string,
      'Cleared': string,
      'ClearDate': string
    }
  }
}

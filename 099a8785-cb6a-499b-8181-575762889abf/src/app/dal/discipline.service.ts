import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { ContractService } from './contract.service';

/**註1 [非明細] 學校轉入生獎懲不會帶有事由等資訊 補登時會寫入與缺礦獎懲不童的table  */
@Injectable({
  providedIn: 'root'
})
export class DisciplineService {

  selectedStudentID: string;
  selectedSeatNum: string;
  selectedName: string;
  schoolType:string ;


   constructor(
      private contractService: ContractService
      ,private http:HttpClient){
    //取得學制
    // this.loadSchoolType();
  }

  /**
   * 取得 學制
   * @memberof DisciplineService
   */
  async loadSchoolType() {

    let schoolType = '高中'; // 預設值為"高中" 如果沒有預設值
    let dsnsName = await gadget.getApplication().accessPoint;
    let url = `https://dsns.ischool.com.tw/campusman.ischool.com.tw/config.public/GetSchoolList?body=%3CCondition%3E%3CDsns%3E${dsnsName}%3C/Dsns%3E%3C/Condition%3E&rsptype=json`;
    try {

      const response = await this.http.get<any>(url, { responseType: 'json' }).toPromise();
      schoolType = response.Response.School.Type;
      console.log("asign", response.Response.School.Type);
      this.schoolType = schoolType;
    } catch (err) {
      console.log("err: \n", err);
      alert("取得學制發生錯誤!");
    }
    // console.log("2", this.schoolType);
  }

  // 取得班級列表
  async getMyClasses() {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('_.GetMyClasses', {
      Request: {}
    }
    );
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
    let temp = [].concat(result?.result||[]);

    return temp as SemesterInfo[];
  }

  // 取得班級學生獎懲列表
  async getStudentDisciplineByClass(cls: ClassInfo, semester: SemesterInfo) {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('discipline.GetStudentDisciplineByClass', {
      Request: {
        ClassID: cls.ClassID,
        SchoolYear: semester.school_year,
        Semester: semester.semester
      }
    }
    );

    let studentDisciplineDetail = [];
    if (Array.isArray(result.result)) {
      studentDisciplineDetail = result.result;
    }
    else {
      studentDisciplineDetail.push(result.result);
    }
    return studentDisciplineDetail as StudentDisciplineDetail[];
  }

  // 取得學生獎懲明細
  async getStudentDisciplineDetail(studentId: string) {
    const contract = await this.contractService.getDefaultContract();
    const rst: any = await contract.send('discipline.GetStudentDisciplineDetail', {
      Request: {
        StudentId: studentId
      }
    });
    const result: parseXmlDisciplineDetail[] = [].concat(rst.result || []);
    console.log('獎懲明細', result);
    return result;

  }

  // 取得班級學生
  async getStudents(classID: string) {
    const contract = await this.contractService.getDefaultContract();
    const rst: any = await contract.send('classroom.GetStudents', {
      Request: {
        Type: 'Class',
        UID: classID
      }
    });
    const result = [].concat(rst.Students.Student || []);
    console.log('student', result);
    const studentList = [];
    result.forEach((student) => {
      studentList.push(new classIdStudents(student.ID, student.Name, student.SeatNo));
    });
    return studentList;

  }
  fillInStudentInfo(studentInfo: StudentDisciplineStatistics) {
    this.selectedStudentID = studentInfo.studentId;
    this.selectedName = studentInfo.name;
    this.selectedSeatNum = studentInfo.seatNumber;
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
  constructor(studentId, studentName, seatNumber) {
    this.studentId = studentId;
    this.name = studentName;
    this.seatNumber = seatNumber;
    this.merit = new discipline();
    this.demerit = new discipline();
    this.detention = '';
  }
  studentId: string;
  seatNumber: string;
  name: string;
  merit: discipline;
  demerit: discipline;
  detention: string;

}

/**  取得非明細(註1) :*/
export class DisciplineWithOutDetail {
 /* <rsp>
	<id>47857</id>
	<school_year>103</school_year>
	<semester>1</semester>
	<ref_student_id>54266</ref_student_id>
	<merit_a>4</merit_a>
	<merit_b>1</merit_b>
	<merit_c>1</merit_c>
	<demerit_a>2</demerit_a>
	<demerit_b>1</demerit_b>
	<demerit_c>1</demerit_c>
  </rsp> */
    id :string ;
    school_year :string  ;
    semester :string ;
    ref_student_id :string ;
    /** */
    merit_a :string ;
    merit_b :string ;
    merit_c :string ;
    demerit_a :string ;
    demerit_b :string ;
    demerit_c :string ;
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

export class classIdStudents {
  studentId: string;
  studentName: string;
  seatNumber: string;

  constructor(studentId: string, studentName: string, seatNumber: string) {
    this.studentId = studentId;
    this.studentName= studentName;
    this.seatNumber = seatNumber;
  }

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

export class studentInfoDetail {
  date: string;
  seatNumber: string;
  name: string;
  majorMerit: string;
  minorMerit: string;
  commendation: string;
  majorDemerit: string;
  minorDemerit: string;
  admonition: string;
  reason: string;
  hasDelNegligence: string;
  delNegligenceDate: string;
  delNegligenceReason: string;
  detention: string;
  remark :string ;

  constructor(detail: parseXmlDisciplineDetail, seatNumber: string, name: string) {
    // alert("detail"+ detail)
    // console.log("detail",detail) ;
    this.date = detail.date;
    this.seatNumber = seatNumber;
    this.name = name;
    this.majorMerit = Number(detail.major_merit) > 0 ? detail.major_merit : '';
    this.minorMerit = Number(detail.minor_merit) > 0 ? detail.minor_merit : '';
    this.commendation = Number(detail.commendation) > 0 ? detail.commendation: '';
    this.majorDemerit = Number(detail.major_demerit) > 0 ? detail.major_demerit : '';
    this.minorDemerit = Number(detail.minor_demerit) > 0 ? detail.minor_demerit : '';
    this.admonition = Number(detail.admonition) > 0 ? detail.admonition : '';
    this.reason = detail.reason;
    this.hasDelNegligence = detail.has_del_negligence;
    this.delNegligenceDate = detail.del_negligence_date;
    this.delNegligenceReason = detail.del_negligence_reason;
    this.detention = detail.detention == '否' ? '': detail.detention;
    this.remark = detail.remark;
  }

}
export interface parseXmlDisciplineDetail {
  ref_student_id: string,
  school_year: string,
  semester: string,
  date: string,
  reason: string,
  detail: string,
  type: string,
  major_merit: string,
  minor_merit: string,
  commendation: string,
  major_demerit: string,
  minor_demerit: string,
  admonition: string,
  has_del_negligence: string,
  del_negligence_date: string,
  del_negligence_reason: string,
  detention: string ,
  remark :string
}

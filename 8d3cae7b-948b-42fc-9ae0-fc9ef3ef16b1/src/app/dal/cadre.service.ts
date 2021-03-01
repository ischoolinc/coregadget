import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { ContractService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class CadreService {

  constructor(
    private contractService: ContractService,
    private http: HttpClient){

  }

  /**
   * 取得班級幹部類別清單
   */
  async getCadreTypes() {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('cadre.GetClassCadreType', {
      Request: {}
    }
    );
    // console.log(result);
    let types = [];
    if (Array.isArray(result.CadreTypes.CadreType)) {
      types = result.CadreTypes.CadreType;
    } else {
      types.push(result.CadreTypes.CadreType);
    }
    return types as CadreTypeInfo[];
  }

  // 取得班級學年度學期
  async getSemestersByClassID(classID) {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('cadre.GetSemestersByClassID', {
      Request: {
        ClassID: classID
      }
    }
    );
    let temp = [].concat(result?.result||[]);

    return temp as SemesterInfo[];
  }

  // 取得班級學年度學期
  async getCurrentSemester() {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('_.GetCurrentSemester', { } );

    return result ;
  }

  /**
   * 取得指定班級的班級幹部名單
   */
  async getClassCadreStudents(classID, schoolYear, semester) {
    const contract = await this.contractService.getDefaultContract();
    const result: any = await contract.send('cadre.GetClassCadres', {
      Request: {
        ClassID: classID,
        SchoolYear: schoolYear,
        Semester: semester
      }
    }
    );
    let types = [];
    if (Array.isArray(result.Cadres.Cadre)) {
      types = result.Cadres.Cadre;
    } else {
      if (result.Cadres.Cadre) {
        types.push(result.Cadres.Cadre);
      }
    }
    return types as CadreInfo[];
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
    return classes as ClassInfo[];
  }

  // 取得班級學生清單
  async getStudents(classID: string) {
    const contract = await this.contractService.getDefaultContract();
    const rst: any = await contract.send('classroom.GetStudents', {
      Request: {
        Type: 'Class',
        UID: classID
      }
    });
    const result = [].concat(rst.Students.Student || []);
    // console.log('student', result);
    const studentList = [];
    result.forEach((student) => {
      studentList.push(new StudentInfo(student.ID, student.Name, student.SeatNo));
    });
    return studentList as StudentInfo[];
  }

  // 刪除一筆班級幹部紀錄
  async deleteCadre(cadreUID: string) {
    const contract = await this.contractService.getDefaultContract();
    const rst: any = await contract.send('cadre.DeleteCadre', {
      Request: {
        UID: cadreUID
      }
    });
  }

  // 新增一筆班級幹部紀錄
  async addCadre(cadre: CadreInfo) {
    const contract = await this.contractService.getDefaultContract();
    const rst: any = await contract.send('cadre.AddCadre', {
      Request: {
        Cadre: {
          CadreName: cadre.cadrename,
          ReferenceType: cadre.referencetype,
          SchoolYear: cadre.schoolyear ,
          Semester: cadre.semester,
          StudentID: cadre.studentid ,
          Text: cadre.text
        }
      }
    });
  }
}

export interface CadreTypeInfo {
  Uid: string ;
  Cadrename: string;
  Index: number;
  Merita: number;
  Meritb: number;
  Meritc: number;
  Nametype: string;
  Number: number;
  Reason: string;
}


export interface CadreInfo {
  uid: string ;
  schoolyear: string;
  semester: string;
  studentid: string;
  referencetype: string;
  cadrename: string;
  text: string;
}

export interface ClassInfo {
  ClassID: string;
  GradeYear: number;
  ClassName: string;
  StudentCount: number;
}

export class StudentInfo {
  StudentId: string;
  SeatNo: string;
  StudentName: string;

  constructor(studentId: string, studentName: string, seatNo: string) {
    this.StudentId = studentId;
    this.StudentName = studentName;
    this.SeatNo = seatNo;
  }
}

/** 呈現出畫面上的一筆紀錄 */
export class ClassCadreRecord {
  cadreType: CadreTypeInfo;
  cadre: CadreInfo ;
  student: StudentInfo ;
}

export interface SemesterInfo {
  school_year: number;
  semester: number;
}

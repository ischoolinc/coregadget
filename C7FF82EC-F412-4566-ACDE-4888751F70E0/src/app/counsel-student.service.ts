import { Injectable } from "@angular/core";
import { DsaService } from "./dsa.service";
import { stringify } from "@angular/compiler/src/util";
import { async } from "@angular/core/testing";

@Injectable({
  providedIn: "root"
})
export class CounselStudentService {
  public isLoading: boolean;
  public studentMap: Map<string, CounselStudent>;
  public classMap = new Map<string, CounselClass>();
  public counselClass: CounselClass[];
  public teacherName: string;
  // 目前學年度
  public currentSchoolYear: number;
  // 目前學期
  public currentSemester: number;
  // 認輔學生
  public guidanceStudent: CounselStudent[];
 
  // public currentStudent: CounselStudent;
 
  constructor(private dsaService: DsaService) {
    this.reload();
  }

  async reload() {
    this.isLoading = true;
    this.studentMap = new Map<string, CounselStudent>();
    this.classMap = new Map<string, CounselClass>();
    this.counselClass = [];
    this.guidanceStudent = [];

    this.classMap = new Map<string, CounselClass>();

    // 取得目前學年度學期
    let currentSemeRsp = await this.dsaService.send("GetCurrentSemester", {});
    [].concat(currentSemeRsp.CurrentSemester || []).forEach(sems => {
      this.currentSchoolYear = sems.SchoolYear;
      this.currentSemester = sems.Semester;
    });
    // console.log(this.currentSchoolYear,this.currentSemester);

    // 取得登入教師名稱
    let teacher = await this.dsaService.send("GetTeacher", {});
    [].concat(teacher.Teacher || []).forEach(tea => {
      this.teacherName = tea.Name;
    });

    // 班導師，輔導老師
    let resp = await this.dsaService.send("GetCounselStudent", {});

    [].concat(resp.Student || []).forEach(stuRec => {
      //建立學生
      if (!this.studentMap.has(stuRec.StudentID)) {
        this.studentMap.set(stuRec.StudentID, {
          StudentID: stuRec.StudentID,
          ClassName: stuRec.ClassName,
          SeatNo: stuRec.SeatNo,
          StudentNumber: stuRec.StudentNumber,
          StudentName: stuRec.StudentName,
          Status: stuRec.Status,
          Role: [],
          InterviewCount: parseInt(stuRec.InterviewCount),
          LastInterviewDate: stuRec.LastInterviewDate,
          LastInterviewContact: stuRec.LastInterviewContact,
          LastInterviewType: stuRec.LastInterviewType,
          LastInterviewTypeOther: stuRec.LastInterviewTypeOther,
          LastInterviewContactItem: stuRec.LastInterviewContactItem,
          LastInterviewReferral: stuRec.LastInterviewReferral
        } as CounselStudent);
      }
      let stu = this.studentMap.get(stuRec.StudentID);
      if (stu.Role.indexOf(stuRec.Role) < 0) {
        stu.Role.push(stuRec.Role);
      }
      //建立班級
      if (!this.classMap.has(stuRec.ClassID)) {
        this.classMap.set(stuRec.ClassID, {
          ClassID: stuRec.ClassID,
          GradeYear: stuRec.GradeYear,
          ClassName: stuRec.ClassName,
          HRTeacherName: stuRec.HRTeacherName,
          Role: [],
          Student: []
        } as CounselClass);
        this.counselClass.push(this.classMap.get(stuRec.ClassID));
      }
      let cls = this.classMap.get(stuRec.ClassID);
      if (cls.Role.indexOf(stuRec.Role) < 0) {
        cls.Role.push(stuRec.Role);
      }
      cls.Student.push(stu);
    });

    this.isLoading = false;
  }
}

export class CounselClass {
  ClassID: string;
  GradeYear: string;
  ClassName: string;
  HRTeacherName: string;
  Role: string[];

  Student: CounselStudent[];
}

export class CounselStudent {
  StudentID: string;
  ClassName: string;
  SeatNo: string;
  StudentNumber: string;
  StudentName: string;
  Status: string;
  Role: string[];

  InterviewCount: Number;
  LastInterviewDate: string;
  LastInterviewContact: string;
  LastInterviewType: string;
  LastInterviewTypeOther: string;
  // 內容
  // LastInterviewContent: string;
  // 聯絡事項
  LastInterviewContactItem: string;
  LastInterviewReferral: Boolean;

  // lastCaseInterviewDate: string;
  // lastCaseInterviewContact: string;
  // lastCaseInterviewType: string;
  // lastCaseInterviewContent: string;
}

export class SemesterInfo {
  SchoolYear: number;
  Semester: number;
}

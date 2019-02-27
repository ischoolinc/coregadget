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
  public teacherInfo: TeacherInfo = new TeacherInfo();

  public getCounselClass(targetRole: string) {
    let list: CounselClass[] = [];
    this.counselClass.forEach((item) => {
      if (item.Role.indexOf(targetRole) >= 0)
        list.push(item);
    });
    return list;
  }

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
      this.teacherInfo = new TeacherInfo();
      this.teacherInfo.Name = tea.Name;
      this.teacherInfo.ID = tea.ID;
      this.teacherInfo.NickName = tea.NickName;
    });

    this.dsaService.getSessionIDAndAccessPoint();

    // 班導師，輔導老師，會讀取目前學年度學期
    let resp = await this.dsaService.send("GetCounselStudent", {});

    [].concat(resp.Student || []).forEach(stuRec => {
      //建立學生
      if (!this.studentMap.has(stuRec.StudentID)) {
        this.studentMap.set(
          stuRec.StudentID, {
            StudentID: stuRec.StudentID,
            SchoolYear: this.currentSchoolYear,
            Semester: this.currentSemester,
            ClassName: stuRec.ClassName,
            SeatNo: stuRec.SeatNo,
            StudentNumber: stuRec.StudentNumber,
            StudentName: stuRec.StudentName,
            Gender: stuRec.Gender,
            Status: stuRec.Status,
            Role: [],
            InterviewCount: parseInt(stuRec.InterviewCount),
            LastInterviewDate: stuRec.LastInterviewDate,
            LastInterviewContact: stuRec.LastInterviewContact,
            LastInterviewType: stuRec.LastInterviewType,
            LastInterviewTypeOther: stuRec.LastInterviewTypeOther,
            LastInterviewContent: stuRec.LastInterviewContent,
            LastInterviewContactItem: stuRec.LastInterviewContactItem,
            LastInterviewReferral: stuRec.LastInterviewReferral,
            ReferralStatus: stuRec.ReferralStatus,
            PhotoUrl: `${this.dsaService.AccessPoint}/GetStudentPhoto?stt=Session&sessionid=${this.dsaService.SessionID}&parser=spliter&content=StudentID:${stuRec.StudentID}`
          } as CounselStudent);
      }
      let stu = this.studentMap.get(stuRec.StudentID);
      if (stu.Role.indexOf(stuRec.Role) < 0) {
        stu.Role.push(stuRec.Role);
      }
      //填入認輔名單
      if (stu.Role.indexOf("認輔老師") > 0)
        this.guidanceStudent.push(stu);
      //建立班級
      if (stuRec.ClassID) {
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
      }
    });

    // // 取得認輔資料 _.GetGuidanceStudent
    // let respGS = await this.dsaService.send("GetGuidanceStudent", {});
    // let gsData: CounselStudent[] = [];
    // [].concat(respGS.Student || []).forEach(stuRec => {
    //   let stu: CounselStudent = new CounselStudent();
    //   stu.StudentID = stuRec.StudentID;
    //   stu.SchoolYear = stuRec.SchoolYear;
    //   stu.Semester = stuRec.Semester;
    //   stu.ClassName = stuRec.ClassName;
    //   stu.SeatNo = stuRec.SeatNo;
    //   stu.StudentNumber = stuRec.StudentNumber;
    //   stu.StudentName = stuRec.StudentName;
    //   stu.Status = stuRec.Status;
    //   stu.Role = stuRec.Role;
    //   stu.InterviewCount = stuRec.InterviewCount;
    //   stu.LastInterviewDate = stuRec.LastInterviewDate;
    //   stu.LastInterviewContact = stuRec.LastInterviewContact;
    //   stu.LastInterviewType = stuRec.LastInterviewType;
    //   stu.PhotoUrl = `${
    //     this.dsaService.AccessPoint
    //     }/GetStudentPhoto?stt=Session&sessionid=${
    //     this.dsaService.SessionID
    //     }&parser=spliter&content=StudentID:${stuRec.StudentID}`;
    //   gsData.push(stu);
    // });
    // this.guidanceStudent = gsData;

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
  SchoolYear: number;
  Semester: number;
  ClassName: string;
  SeatNo: string;
  Gender: string;
  StudentNumber: string;
  StudentName: string;
  Status: string;
  Role: string[];

  InterviewCount: number;
  LastInterviewDate: string;
  LastInterviewContact: string;
  LastInterviewType: string;
  LastInterviewTypeOther: string;
  // 內容
  LastInterviewContent: string;
  // 聯絡事項
  LastInterviewContactItem: string;
  LastInterviewReferral: boolean;
  ReferralStatus:string;
  PhotoUrl: string;
  // lastCaseInterviewDate: string;
  // lastCaseInterviewContact: string;
  // lastCaseInterviewType: string;
  // lastCaseInterviewContent: string;
}

export class SemesterInfo {
  SchoolYear: number;
  Semester: number;
}

// 登入教師
export class TeacherInfo {
  Name: string;
  NickName: string;
  ID: string;
}

import { Injectable } from "@angular/core";
import { DsaService } from "./dsa.service";
import { stringify } from "@angular/compiler/src/util";

@Injectable({
  providedIn: "root"
})
export class CounselStudentService {
  public isLoading: boolean;
  public studentMap: Map<string, CounselStudent>;
  public classMap = new Map<string, CounselClass>();
  public counselClass: CounselClass[];
  public guidanceStudent: CounselStudent[];
  public currentStudent: CounselStudent;
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

  // 新增/更新輔導資料
  async SetCounselInterview(data: CounselInterview) {
    this.isLoading = true;

    if (!data.isPrivate)
      data.isPrivate = 'true';
    if (!data.isReferral)
    data.isReferral = 'false';  

    let resp = await this.dsaService.send("SetCounselInterview", {
      Request: {
        SchoolYear: data.SchoolYear,
        Semester: data.Semester,
        OccurDate: data.OccurDate,
        ContactName: data.ContactName,
        AuthorName: data.AuthorName,
        CounselType: data.CounselType,
        CounselTypeOther: data.CounselTypeOther,
        isPrivate: data.isPrivate,
        StudentID: data.StudentID,
        isReferral: data.isReferral,
        ReferralDesc: data.ReferralDesc,
        ReferralReply: data.ReferralReply,
        ReferralStatus: data.ReferralStatus,
        ReferralReplyDate: data.ReferralReplyDate,
        Content: data.Content,
        ContactItem: data.ContactItem
      }
    });
    console.log("test");
    console.log(resp);
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

// 輔導資料
export class CounselInterview {
  constructor() {}
  SchoolYear: string; //學年度
  Semester: string; //學期
  OccurDate: string; //訪談日期
  ContactName: string; //訪談對象姓名
  AuthorName: string; //訪談者姓名
  CounselType: string; //訪談方式
  CounselTypeOther: string; //其他訪談方式
  isPrivate: string; //是否僅有自己(以及輔導老師)能看見
  StudentID: string; //學生系統編號
  isReferral: string; //是否轉介
  ReferralDesc: string; //轉介說明
  ReferralReply: string; //輔導室針對轉介之回覆
  ReferralStatus: string; //輔導室回覆轉介接收狀態
  ReferralReplyDate: string; //輔導室回覆轉介之日期
  Content: string; //內容
  ContactItem: string; //聯絡事項
}

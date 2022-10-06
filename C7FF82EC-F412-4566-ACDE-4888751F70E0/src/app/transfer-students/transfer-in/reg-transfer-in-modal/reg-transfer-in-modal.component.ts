import { Component, OnInit } from "@angular/core";
import { DsaTransferService } from "../../service/dsa-transfer.service";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: "app-reg-transfer-in-modal",
  templateUrl: "./reg-transfer-in-modal.component.html",
  styleUrls: ["./reg-transfer-in-modal.component.css"]
})
export class RegTransferInModalComponent implements OnInit {

  isLoading = true;
  isReging = false;
  regStatus: RegStatus = {} as RegStatus;
  gradeYears: string[] = [];
  classList: ClassRec[] = [];
  studentMap: Map<string, StudentRec[]> = new Map();
  selectedGradeYear = '';
  selectedClass: ClassRec = {} as ClassRec;
  curClassList: ClassRec[] = [];
  selectedStudent: StudentRec = {} as StudentRec;
  curStudentList: StudentRec[] = [];
  schoolList: SchoolRec[] = [];
  selectedSchool: SchoolRec = {} as SchoolRec;

  constructor(
    private dsaService: DsaTransferService,
  ) { }

  async ngOnInit() {
    try {
      await Promise.all([
        this.getClassList(),
        this.getSchoolList(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  async getClassList() {
    const resp = await this.dsaService.send('GetClass');
    const sourceClass = [].concat(resp.Class || []);

    for (const item of sourceClass) {
      item.GradeYear = item.GradeYear || '未分年級';
      if (this.gradeYears.indexOf(item.GradeYear) === -1) {
        this.gradeYears.push(item.GradeYear);
      }
    }

    const sortClassList = sourceClass.sort((a: any, b: any) => {
      const x = `${a.GradeYear}_${a.ClassName}`;
      const y = `${b.GradeYear}_${b.ClassName}`;
      return x.localeCompare(y);
    });
    this.classList = sortClassList;
  }

  async getSchoolList() {
    // TODO: 去 1campusman，取得學校清單
    // const resp = await this.dsaService.send('', { group: '' }, '');
    // const schoolList = [].concat(resp.Schools || []);
    this.schoolList = [
      { school_name: '俊威測試高中', dsns: 'demo.h.kandy.huang' },
      { school_name: '內部高中開發_日校', dsns: 'dev.sh_d' },
    ];
  }

  selectGrade(gradeYear: string) {
    this.selectedGradeYear = gradeYear;
    this.selectedClass = {} as ClassRec;
    this.selectedStudent = {} as StudentRec;
    this.curClassList = this.classList.filter(v => v.GradeYear === gradeYear);
  }

  async selectClass(item: ClassRec) {
    this.selectedClass = item;
    this.selectedStudent = {} as StudentRec;
    if (!this.studentMap.has(item.ClassID)) {
      const resp = await this.dsaService.send('TransferStudent.GetStudentByClassID', { ClassID: item.ClassID });
      this.curStudentList = [].concat(resp.ClassStudent || []);
    } else {
      this.curStudentList = this.studentMap.get(item.ClassID);
    }
  }

  selectStudent(student: StudentRec) {
    this.selectedStudent = student;
  }

  selectSchool(school: SchoolRec) {
    this.selectedSchool = school;
  }

  async beginReg() {
    if (!this.selectedStudent.StudentId) {
      this.regStatus = { info: 'failed', msg: '請選擇學生' };
      return;
    }
    if (!this.selectedSchool.dsns) {
      this.regStatus = { info: 'failed', msg: '請選擇轉出校' };
      return;
    }
    if (!(this.selectedStudent.IdNumber && this.selectedStudent.Birthdate && this.selectedStudent.Account)) {
      this.regStatus = { info: 'failed', msg: '學生未設定「身分證號」及「生日」及「登入帳號」' };
      return;
    }

    if (this.isReging) return;

    try {
      this.isReging = true;
      this.regStatus = { info: '', msg: '' };
      const resp = await Promise.all([
        this.dsaService.send('TransferStudent.GetMyInfo'),
      ]);

      const myInfo: MyInfo = resp[0].MyInfo || {};
      const myDSNS = gadget.getApplication().accessPoint;
      const mySchoolName = this.schoolList.find(v => v.dsns === myDSNS);
      // TODO:
      // 1. 去它校申請轉入
      // 2. 在本校新增申請記錄
      // 3. 新增 log
      const body = {
        IdNumber: this.selectedStudent.IdNumber,
        Birthday: this.selectedStudent.Birthdate,
        DSNS: myDSNS,
        SchoolName: mySchoolName,
        ContractInfo: JSON.stringify(myInfo),
        AcceptToken: `${uuidv4().substring(0, 7)}@${this.selectedStudent.Account}`,
      };
      console.log(body);
      this.regStatus = { info: 'success', msg: '' };
    } catch (error) {
      console.log(error);
      this.regStatus = {
        info: 'failed',
        msg: '過程中發生錯誤'
      };
    } finally {
      this.isReging = false;
    }
  }
}

interface ClassRec {
  GradeYear: string;
  ClassID: string;
  ClassName: string;
}
interface StudentRec {
  Name: string;
  SeatNo: string;
  StudentId: string;
  Account: string;
  IdNumber: string;
  Birthdate: string;
}
interface MyInfo {
  TeacherName: string;
  Nickname: string;
  Account: string;
}
interface RegStatus {
  info: 'success' | 'failed' | '';
  msg: string;
}
interface SchoolRec {
  dsns: string;
  school_name: string;
}
import { Component, OnInit } from "@angular/core";
import { DsaTransferService } from "../../service/dsa-transfer.service";
import { v4 as uuidv4 } from 'uuid';
import { TransferStudentsService } from "../../service/transfer-students.service";

@Component({
  selector: "app-reg-transfer-in-modal",
  templateUrl: "./reg-transfer-in-modal.component.html",
  styleUrls: ["./reg-transfer-in-modal.component.css"]
})
export class RegTransferInModalComponent implements OnInit {

  isLoading = true;
  isReging = false;
  regResp: RegResponse = {} as RegResponse;
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
  mySchool: SchoolRec = {} as SchoolRec;
  myDSNS = '';

  constructor(
    private dsaService: DsaTransferService,
    private transferSrv: TransferStudentsService
  ) { }

  async ngOnInit() {
    this.myDSNS = gadget.getApplication().accessPoint;

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
    const resp = await this.dsaService.send('TransferStudent.GetStudentClass');
    const sourceClass = [].concat(resp.Class || []);

    for (const item of sourceClass) {
      item.GradeYear = item.GradeYear || '未分年級';
      item.ClassName = item.ClassName || '未分班級';
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
    // 去 1campusman，取得學校清單
    const rsp = await this.dsaService.accessPointSend({
      dsns: 'campusman.ischool.com.tw',
      contractName: 'counsel.public',
      securityTokenType: 'Public',
      serviceName: 'GetSchoolbyTag',
      body: `<TagName>${gadget.params.trans_tag_name}</TagName>`,
      rootNote: 'SchoolList'
    });
    const schools = [].concat(rsp || []);
    this.mySchool = schools.find(v => v.Dsns === this.myDSNS);
    this.schoolList = schools.filter((v: SchoolRec) => v.Dsns !== gadget.getApplication().accessPoint);
  }

  loadDefault() {
    this.isReging = false;
    this.regResp = {} as RegResponse;
    this.selectedGradeYear = '';
    this.selectedClass = {} as ClassRec;
    this.curClassList = [];
    this.selectedStudent = {} as StudentRec;
    this.curStudentList = [];
    this.selectedSchool = {} as SchoolRec;
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
      this.regResp = { info: 'failed', msg: '請選擇學生' };
      return;
    }
    if (!this.selectedSchool.Dsns) {
      this.regResp = { info: 'failed', msg: '請選擇轉出校' };
      return;
    }
    if (!(this.selectedStudent.IdNumber && this.selectedStudent.Birthdate)) {
      this.regResp = { info: 'failed', msg: '學生未設定「身分證號」及「生日」' };
      return;
    }

    if (this.isReging) return;

    try {
      this.isReging = true;
      this.regResp = { info: '', msg: '' };
      const resp = await this.dsaService.send('TransferStudent.GetMyInfo');
      const myInfo: MyInfo = resp.MyInfo || {};
      const acceptToken = `${uuidv4().substring(0, 7)}@${this.myDSNS}`;
      // 1. 去它校申請轉入
      // 2. 在本校新增申請記錄
      // 3. 新增 log
      const regBody = `<Request>
        <IdNumber>${this.selectedStudent.IdNumber}</IdNumber>
        <Birthdate>${this.selectedStudent.Birthdate}</Birthdate>
        <DSNS>${this.myDSNS}</DSNS>
        <SchoolName>${this.mySchool.Title}</SchoolName>
        <ConnectionInfo>${myInfo.TeacherName + (myInfo.Nickname ? '(' + myInfo.Nickname + ')' : '')}</ConnectionInfo>
        <TransferToken>${acceptToken}</TransferToken>
        <RedPointCode>轉出核可</RedPointCode>
      </Request>`;

      const regResult = await this.dsaService.accessPointSend({
        dsns: this.selectedSchool.Dsns,
        contractName: '1campus.counsel.transfer_public',
        securityTokenType: 'Public',
        serviceName: 'AddTransOutStudent',
        body: regBody,
        rootNote: 'Info'
      });

      if (regResult.TargetStudentCheck === 't' && regResult.TargetStatusCheck === 't') {
        try {
          await this.transferSrv.addLog('轉入申請', '向轉出校申請',
            `成功。StudentId：${this.selectedStudent.StudentId}`,
            regBody);
        } catch (error) {
          console.log(error);
        }

        const addBody = {
          StudentId: this.selectedStudent.StudentId,
          StudentName: this.selectedStudent.Name,
          DSNS: this.selectedSchool.Dsns,
          SchoolName: this.selectedSchool.Title,
          AcceptToken: acceptToken,
        };

        const addResult = await this.dsaService.send('TransferStudent.AddTransInStudent', addBody);
        if (addResult.Info === 'success') {
          try {
            await this.transferSrv.addLog('轉入申請', '本校新增',
              `成功。StudentId：${this.selectedStudent.StudentId}`,
              JSON.stringify(addBody));
          } catch (error) {
            console.log(error);
          }
          $('#regTransStudentModal').modal('hide');
        } else {
          try {
            await this.transferSrv.addLog('轉入申請', '本校新增',
              `失敗。StudentId：${this.selectedStudent.StudentId}`,
              JSON.stringify(addBody));
          } catch (error) {
            console.log(error);
          }
          this.regResp = {
            info: 'failed',
            msg: '新增移轉資料失敗'
          };
        }
      } else {
        try {
          await this.transferSrv.addLog('轉入申請', '向轉出校申請',
            `失敗。StudentId：${this.selectedStudent.StudentId}`,
            regBody);
        } catch (error) {
          console.log(error);
        }

        let errMsg = '';
        if (regResult.TargetStudentCheck !== 't') {
          errMsg = '學生資料不存在';
        }
        if (regResult.TargetStatusCheck !== 't') {
          errMsg = '狀態不正確';
        }

        this.regResp = {
          info: 'failed',
          msg: errMsg || '未知的錯誤',
        };
      }
    } catch (error) {
      console.log(error);
      this.regResp = {
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
  IdNumber: string;
  Birthdate: string;
}
interface MyInfo {
  TeacherName: string;
  Nickname: string;
  Account: string;
}
interface RegResponse {
  info: 'success' | 'failed' | '';
  msg: string;
}
interface SchoolRec {
  Dsns: string;
  Title: string;
}
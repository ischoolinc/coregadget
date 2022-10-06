import { Component, OnInit } from "@angular/core";
import { promise } from "protractor";
import { DsaService } from "src/app/dsa.service";

@Component({
  selector: "app-reg-transfer-in-modal",
  templateUrl: "./reg-transfer-in-modal.component.html",
  styleUrls: ["./reg-transfer-in-modal.component.css"]
})
export class RegTransferInModalComponent implements OnInit {

  isLoading = true;
  gradeYears: string[] = [];
  classList: ClassRec[] = [];
  studentMap: Map<string, StudentRec[]> = new Map();
  selectedGradeYear = '';
  selectedClass: ClassRec = {} as ClassRec;
  curClassList: ClassRec[] = [];
  selectedStudent: StudentRec = {} as StudentRec;
  curStudentList: StudentRec[] = [];
  today = new Date();
  myInfo: MyInfo = {} as MyInfo;

  constructor(
    private dsaService: DsaService,
  ) { }

  async ngOnInit() {
    try {
      await Promise.all([
        this.getMyInfo(),
        this.getClassList()
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  async getMyInfo() {
    const resp = await this.dsaService.send('TransferStudent.GetMyInfo');
    this.myInfo = resp.MyInfo || {};
    console.log(this.myInfo)
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

  cancel() {
    $("#newCase").modal("hide");
  }
}

interface ClassRec {
  GradeYear: string;
  ClassID: string;
  ClassName: string;
}

interface StudentRec {
  name: string;
  seat_no: string;
  student_id: string;
  id_number: string;
  birthday: string;
}

interface MyInfo {
  teacher_name: string;
  account: string;
}

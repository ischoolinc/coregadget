import { GadgetService } from './gadget.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  startTime: string; //加減分填寫開始時間
  endTime: string; //加減分填寫結束時間
  curClass: ClassRec; //目前所選班級

  currentSchoolYear:string ; //預設學年度
  currentSemester:string; //預設學期
  currSchoolYearName:string; //學年期名稱 

  isLoading: boolean; //載入中
  contract: any; //資料服務

  isBeforeTheDeadline: boolean;
  classList: ClassRec[] = [];
  studentList: StudentRec[];
  moralScoreList: MoralScoreRec[];
  curStudent: StudentRec;

  regExp = /^[0-9]?$|^100$|^0$/;

  modalRef: BsModalRef;

  @ViewChild('tplError', {static: false}) tplError: TemplateRef<any>;
  @ViewChild('tplEditForm', {static: false}) tplEditForm: TemplateRef<any>;
  @ViewChild('tplForbid', {static: false}) tplForbid: TemplateRef<any>;

  constructor(
    private gadget: GadgetService,
    private bsModalSrv: BsModalService
  ) {
  }

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.contract = await this.gadget.getContract('ischool.moralconduct');

      await this.getDeadline();
      await this.getDefSchoolyear();
      await this.getMyClass();
      await this.getClassStudent();
      await this.getMoralScore();


      this.currSchoolYearName = this.currentSchoolYear +"學年度 第" +this.currentSemester +"學期 班級德行加減分"
    } catch (error) {
      console.log(error);
    } finally{
      this.isLoading = false;
    }
  }

  async getDeadline() {
      try {
        const rsp = await this.contract.send('GetDeadline', {});

        if (rsp.Response.StartTime && rsp.Response.EndTime) {
          this.startTime = moment(rsp.Response.StartTime).format('YYYY/MM/DD HH:mm');
          this.endTime = moment(rsp.Response.EndTime).format('YYYY/MM/DD HH:mm');
          this.isBeforeTheDeadline = moment(Date.now()).isBefore(this.endTime);
        } else {
          this.startTime = '未設定開始時間！';
          this.endTime = '未設定結束時間！';
          this.isBeforeTheDeadline = false;
        }

      } catch (error) {
        alert(`Service GetDeadline: ${error}`)
      }
  }

  async getDefSchoolyear() {

      try {
        const rsp = await this.contract.send('GetDefSchoolYear', {});
          this.currentSchoolYear = rsp.Result.SystemConfig.DefaultSchoolYear;
          this.currentSemester = rsp.Result.SystemConfig.DefaultSemester;

      } catch (error) {
        alert(`Service GetDeadline: ${error}`)
      }
  }

  async getMyClass() {
    try {
      const rsp = await this.contract.send('GetMyClass', {});
      // 存取學年度學期
      this.classList = [].concat(rsp.Class || []);
      
      if (this.classList.length > 0) {
        this.curClass = this.classList[0];
      } else {
        this.curClass = {} as ClassRec;
      }

    } catch (error) {
      alert(`Service getMyClass: ${error}`);
    }
  }


  async getClassStudent() {
    if (!this.curClass.id)
    {
      return;
    } else {
      try {
        const rsp = await this.contract.send('GetClassStudent', 
        {
          Condition:{
            ClassID: this.curClass.id
          }
        });
        this.studentList = [].concat(rsp.Response.Student || [])
      } catch (error) {
        alert(`Service GetClassStudent: ${error}`);
      }
    }
  }

  async getMoralScore() {
    if (!this.curClass.id)
    {
      return;
    } else {
      try {
        const rsp = await this.contract.send('GetMoralAddScore', 
        {
          Request:{
          Condition:{
            SchoolYear: this.currentSchoolYear,
            Semester: this.currentSemester,
            ClassID: this.curClass.id
          }
        }});
        this.moralScoreList = [].concat(rsp.MoralScore.SbDiff || [])
        console.log("moralScore:",this.moralScoreList);

        this.studentList.forEach(student => {

          let nowMoral = this.moralScoreList.find(moralInfo => moralInfo.StudentID==student.StudentID);
          if(nowMoral)
          {
            student.SbDiff = nowMoral.SbDiff;
            student.Comment = nowMoral.Comment;
            student.OtherDiff = nowMoral.OtherDiff;
            student.TextScore = nowMoral.TextScore;
            student.InitialSummary = nowMoral.InitialSummary;
            student.Summary = nowMoral.Summary;
          }


        }); 
      

      } catch (error) {
        alert(`Service GetMoralAddScore: ${error}`);
      }
    }
  }

  setCurClass(tClass: ClassRec) {
    this.curClass = tClass;
    this.getClassStudent();
  }

  openEditForm(stu: StudentRec) {
    if (this.isBeforeTheDeadline) {
      this.curStudent = {...stu};
      this.modalRef = this.bsModalSrv.show(this.tplEditForm);  
    } else {
      this.modalRef = this.bsModalSrv.show(this.tplForbid);
    }
    
  }

  validateMs() {
      this.curStudent.validate_ms = this.regExp.test('' + this.curStudent.validate_ms);
  }

  async save() {
    if (this.curStudent) {
      this.isLoading = true;
      try {
        const body = {
          ref_student_id: this.curStudent.StudentID,
          school_year: this.currentSchoolYear,
          semester: this.currentSemester,

          //其他資料
          moral_score_id: this.curStudent.MoralScoreID,

          sb_diff:this.curStudent.SbDiff,
          other_diff: this.curStudent.OtherDiff,
          text_score: this.curStudent.TextScore,
          comment: this.curStudent.Comment,
          initial_summary: this.curStudent.InitialSummary,
          summary: this.curStudent.Summary,
        };
        const rsp = await this.contract.send('SetMoralAddScore', body)
        
        this.getClassStudent();
        this.modalRef.hide();

      } catch (error) {
        alert(`Service SetStudentScore: ${error}`);
      }
      this.isLoading = false;
    } else {
      alert(`資料有誤，請修正後再儲存資料。`);
      return;
    }
  }

  exportData(selector) {
    var downloadLink;
    var dataType = 'application/octet-stream';
    var tableSelect = document.querySelector(selector);
    var tableHTML = encodeURIComponent(`  <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'/><style> table, td {border:1px solid #dee2e6;  text-align: center;} table {border-collapse:collapse}</style>`+
    `導師加減分-${this.currentSchoolYear}學年度 第${this.currentSemester}學期 ${this.curClass.class_name}` +
    tableSelect.outerHTML
    +` <br> 教師簽名: `);
    
    // Specify file name
    var filename ='導師加減分'+'.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    
    if(navigator.msSaveOrOpenBlob){
      
        var blob = new Blob([tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
  }





}

interface ClassRec {
  id: string;
  class_name: string;
}

interface MoralScoreRec {
  StudentID: string;
  Name: string;
  SbDiff: string;

  OtherDiff: string;
  Comment: string;
  TextScore: string;
  InitialSummary: string;
  Summary: string;
}

interface StudentRec {
  ClassID: string;
  ClassName: string;
  StudentID: string;
  StudentName: string;
  StudentNumber: string;
  SeatNo: string;

  MoralScoreID: string;
  SbDiff: string;
  OtherDiff: string;
  Comment: string;
  TextScore: string;
  InitialSummary: string;
  Summary: string;

  // 資料驗證
  validate_ps: boolean;
  validate_ms: boolean;
}
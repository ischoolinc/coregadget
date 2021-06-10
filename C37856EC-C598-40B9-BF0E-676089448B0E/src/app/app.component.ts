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


  currentSchoolYear:string ;
  currentSemester:string;
  isLoading: boolean;
  contract: any;

  deadline: string;
  isBeforeTheDeadline: boolean;
  courseList: CourseRec[] = [];
  curCourse: CourseRec;
  studentList: StudentRec[];
  curStudent: StudentRec;

  regExp = /^[1-9][0-9]?$|^100$|^0$/;

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
      this.contract = await this.gadget.getContract('ischool.course.iep1');

      await this.getMyCourse();
      await this.getDeadline();
      await this.getCourseStudent();
    } catch (error) {
      console.log(error);
    } finally{
      this.isLoading = false;
    }
  }

  async getMyCourse() {
    try {
      const rsp = await this.contract.send('GetMyCourse', {});
      // 存取學年度學期
      this.currentSchoolYear =rsp.SchoolYear||'';
      this.currentSemester =rsp.Semester||'';
      this.courseList = [].concat(rsp.Courses || []);
      
      if (this.courseList.length > 0) {
        this.curCourse = this.courseList[0];
      } else {
        this.curCourse = {} as CourseRec;
      }

    } catch (error) {
      alert(`Service GetMyCourse: ${error}`);
    }
  }

  async getDeadline() {
    if (!this.curCourse.id) {
      return;
    } else {
      try {
        const rsp = await this.contract.send('GetDeadline', {CourseID: this.curCourse.id});

        if (rsp.Result.deadline) {
          this.deadline = moment(rsp.Result.deadline).format('YYYY/MM/DD HH:mm');
          this.isBeforeTheDeadline = moment(Date.now()).isBefore(this.deadline);
        } else {
          this.deadline = '此課程未設定成績輸入時間！';
          this.isBeforeTheDeadline = false;
        }

      } catch (error) {
        alert(`Service GetDeadline: ${error}`)
      }
    }
  }

  async getCourseStudent() {
    if (!this.curCourse.id)
    {
      return;
    } else {
      try {
        const rsp = await this.contract.send('GetCourseIEPStudent1', {CourseID: this.curCourse.id});
        this.studentList = [].concat(rsp.Students || []).map((data: StudentRec) => {
          data.validate_ps = true;
          data.validate_ms = true;
        // data.remark = data.remark;
         
          return data;
        });
      } catch (error) {
        alert(`Service GetCourseStudent: ${error}`);
      }
    }
  }

  setCurCourse(course: CourseRec) {
    this.curCourse = course;
    this.getCourseStudent();
    this.getDeadline();
  }

  openEditForm(stu: StudentRec) {
    if (this.isBeforeTheDeadline) {
      this.curStudent = {...stu};
      this.modalRef = this.bsModalSrv.show(this.tplEditForm);  
    } else {
      this.modalRef = this.bsModalSrv.show(this.tplForbid);
    }
    
  }

  validatePs() {
    if (this.curStudent.passing_standard) {
      this.curStudent.validate_ps = this.regExp.test('' + this.curStudent.passing_standard);
    } else {
      this.curStudent.validate_ps = true;
    }
  }

  validateMs() {
    if (this.curStudent.makeup_standard) {
      this.curStudent.validate_ms = this.regExp.test('' + this.curStudent.makeup_standard);
    } else {
      this.curStudent.validate_ms = true;
    }
  }

  async save() {
    if (this.curStudent.validate_ms && this.curStudent.validate_ps) {
      this.isLoading = true;
      try {
        const body = {
          CourseID: this.curCourse.id,
          StudentID: this.curStudent.id,
          PassingStandard: this.curStudent.passing_standard,
          MakeupStandard: this.curStudent.makeup_standard,
          Remark: this.curStudent.remark,
          DesignateFinalScore: this.curStudent.designate_final_score
        };
        const rsp = await this.contract.send('SetStudentStandard1', body)
        
        this.getCourseStudent();
        this.modalRef.hide();

      } catch (error) {
        alert(`Service SetStudentIEP: ${error}`);
      }
      this.isLoading = false;
    } else {
      alert(`IEP資料有誤，請修正後再儲存資料。`);
      return;
    }
  }

  exportData(selector) {
    var downloadLink;
    var dataType = 'application/octet-stream';
    var tableSelect = document.querySelector(selector);
    var tableHTML = encodeURIComponent(`  <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'/><style> table, td {border:1px solid #dee2e6;  text-align: center;} table {border-collapse:collapse}</style>`+
    `特殊生課程總成績-${this.currentSchoolYear}學年度 第${this.currentSemester}學期 ${this.curCourse.name}` +
    tableSelect.outerHTML
    +` <br> 教師簽名: `);
    
    // Specify file name
    var filename ='特殊生課程總成績'+'.xls';
    
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

interface CourseRec {
  id: string;
  name: string;
}

interface StudentRec {
  id: string;
  name: string;
  student_number: string;
  seat_no: string;
  passing_standard: number;
  makeup_standard: number;
  remark: string;
  designate_final_score: number;
  score: number;

  // 資料驗證
  validate_ps: boolean;
  validate_ms: boolean;
}
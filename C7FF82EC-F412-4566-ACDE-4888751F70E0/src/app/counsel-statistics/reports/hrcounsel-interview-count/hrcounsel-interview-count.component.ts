import { Component, OnInit } from '@angular/core';
import { CounselClass, GradeClassInfo } from '../../CounselStatistics-vo';
import { DsaService } from "../../../dsa.service";
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hrcounsel-interview-count',
  templateUrl: './hrcounsel-interview-count.component.html',
  styleUrls: ['./hrcounsel-interview-count.component.css']
})
export class HRCounselInterviewCountComponent implements OnInit {

  constructor(private dsaService: DsaService) { }

  selectSchoolYear: string = "";
  selectSemester: string = "";

  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await this.getCurrentSemester();
  }

  report() {
    if (this.selectSchoolYear !== "" && this.selectSemester !== "") {
      this.exportReport();
    } else {
      alert("學年度或學期沒有輸入！");
    }

  }

  // 取得系統內目前學年度學期
  async getCurrentSemester() {
    let resp = await this.dsaService.send("GetCurrentSemester", {
      Request: {
      }
    });

    let ss = [].concat(resp.CurrentSemester || []);
    if (ss.length > 0) {
      this.selectSchoolYear = ss[0].SchoolYear;
      this.selectSemester = ss[0].Semester;
    }
  }

  async exportReport() {
    try {
      let wsName: string = "各班導師晤談次數";
      let fileName: string = wsName + ".xlsx";
      let resp = await this.dsaService.send("GetHRCounselInterviewCount1", {
        Request: {
          SchoolYear: this.selectSchoolYear,
          Semester: this.selectSemester
        }
      });

      let data = [].concat(resp.HRCounselInterview || []);

      if (data.length > 0) {
        let data1: any[] = [];
        data.forEach(item => {
          let noCounselCount: number = 0;
          noCounselCount = item.StudentCount - item.InterviewStudentCount;
          let item1 = {
            '班級': item.ClassName,
            '導師': item.TeacherName,
            '班級人數': item.StudentCount,
            '導師訪談(次)': item.CounselInterviewCount,
            '訪談人數': item.InterviewStudentCount,
            '未訪談人數': noCounselCount
          };
          data1.push(item1);
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
        XLSX.utils.book_append_sheet(wb, ws, wsName);
        //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
        XLSX.writeFile(wb, fileName);
      } else {
        alert("沒有資料");
      }
    }
    catch (err) {
      alert(err.dsaError.message);
    }
  }


}

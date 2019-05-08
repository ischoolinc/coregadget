import { Component, OnInit, Optional } from '@angular/core';
import { AppComponent } from "../app.component";
import { DsaService } from "../dsa.service";
import { CaseMonthlyStatistics } from '../case/case-student';
import * as XLSX from 'xlsx';
import { concat } from 'rxjs';

@Component({
  selector: 'app-counsel-statistics',
  templateUrl: './counsel-statistics.component.html',
  styleUrls: ['./counsel-statistics.component.css']
})
export class CounselStatisticsComponent implements OnInit {

  reportNameList: [string];
  selectYear: number;
  selectMonth: number;
  constructor(
    @Optional()
    private appComponent: AppComponent, private dsaService: DsaService, ) { }

  ngOnInit() {
    let dt = new Date();
    this.selectYear = dt.getFullYear();
    this.selectMonth = dt.getMonth() + 1;
    if (this.appComponent) this.appComponent.currentComponent = "counsel_statistics";
    this.reportNameList = ["新北市國民中小輔導月個案"];

    //this.reportNameList.push("新北市國民中小輔導當月個案");
  }

  exportRepot(item) {
    if (item === '新北市國民中小輔導月個案') {
      this.GetCaseMonthlyStatistics();
    }
  }

  // 新北市國民中小輔導當月個案
  async GetCaseMonthlyStatistics() {

    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年新北市國民中小輔導" + this.selectMonth + "月個案";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    [].concat(resp.Statistics || []).forEach(rspRec => {
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.CaseNo = rspRec.CaseNo;
      rec.OccurDate = rspRec.OccurDate;
      rec.ProblemCategory = rspRec.ProblemCategory;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      // 判斷新或舊
      let selD1 = this.selectYear + "/" + this.selectMonth + "/1";
      let selDt = new Date(selD1);
      let recDt = new Date(rspRec.OccurDate);
      rec.Status = '舊';
      
      // 畫面上選擇月份新增算新
      if (recDt >= selDt)
      {
        rec.Status = '新';
      }
      
      rec.Count = parseInt(rspRec.Count);
      let ProblemCategory = JSON.parse(rspRec.ProblemCategory);
      ProblemCategory.forEach(proRec => {
        if (proRec.answer_checked) {
          rec.ProblemCategoryValue.push(this.parseProblemCategoryNoT(proRec.answer_value));
        }
      });

      data.push(rec);
    });

    if (data.length > 0) {
      let data1: any[] = [];
      data.forEach(da => {
        let item = {
          '教師編碼': da.TeacherName,
          '學生年級': da.GradeYear,
          '學生性別': da.StudentGender,
          '個案類別': da.ProblemCategoryValue.join(','),
          '新案舊案': da.Status,
          '晤談次數': da.Count,
        };
        data1.push(item);
      })

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      XLSX.utils.book_append_sheet(wb, ws, wsName);
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    } else {
      alert("沒有資料");
    }
  }

  // 名稱與代碼轉換(新北)
  parseProblemCategoryNoT(item: string) {
    let value: number = 0;
    switch (item) {
      case '人際困擾': value = 1; break;
      case '師生關係': value = 2; break;
      case '家庭困擾': value = 3; break;
      case '自我探索': value = 4; break;
      case '情緒困擾': value = 5; break;
      case '生活壓力': value = 6; break;
      case '創傷反應': value = 7; break;
      case '自我傷害': value = 8; break;
      case '性別議題': value = 9; break;
      case '高風險家庭': value = 10; break;
      case '兒少保議題': value = 11; break;
      case '學習困擾': value = 12; break;
      case '生涯輔導': value = 13; break;
      case '偏差行為': value = 14; break;
      case '網路成癮': value = 15; break;
      case '中離(輟)拒學': value = 16; break;
      case '藥物濫用': value = 17; break;
      case '心理疾病': value = 18; break;
      case '其他': value = 19; break;
    }
    return value;
  }
}


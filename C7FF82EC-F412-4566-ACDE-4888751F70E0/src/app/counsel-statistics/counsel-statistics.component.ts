import { Component, OnInit, Optional } from '@angular/core';
import { AppComponent } from "../app.component";
import { DsaService } from "../dsa.service";
import { CaseMonthlyStatistics, CaseMonthlyItemCount } from '../case/case-student';
import * as XLSX from 'xlsx';
import { concat } from 'rxjs';
import { _MatListItemMixinBase } from '@angular/material';
import { StudentQuizData } from '../psychological-test/PsychologicalTest-vo';
import * as moment from 'moment';
import { QuizInfoReport, ClassStudentCountReport } from './CounselStatistics-vo';

@Component({
  selector: 'app-counsel-statistics',
  templateUrl: './counsel-statistics.component.html',
  styleUrls: ['./counsel-statistics.component.css']
})
export class CounselStatisticsComponent implements OnInit {

  ImplementationDate_Begin: string;
  ImplementationDate_End: string;
  reportNameList: string[];
  selectYear: number;
  selectMonth: number;
  selectReportType: string = '輔導工作月統計';
  reportTypeList: string[] = [];
  QuizInfoReportList: QuizInfoReport[] = [];
  ClassStudentCountReportList: ClassStudentCountReport[] = [];
  isPsyButtonDisable: boolean = false;
  constructor(
    @Optional()
    private appComponent: AppComponent, private dsaService: DsaService, ) { }

  ngOnInit() {
    let dt = new Date();
    this.selectYear = dt.getFullYear();
    this.selectMonth = dt.getMonth() + 1;
    this.reportTypeList.push('輔導工作月統計');
    this.selectReportType = '輔導工作月統計';
    // this.reportTypeList.push('心理測驗結果分析');
    if (this.appComponent) this.appComponent.currentComponent = "counsel_statistics";
    this.reportNameList = [
      "輔導工作月統計報表-教育部版",
      "輔導工作月統計報表-新北市版",
      "輔導工作月統計報表-新竹國中版",
      "輔導工作月統計報表-新竹國小版"
    ];
    this.ImplementationDate_Begin = moment().format('YYYY-MM-DD');
    this.ImplementationDate_End = moment().format('YYYY-MM-DD');
    //this.reportNameList.push("新北市國民中小輔導當月個案");
  }

  exportRepot(item) {
    if (item === '輔導工作月統計報表-教育部版') {
      this.GetCaseMonthlyStatistics1();
    }

    if (item === '輔導工作月統計報表-新北市版') {
      this.GetCaseMonthlyStatistics2();
    }

    if (item === '輔導工作月統計報表-新竹國中版') {
      this.GetCaseMonthlyStatistics3();
    }

    if (item === '輔導工作月統計報表-新竹國小版') {
      this.GetCaseMonthlyStatistics4();
    }

  }

  // 輔導工作月統計報表-教育部版
  async GetCaseMonthlyStatistics1() {

    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-教育部版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics1", {
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
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      let ProblemCategory = JSON.parse(rspRec.ProblemCategory);
      ProblemCategory.forEach(proRec => {
        if (proRec.answer_checked) {
          rec.ProblemCategoryValue.push(this.parseProblemCategoryNoT1(proRec.answer_value));
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
          '晤談次數': da.Count        
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

  // 名稱與代碼轉換(教育部)
  parseProblemCategoryNoT1(item: string) {
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
      case '脆弱家庭': value = 10; break;
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

  // 輔導工作月統計報表-新北市版
  async GetCaseMonthlyStatistics2() {
    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-新北市版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];
    // 其他項目需要統計名稱
    let detailItemnNameList: string[] = [];
    detailItemnNameList.push('個案會議');
    detailItemnNameList.push('教師晤談');
    detailItemnNameList.push('家長晤談');
    detailItemnNameList.push('電訪');
    detailItemnNameList.push('家訪');
    detailItemnNameList.push('個別心理測驗');
    detailItemnNameList.push('通訊軟體');
    detailItemnNameList.push('資源聯繫');

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics2", {
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
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      let ProblemCategory = JSON.parse(rspRec.ProblemCategory);

      // 統計資料
      let detail = [].concat(rspRec.Detail || []);

      detail.forEach(item => {
        detailItemnNameList.forEach(itemName => {
          if (item.counsel_type.indexOf(itemName) > -1 || item.counsel_type_other.indexOf(itemName) > -1) {
            rec.AddOtherDetailCount(itemName);
          }
        });
      });

      ProblemCategory.forEach(proRec => {
        if (proRec.answer_checked) {
          // 檢查目前和教育部版相同，先用T1，不同再用分支
          rec.ProblemCategoryValue.push(this.parseProblemCategoryNoT1(proRec.answer_value));
        }
      });

      data.push(rec);
    });

    if (data.length > 0) {
      let data1: any[] = [];
      data.forEach(da => {
        da.OtherCount = da.SumOtherDetailCount();
        let item = {
          '教師編碼': da.TeacherName,
          '學生年級': da.GradeYear,
          '學生性別': da.StudentGender,
          '個案類別': da.ProblemCategoryValue.join(','),
          '新案舊案': da.Status,
          '晤談次數': da.Count,
          '其他服務次數': da.OtherCount,
          '個案會議': da.GetOtherDetailCount('個案會議'),
          '教師晤談': da.GetOtherDetailCount('教師晤談'),
          '家長晤談': da.GetOtherDetailCount('家長晤談'),
          '電訪': da.GetOtherDetailCount('電訪'),
          '家訪': da.GetOtherDetailCount('家訪'),
          '個別心理測驗': da.GetOtherDetailCount('個別心理測驗'),
          '通訊軟體': da.GetOtherDetailCount('通訊軟體'),
          '資源聯繫': da.GetOtherDetailCount('資源聯繫'),
          '對應新北市代號': ''
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

  // 輔導工作月統計報表-新竹國中版
  async GetCaseMonthlyStatistics3() {
    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-新竹國中版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics3", {
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
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      let ProblemCategory = JSON.parse(rspRec.ProblemCategory);
      ProblemCategory.forEach(proRec => {
        if (proRec.answer_checked) {
          // 檢查目前和教育部版相同，先用T1，不同再用分支          
          rec.ProblemCategoryValue.push(this.parseProblemCategoryNoT1(proRec.answer_value));
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
          '晤談次數': da.Count        
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

  // 輔導工作月統計報表-新竹國小版
  async GetCaseMonthlyStatistics4() {
    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-新竹國小版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics4", {
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
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      let ProblemCategory = JSON.parse(rspRec.ProblemCategory);
      ProblemCategory.forEach(proRec => {
        if (proRec.answer_checked) {
          // 檢查目前和教育部版相同，先用T1，不同再用分支
          rec.ProblemCategoryValue.push(this.parseProblemCategoryNoT1(proRec.answer_value));
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
          '晤談次數': da.Count         
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

  // 名稱與代碼轉換(新北市版)
  parseProblemCategoryNoT2(item: string) { }

  // 名稱與代碼轉換(新竹國中版)
  parseProblemCategoryNoT3(item: string) { }

  // 名稱與代碼轉換(新竹國小版)
  parseProblemCategoryNoT4(item: string) { }

  // 心測功能檢查值
  async psyCheckValue() {
    this.QuizInfoReportList = await this.loadQuziInfoReportByImplementationDate();
  }

  // 產生心理測驗報表
  async psyExportReport(item: QuizInfoReport) {
    this.isPsyButtonDisable = true;
    this.ReportCPMP_P(item);

  }

  async ReportCPMP_P(item: QuizInfoReport) {
    this.ClassStudentCountReportList = [];
    let respClass = await this.dsaService.send("GetClassStudetCountByQuizID", {
      Request: {
        QuizID: item.QuizID,
        ImplementationDate: item.ImplementationDateStr
      }
    });

    let dataClass = [].concat(respClass.ClassStudentCount || []);
    if (dataClass && dataClass.length > 0) {
      dataClass.forEach(classItem => {
        let csr: ClassStudentCountReport = new ClassStudentCountReport();
        csr.ClassID = classItem.class_id;
        csr.ClassName = classItem.class_name;
        csr.StudentCount = parseInt(classItem.student_count);
        csr.GradeYear = parseInt(classItem.grade_year);
        this.ClassStudentCountReportList.push(csr);
      });
    }

    // 讀取這次測驗資料用來分析
    let respStud = await this.dsaService.send("GetQuizStudentDataByQuizID", {
      Request: {
        QuizID: item.QuizID,
        ImplementationDate: item.ImplementationDateStr
      }
    });

    let dataStud = [].concat(respStud.QuizStudentData || []);
    if (dataStud && dataStud.length > 0) {
      dataStud.forEach(studItem => {
        this.ClassStudentCountReportList.forEach(classItem => {
          if (studItem.class_id === classItem.ClassID) {
            classItem.StudentDataSource.push(studItem);
          }
        });
      });
    }

    // 解析資料
    this.ClassStudentCountReportList.forEach(classItem => {
      classItem.CalcCPM_P();
    });


    if (this.ClassStudentCountReportList.length > 0) {
      // 產生報表
      let wsName: string = "CPMP_P結果分析";
      let fileName: string = wsName + ".xlsx";
      let rowIdx: number = 1;
      // 總人數
      let TotalStudeCount: number = 0;
      let data1: any[] = [];
      this.ClassStudentCountReportList.forEach(classItem => {
        let item = {
          '班級': classItem.ClassName,
          '年級': classItem.GradeYear,
          '學生人數': classItem.StudentCount,
          '智能優異(PR＞=95)_人數': classItem.ItemCountList[0].Count,
          '智能優異(PR＞=95)_百分比': classItem.ItemCountList[0].pst,
          '智能在平均數以上(PR >=90 且 PR＜95)_人數': classItem.ItemCountList[1].Count,
          '智能在平均數以上(PR >=90 且 PR＜95)_百分比': classItem.ItemCountList[1].pst,
          '智能在平均數以上(PR >=75 且 PR＜90)_人數': classItem.ItemCountList[2].Count,
          '智能在平均數以上(PR >=75 且 PR＜90)_百分比': classItem.ItemCountList[2].pst,
          '平均智能(PR >=25 且 PR＜75)_人數': classItem.ItemCountList[3].Count,
          '平均智能(PR >=25 且 PR＜75)_百分比': classItem.ItemCountList[3].pst,
          '智能在平均數以下(PR >=5 且 PR＜25)_人數': classItem.ItemCountList[4].Count,
          '智能在平均數以下(PR >=5 且 PR＜25)_百分比': classItem.ItemCountList[4].pst,
          '智能缺陷(PR＜5)_人數': classItem.ItemCountList[5].Count,
          '智能缺陷(PR＜5)_百分比': classItem.ItemCountList[5].pst,
        };
        TotalStudeCount += classItem.StudentCount;
        rowIdx++;
        data1.push(item);
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });

      //XLSX.utils.sheet_add_json(ws,[{A:1,B:2},{A:6,B:7,C:10}],{skipHeader: true,origin: "A40"});

      XLSX.utils.sheet_add_json(ws, [{ A: '總人數：', B: TotalStudeCount }], { skipHeader: true, origin: { r: (rowIdx + 1), c: 1 } });



      XLSX.utils.book_append_sheet(wb, ws, wsName);
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    }

    this.isPsyButtonDisable = false;

  }

  SetSelectReportType(name: string) {
    this.selectReportType = name;
  }

  // 透過實施開始結束取得測驗試別
  async loadQuziInfoReportByImplementationDate() {
    let resp = await this.dsaService.send("GetQuizNameByImplementationDate", {
      Request: {
        BeginDate: this.ImplementationDate_Begin,
        EndDate: this.ImplementationDate_End
      }
    });

    let value: QuizInfoReport[] = [];
    let data = [].concat(resp.QuizName || []);
    if (data && data.length > 0) {
      data.forEach(item => {
        let da: QuizInfoReport = new QuizInfoReport();
        da.QuizID = item.quiz_id;
        da.QuizName = item.quiz_name;
        da.ImplementationDate = moment(item.implementation_date);
        da.ImplementationDateStr = da.ImplementationDate.format('YYYY-MM-DD');
        da.UseMappingTable = false;
        if (item.use_mapping_table === 't')
          da.UseMappingTable = true;
        value.push(da);
      });
    }
    return value;
  }

}


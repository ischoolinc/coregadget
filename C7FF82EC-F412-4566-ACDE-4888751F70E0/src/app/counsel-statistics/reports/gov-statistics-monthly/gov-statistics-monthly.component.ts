import { Component, OnInit, Optional } from '@angular/core';
import { DsaService } from "../../../dsa.service";
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { AppComponent } from "../../../app.component";
import { CaseMonthlyStatistics, CaseMonthlyStatistics2 } from '../gov-statistics-monthly/gov-statistics-vo';
import { MapOperator } from 'rxjs/internal/operators/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-gov-statistics-monthly',
  templateUrl: './gov-statistics-monthly.component.html',
  styleUrls: ['./gov-statistics-monthly.component.css']
})
export class GovStatisticsMonthlyComponent implements OnInit {

  reportNameList: string[];
  selectYear: number;
  selectMonth: number;
  selectReportType: string = '輔導工作月統計';
  reportTypeList: string[] = [];
  buttonDisable: boolean = true;
  dsnsName: string = "";
  schoolType;

  constructor(@Optional()
  private appComponent: AppComponent, private dsaService: DsaService, private http: HttpClient) { }

  ngOnInit() {
    let scType: string;
    this.dsnsName = gadget.getApplication().accessPoint;

    let url = `https://dsns.ischool.com.tw/campusman.ischool.com.tw/config.public/GetSchoolList?body=%3CCondition%3E%3CDsns%3E${this.dsnsName}%3C/Dsns%3E%3C/Condition%3E&rsptype=json`;
    try {
      this.http.get<any>(url, { responseType: 'json' }).subscribe(response => {
        this.schoolType = response.Response.School.Type;

        // 年,月 初始化
        this.selectYear = new Date().getFullYear();
        this.selectMonth = new Date().getMonth() + 1;
        this.buttonDisable = false;
        this.reportNameList = [
          "輔導工作月統計報表-教育部版",
          "輔導工作月統計報表-新北市版",
          "輔導工作月統計報表-新竹國中版",
          "輔導工作月統計報表-新竹國小版"
        ];

      });
    } catch (err) {
      console.log(err);
    }
  }

  exportRepot(item) {

    // 檢查年,月
    var selYear = Number(this.selectYear);
    var selMonth = Number(this.selectMonth);
    var chkPass = false;

    if (selYear && selMonth) {
      if (selYear > 0 && (selMonth > 0 && selMonth < 13)) {
        chkPass = true;
      }
    }

    this.buttonDisable = true;
    if (chkPass) {
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
    } else {
      alert('西元年或月，輸入格式有問題。');
    }
  }

  // 年級轉換
  parseGradeYear(value: string) {
    if (this.schoolType) {
      if (this.schoolType === '高中') {
        if (value === '1')
          return '10';
        if (value === '2')
          return '11';
        if (value === '3')
          return '12';

      } else if (this.schoolType === '國中') {
        if (value === '1' || value === '7')
          return '7';
        if (value === '2' || value === '8')
          return '8';
        if (value === '3' || value === '9')
          return '9';
      } else {
        // 當國小處理，回傳原本年級
        return value;
      }

    } else {
      return value;
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
    let data2: CaseMonthlyStatistics2[] = [];

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics1_1", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics1_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    // 當月個案
    [].concat(resp.Statistics || []).forEach(rspRec => {
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.TeacherID = rspRec.TeacherID;
      rec.TeacherNickName = rspRec.TeacherNickName;
      rec.OccurDate = rspRec.OccurDate;
      rec.Category = rspRec.Category;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      rec.CLevel = rspRec.CLevel;
      if (rspRec.Category != "") {
        let Category = JSON.parse(rspRec.Category);
        Category.forEach(proRec => {
          if (proRec.answer_checked) {
            rec.CategoryValue.push(this.parseCategoryNoT1(proRec.answer_text));
          }
        });

      }

      data.push(rec);
    });


    let map = new Map<string, CaseMonthlyStatistics2>();


    // 相關服務
    [].concat(resp2.Statistics || []).forEach(rspRec => {
      // 輔導相關服務
      let key = rspRec.TeacherID + rspRec.OccurDate + rspRec.ContactItem + rspRec.ContactName;

      if (!map.has(key)) {
        let rec: CaseMonthlyStatistics2 = new CaseMonthlyStatistics2();
        rec.TeacherID = rspRec.TeacherID;
        rec.TeacherNickName = rspRec.TeacherNickName;
        rec.OccurDate = rspRec.OccurDate;
        rec.StudentID = rspRec.StudentID;
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ContactName = rspRec.ContactName;
        rec.CLevel = rspRec.CLevel;
        map.set(key, rec);
      }


      if (rspRec.StudentGender === '男') {
        if (map.has(key)) {
          let x = map.get(key);
          x.BoyCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }

      if (rspRec.StudentGender === '女') {
        if (map.has(key)) {
          let x = map.get(key);
          x.GirlCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }
    });

    map.forEach((values, keys) => {
      data2.push(values);
    });



    if (data.length > 0 || data2.length > 0) {
      let data1: any[] = [];
      let data2_d: any[] = [];
      data.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        let item = {
          '教師編碼': tno,
          '學生年級': this.parseGradeYear(da.GradeYear),
          '學生性別': da.StudentGender,
          '個案類別': da.CategoryValue.join(','),
          '新案舊案': da.Status,
          '晤談次數': da.Count,
          '其他服務次數': 0
        };
        data1.push(item);
      })

      data2.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        let item = {
          '教師編碼': tno,
          '服務項目': da.ContactItem,
          '對象': da.ContactName,
          '日期': da.OccurDate,
          '服務人次(男)': da.BoyCount,
          '服務人次(女)': da.GirlCount
        };
        data2_d.push(item);
      })
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      const ws2 = XLSX.utils.json_to_sheet(data2_d, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      XLSX.utils.book_append_sheet(wb, ws, "1.當月個案");
      XLSX.utils.book_append_sheet(wb, ws2, "2.相關服務");
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);


    } else {
      alert("沒有資料");
    }

    this.buttonDisable = false;
  }

  // 名稱與代碼轉換(教育部)
  parseCategoryNoT1(item: string) {
    let value: number = 19; // 預設其他
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

  // 輔導工作月統計報表-新北市版
  async GetCaseMonthlyStatistics2() {
    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-新北市版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];
    let data2: CaseMonthlyStatistics2[] = [];

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

    let resp = await this.dsaService.send("GetCaseMonthlyStatistics2_1", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics2_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    [].concat(resp.Statistics || []).forEach(rspRec => {
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.TeacherID = rspRec.TeacherID;
      rec.TeacherNickName = rspRec.TeacherNickName;
      rec.OccurDate = rspRec.OccurDate;
      rec.Category = rspRec.Category;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      if (rspRec.Category != "") {
        let Category = JSON.parse(rspRec.Category);
        Category.forEach(proRec => {
          if (proRec.answer_checked) {
            rec.CategoryValue.push(this.parseCategoryNoT1(proRec.answer_text));
          }
        });

      }

      // 統計資料
      let detail = [].concat(rspRec.Detail || []);

      detail.forEach(item => {
        detailItemnNameList.forEach(itemName => {
          if (item.counsel_type.indexOf(itemName) > -1 || item.counsel_type_other.indexOf(itemName) > -1) {
            rec.AddOtherDetailCount(itemName);
          }
        });
      });

      data.push(rec);
    });


    let map = new Map<string, CaseMonthlyStatistics2>();

    // 相關服務
    [].concat(resp2.Statistics || []).forEach(rspRec => {
      // 輔導相關服務
      let key = rspRec.TeacherID + rspRec.OccurDate + rspRec.ContactItem + rspRec.ContactName;

      if (!map.has(key)) {
        let rec: CaseMonthlyStatistics2 = new CaseMonthlyStatistics2();
        rec.TeacherID = rspRec.TeacherID;
        rec.TeacherNickName = rspRec.TeacherNickName;
        rec.OccurDate = rspRec.OccurDate;
        rec.StudentID = rspRec.StudentID;
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ContactName = rspRec.ContactName;
        rec.CLevel = rspRec.CLevel;
        map.set(key, rec);
      }


      if (rspRec.StudentGender === '男') {
        if (map.has(key)) {
          let x = map.get(key);
          x.BoyCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }

      if (rspRec.StudentGender === '女') {
        if (map.has(key)) {
          let x = map.get(key);
          x.GirlCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }
    });

    map.forEach((values, keys) => {
      data2.push(values);
    });


    if (data.length > 0 || data2.length > 0) {
      let data1: any[] = [];
      let data2_d: any[] = [];
      data.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        da.OtherCount = da.SumOtherDetailCount();
        let item = {
          '教師編碼': tno,
          '學生年級': this.parseGradeYear(da.GradeYear),
          '學生性別': da.StudentGender,
          '個案類別': da.CategoryValue.join(','),
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

      data2.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        let item = {
          '教師編碼': tno,
          '服務項目': da.ContactItem,
          '對象': da.ContactName,
          '日期': da.OccurDate,
          '服務人次(男)': da.BoyCount,
          '服務人次(女)': da.GirlCount
        };
        data2_d.push(item);
      })

      data2.forEach(da => {
        let tno = da.TeacherName; if (da.TeacherNickName
          != '') tno = da.TeacherName + "(" + da.TeacherNickName + ")"; let item =
          {
            '教師編碼': tno, '服務項目': da.ContactItem, '對象': da.ContactName, '日期':
              da.OccurDate, '服務人次(男)': da.BoyCount, '服務人次(女)': da.GirlCount
          };
        data2_d.push(item);
      })

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      const ws2 = XLSX.utils.json_to_sheet(data2_d, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      XLSX.utils.book_append_sheet(wb, ws, "1.當月個案");
      XLSX.utils.book_append_sheet(wb, ws2, "2.相關服務");
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    } else {
      alert("沒有資料");
    }
    this.buttonDisable = false;
  }

  // 輔導工作月統計報表-新竹國中版
  async GetCaseMonthlyStatistics3() {
    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-新竹國中版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];
    let data2: CaseMonthlyStatistics2[] = [];
    let resp = await this.dsaService.send("GetCaseMonthlyStatistics3_1", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics3_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    [].concat(resp.Statistics || []).forEach(rspRec => {
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.TeacherID = rspRec.TeacherID;
      rec.TeacherNickName = rspRec.TeacherNickName;
      rec.TeacherRole = rspRec.TeacherRole;
      rec.OccurDate = rspRec.OccurDate;
      rec.Category = rspRec.Category;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      if (rspRec.Category != "") {
        let Category = JSON.parse(rspRec.Category);
        Category.forEach(proRec => {
          if (proRec.answer_checked) {
            rec.CategoryValue.push(this.parseCategoryNoT1(proRec.answer_text));
          }
        });

      }

      data.push(rec);
    });

    let map = new Map<string, CaseMonthlyStatistics2>();

    // 相關服務
    [].concat(resp2.Statistics || []).forEach(rspRec => {
      // 輔導相關服務
      let key = rspRec.TeacherID + rspRec.OccurDate + rspRec.ContactItem + rspRec.ContactName;

      if (!map.has(key)) {
        let rec: CaseMonthlyStatistics2 = new CaseMonthlyStatistics2();
        rec.TeacherID = rspRec.TeacherID;
        rec.TeacherNickName = rspRec.TeacherNickName;
        rec.TeacherRole = rspRec.TeacherRole;
        rec.OccurDate = rspRec.OccurDate;
        rec.StudentID = rspRec.StudentID;
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ContactName = rspRec.ContactName;
        rec.CLevel = rspRec.CLevel;
        map.set(key, rec);
      }


      if (rspRec.StudentGender === '男') {
        if (map.has(key)) {
          let x = map.get(key);
          x.BoyCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }

      if (rspRec.StudentGender === '女') {
        if (map.has(key)) {
          let x = map.get(key);
          x.GirlCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }
    });

    map.forEach((values, keys) => {
      data2.push(values);
    });

    if (data.length > 0 || data2.length > 0) {
      let data1: any[] = [];
      let data2_d: any[] = [];
      data.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        let item = {
          '職司編碼': tno,
          '身份': da.TeacherRole,
          '學生年級':this.parseGradeYear(da.GradeYear),
          '學生性別': da.StudentGender,
          '個案類別': da.CategoryValue.join(','),
          '新案舊案': da.Status,
          '晤談次數': da.Count
        };
        data1.push(item);
      })

      data2.forEach(da => {
        let tno = da.TeacherName; if (da.TeacherNickName
          != '') tno = da.TeacherName + "(" + da.TeacherNickName + ")"; let item =
          {
            '職司編碼': tno, '身份': da.TeacherRole, '服務項目': da.ContactItem, '對象': da.ContactName, '日期':
              da.OccurDate, '服務人次(男)': da.BoyCount, '服務人次(女)': da.GirlCount
          };
        data2_d.push(item);
      })

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      const ws2 = XLSX.utils.json_to_sheet(data2_d, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      XLSX.utils.book_append_sheet(wb, ws, "1.當月個案");
      XLSX.utils.book_append_sheet(wb, ws2, "2.相關服務");
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    } else {
      alert("沒有資料");
    }
    this.buttonDisable = false;
  }

  // 輔導工作月統計報表-新竹國小版
  async GetCaseMonthlyStatistics4() {
    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-新竹國小版";
    let fileName: string = wsName + ".xlsx";
    let data: CaseMonthlyStatistics[] = [];
    let data2: CaseMonthlyStatistics2[] = [];
    let resp = await this.dsaService.send("GetCaseMonthlyStatistics4_1", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics4_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth
      }
    });

    [].concat(resp.Statistics || []).forEach(rspRec => {
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.TeacherID = rspRec.TeacherID;
      rec.TeacherNickName = rspRec.TeacherNickName;
      rec.TeacherRole = rspRec.TeacherRole;
      rec.OccurDate = rspRec.OccurDate;
      rec.Category = rspRec.Category;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      if (rspRec.Category != "") {
        let Category = JSON.parse(rspRec.Category);
        Category.forEach(proRec => {
          if (proRec.answer_checked) {
            rec.CategoryValue.push(this.parseCategoryNoT1(proRec.answer_text));
          }
        });

      }

      data.push(rec);
    });

    let map = new Map<string, CaseMonthlyStatistics2>();

    // 相關服務
    [].concat(resp2.Statistics || []).forEach(rspRec => {
      // 輔導相關服務
      let key = rspRec.TeacherID + rspRec.OccurDate + rspRec.ContactItem + rspRec.ContactName;

      if (!map.has(key)) {
        let rec: CaseMonthlyStatistics2 = new CaseMonthlyStatistics2();
        rec.TeacherID = rspRec.TeacherID;
        rec.TeacherNickName = rspRec.TeacherNickName;
        rec.TeacherRole = rspRec.TeacherRole;
        rec.OccurDate = rspRec.OccurDate;
        rec.StudentID = rspRec.StudentID;
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ContactName = rspRec.ContactName;
        rec.CLevel = rspRec.CLevel;
        map.set(key, rec);
      }


      if (rspRec.StudentGender === '男') {
        if (map.has(key)) {
          let x = map.get(key);
          x.BoyCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }

      if (rspRec.StudentGender === '女') {
        if (map.has(key)) {
          let x = map.get(key);
          x.GirlCount += parseInt(rspRec.Count);
          map.set(key, x);
        }
      }
    });

    map.forEach((values, keys) => {
      data2.push(values);
    });

    if (data.length > 0 || data2.length > 0) {
      let data1: any[] = [];
      let data2_d: any[] = [];
      data.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        let item = {
          '職司編碼': tno,
          '身份': da.TeacherRole,
          '學生年級': this.parseGradeYear(da.GradeYear),
          '學生性別': da.StudentGender,
          '個案類別': da.CategoryValue.join(','),
          '新案舊案': da.Status,
          '晤談次數': da.Count
        };
        data1.push(item);
      })

      data2.forEach(da => {
        let tno = da.TeacherName; if (da.TeacherNickName
          != '') tno = da.TeacherName + "(" + da.TeacherNickName + ")"; let item =
          {
            '職司編碼': tno, '身份': da.TeacherRole, '服務項目': da.ContactItem, '對象': da.ContactName, '日期':
              da.OccurDate, '服務人次(男)': da.BoyCount, '服務人次(女)': da.GirlCount
          };
        data2_d.push(item);
      })

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data1, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      const ws2 = XLSX.utils.json_to_sheet(data2_d, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });
      XLSX.utils.book_append_sheet(wb, ws, "1.當月個案");
      XLSX.utils.book_append_sheet(wb, ws2, "2.相關服務");
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    } else {
      alert("沒有資料");
    }
    this.buttonDisable = false;
  }

  // 名稱與代碼轉換(新北市版)
  parseProblemCategoryNoT2(item: string) { }

  // 名稱與代碼轉換(新竹國中版)
  parseProblemCategoryNoT3(item: string) { }

  // 名稱與代碼轉換(新竹國小版)
  parseProblemCategoryNoT4(item: string) { }



}

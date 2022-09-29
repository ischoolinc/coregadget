import { Component, ElementRef, OnInit, Optional, ViewChild } from '@angular/core';
import { DsaService } from "../../../dsa.service";
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { AppComponent } from "../../../app.component";
import { CaseMonthlyStatistics, CaseMonthlyStatistics2, TeacherCounselRole } from '../gov-statistics-monthly/gov-statistics-vo';
import { MapOperator } from 'rxjs/internal/operators/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { mapping } from './mapping';


@Component({
  selector: 'app-gov-statistics-monthly',
  templateUrl: './gov-statistics-monthly.component.html',
  styleUrls: ['./gov-statistics-monthly.component.css']
})
export class GovStatisticsMonthlyComponent implements OnInit {




  
  @ViewChild('sheet1') sheet1: ElementRef;
  @ViewChild('sheet2') sheet2: ElementRef;
  reportNameList: { reportName, description, isShowDescrip?}[];
  selectYear: number;
  selectMonth: number;
  selectReportType: string = '輔導工作月統計';
  reportTypeList: string[] = [];
  buttonDisable: boolean = true;
  dsnsName: string = "";
  schoolType;
  schoolName = '';
  maping  =new mapping();
  /**sheet 1 資料 */
  data = [];
  /**sheet 2 資料 */
  data2 = [];
  TeacherCounselRole: TeacherCounselRole[] = [];
  /** 範圍 */
  privateRangeList: {
    /**選單顯示用詞*/
    name,
    /**資料庫條件*/
    dbIsPrivate
  }[] =
    [{ name: "全部", dbIsPrivate: "true,false" },
    { name: "公開", dbIsPrivate: "false" },
    { name: "不公開", dbIsPrivate: "true" }]
  currentRange = this.privateRangeList[0]; // 預設為全部

  constructor(@Optional()
  private appComponent: AppComponent, private dsaService: DsaService, private http: HttpClient) { }


  /** */
  getJSON(obj: any) {
    return JSON.stringify(obj)
  }

  async ngOnInit() {
    console.log("以下皆非" , this.maping.StudentStatusMaps.get("以下皆非"))
   
    // console.log("mapping",mapping.StudentStatusMaps);
    // 取得教師編碼 
    await this.getTeacherConNumbr();
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
          { reportName: "輔導工作月統計報表-教育部版", description: "版本更新月份:2022-09", isShowDescrip: false },
          { reportName: "輔導工作月統計報表-新北市版", description: "" },
          { reportName: "輔導工作月統計報表-新竹國中版", description: "" },
          { reportName: "輔導工作月統計報表-新竹國小版", description: "" }
        ];
      });
    } catch (err) {
      console.log(err);
    }
  }

  async exportRepot(item) {

    //取得學校資訊 (學校名稱)
    await this.getSchoolInfo();
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

  /**切換公開不公開範圍 */
  setCurRange(item: any) {
    this.currentRange = item;
  }
  /**年級轉換*/
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

  /** 取得 教師編碼 */
  async getTeacherConNumbr() {
    try {
      let rsp = await this.dsaService.send("_.GetTeachersCounselRole", {})
      this.TeacherCounselRole = [].concat(rsp.TeacherCounselRole || []);
    } catch (ex) {
      alert("取得教師編碼發生錯誤! \n" + JSON.stringify(ex));
    }

  }

  /** 取得教師編碼 如果沒有設定一樣顯示 教師名稱 【Mapping 資料】*/
  getTeacherConNumberByTeacherID(teacherIDSor: CaseMonthlyStatistics) {

    if (this.TeacherCounselRole.find(x => x.TeacherID == teacherIDSor.TeacherID)) {
      const teacherConNumber = this.TeacherCounselRole.find(x => x.TeacherID == teacherIDSor.TeacherID).TeacherCounselNumber
      if (teacherConNumber) {
        // alert("有資料" +teacherIDSor.TeacherID+teacherIDSor.TeacherName +teacherConNumber)
        return this.TeacherCounselRole.find(x => x.TeacherID == teacherIDSor.TeacherID).TeacherCounselNumber

      } else {
        return `${teacherIDSor.TeacherName} (未設教師編碼)`
      }
    } else {
      return `${teacherIDSor.TeacherName} (已刪除)`;
    }
  }


  /**取得學校資訊 主要是取得學校名稱 */
  async getSchoolInfo() {
    let rsp = await this.dsaService.send("Statistics.GetSchoolInfo", {
      Request: {

      }
    });

    if (rsp.result) {
      this.schoolName = rsp.result.school_name;
    }
    console.log("schoolInfo", this.schoolName)

  }
  // 輔導工作月統計報表-教育部版
  async GetCaseMonthlyStatistics1() {

    // Service 取得資料邏輯：
    // 1. 未結案個案：是否結案=f  and 個案建立日期 <= 畫面上所選年月
    // 2. 該月結案:是否結案=t and 結案日期 = 畫面上所選年月
    let wsName: string = this.selectYear + "年輔導工作" + this.selectMonth + "月統計報表-教育部版";
    let fileName: string = wsName + ".xlsx";
    // let data: CaseMonthlyStatistics[] = [];
    // let data2: CaseMonthlyStatistics2[] = [];
    this.data = [];
    this.data2 = [];
    let resp = await this.dsaService.send("GetCaseMonthlyStatistics1_1", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate
      }
    });





    console.log("處理..", [].concat(resp.Statistics || []));

    // sheet1
    [].concat(resp.Statistics || []).forEach(rspRec => {

      console.log("看看有沒有抓到rspRec.CaseSource",rspRec);
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.TeacherReportRole = rspRec.TeacherReportRole; // 教師身分
      rec.TeacherID = rspRec.TeacherID;
      rec.TeacherNickName = rspRec.TeacherNickName;
      rec.OccurDate = rspRec.OccurDate;
      rec.Category = rspRec.SecondCategory;
      rec.CaseMainCategory = rspRec.CaseMainCategory;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.ReportReferal = rspRec.ReportedReferralStatus; //202209 增加轉借狀況
      rec.CaseNo = rspRec.CaseNo; // 20220907 需求增加
      rec.CaseSource = rspRec.CaseSource      // 202209增加個案來源 (複選)
      rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec),
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      rec.Status = rspRec.CaseStatus; //  新舊個案
      rec.Count = parseInt(rspRec.Count);
      rec.CLevel = rspRec.CLevel;


      // sheet1 副類別
      if (rspRec.SecondCategory) {
        let Category = JSON.parse(rspRec.SecondCategory);
        Category.forEach(proRec => {
          if(proRec.answer_text.includes('其他')){ // 如果有其他選項
            rec.CategoryOther = proRec.answer_value
          }

          if (proRec.answer_checked) {
            rec.CategoryValue.push(this.parseCategoryNoT1(proRec.answer_text));
          }
        });

      }

      // sheet1 處理主類別 以及其他項目
      if (rspRec.CaseMainCategory) {
        let CaseMainCatagory = JSON.parse(rspRec.CaseMainCategory);
        CaseMainCatagory.forEach(proRec => {
          if(proRec.answer_text.includes('其他')){ // 如果有其他選項
            rec.CaseMainCategoryOther = proRec.answer_value
          }
          if (proRec.answer_checked) {
            rec.MainCategoryValueList.push(this.parseCategoryNoT1(proRec.answer_text));
          }
        });

      }
      

      //sheet  學生身分
      if (rspRec.StudentStatus) {
        let StudentStatus = JSON.parse(rspRec.StudentStatus);
        
        StudentStatus.forEach(proRec => {
          if (proRec.answer_checked) {
            
            rec.StudentStatusList.push(this.maping.StudentStatusMaps.get(proRec.answer_text));
          }
        })
      }
      console.log("StudentStatusList") 

     // 處理個案來源

     if(rspRec.CaseSource){
      let CaseSource :string [] =  rspRec.CaseSource.split('___') ;
         CaseSource.forEach(item =>{
         if( rspRec.CaseStatus=="新"){

          console.log("mapping ",this.maping.CaseSourcesMapping)
           let mapNum = this.maping.CaseSourcesMapping.has(item) ? this.maping.CaseSourcesMapping.get(item) :item ;
           rec.CaseSourceList.push(mapNum);
         }

      });
      console.log("map List",   rec.CaseSourceList);

     }




      console.log("StudentStatus",rspRec.StudentStatus)
      //

      this.data.push(rec);
    });


    let map = new Map<string, CaseMonthlyStatistics2>();
    // 相關服務 【sheet2】
    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics1_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate
      }
    });

    [].concat(resp2.Statistics || []).forEach(rspRec => {
      // 輔導相關服務
      // let key = rspRec.TeacherID + rspRec.OccurDate + rspRec.ContactItem + rspRec.ContactName;


        let rec: CaseMonthlyStatistics2 = new CaseMonthlyStatistics2();
        rec.TeacherID = rspRec.ref_teacher_id;
        rec.TeacherNickName = rspRec.nickname;
        rec.TeacherCounselNumber = rspRec.teacher_counsel_number;
        rec.TeacherReportRole = rspRec.teacher_report_role; // 教師身分
        rec.TeacherName = rspRec.teacher_name;
        rec.ServiceTarget = rspRec.detail_service_target;
        rec.ServiceItemOtherDetail = rspRec.service_item_other_detail // 其他選項
        rec.ServiceItem = rspRec.service_item;
        rec.ContactName = rspRec.detail_service_target;
        rec.BoyCount = rspRec.male || 0;
        rec.GirlCount = rspRec.female || 0;
        // rec.CLevel = rspRec.CLevel;
  ;
        this.data2.push(rec);
 


      // if (rspRec.StudentGender === '男') {
      //   if (map.has(key)) {
      //     let x = map.get(key);
      //     x.BoyCount += parseInt(rspRec.Count);
      //     map.set(key, x);
      //   }
      // }

      // if (rspRec.StudentGender === '女') {
      //   if (map.has(key)) {
      //     let x = map.get(key);
      //     x.GirlCount += parseInt(rspRec.Count);
      //     map.set(key, x);
      //   }
      // }
    });

    // map.forEach((values, keys) => {
    //   this.data2.push(values);
    // });


    //sheet 1
    if (this.data.length > 0 || this.data2.length > 0) {
      let data1: any[] = [];
      let data2_d: any[] = [];
      this.data.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";


        // 教師編碼 
        // 身分
        // 學生代號 
        // 學生年級 
        // 學生性別 
        // 學生身分
        // 個案來源 
        // 輔導概況 
        // 轉介概況 
        // 個案類別(主) 
        // 個案類別(主) 其他說明 
        // 個案類別(副) 
        // 個案類別(副) 
        // 其他說明當月晤談累積次數 （人次)

       /** 個案類別(主) 其他說明 */
     
  

        let item = {
          '教師編碼': da.TeacherCounselNumber,
          '身分':  this.maping.ReportTeacherRole.get(da.TeacherReportRole), // 新欄位 
          '學生代號': da.CaseNo, // 新欄位(個案編號) 
          '學生年級': this.parseGradeYear(da.GradeYear),
          '學生性別': da.StudentGender,
          '學生身分': da.StudentStatusList.length>0 ?da.StudentStatusList.join(','):'', // 新欄位 
          '個案來源': da.CaseSourceList.join(','), // 新欄位 
          '輔導概況': da.Status, // 新案舊案 
          '轉介概況 ': da.ReportReferal, // 新欄位 
          '個案類別(主)': da.MainCategoryValueList.length> 0? da.MainCategoryValueList.join(','):'',
          '個案類別(主) 其他說明':da.CaseMainCategoryOther ,
          '個案類別(副)': da.CategoryValue.join(','),
          '個案類別(副) 其他說明':da.CategoryOther,
          // '新案舊案': da.Status, // 新規格暫時住借
          '晤談次數': da.Count
          // '其他服務次數': 0
        };
        data1.push(item);
      })
      // sheet2

      this.data2.forEach(da => {
        let tno = da.TeacherName;
        if (da.TeacherNickName != '')
          tno = da.TeacherName + "(" + da.TeacherNickName + ")";
        let item = {
          '教師編碼': da.TeacherCounselNumber,
          '身分': this.maping.ReportTeacherRole.get(da.TeacherReportRole),
          '服務項目': this.maping.ServiceItemsMapping.get(da.ServiceItem),
          '其他說明' :da.ServiceItemOtherDetail ||'',
          '對象': this.maping.ServiceTargetMaps.get(da.ServiceTarget),
          // '日期': da.OccurDate,
          '服務人次(男)': da.BoyCount,
          '服務人次(女)': da.GirlCount
        };
        data2_d.push(item);
      })
      // XLSX.writeFile
      const wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet([
        { A: `[${(this.selectYear - 1911)}-${this.selectMonth}] ${this.schoolName} 輔導教師工作成果(當月個案填報)` }
      ], { header: ["A", "B", "C", "D", "E", "F", "G"], skipHeader: true });

      // 合併儲存格
      ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 6, r: 0 } }];
      var wscols = [
        { hpx: 18 }
      ]; // 設定第一版 

      ws['!rows'] = wscols;
      // XLSX.utils.sheet_add_json (ws,data1,  { skipHeader: false,origin: {r:1,c:0}});// 寫入資料 從第二列開始
      // const ws2 = XLSX.utils.json_to_sheet(data2_d, { header: [], cellDates: true, dateNF: 'yyyy-mm-dd hh:mm:ss', });

      // sheet 1

      const ws1 = XLSX.utils.table_to_sheet(this.sheet1.nativeElement);
      // 增加資料 
      XLSX.utils.sheet_add_json(ws1, data1, { skipHeader: true, origin: { r: 5, c: 0 } });// 寫入資料 從第二列開始
      console.log("ws1", this.sheet1.nativeElement);
      // sheet 2 

      const ws2 = XLSX.utils.table_to_sheet(this.sheet2.nativeElement);

      XLSX.utils.sheet_add_json(ws2,data2_d, { skipHeader: true, origin: { r: 4, c: 0 } });// 寫入資料 從第二列開始
      // sheet 3
      const table = document.getElementById("sheet3");

      const ws3 = XLSX.utils.table_to_sheet(table);

      XLSX.utils.book_append_sheet(wb, ws1, "表A-1-輔導教師-1_當月個案");
      XLSX.utils.book_append_sheet(wb, ws2, "表A-2-輔導教師-2_相關服務");
      XLSX.utils.book_append_sheet(wb, ws3, "填報說明-A-輔導教師");
      //XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
      XLSX.writeFile(wb, fileName);
    } else {
      alert("沒有資料");
    }

    this.buttonDisable = false;
  }

  //測試產出
  export2() {
    alert("ssss")

  }


  /**名稱與代碼轉換(教育部)*/
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
      case '網路沉迷': value = 15; break;
      case '網路成癮': value = 15; break; // 舊用詞向下相容
      case '中離(輟)拒學': value = 16; break;
      case '藥物濫用': value = 17; break;
      case '精神疾患': value = 18; break;
      case '心理疾病': value = 18; break; // 舊用詞 向下相容
      case '其他': value = 19; break;
    }
    return value;
  }

  // 名稱與代碼轉換(教育部)
  parseCategoryNoT2(item: string) {
    let value: string = 'T19'; // 預設其他
    switch (item) {
      case '人際困擾': value = 'T01'; break;
      case '師生關係': value = 'T02'; break;
      case '家庭困擾': value = 'T03'; break;
      case '自我探索': value = 'T04'; break;
      case '情緒困擾': value = 'T05'; break;
      case '生活壓力': value = 'T06'; break;
      case '創傷反應': value = 'T07'; break;
      case '自我傷害': value = 'T08'; break;
      case '性別議題': value = 'T09'; break;
      case '高風險家庭': value = 'T10'; break;
      case '兒少保議題': value = 'T11'; break;
      case '學習困擾': value = 'T12'; break;
      case '生涯輔導': value = 'T13'; break;
      case '偏差行為': value = 'T14'; break;
      case '網路沉迷': value = 'T15'; break;
      case '中離(輟)拒學': value = 'T16'; break;
      case '藥物濫用': value = 'T17'; break;
      case '精神疾患': value = 'T18'; break;
      case '其他': value = 'T19'; break;
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
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate
      }
    });

    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics2_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate
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
      rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec);
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
        rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec);
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ServiceItem = rspRec.ServiceItem;
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
          '教師編碼': da.TeacherCounselNumber,
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
          '教師編碼': da.TeacherCounselNumber,
          '服務項目': da.ServiceItem,
          '對象': da.ContactItem,
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
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate

      }
    });

    let resp2 = await this.dsaService.send("GetCaseMonthlyStatistics3_2", {
      Request: {
        Year: this.selectYear,
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate
      }
    });

    [].concat(resp.Statistics || []).forEach(rspRec => {
      // 輔導當月個案
      let rec: CaseMonthlyStatistics = new CaseMonthlyStatistics();
      rec.TeacherID = rspRec.TeacherID;
      rec.TeacherNickName = rspRec.TeacherNickName;
      rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec);
      rec.TeacherRole = rspRec.TeacherRole;
      rec.OccurDate = rspRec.OccurDate;
      rec.Category = rspRec.Category;
      rec.StudentID = rspRec.StudentID;
      rec.TeacherName = rspRec.TeacherName;
      rec.GradeYear = rspRec.GradeYear;
      rec.StudentGender = rspRec.StudentGender;
      rec.Status = rspRec.CaseStatus;
      rec.Count = parseInt(rspRec.Count);
      // 處理數字對應 
      if (rspRec.Category != "") {
        let Category = JSON.parse(rspRec.Category);
        Category.forEach(proRec => {
          if (proRec.answer_checked) {

            rec.CategoryValue.push(this.parseCategoryNoT2(proRec.answer_text));
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
        rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec);
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ServiceItem = rspRec.ServiceItem;
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
          '職司編碼': da.TeacherCounselNumber,
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
            '職司編碼': da.TeacherCounselNumber, '身份': da.TeacherRole, '服務項目': da.ServiceItem, '對象': da.ContactItem, '日期':
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
        Month: this.selectMonth,
        IsPrivate: this.currentRange.dbIsPrivate
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
      rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec);
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
            rec.CategoryValue.push(this.parseCategoryNoT2(proRec.answer_text));
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
        rec.TeacherCounselNumber = this.getTeacherConNumberByTeacherID(rspRec);
        rec.TeacherRole = rspRec.TeacherRole;
        rec.OccurDate = rspRec.OccurDate;
        rec.StudentID = rspRec.StudentID;
        rec.TeacherName = rspRec.TeacherName;
        rec.ContactItem = rspRec.ContactItem;
        rec.ServiceItem = rspRec.ServiceItem;
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
          '職司編碼': da.TeacherCounselNumber,
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
            '職司編碼': da.TeacherCounselNumber, '身份': da.TeacherRole, '服務項目': da.ServiceItem, '對象': da.ContactItem, '日期':
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

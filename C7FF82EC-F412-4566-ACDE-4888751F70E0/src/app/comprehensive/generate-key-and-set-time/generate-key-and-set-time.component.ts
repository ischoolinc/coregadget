import { Component, OnInit } from '@angular/core';
import { DsaService } from "../../dsa.service";
import { FillInSectionInfo } from "./GenerateKeyAndSetTimeComponent-vo";
import { Alert } from 'selenium-webdriver';
import * as moment from 'moment';

@Component({
  selector: 'app-generate-key-and-set-time',
  templateUrl: './generate-key-and-set-time.component.html',
  styleUrls: ['./generate-key-and-set-time.component.css']
})
export class GenerateKeyAndSetTimeComponent implements OnInit {

  selectSchoolYear: string = "";
  selectSemester: string = "";
  isLoading: boolean = false;
  disableGenerateIDNumber: boolean = true;
  disableGenerateGUID: boolean = true;
  disableGenerateNull: boolean = true;
  disableSaveFillInSectionTime: boolean = true;
  selectSectionName = "請選擇 ..";
  selectFillInSection: FillInSectionInfo = new FillInSectionInfo();
  FillInSectionList: FillInSectionInfo[] = [];
  constructor(
    private dsaService: DsaService
  ) { }

  async ngOnInit() {

  }

  async loadData() {
    try {
      this.selectFillInSection = new FillInSectionInfo();
      this.selectSchoolYear = "";
      this.selectSemester = "";
      this.FillInSectionList = [];
      this.disableGenerateGUID = this.disableGenerateIDNumber = this.disableGenerateNull = this.disableSaveFillInSectionTime = true;
      this.selectSectionName = "請選擇 ..";
      let resp = await this.dsaService.send("GetCurrentFillInSections", {});

      let FillInSectionData = [].concat(resp.FillInSection || []);
      FillInSectionData.forEach(item => {
        let data: FillInSectionInfo = new FillInSectionInfo();
        data.FillInSectionID = item.FillInSectionID;
        data.SchoolYear = item.SchoolYear;
        if (moment(item.StartTime).isValid()) {
          data.StartTime = moment(item.StartTime, "YYYY/MM/DD hh:mm:ss").format('YYYY-MM-DDThh:mm:ss');
        }
        if (moment(item.EndTime).isValid()) {
          data.EndTime = moment(item.EndTime, "YYYY/MM/DD hh:mm:ss").format("YYYY-MM-DDThh:mm:ss");
        }
        data.IsPassTime = item.IsPassTime;
        data.Semester = item.Semester;
        data.SectionName = item.SectionName;
        data.Respondent = item.Respondent;
        this.FillInSectionList.push(data);
      });

      if (this.FillInSectionList.length > 0) {
        this.selectSchoolYear = this.FillInSectionList[0].SchoolYear;
        this.selectSemester = this.FillInSectionList[0].Semester;
      }

    } catch (err) {
      alert('無法取得綜合記錄表開放時間設定：' + err.dsaError.message);
    }
  }


  selectFillInSectionInfo(item: FillInSectionInfo) {
    this.selectSectionName = item.SectionName;
    this.selectFillInSection = item;
    if (this.selectFillInSection.FillInSectionID.length > 0)
      this.disableSaveFillInSectionTime = false;
    else
      this.disableSaveFillInSectionTime = true;

    if (this.selectFillInSection.IsPassTime === 't') {
      this.disableGenerateIDNumber = this.disableGenerateGUID = this.disableGenerateNull = true;
    }
    else {
      this.disableGenerateIDNumber = this.disableGenerateGUID = this.disableGenerateNull = false;
    }
  }

  // 身分證號
  async generateKeyByIDNumber() {
    try {
      this.disableGenerateIDNumber = true;
      await this.dsaService.send("GenerateFillInKeySSN", { FillInSectionID: this.selectFillInSection.FillInSectionID });
      window.location.reload();
    }
    catch (err) {
      alert(err.dsaError.message);
    }

  }

  // GUID
  async generateKeyByGUID() {
    try {
      this.disableGenerateGUID = true;
      await this.dsaService.send("GenerateFillInKeyGUID", { FillInSectionID: this.selectFillInSection.FillInSectionID });
      window.location.reload();
    }
    catch (err) {
      alert(err.dsaError.message);
    }
  }

  // 清空
  async generateKeyNull() {
    try {
      this.disableGenerateNull = true;
      await this.dsaService.send("GenerateFillInKeyNull", { FillInSectionID: this.selectFillInSection.FillInSectionID });
      window.location.reload();
    }
    catch (err) {
      alert(err.dsaError.message);
    }
  }

  // 儲存時間
  async saveFillInSectionTime() {
    // 檢查轉換資料
    let FillInSectionID: string = this.selectFillInSection.FillInSectionID;
    let StartTime: string = this.selectFillInSection.StartTime.replace('T', ' ');
    let EndTime: string = this.selectFillInSection.EndTime.replace('T', ' ');

    let chkDataPass: boolean = true;
    if (FillInSectionID.length === 0) {
      alert("沒有 FillInSectionID");
      chkDataPass = false;
    }

    if (!moment(StartTime).isValid() || !moment(EndTime).isValid()) {
      alert("開始或結束日期錯誤！");
      chkDataPass = false;
    }

    if (chkDataPass) {
      try {
        let resp = await this.dsaService.send("SetFillInSectionByID", {
          Request: {
            FillInSectionID: FillInSectionID,
            StartTime: StartTime,
            EndTime: EndTime
          }
        });

        let rspData = [].concat(resp || []);
        alert("儲存完成");
      } catch (err) {
        alert(err.dsaError.message);
      }
    }

  }
}

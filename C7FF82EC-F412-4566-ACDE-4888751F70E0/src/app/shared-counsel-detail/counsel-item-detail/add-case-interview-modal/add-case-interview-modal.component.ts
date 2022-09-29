import { Component, OnInit } from "@angular/core";
import { DsaService } from '../../../dsa.service';
import { CaseInterview, QOption } from '../case-interview-vo';

@Component({
  selector: "app-add-case-interview-modal",
  templateUrl: "./add-case-interview-modal.component.html",
  styleUrls: ["./add-case-interview-modal.component.css"]
})
export class AddCaseInterviewModalComponent implements OnInit {
  constructor(
    private dsaService: DsaService
  ) { }
  isCancel: boolean = true;
  fileContent: any
  _editMode: string = "add";
  editModeString: string = "新增";
  // _studentName: string;
  fileUpladed: { FileName, FileContent, TargetID };
  _CaseInterview: CaseInterview;
  ngOnInit() {
    this.isCancel = true;
    this._CaseInterview = new CaseInterview();
  }


  // 載入預設資料
  async loadDefaultData() {

    // 取得登入教師名稱
    let teacher = await this.dsaService.send("GetTeacher", {});
    [].concat(teacher.Teacher || []).forEach(tea => {
      this._CaseInterview.AuthorName = tea.Name;

    });
    // 
    // this._CaseInterview.checkValue();

  }

  // click 取消
  cancel() {
    this.isCancel = true;
    $("#addCaseInterview").modal("hide");
  }
  // click 儲存
  async save() {
    this.isCancel = false;
    try {
      this._CaseInterview.isSaveDisable = true;
      this._CaseInterview.Category = JSON.stringify(this._CaseInterview._category);
      await this.SetCaseInterview(this._CaseInterview);
      $("#addCaseInterview").modal("hide");
      this._CaseInterview.isSaveDisable = false;
    } catch (error) {
      alert(error);
      this._CaseInterview.isSaveDisable = false;
    }
  }

  checkChange(qq, item: CaseInterview) {
    // console.log(qq);

    if (qq.value == "") {
      item.isCategoryHasValue = false;
    } else {
      item.isCategoryHasValue = true;
    }
    item.checkValue();
  }

  // 新增/更新認輔資料，Service 使用UID是否有值判斷新增或更新
  async SetCaseInterview(data: CaseInterview) {

    if (!data.CounselTypeOther) {
      data.CounselTypeOther = "";
    }

    if (data.isPublic) {
      data.isPrivate = "false";
    } else {
      data.isPrivate = "true";
    }

    // 方式,對象 不是選其他，其他內容需要被清空
    if (data.CounselType !== "其他") {
      data.CounselTypeOther = '';
    }

    if (data.ContactName !== "其他") {
      data.ContactNameOther = '';
    }

    let req = {
      UID: data.UID,
      SchoolYear: data.SchoolYear,
      Semester: data.Semester,
      OccurDate: data.OccurDate,
      ContactName: data.ContactName,
      AuthorName: data.AuthorName,
      CounselType: data.CounselType,
      CounselTypeOther: data.CounselTypeOther,
      isPrivate: data.isPrivate,
      StudentID: data.StudentID,
      Attachment: "",
      Content: data.Content,
      CaseID: data.CaseID,
      AuthorRole: data.AuthorRole,
      Category: data.Category,
      ReferralStatus: data.TransferStatus,
      ContactNameOther: data.ContactNameOther
    };
    // console.log(req);

    let resp = await this.dsaService.send("SetCaseInterview", {
      Request: req
    });

    if (this.fileUpladed) {
      console.log('respsss', resp.result);
      this.fileUpladed.TargetID = resp.result.UID;
      let respfile = await this.dsaService.send("SetCaseInterviewFile", {
        Request: {
          FileInfo: this.fileUpladed
        }
      });
      console.log("檔案回來的值", respfile);
    }
  }

  /** 上傳資料 */
  async handleInputChange(event: any) {
    const file = event.target.files[0];

    this.readBase64(file)
      .then((data) => {
        this.fileContent = data;
        const fileStrig = btoa(data);
        console.log("fileBase64", fileStrig);
        const aa = atob(fileStrig)
        console.log("aa", aa)
      });
  }

  private readBase64(file): Promise<any> {
    const reader = new FileReader();
    const future = new Promise((resolve, reject) => {
      reader.addEventListener('load', function () {
        resolve(reader.result);
      }, false);
      reader.addEventListener('error', function (event) {
        reject(event);
      }, false);

      reader.readAsDataURL(file);
    });
    return future;
  }
}

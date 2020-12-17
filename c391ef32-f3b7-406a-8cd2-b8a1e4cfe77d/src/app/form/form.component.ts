import { Contract } from './../gadget.service';
import { Parser } from './../parser';
import { Component, ElementRef, OnInit} from '@angular/core';
import { ViewChild } from '@angular/core';
import { CodeInfo, CourseCodeInfo, FileInfo } from './model-subject';
import { GadgetService } from '../gadget.service';

interface MoeHistory {
  uid: string;
  md5Code: string;
  courseType: string;
  fileName: string;
  uploader: string;
  approvedDate: string;
  lastUpdate: string;
  content: string;
  classTypeContent: string;
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @ViewChild('dealCsv', {static: true}) dealCsv: ElementRef<HTMLInputElement>;

  private dealSubjectCsv: ElementRef;
  @ViewChild('dealSubjectCsv') set content(content: ElementRef<HTMLInputElement>) {
    if (content) { // initially setter gets called with undefined
        this.dealSubjectCsv = content;
    }
  }
  constructor(private gadget: GadgetService) {
  }
  /**
   * 儲存於資料庫的大表經運算後的結果 <key: FileInfo.MD5, value: FileInfo>
   */
  moeFileInfoHistory: Map<string, FileInfo> = new Map();
  /**
   * 儲存於資料庫的大表與此次上傳檔案運算後的結果(未儲存)
   */
  moeFileInfoTemp: Map<string, FileInfo> = new Map();
  /**
   * 紀錄上次運算後的大表 <key: OriCourseCode / CourseCode, value: CourseCodeInfo>
   */
  lastCourseMap: Map<string, CourseCodeInfo> = new Map();
  /**
   * 紀錄本次運算後的大表
   */
  currentCourseMap: Map<string, CourseCodeInfo> = new Map();
  /**
   * 本次欲上傳的檔案
   */
  uploadFileRecord: FileInfo;
  /**
   * 科目代碼檔案名稱
   */
  priFileName: string;
  /**
   * 班群代碼檔案名稱
   */
  secFileName: string;
  /**
   * 科目代碼檔案的內容
   */
  fileContent: string;
  /**
   * 班群代碼檔案的內容
   */
  classTypeContent: string;
  /**
   * 班群代碼map
   */
  classTypeMap = new Map();
  /**
   * 顯示大表的陣列
   */
  dataSource: CourseCodeInfo[];
  /**
   * 判斷是否為普通型高中
   */
  HCourseType = false;
  buttonIsLocked = false;
  isEmpty = false;
  parser = new Parser();
  contract: Contract;
  async ngOnInit(): Promise<void> {
    console.log(document.location.origin + document.location.pathname);
    this.contract = await this.gadget.getContract('campus.moe_coursecode.adminator');
    this.gadget.onLeave(() => {
      if (this.moeFileInfoTemp.size > 0) {
        return '您尚未儲存課程代碼，確認要離開此網頁嗎?';
      }
    });
    // window.addEventListener('beforeunload', (event) => {
    //   event.returnValue = '111';
    // });
  }
  saveFileToServer(): void {
    const courseCode = [];
    /**
     * 檔案欄位空的
     */
    if (!this.priFileName) {
      alert('檔案不得為空!');
    }
    /**
     * 上傳普通型高中，沒傳班群代碼表
     */
    else if ((this.HCourseType) && (!this.secFileName)) {
      if (confirm('普通型高中如有分群需要額外上傳檔案，確定執行本次上傳嗎?')) {
        this.saveSuccess();
        // this.redefineClassType(this.currentCourseMap);
        this.currentCourseMap.forEach((course) => {
          if (!course.isDelete) {
            courseCode.push(course);
          }
        });
        this.saveView(courseCode);
        alert('儲存成功');
        this.reset();
      }
    }
    else {
      this.saveSuccess();
      if ((this.HCourseType) && (this.secFileName)) {
        this.redefineClassType(this.currentCourseMap);
      }
      this.currentCourseMap.forEach((course) => {
        if (!course.isDelete) {
          courseCode.push(course);
        }
      });
      this.saveView(courseCode);
      alert('儲存成功');
      this.reset();
    }
  }
  async uploadFile(): Promise<void> {
    const fileName = this.dealCsv.nativeElement;
    const reader = new FileReader();
    // 觸發change事件後，清空暫存用table
    await this.downloadHistory();
    this.parser.cloneFileMapAtoB(this.moeFileInfoHistory, this.moeFileInfoTemp);
    // 運算上次的結果
    this.lastCourseMap = this.parser.sortFileInfo(this.moeFileInfoHistory);
    // 確認有資料後進行解析
    if (fileName.files[0]) {
      reader.addEventListener('load', (e) => {
        this.priFileName = fileName.value;
        this.fileContent = String(e.target.result);
        if (this.priFileName.match('.csv')) {
          // 將新增的檔案set至FileInfoTemp
          this.parseFile(this.priFileName, this.fileContent, this.moeFileInfoTemp, true);
          // 排序Map中的檔案，並顯示在畫面上
          this.sortFileInfo(this.moeFileInfoTemp);
        }
        else {
          this.buttonIsLocked = true;
          this.priFileName = undefined;
          alert('非正確檔案格式!');
        }
      });
      reader.readAsText(fileName.files[0], 'utf-8');
    }
    else {
      alert('請選擇檔案!');
      this.reset();
    }
  }

  uploadSubjectFile(): void {
    const fileName = this.dealSubjectCsv.nativeElement;
    const reader = new FileReader();
    if (fileName.files[0]) {
      reader.addEventListener('load', (e) => {
        this.secFileName = fileName.value;
        this.classTypeContent = String(e.target.result);
        if (this.secFileName.match('.csv')) {
          // 將新增的檔案set至FileInfoTemp
          this.parseSubjectFile(this.classTypeContent, this.uploadFileRecord.mapSubjectCodes);
          this.uploadFileRecord.classTypeContent = this.classTypeContent;
        }
        else {
          this.secFileName = undefined;
          alert('非正確檔案格式!');
        }
      });
      reader.readAsText(fileName.files[0], 'utf-8');
    }
    else {
      alert('請選擇檔案!');
    }
  }
  parseFile(
    fileName: string,
    fileContent: string,
    fileInfoMap: Map<string, FileInfo>,
    isCopy: boolean = false,
    classTypeContent: string = null
    ): void {
    // 解析Csv資料
    const courseInfo = this.parser.parseCsvData(fileContent);
    // 解析Csv檔名
    const fileInfo = FileInfo.newSelf(fileName, courseInfo);
    this.HCourseType = false;
    // 紀錄本次上傳的檔案
    if (isCopy) {
      this.uploadFileRecord = fileInfo;
      if (fileInfo.courseType === '普通型高中') {
        this.HCourseType = true; // 普通型高中需額外上傳班群代碼檔(只判斷本次上傳檔案)
      }
    }
    if (classTypeContent !== null) {
      this.parseSubjectFile(classTypeContent, fileInfo.mapSubjectCodes);
    }
    if (!fileInfoMap.has(fileInfo.md5Code)) {
      fileInfoMap.set(fileInfo.md5Code, fileInfo);
    }
    else {
      alert('重複的MD5碼，請確認檔案是否重複');
    }
  }
  parseSubjectFile(content: string, mapCourseInfo: Map<string, CourseCodeInfo>): void {
    const classTemp = content.split('\n');
    this.classTypeMap.clear();
    classTemp.forEach((value) => {
      const classInfo = value.split(',');
      const classKey = `${classInfo[0]}_${classInfo[1]}${classInfo[2]}${classInfo[3]}${classInfo[4]}`;
      this.classTypeMap.set(classKey, classInfo[5]);
    });
    this.redefineClassType(mapCourseInfo);
  }
  redefineClassType(courseInfo: Map<string, CourseCodeInfo>): void {
    const tempCourseInfo = new Map();
    courseInfo.forEach((value, key) => {
      let tempCourseCodeInfo: CourseCodeInfo;
      const tempClassKey = value.entryYear + '_' + value.courseCode.slice(9, 16);
      tempCourseCodeInfo = value.clone();
      if (this.classTypeMap.has(tempClassKey)) {
        tempCourseCodeInfo.classType = this.classTypeMap.get(tempClassKey);
      }
      tempCourseInfo.set(key, tempCourseCodeInfo);
    });
    this.parser.cloneCourseMapAtoB(tempCourseInfo, courseInfo);

  }
  sortFileInfo(fileInfo: Map<string, FileInfo>): void {
    const lastCourseMap = this.lastCourseMap;
    this.currentCourseMap = this.parser.sortFileInfo(fileInfo);
    // 丟前後2次的Map做比較
    this.isEmpty = false;
    this.dataSource = this.parser.showTable(this.currentCourseMap, lastCourseMap);
    if (this.dataSource.length === 0) {
      this.buttonIsLocked = true;
      this.isEmpty = true;
    }
    else {
      this.buttonIsLocked = false;
    }
  }

  async downloadHistory(): Promise<void> {
    const rsp = await this.contract.send('_.GetMOEHistories', {});
    const result = [].concat(rsp.result as MoeHistory[] || []);
    this.moeFileInfoHistory.clear();
    // 解析資料庫每一份檔案
    result.forEach((value) => {
      this.parseFile(value.fileName, value.content, this.moeFileInfoHistory, false, value.classTypeContent);
    });
  }

  // TODO:儲存上傳檔案到資料庫
  async saveSuccess(): Promise<void> {
    await this.contract.send('_.InsertMOEUploadHistory',
      {Request:
        { UploadHistory:
          {
            Md5Code: this.uploadFileRecord.md5Code,
            CourseType: this.uploadFileRecord.courseType,
            FileName: this.uploadFileRecord.fileName,
            Uploader: this.uploadFileRecord.uploader,
            ApprovedDate: this.uploadFileRecord.approvedDate,
            Content: this.fileContent,
            ClassTypeContent: this.uploadFileRecord.classTypeContent
          }
        }
      });
  }
  // TODO:儲存最後運算完的表格
  async saveView(courseCode: CourseCodeInfo[]): Promise<void> {
    const  courses: CodeInfo[]  = [];
    courseCode.forEach((codeInfo) => {
      courses.push({
        GroupCode: codeInfo.groupCode,
        CourseCode: codeInfo.courseCode,
        SubjectName: codeInfo.subjectName,
        CreditPeriod: codeInfo.creditPeriod,
        Md5Code: codeInfo.historyMD5Code,
        EntryYear: codeInfo.entryYear,
        RequireBy: codeInfo.requireBy,
        IsRequired: codeInfo.isRequired,
        CourseType: codeInfo.courseType,
        GroupType: codeInfo.groupType,
        SubjectType: codeInfo.subjectType,
        ClassType: codeInfo.classType
      });
    });
    const contract = await this.gadget.getContract('campus.moe_coursecode.adminator');
    await contract.send('_.InsertSubjectCode',
      {
        Request: {
          CodeInfo: courses
        }
      });
  }

  mappingClassCodeInfo(): void {
    const classInfo = this.uploadFileRecord.classTypeContent.split('\n');
    classInfo.forEach((value) => {
      const classData = value.split(',');

    });
    // console.log('classInfo[5]', classInfo[5]);
    this.currentCourseMap.forEach((courseInfo) => {
      // courseInfo.classType = ;
    });
  }
  cssSwitch(rowData: CourseCodeInfo): string {
    return rowData.action ;
  }
  reset(): void {
    this.moeFileInfoHistory.clear();
    this.moeFileInfoTemp.clear();
    this.priFileName = undefined;
    this.fileContent = undefined;
    this.secFileName = undefined;
    this.uploadFileRecord = undefined;
    this.dataSource = [];
  }
}

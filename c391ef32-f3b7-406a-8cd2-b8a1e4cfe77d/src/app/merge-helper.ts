import { CourseCodeInfo, FileInfo } from './form/model-subject';

export class MergeHelper {
  constructor() {}
   /**
    * 歷程產生的大表
    */
  tempCourseTable: Map<string, CourseCodeInfo> = new Map();
  /**
   *  每一份FileIno的暫存
   */
  tempCourseMap: Map<string, CourseCodeInfo> = new Map();

  /**
   *
   * @param fileInfo 要加入合併的檔案
   */
  mergeFile(fileInfo: FileInfo): void {

    this.tempCourseMap.clear();
    // 複製到暫存區
    fileInfo.mapSubjectCodes.forEach((value, key) => {
      value.clearActionHistory(); // 每次判斷前先清空歷史資料
      this.tempCourseMap.set(key, value.clone());
    });
    // 將原本大表中刪除的物件做移除
    this.tempCourseTable.forEach((value) => {
      if (value.isDelete) {
        this.tempCourseTable.delete(value.key);
      }
    });
    // 使用暫存區資料搬移到大表中
    this.tempCourseMap.forEach((newCourseValue) => {
      // 有沒有相對應大表的key值
      if (this.tempCourseTable.has(newCourseValue.key)) {
        if ((newCourseValue.action === '新增或不變')) {
          newCourseValue.action = '不變';
          this.tempCourseTable.set(newCourseValue.key, newCourseValue) ;
        }
        else if (newCourseValue.action === '修改') {
          newCourseValue.setActionHistory(this.tempCourseTable.get(newCourseValue.key));
          this.tempCourseTable.delete(newCourseValue.key);
          newCourseValue.key = newCourseValue.courseCode;
          newCourseValue.addHistoryRecord(fileInfo.md5Code, String(fileInfo.approvedDate), newCourseValue);
          this.tempCourseTable.set(newCourseValue.key, newCourseValue) ;

        }
        else if (newCourseValue.action === '刪除') {
          newCourseValue.isDelete = true;
          this.tempCourseTable.delete(newCourseValue.key);
          newCourseValue.addHistoryRecord(fileInfo.md5Code, String(fileInfo.approvedDate), newCourseValue);
          this.tempCourseTable.set(newCourseValue.key, newCourseValue);
        }
      }
      // 沒有相對應大表的key值
      else {
        if (newCourseValue.action === '新增或不變') {
          newCourseValue.action = '新增';
          newCourseValue.addHistoryRecord(fileInfo.md5Code, String(fileInfo.approvedDate), newCourseValue);
          this.tempCourseTable.set(newCourseValue.key, newCourseValue);
        }
        else if (newCourseValue.action === '修改') {
          newCourseValue.addHistoryRecord(fileInfo.md5Code, String(fileInfo.approvedDate), newCourseValue);
          newCourseValue.key = newCourseValue.courseCode;
          this.tempCourseTable.set(newCourseValue.key, newCourseValue);
        }
        else if (newCourseValue.action === '刪除') {
          newCourseValue.isDelete = true;
          newCourseValue.addHistoryRecord(fileInfo.md5Code, String(fileInfo.approvedDate), newCourseValue);
          this.tempCourseTable.set(newCourseValue.key, newCourseValue);
        }
      }

    });
  }
  /**
   * 取得歷程加匯入檔的大表
   */
  getFinalCourseCodes(): Map<string, CourseCodeInfo> {

    return this.tempCourseTable;
  }
}

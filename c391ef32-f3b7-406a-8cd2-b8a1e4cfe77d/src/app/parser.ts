import { CourseCodeInfo, FileInfo } from './form/model-subject';
import { MergeHelper } from './merge-helper';

export class Parser {
  /**
   *
   * @param data 解析csv中的資料
   */
  parseCsvData(data: string): CourseCodeInfo[] {
    const rowCourseCode: Array<string> = data.split('\n');
    const totalCourseInfo: CourseCodeInfo[] = [];
    rowCourseCode.forEach((rowData) => {
      const courseCodeInfo = CourseCodeInfo.newSelf(rowData);
      if (courseCodeInfo.key !== null) {
        totalCourseInfo.push(courseCodeInfo);
      }
    });
    return totalCourseInfo;
  }
  /**
   * 將資料庫中檔案和本次上傳檔案做排序(未儲存)
   */
  sortFileInfo(fileMap: Map<string, FileInfo>): Map<string, CourseCodeInfo> {
    /**
     * 排序完的大表
     */
    let courseCodeTable: Map<string, CourseCodeInfo>;
    const fileMapList = [...fileMap];

    // 根據檔案日期做排序
    fileMapList.sort((a, b) => {
      return (a[1].approvedDate - b[1].approvedDate);
    });
    const mergeHelper: MergeHelper =  new MergeHelper();
    fileMapList.forEach((newFileCode) => {
      mergeHelper.mergeFile(newFileCode[1]);
    });
    courseCodeTable = mergeHelper.getFinalCourseCodes();
    return courseCodeTable;
  }
  showTable(currentMap: Map<string, CourseCodeInfo>, lastMap: Map<string, CourseCodeInfo>): CourseCodeInfo[] {
    const courseTable = [];
    // 使用2邊的Map交互檢查
    lastMap.forEach((courseCode, key) => {
      if ((!currentMap.has(key)) && (courseCode.action !== '刪除')) {
          let hasKey = false;
          currentMap.forEach((value) => {
            if (value.oriCourseCode === key) {
              hasKey = true;
            }
          });
          if (!hasKey) {
            courseCode.action = '刪除';
            // 新舊對照找不到資料，歸為刪除
            courseTable.push(courseCode);
          }
      }
    });
    currentMap.forEach((courseCode, key) => {
      if (!lastMap.has(key)) {
        courseTable.push(courseCode);
      }
      else if (courseCode.action === '修改') {
        // 判斷前後的修改內容是否相同
        if (!courseCode.isTheSame(courseCode, lastMap.get(key))) {
          courseTable.push(courseCode);
        }
      }
      else if (courseCode.action === '刪除') {
        if (!courseCode.isTheSame(courseCode, lastMap.get(key))) {
          courseTable.push(courseCode);
        }
      }
    });
    return courseTable;
  }
  cloneFileMapAtoB(A: Map<string, FileInfo>, B: Map<string, FileInfo>): void {
    B.clear();
    A.forEach((value, key) => {
      B.set(key, value.clone());
    });
  }
  cloneCourseMapAtoB(A: Map<string, CourseCodeInfo>, B: Map<string, CourseCodeInfo>): void {
    B.clear();
    A.forEach((value, key) => {
      B.set(key, value.clone());
    });
  }

}

import { config, courseTypeConfig, groupTypeConfig, subjectTypeConfig, classTypeConfig } from '../../config.json';

export class CourseCodeInfo {
  mapRequireConfig: Map<string, RequireMappingConfig> = new Map();
  mapCourseTypeConfig: Map<string, CourseTypeConfig> = new Map();
  mapGroupTypeConfig: Map<string, GroupTypeConfig> = new Map();
  mapSubjectTypeConfig: Map<string, SubjectTypeConfig> = new Map();
  mapClassTypeConfig: Map<string, ClassTypeConfig> = new Map();
  private constructor() {}
  key: string;
  courseCode: string;           // 課程代碼(共23碼)
  subjectName: string;         // 科目名稱
  creditPeriod: string;        // 學期學分(共6碼)
  oriCourseCode: string;        // 原始課程代碼(共23碼)
  oriSubjectName: string;      // 原始科目名稱


  groupCode: string;          // 課程代碼(前16碼)
  entryYear: string;
  courseType: string;
  groupType: string;
  subjectType: string;
  classType: string;
  uid: string;
  refUploadHistoryId: string;
  historyMD5Code: string;
  uploader: string;
  lastUpdate: string;
  requireBy: string;
  isRequired: string;
  action: '修改' | '刪除' | '新增' | '不變'| '新增或不變';
  actionHistories: ActionHistory[] ;
  isDelete: boolean;

  public static newSelf(data: string): CourseCodeInfo {

    const t = new CourseCodeInfo();
    t.actionHistories = [];
    /**
     * 課程代碼(16) / 校部定必選修(1) / 開課方式(1) / 科目屬性(1) / 領域名稱(1) / 科目名稱代碼(2)
     */
    const contentRegex = '(.{16})(.{1})(.{1})(.{1})(.{2})(.{2})';
    /**
     * 入學年度(3) /	校代碼(6)	/ 課程類型(1)	/ 群別代碼(2)	/ 科別代碼(3)	/ 班群代碼(1)
     */
    const courseCodeRegex = '(.{3})(.{6})(.{1})(.{2})(.{3})(.{1})';
    const eachCourse = data.split(',');
    // 使用舊制格式 4,5欄沒使用逗號隔開
    while (eachCourse.length < 5) {
      eachCourse.push('');
    }
    // 校部定代碼轉換
    config.forEach((value) => {
        t.mapRequireConfig.set(value.code, value);
    });
    // 課程類別轉換
    courseTypeConfig.forEach((courseType) => {
        t.mapCourseTypeConfig.set(courseType.code, courseType);
    });
    // 群別轉換
    groupTypeConfig.forEach((groupType) => {
      const types: string[] = (groupType.adaptType.substring(1, groupType.adaptType.length - 1 )).split('|');
      types.forEach(type => {
        const key = groupType.code + '_' + type ;
        if (!t.mapGroupTypeConfig.has(key))
        {
          t.mapGroupTypeConfig.set(key, groupType);
        }
      });
    });
    // 科別轉換
    subjectTypeConfig.forEach((subjectType) => {
        t.mapSubjectTypeConfig.set(subjectType.code, subjectType);
    });
    // 班別轉換
    classTypeConfig.forEach((classType) => {
        t.mapClassTypeConfig.set(classType.code, classType);
    });
    t.courseCode = eachCourse[0].trim();
    t.subjectName = eachCourse[1].trim();
    t.creditPeriod = eachCourse[2].trim();
    t.oriCourseCode = eachCourse[3].trim();
    t.oriSubjectName = eachCourse[4].trim();
    t.uploader = 'bubu@debug.ischool.com.tw';
    t.key = null;
    if (t.oriCourseCode !== '') {
      if (t.oriSubjectName !== '') {
        t.key = t.oriCourseCode;
      }
      if (t.courseCode !== '') {
        t.action = '修改';
      }
      else {
        t.action = '刪除';
      }
    }
    else if (t.oriCourseCode === '') {
      t.action = '新增或不變';
      if (t.oriSubjectName === '') {
        t.key = t.courseCode;
      }
    }

    if (t.action !== '刪除') {
      const tempCourseCode23 = (t.courseCode.match(contentRegex));
      const tempCourseCode16 = (t.courseCode.match(courseCodeRegex));
      // 入學年度
      t.entryYear = tempCourseCode16[1];
      // 課程類型
      t.courseType = t.mapCourseTypeConfig.get(tempCourseCode16[3]).description;
      // 群別類型
      t.groupType = t.mapGroupTypeConfig.get(tempCourseCode16[4] + '_' + tempCourseCode16[3]).description;
      // 科別類型
      t.subjectType = t.mapSubjectTypeConfig.get(tempCourseCode16[5]).description;
      // 科別類型
      if (t.mapClassTypeConfig.has(tempCourseCode16[6])) {
        t.classType = t.mapClassTypeConfig.get(tempCourseCode16[6]).description;
      }
      // 課程代碼(前16碼)
      t.groupCode = tempCourseCode23[1];
      if (tempCourseCode23[2].match('[0-9|A-F]')) {
        // 課程類別(校部定)
        t.requireBy = t.mapRequireConfig.get(tempCourseCode23[2]).requiredBy;
        // 課程類別(必選修)
        t.isRequired = t.mapRequireConfig.get(tempCourseCode23[2]).isRequire;
      }
      else {
        // 課程類別(校部定)
        t.requireBy = t.mapRequireConfig.get(null).requiredBy;
        // 課程類別(必選修)
        t.isRequired = t.mapRequireConfig.get(null).isRequire;
      }
    }
    return t;
  }
  /**
   * CourseCodeInfo deep copy
   */
  clone(): CourseCodeInfo {
    const a = [];
    this.actionHistories.forEach((value) => {
      a.push(Object.assign(new ActionHistory(), value));
    });
    const result = Object.assign(new CourseCodeInfo(), this);
    result.actionHistories = a;

    return result;
  }
   // 加入異動紀錄

  addHistoryRecord(md5: string , date: string, courseCodeInfo: CourseCodeInfo): void {
    const actionHistory: ActionHistory  = ActionHistory.newSelf(md5, date, courseCodeInfo);
    this.actionHistories.push(actionHistory);
  }

  setActionHistory(courseCodeInfo: CourseCodeInfo): void {
    // courseCodeInfo.actionHistory = this.actionHistory;
    this.actionHistories = [...courseCodeInfo.actionHistories] ;
    // this.actionHistories = courseCodeInfo.actionHistories ;
  }

  clearActionHistory(): void {
    this.actionHistories = [];
  }

  isTheSame(a: CourseCodeInfo, b: CourseCodeInfo): boolean {
    let result = true;
    if (a.courseCode !== b.courseCode) {
      result = false;
    }
    if (a.subjectName !== b.subjectName) {
      result = false;
    }
    if (a.creditPeriod !== b.creditPeriod) {
      result = false;
    }
    if (a.oriCourseCode !== b.oriCourseCode) {
      result = false;
    }
    if (a.oriSubjectName !== b.oriSubjectName) {
      result = false;
    }
    if (a.action !== b.action) {
      result = false;
    }
    return result;
  }
}



export class FileInfo {

  private constructor() {}

  uid: string;
  md5Code: string;
  courseType: string;
  fileName: string;
  uploader: string;
  approvedDate: number;
  lastUpdate: string;
  content: string;
  classTypeContent: string;
  /**
   * 檔案下所有課程代碼
   */
  mapSubjectCodes: Map<string, CourseCodeInfo>; // <key ,CourseCodeInfo>

  public static newSelf(fileName: string, fileData: CourseCodeInfo[]): FileInfo {

    const fi = new FileInfo();

    const regex = '[HVMSCEF]_.+';
    const MD5regex = '[0-9|A-Z]{32}';
    const dateregex = '\\d{12}';
    const tempFileName = String(fileName.match(regex));
    const file = fi.addCourseFileInfo();

    fi.mapSubjectCodes = new Map();
    fi.fileName = String(tempFileName);
    fi.md5Code = String(tempFileName.match(MD5regex));
    fi.approvedDate = Number(tempFileName.match(dateregex));
    fi.courseType = String(file.get(String(fi.fileName.match('[HVMSCEF]'))).description);
    fi.addCourseCodeInfo(fileData, fi.md5Code);

    return fi;
  }

  addCourseFileInfo(): Map<string, CourseTypeConfig> {
    const fileConfig: Map<string, CourseTypeConfig>  = new Map();
    courseTypeConfig.forEach((value, index) => {
      fileConfig.set(courseTypeConfig[index].code, value);
    });
    return fileConfig;
  }

  addCourseCodeInfo(course: CourseCodeInfo[], md5Code: string): void {
    const mapSubjectCodes: Map<string, CourseCodeInfo> = new Map();
    course.forEach((value) => {
      value.historyMD5Code = md5Code;
      this.mapSubjectCodes.set(value.key, value);
    });
  }

  clone(): FileInfo {
    const n = new Map<string, CourseCodeInfo>(this.mapSubjectCodes);
    const result = Object.assign(new FileInfo(), this);
    result.mapSubjectCodes = n;

    return result;
  }
}

export class RequireMappingConfig {
  code: string;
  description: string;
  requiredBy: string;
  isRequire: string;
}
export class CourseTypeConfig {
  code: string;
  description: string;
}
export class GroupTypeConfig {
    code: string;
    description: string;
    adaptType: string;
}
export class SubjectTypeConfig {
  code: string;
  description: string;
}
export class ClassTypeConfig {
  code: string;
  description: string;
}




export class ActionHistory {

  constructor() {}
  md5: string ;
  action: string ;
  date: string ;
  originCourseCode: string ;
  newCourseCode: string ;

  public static newSelf(md5: string , date: string, courseCodeInfo: CourseCodeInfo): ActionHistory {
    const t = new ActionHistory();

    t.md5 = md5;
    t.action = courseCodeInfo.action;
    t.date = date;
    t.originCourseCode = courseCodeInfo.oriCourseCode;
    t.newCourseCode = courseCodeInfo.courseCode;

    return t;
  }
  clone(): ActionHistory {
    return this;
  }
}

export interface CodeInfo{
  GroupCode: string;
  CourseCode: string;
  SubjectName: string;
  CreditPeriod: string;
  Md5Code: string;
  EntryYear: string;
  RequireBy: string;
  IsRequired: string;
  CourseType: string;
  GroupType: string;
  SubjectType: string;
  ClassType: string;
}

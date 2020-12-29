import { GadgetService } from './../gadget.service';
import { FileInfo, CourseCodeInfo } from './../form/model-subject';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Parser } from '../parser';
import { Sort } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatBottomSheet} from '@angular/material/bottom-sheet';

interface GetServerData {
  EntryYear: string;
  GroupCode: string;
}
@Component({
  selector: 'app-view-course-code',
  templateUrl: './view-course-code.component.html',
  styleUrls: ['./view-course-code.component.scss']
})

export class ViewCourseCodeComponent implements OnInit {
/**
 * 行為模式:
 * 1. 一開始畫面讀取後，從資料庫抓取之前的紀錄
 * 2. 顯示給使用者觀看 (顯示入學年度/ 課程類型/ 群別 / 科別/ 班別/ 科目名稱/ 學分/ 課程代碼)，並可透過入學年度or類別選取想看的資料
 * 3. 使用者如要上傳資料，透過Plugin切換檔案上傳頁面
 * 4. 當使用者一選擇檔案後，立即使用資料庫的歷史資料與之排列後，透過近兩次比較的大表差異顯示在畫面上 (包含各個項目的差異: 新增/ 修改/ 刪除)
 * 5. 如果為普通型高中需要額外上傳班群代碼表
 * 6. 按下送出後，將最後一份檔案儲存至資料庫當中
 */
  showingLabel: GetServerData[] = [];
  categories = [];
  years = [];
  selectYearOption: string;
  selectCategoryOption: string;
  selectYear: string;
  selectCategory: string;
  sortedData: CourseCodeInfo[] = [];
  courseCodeInfo: CourseCodeInfo[] = [];
  mapCourseCodeInfo: Map<string, CourseCodeInfo> = new Map();
  moeHistory: Map<string, FileInfo> = new Map();
  parser = new Parser();
  constructor(private gadget: GadgetService, private bottomSheet: MatBottomSheet) {}

  @ViewChild(MatSort) sort: MatSort;

  async ngOnInit(): Promise<void> {
    await this.downloadHistory();
    // 從資料庫抓取資料
    this.showingLabel = await this.getServerData();
    await this.getYears();
    await this.getCategories(this.years[0]);
  }

  async downloadHistory(): Promise<void> {

    const contract = await this.gadget.getContract('campus.moe_coursecode.adminator');

    const rsp = await contract.send('_.GetMOESubjectCode', {});
    const result = [].concat(rsp.result || []);

    // 解析資料庫每一份檔案
    result.forEach((CourseInfo) => {
      this.courseCodeInfo.push(CourseInfo);
    });
    this.sortedData = this.courseCodeInfo.slice();
  }

  async getCategories(year: string): Promise<void> {
    const tempCategories = [];
    this.categories = [];
    if (this.showingLabel.length > 0) {
      this.courseCodeInfo.forEach((value) => {
        if (value.entryYear === year) {
          const courseType = value.courseType;
          const groupType = value.groupType;
          const subjectType = value.subjectType;
          const classType = value.classType;
          const text = `${courseType}-${groupType}-${subjectType}-${classType}`;
          tempCategories.push(text);
        }
      });
    }
    tempCategories.unshift('所有類別');
    this.categories = tempCategories.filter((value, index) => {
      return tempCategories.indexOf(value) === index;
    }).sort();
    this.selectCategoryOption = this.categories[0];
  }

  async getYears(): Promise<void> {
    const temp = [];
    this.showingLabel.forEach((value) => {
      temp.push(value.EntryYear);
    });
    this.years = temp.filter((value, index) => {
      return temp.indexOf(value) === index;
    }).sort();
    this.selectYearOption = this.years[0];
  }

  sortData(sort: Sort): void {
    // const data = this.courseCodeInfo.slice();
    const data = this.sortedData;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case '課程類型': return this.compare(a.courseType, b.courseType, isAsc);
        case '群別類型': return this.compare(a.groupType, b.groupType, isAsc);
        case '科別類型': return this.compare(a.subjectType, b.subjectType, isAsc);
        case '班群類型': return this.compare(a.classType, b.classType, isAsc);
        case '課程代碼': return this.compare(a.courseCode, b.courseCode, isAsc);
        case '科目名稱': return this.compare(a.subjectName, b.subjectName, isAsc);
        case '學期學分': return this.compare(a.creditPeriod, b.creditPeriod, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  filterInspect(selection: string): void {
    if (selection.match('[0-9]{3}')) {
      this.selectYear = selection;
      // 每選擇學年度就重置類別選項
      this.selectCategory = this.selectCategoryOption = this.categories[0];
      this.getCategories(this.selectYear);
    }
    else {
      this.selectCategory = selection;
    }
    this.filterTable();
  }
  filterTable(): void {
    this.sortedData = this.courseCodeInfo.filter((eachData) => {
      const text = `${eachData.courseType}-${eachData.groupType}-${eachData.subjectType}-${eachData.classType}`;
      return (
        ((eachData.entryYear === this.selectYear) || (!this.selectYear)) &&
        ((this.selectCategory === this.categories[0]) || (text === this.selectCategory) || (!this.selectCategory))
      );
    });
  }
  async getServerData(): Promise<any[]> {
    const contract = await this.gadget.getContract('campus.moe_coursecode.adminator');
    const rsp = await contract.send('_.GetSchoolYearCon16', {});
    const res: GetServerData[] = rsp.result || [];
    const result = [].concat(res);
    const CourseCode = [];
    result.forEach((value) => {
      CourseCode.push(value);
    });
    return CourseCode;
  }
}

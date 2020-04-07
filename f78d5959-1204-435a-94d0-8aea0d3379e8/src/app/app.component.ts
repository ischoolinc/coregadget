import { Component, OnInit } from '@angular/core';
import { BasicService } from './service/basic.service';
import { Point } from './data/point';
import { PointHistories } from './data/pointHistories';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  isLoading = false;
  currPoint: Point = new Point();
  pointHistories: PointHistories [] = [];
  startDate: Date;
  endDate: Date;

  rangeList: string[] = ['全部', '使用', '取得'];
  targetRange = this.rangeList[0];

  constructor(
    private basicService: BasicService
  ) {}

  async ngOnInit() {
    try {
      // 取得目前點數
      this.currPoint = await this.basicService.getPoints();
      // 取得點數歷程資料
      await this.getPointsLog('', '');
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  selectRange(range: string) {
    this.targetRange = range;
  }

  async searchPointsLog() {
    const _startDate = this.startDate ? `${this.startDate.getFullYear()}/${this.startDate.getMonth() + 1 }/${this.startDate.getDate()}` : '';
    const _endDate = this.endDate ? `${this.endDate.getFullYear()}/${this.endDate.getMonth() + 1 }/${this.endDate.getDate()}` : '';

    try {
      // 取得點數歷程資料
      await this.getPointsLog(_startDate, _endDate);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  async getPointsLog(startDate, endDate) {
    if (this.isLoading) { return; }
    this.isLoading = true;

    // 取得點數歷程資料
    const rsp = await this.basicService.getPointsLog(startDate, endDate, this.targetRange);
    // 資料整理
    this.pointHistories = [].concat(rsp || []);
  }
}

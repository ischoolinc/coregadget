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
  point: Point = new Point();
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
      // 取得點數
      this.point = await this.basicService.getPoints();
      // 取得點數歷程資料
      this.pointHistories = await this.basicService.getPointsLog('', '', this.targetRange);
      // 資料整理
      this.pointHistories.forEach(data => {
        const editDate = new Date(data.OccurDate);
        const year = editDate.getFullYear();
        const month = ((editDate.getMonth() + 1) < 10) ? '0' + editDate.getMonth() : '' + editDate.getMonth() ;
        const day = (editDate.getDate() < 10) ? '0' + editDate.getDate() : '' + editDate.getDate();

        data.OccurDate = `${year}/${month}/${day}`;
      });
    } catch (error) {
      console.log(error);
    }
  }

  selectRange(range: string) {
    this.targetRange = range;
  }

  async searchPointsLog() {
    const _startDate = this.startDate ? `${this.startDate.getFullYear()}/${this.startDate.getMonth() + 1 }/${this.startDate.getDate()}` : '';
    const _endDate = this.endDate ? `${this.endDate.getFullYear()}/${this.endDate.getMonth() + 1 }/${this.endDate.getDate()}` : '';
    // 取得點數歷程資料
    this.pointHistories = await this.basicService.getPointsLog(_startDate, _endDate, this.targetRange);
    // 資料整理
    this.pointHistories.forEach(data => {
      const editDate = new Date(data.OccurDate);
      const year = editDate.getFullYear();
      const month = ((editDate.getMonth() + 1) < 10) ? '0' + (editDate.getMonth() + 1) : '' + editDate.getMonth() ;
      const day = (editDate.getDate() < 10) ? '0' + editDate.getDate() : '' + editDate.getDate();

      data.OccurDate = `${year}/${month}/${day}`;
    });
  }
}

import { Injectable } from '@angular/core';
import { GadgetService } from '../gadget.service';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  private _courseContract: any;

  constructor(
    private gadget: GadgetService,
  ) {}

  async getCourseContract() {
    if (!this._courseContract) {
      this._courseContract = await this.gadget.getContract('emba.choose_course.student');
    }
  }

  /**
   * 取得學生點數
   */
  async getPoints() {
    await this.getCourseContract();
    const rsp = await this._courseContract.send('_.GetPoints', {});

    return rsp.Result || {};
  }

  /**
   *取得點數歷程
   */
  async getPointsLog(startDate: string, endDate: string, type: string) {
    await this.getCourseContract();
    const rsp = await this._courseContract.send('_.GetPointsLog', {
      Request: {
        StartDate: startDate || '',
        EndDate: endDate || '',
        Type: type || ''

      }
    });
    return [].concat(rsp.Result && rsp.Result.Histories || []);
  }

}

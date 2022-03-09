import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Day from 'dayjs';

/** 我的課程 gadget guid。 */
const SERVICE_GUID = 'myc5b1c0-725d-4129-ba74-d5eb5f1e944d';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient,
  ) { }

  /** Server 的 Timestamp。 */
  public async timestamp() {
    const rsp = await this.http.get<any>('/service/common/aptimestamp').toPromise();
    return Day(rsp.ap_timestamp_iso);
  }

  /** 取得本 gadget 的 deply params。 */
  public async params() {
    const rsp = await this.http.get<GadgetParams>(`/service/gadget/${SERVICE_GUID}/params`).toPromise();
    return rsp;
  }
}

export interface GadgetParams {
  /** 課表來源設定。 */
  schedule_source: 'standard' | 'personal';
}
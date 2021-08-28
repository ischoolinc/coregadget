import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Day from 'dayjs';

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
}

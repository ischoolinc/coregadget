import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectedSettingService {

  #lastServiceInfo?: GoogleServiceInfo;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  public async check_connected(dsns: string, serviceType: ConnectedServiceType) {
    return this.http.get(`${this.config.API_BASE}/connected_service/check_connected?dsns=${dsns}&service_type=${serviceType}`)
      .pipe(
        tap(rsp => {
          this.#lastServiceInfo = rsp as GoogleServiceInfo;
        })
      ).toPromise();
  }

  /** 上次呼叫結果 */
  public get lastServiceInfo() {
    return this.#lastServiceInfo;
  }
}

export type ConnectedServiceType = 'google_classroom_admin' | 'google_classroom' | 'google_classroom_service_account';

export type GoogleServiceInfo = {
  success: boolean,
  message: string,
  link_account: string,
  service_type: ConnectedServiceType,
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectedSettingService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
  }

  public async check_connected(dsns: string, serviceType: ConnectedServiceType) {
    return this.http.get(`${this.config.API_BASE}/connected_service/check_connected?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }
}

export type ConnectedServiceType = 'google_classroom_admin' | 'google_classroom';

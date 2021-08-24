import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  /** 呼叫 API 時基礎位置 */
  public get API_BASE(): string {
    return 'service';
  }

  public get DSNS_HOST(): string {
    return 'https://dsns.ischool.com.tw';
  }
}

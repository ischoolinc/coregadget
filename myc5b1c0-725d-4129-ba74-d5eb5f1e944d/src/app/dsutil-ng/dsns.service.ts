import { Injectable } from '@angular/core';
import { DSNS, registerLocal, resolveDSNS } from './dsns';

const localMap = new Map<string, string>();

@Injectable({
  providedIn: 'root'
})
export class DsnsService {

  constructor() { }

  /** DSNS Server 位置。 */
  public get dsnsServer() {
    return DSNS
  }

  /** 註冊本地端 DSNS */
  public registerLocal(dsns: string, url: string) {
    registerLocal(dsns, url);
  }

  public async resolveDSNS(dsns: string) {
    return resolveDSNS(dsns);
  }
}

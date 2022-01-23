import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { interval } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AccessPoint } from './access_point';
import { Connection } from './connection';
import { AccessTokenCredential, DSA_ACCESSTOKEN } from './credential_provider';
import { DSAHttpClient } from './dsa_http_client';
import { PassportAccessToken } from './envelope';
import djs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class DSAService {

  #connCache = new Map<string, Connection>();

  constructor(
    @Optional() @Inject(DSA_ACCESSTOKEN) private creden: AccessTokenCredential,
    http: HttpClient,
  ) {
    DSAHttpClient.setHttpClient(http);

    // 排程每10分鐘檢查所有 connection。
    interval(1000 * 60 * 10).subscribe(v => {
      for (const [key, conn] of [...this.#connCache.entries()]) {

        const now = djs();
        const d = djs(conn.createAt);
        const diff = now.diff(d, 'minute');
        if(diff > (60 * 8)) { // 如果建立大於 8 小時就重建 connection。
          // console.log(`Connection Delete：${key}`);
          this.#connCache.delete(key);
        }
      }
    })
  }

  public async getConnection(dsns: string, contract: string) {
    const { creden } = this;

    // 有取快就直接用。
    const cacheKey = this.genKey(dsns, contract);
    if(this.#connCache.has(cacheKey)) {
      return this.#connCache.get(cacheKey)!;
    }

    const atoken = await  creden.getCredential().pipe(
      filter(v => !!v),
      take(1)
    ).toPromise();

    const token = new PassportAccessToken({AccessToken: atoken});
    const ap = await AccessPoint.resolve(dsns, contract);
    const conn  = new Connection(ap, token);

    // 暫時做法，解決 DSA 無法處理短時間同 AccessToken Connect 問題。
    // 正確解法是修掉 DSA 問題，目前已確認問題。
    return new Promise<Connection>((r, j) => {
      setTimeout(async () => {
        await conn.connect();
        this.#connCache.set(cacheKey, conn);   
        r(conn);
      }, Math.random() * 300);
    })
    
  }

  private genKey(dsns: string, contract: string) {
    return `${dsns}/${contract}`;
  }
}

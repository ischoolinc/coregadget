import { Injectable } from '@angular/core';
import { DSAService } from '../dsutil-ng/dsa.service';
import { ServiceConf } from './data/service-conf';

const TeacherContract = 'web3.v1.teacher';
const StudentContract = 'web3.v1.student';

@Injectable({
  providedIn: 'root'
})
export class ConfService {

  constructor(
    private dsa: DSAService,
  ) { }

  /** 設定課程組態，course_id、service_id 是必要欄位。 */
  public async setConf(dsns: string, conf: Partial<Omit<ServiceConf, 'uid'>>) {
    const contract = await this.dsa.getConnection(dsns, TeacherContract);

    const req = {
      "Request": {
        ...conf,
        conf: conf.conf ? JSON.stringify(conf.conf) : undefined,
      }
    };

    const rsp = await contract.send('mycourse.setConf', req);

    const rspjson = rsp?.toCompactJson()?.result ?? {};

    // 把字串轉成 JSON，因為資料庫是存字串。
    try { rspjson.conf = JSON.parse(rspjson.conf); }
    catch { rspjson.conf = {}; }

    try { rspjson.enabled = rspjson.enabled == 't' ? true : false; }
    catch { rspjson.enabled = true; }

    return rspjson;
  }

  public async getConf(dsns: string, role: string,  cond?: {service_id?: string, course_id?: number}) {
    const usedContract = (role === 'teacher') ? TeacherContract : StudentContract;
    const contract = await this.dsa.getConnection(dsns, usedContract);

    const rsp = await contract.send('mycourse.getConf', cond);

    const confs = rsp?.toCompactJson()?.conf ?? [];

    const ensureArray = ([] as any[]).concat(confs)
    for(const conf of ensureArray) {
      try { conf.conf = JSON.parse(conf.conf); }
      catch { conf.conf = {}; }

      try { conf.enabled = (conf.enabled == 't' ? true : false); }
      catch { conf.enabled = true; }
    }

    return ensureArray;
  }
}

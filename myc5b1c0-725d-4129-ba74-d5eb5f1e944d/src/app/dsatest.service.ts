import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './core/login.service';
import { DSAService } from './dsutil-ng/dsa.service';
import { DSAError } from './dsutil-ng/errors';

@Injectable({
  providedIn: 'root'
})
export class DsatestService {

  constructor(
    private dsa: DSAService,
  ) { }

  public async setTimetable() {
    try {
      const contract = await this.dsa.getConnection('dev.sh_d', 'web3.v1.teacher');

      const req = {
        "course": {
          "uid": "58191726",
          "course_id": "339",
          "period": [
            {
              "weekday": "1",
              "period": "1"
            },
            {
              "weekday": "1",
              "period": "2"
            }
          ]
        }
      };
      const rsp = await contract?.send('mycourse.setTimetable', req);

      const rspjson = rsp?.toCompactJson();
      console.log(rspjson);
    } catch (err) {
      if (err instanceof DSAError) {
        console.log(err.code);
        console.error(err.message);
      }
    }
  }

  public async getTimetable() {
    try {
      const contract = await this.dsa.getConnection('dev.sh_d', 'web3.v1.teacher');
      const rsp = await contract?.send('mycourse.getTimetable', { Powerful: 'what???' });
      const rspjson = rsp?.toCompactJson();
      console.log(rspjson);
      console.log(rsp?.toXmlString());
    } catch (err) {
      if (err instanceof DSAError) {
        console.log(err.code);
        console.error(err.message);
      }
    }
  }
}

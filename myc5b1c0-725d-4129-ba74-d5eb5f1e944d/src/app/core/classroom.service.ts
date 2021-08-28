import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { LoginService } from './login.service';
import Day from 'dayjs';
import { of } from 'rxjs';
import { ServerService } from './server.service';

const Host =`https://us-central1-classroom-1campus.cloudfunctions.net/classroomStatus`;
// {
//   "accessToken": "27d825ab75357315ce75ddd2581e9712",
//   "dsns": "demo.1campus.h",
//   "class": [
//       1713
//   ],
//   "course": [
//       34834,
//       34838
//   ]
// }

type QueryOptions = { dsns: string, courses?: number[], classes?: number[] };

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  #openStatusCache = new Map<string, Classroom>();

  constructor(
    private login: LoginService,
    private http: HttpClient,
    private server: ServerService,
  ) { }

  /**
   * 查詢指定的 Classroom 的啟動狀態。
   * @param options 查詢參數。
   * @param forceRefresh 是否立刻更新狀態，一般狀態下，每五分鐘才更新一次。
   * @returns
   */
  public async queryOpenStatus(options: QueryOptions, forceRefresh: boolean = true) {
    //https://us-central1-classroom-1campus.cloudfunctions.net/classroomStatus

    const timestamp = await this.server.timestamp();

    const args: QueryOptions = { courses: [], classes: [], ...options };
    const resultOutput: Classroom[] = [];

    const queryClass = (args.classes || []).filter(v => {
      if(forceRefresh) return true;
      const ret = this.checkUpdateRequired(args.dsns, 'Class', v);
      if (!ret[0]) { resultOutput.push(ret[1]!); }
      return ret[0];
    });

    const queryCourse = (args.courses || []).filter(v => {
      if(forceRefresh) return true;
      const ret = this.checkUpdateRequired(args.dsns, 'Course', v);
      if (!ret[0]) { resultOutput.push(ret[1]!); }
      return ret[0];
    });

    const rsp = await this.login.getAccessToken().pipe(
      concatMap(token => {
        const body = {
          dsns: args.dsns,
          class: queryClass,
          course: queryCourse,
          accessToken: token,
        }

        const targetUrl = `${Host}`
        if(body.class.length > 0 || body.course.length > 0) {
          return this.http.post(targetUrl, body);
        } else {
          return of([] as Classroom[]);
        }

      })
    ).toPromise()

    if (Array.isArray(rsp)) {
      let crrsp = rsp;
      if (Array.isArray(rsp[0])) { crrsp = rsp[0]; }

      const classrooms = (crrsp as Classroom[]).map(v => {
        return Object.assign(new Classroom(timestamp), v);
      });

      classrooms.forEach(v => {
        const { target: t } = v;
        return this.#openStatusCache.set(this.genkey(args.dsns, t.type, t.uid), v)
      });
      resultOutput.push(...classrooms);
      return resultOutput;
    } else { return []; }
  }

  private checkUpdateRequired(dsns: string, type: 'Class' | 'Course', uid: number) {
    const key = this.genkey(dsns, type, uid);
    const exists = this.#openStatusCache.get(key);
    let result: [boolean, Classroom | null] = [true, null];

    if (exists) { result = [exists.updateRequired(), exists]; }

    return result;
  }

  private genkey(dsns: string, type: 'Class' | 'Course', uid: number) {
    return `${dsns}:${type}:${uid}`;
  }
}

export class Classroom {
  key!:       string;
  target!:    Target;
  status!:    string;
  timestamp!: string;

  #createTimestamp = Day();
  #serverTimestamp: Day.Dayjs;

  constructor(sts: Day.Dayjs) {
    this.#serverTimestamp = sts;
  }

  /**
   * 開始上課時間。
   * @param format 顯示格式，如果有則會回傳字串。
   * @returns
   */
  public getTimestamp(format: string | null = null) {
    if(format) {
      return Day(this.timestamp).format(format);
    } else {
      return Day(this.timestamp);
    }
  }

  /** 是否在上課中。 */
  public get isOpen() {
    return this.status === 'open';
  }

  /** 推測目前是否上課中。 */
  public guessOpen() {
    return this.isOpen && this.getLiveTime('hour') <= 2;
  }

  /** 課堂持續時間。 */
  public getLiveTime(unit: 'minute' | 'hour' = 'hour') {
    const openTimestamp = Day(this.timestamp);
    return this.#serverTimestamp.diff(openTimestamp, unit);
  }

  /** 是否需要更新。 */
  public updateRequired() {
    return this.#createTimestamp.diff(Day(), 'second') >= 60;
  }
}

export interface Target {
  name: string;
  type: 'Class' | 'Course';
  uid:  number;
  gid:  number;
}

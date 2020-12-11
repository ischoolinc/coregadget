import { BaseService } from './base.service';
import { Injectable, OnInit } from '@angular/core';
import { StudentRecord } from './data';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  #ready: Promise<void>;

  #studentMap = new Map<number, StudentRecord>();

  constructor(
    private dsa: BaseService,
  ) {
    this.#ready = this.dsa.getStudents('All')
      .toPromise()
      .then(studs => {

        const entries = studs.map(s => {
          return [+s.Id, s] as [number, StudentRecord];
        });

        this.#studentMap = new Map<number, StudentRecord>(entries);
      });

  }

  public ready() {
    return this.#ready;
  }

  /** 取得學生物件 */
  public get(id: number) {
    return this.#studentMap.get(+id);
  }

  /** 重設所有 checked 為 false。 */
  public resetSelection() {
    for(const stu of this.#studentMap.values()) {
      stu.checked = false;
    }
  }

  /** 取得所有被選擇的學生。 */
  public getSelectedStudents() {
    const selection: StudentRecord[] = [];

    for(const stu of this.#studentMap.values()) {
      selection.push(stu);
    }

    return selection;
  }
}

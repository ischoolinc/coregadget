import { Injectable } from '@angular/core';
import { StudentRecord, ModeRecord } from '../data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetDataService {

  studentList$ = new BehaviorSubject<StudentRecord[]>([] as StudentRecord[]);
  student$ = new BehaviorSubject<StudentRecord>({} as StudentRecord);
  mode$ =  new BehaviorSubject<ModeRecord>({} as ModeRecord);
  grade$ = new BehaviorSubject<string>('');
  canEdit$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**設定學生及成績清單 */
  setStudentList(data: StudentRecord[]): void {
    this.studentList$.next(data);
    if (this.student$.value) {
      const stu = data.find(v => v.StudentID === this.student$.value.StudentID);
      this.setStudent(stu ? stu : data[0] || {} as StudentRecord);
    }
  }

  /**取得學生及成績清單 */
  getStudentList(): StudentRecord[] {
    return this.studentList$.value;
  }

  /**設定目前學生 */
  setStudent(stu: StudentRecord): void {
    this.student$.next(stu);
  }

  /**取得目前學生 */
  getTargetStudent(): StudentRecord {
    return this.student$.value;
  }

  /**上一個座號的學生 */
  goPrevSeatNoStudent(): void {
    const currentIndex = this.student$.value ? this.student$.value.Index || 0 : 0;
    const student = (currentIndex === 0) ?
      this.studentList$.value[this.studentList$.value.length - 1] :
      this.studentList$.value[currentIndex - 1];

    this.student$.next(student);
  }

  /**下一個座號的學生 */
  goNextSeatNoStudent(): void {
    const currentIndex = this.student$.value ? this.student$.value.Index || 0 : 0;
    const student = (currentIndex === this.studentList$.value.length - 1) ?
      this.studentList$.value[0] :
      this.studentList$.value[currentIndex + 1];

    this.student$.next(student);
  }

  /**指定座號，座號重複時會選擇同座號的下一位 */
  goSeatNoStudent(seatNo: string): void {
    const currentIndex = this.student$.value ? this.student$.value.Index || 0 : 0;

    let nextStudent1 = null;
    let nextStudent2 = null;
    [].concat(this.studentList$.value || []).forEach((item, idx) => {
      if (item.SeatNumber == seatNo) {
        if (idx > currentIndex) {
          if (nextStudent2 == null) {
            nextStudent2 = item;
          }
        }
        else {
          if (nextStudent1 == null) {
            nextStudent1 = item;
          }
        }
      }
    });

    if (nextStudent2 || nextStudent1) {
      this.student$.next(nextStudent2 || nextStudent1);
    }
  }

  /**設定評分類別 */
  setMode(value: ModeRecord): void {
    this.mode$.next(value);
    if (value && value.GradeItemList) {
      this.setGrade(value.GradeItemList[0] || '');
    }
  }

  /**取得設定評分類別 */
  getMode(): ModeRecord {
    return this.mode$.value;
  }

  /**設定目前評分項目 */
  setGrade(grade: string): void {
    this.grade$.next(grade);
  }

  /**取得目前評分項目 */
  getGrade(): string {
    return this.grade$.value;
  }

  /**設定是否可以編輯 */
  setCanEdit(value: boolean): void {
    this.canEdit$.next(value);
  }

  /**取得設定是否可以編輯 */
  getCanEdit(): boolean {
    return this.canEdit$.value;
  }

}

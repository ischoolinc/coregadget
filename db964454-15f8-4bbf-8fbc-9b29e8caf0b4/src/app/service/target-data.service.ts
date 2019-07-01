import { Injectable } from '@angular/core';
import { StudentRecord, ExamRecord } from '../data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetDataService {
  
  canEdit$ = new BehaviorSubject<boolean>(false);
  exam$ = new BehaviorSubject<ExamRecord>({} as ExamRecord);
  quizName$ = new BehaviorSubject<string>('');
  student$ = new BehaviorSubject<StudentRecord>({} as StudentRecord);
  studentList$ = new BehaviorSubject<StudentRecord[]>([] as StudentRecord[]);

  constructor() { }

  /**設定學生及成績清單 */
  setStudentList(data: StudentRecord[]): void {
    this.studentList$.next(data);
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
  getStudent(): StudentRecord {
    return this.student$.value;
  }

  /**設定目前評量 */
  setExam(exam: ExamRecord) {
    this.exam$.next(exam);
  }

  /**取得目前評量 */
  getExam(): ExamRecord {
    return this.exam$.value;
  }

  /**設定目前評分項目 */
  setQuizName(name: string): void {
    this.quizName$.next(name);
  }

  /**取得目前評分項目 */
  getQuizName(): string {
    return this.quizName$.value;
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
    
    {
        // const currentIndex = this.student$.value ? this.student$.value.Index || 0 : 0;
        // let nextStudent1 = null;
        // let nextStudent2 = null;
        // [].concat(this.studentList$.value || []).forEach((item, idx) => {
        //   if (item.SeatNumber == seatNo) {
        //     if (idx > currentIndex) {
        //       if (nextStudent2 == null) {
        //         nextStudent2 = item;
        //       }
        //     }
        //     else {
        //       if (nextStudent1 == null) {
        //         nextStudent1 = item;
        //       }
        //     }
        //   }
        // });

        // if (nextStudent2 || nextStudent1) {
        //   this.student$.next(nextStudent2 || nextStudent1);
        // }    
    }
    
    const curIndex = this.student$.value ? this.student$.value.Index || 0 : 0;
    const targetStudents: StudentRecord[] = this.studentList$.value.filter((stu: StudentRecord) => stu.SeatNumber === seatNo);
    
    if (targetStudents.length > 0) {
      const targetStudent1: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index > curIndex);
      const targetStudent2: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index <= curIndex);
      this.student$.next(targetStudent1 || targetStudent2);
    }
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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StudentRecord, ExamRecord } from '../data';

@Injectable({
  providedIn: 'root'
})
export class TargetDataService {

  canEdit$ = new BehaviorSubject<boolean>(false);
  exam$ = new BehaviorSubject<ExamRecord>({} as ExamRecord);
  quizName$ = new BehaviorSubject<string>('');
  student$ = new BehaviorSubject<StudentRecord>({} as StudentRecord);
  studenList$= new BehaviorSubject<StudentRecord[]>([] as StudentRecord[]);

  constructor() { }

  setCanEdit(value: boolean) {
    this.canEdit$.next(value);
  }

  getCanEdit(): boolean {
    return this.canEdit$.value;
  }

  setExam(exam: ExamRecord) {
    this.exam$.next(exam);
  }

  getExam(): ExamRecord {
    return this.exam$.value;
  }

  setQuizName(quiz: string) {
    this.quizName$.next(quiz);
  }

  getQuizName(): string{
    return this.quizName$.value;
  }

  setStudent(stu: StudentRecord) {
    this.student$.next(stu);
  }

  getStudent(): StudentRecord {
    return this.student$.value;
  }

  setStudentList(stuList: StudentRecord[]) {
    this.studenList$.next(stuList);
  }

  getStudentList(): StudentRecord[] {
    return this.studenList$.value;
  }
}

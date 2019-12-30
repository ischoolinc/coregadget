import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentRecord, ExamRecord } from '../data';
import { TargetDataService } from '../service/target-data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-students-block',
  templateUrl: './students-block.component.html',
  styleUrls: ['./students-block.component.css']
})
export class StudentsBlockComponent implements OnInit, OnDestroy {

  dispose$ = new Subject();

  curExam: ExamRecord = {} as ExamRecord;
  curStudent: StudentRecord = {} as StudentRecord;
  studentList: StudentRecord[] = [];

  constructor(
    private targetDataSrv: TargetDataService
  ){}

  ngOnInit() {
    // 訂閱資料
    this.targetDataSrv.exam$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((exam: ExamRecord) => {
      this.curExam = exam;
    });

    this.targetDataSrv.student$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stu: StudentRecord) => {
      this.curStudent = stu;
    });

    this.targetDataSrv.studenList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
    });
  }

  ngOnDestroy() {
    this.dispose$.next();
  }
  
  /** 判斷成績資料是否變更 */
  checkHasChanged(stu: StudentRecord, quiz: any): boolean {
    if (stu.DailyLifeScore) {
      const curScore: string = stu.DailyLifeScore.get(`${this.curExam.ExamID}_${quiz.Name}`);
      const originScore: string = stu.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${quiz.Name}`);
      return curScore !== originScore;
    } else {
      return false;
    }
  }

  /** 取得學生評分項目成績 */
  getScoreText(stu: StudentRecord, quiz: any): string {
    if (stu.DailyLifeScore) {
      const score: string = stu.DailyLifeScore.get(`${this.curExam.ExamID}_${quiz.Name}`) || '';
      return score;
    } else {
      return '';
    }
  }

  doSelect(stu: StudentRecord, quizName: string) {
    this.curStudent = stu;
    this.targetDataSrv.setStudent(this.curStudent);
    this.targetDataSrv.setQuizName(quizName);
  }
}

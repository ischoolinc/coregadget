import { Component, OnInit, OnDestroy} from '@angular/core';
import { StudentRecord, ExamRecord } from '../data';
import { TargetDataService } from '../service/target-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-students-block',
  templateUrl: './students-block.component.html',
  styleUrls: ['./students-block.component.css']
})
export class StudentsBlockComponent implements OnInit, OnDestroy{

  // 學生清單
  studentList: StudentRecord[] = [];
  // 目前學生
  curStudent: StudentRecord = {} as StudentRecord;
  // 目前評量
  curExam: ExamRecord;

  dispose$ = new Subject();

  constructor(
    private targetDataSrv: TargetDataService
  ){}

  ngOnInit(): void {
    /**訂閱資料 */
    this.targetDataSrv.studentList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
    });

    this.targetDataSrv.student$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stu: StudentRecord) => {
      this.curStudent = stu;
    });

    this.targetDataSrv.exam$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((exam: ExamRecord) => {
      this.curExam = exam;
    });
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }
  
  /** 判斷成績資料是否變更 */
  checkHasChanged(student: StudentRecord, itemName: string): boolean {
    if (student.DailyLifeScore) {
      const curScore: string = student.DailyLifeScore.get(`${this.curExam.ExamID}_${itemName}`);
      const originScore: string = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${itemName}`);
      return curScore !== originScore;
    } else {
      return false;
    }
  }

  /** 取得學生評分項目成績 */
  getScoreText(student: StudentRecord, itemName: string): string {
    if (student.DailyLifeScore) {
      return student.DailyLifeScore.get(`${this.curExam.ExamID}_${itemName}`) || '';
    } else {
      return '';
    }
  }

  doSelect(student: StudentRecord, quizName: string) {
    this.targetDataSrv.setStudent(student);
    this.targetDataSrv.setQuizName(quizName);
  }
  
}

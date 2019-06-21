import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StudentRecord, ExamRecord, TargetRecord } from '../data';

@Component({
  selector: 'app-students-block',
  templateUrl: './students-block.component.html',
  styleUrls: ['./students-block.component.css']
})
export class StudentsBlockComponent {

  @Input() // 目前評量項目
  curExam: ExamRecord = {} as ExamRecord;

  @Input() // 目前學生
  curStudentID: string = '';

  @Input() // 學生清單
  studentList: StudentRecord[] = [];

  @Output() // 目前物件
  onTargetChange: EventEmitter<TargetRecord> = new EventEmitter();

  constructor(){}
  
  /** 判斷成績資料是否變更 */
  checkHasChanged(student: StudentRecord, item: any): boolean {
    const curScore: string = student.DailyLifeScore.get(`${this.curExam.ExamID}_${item.Name}`);
    const originScore: string = student.DailyLifeScore.get(`Origin_${this.curExam.ExamID}_${item.Name}`);
    return curScore !== originScore;
  }

  /** 取得學生評分項目成績 */
  getScoreText(student: StudentRecord, itemName: string): string {
    const score: string = student.DailyLifeScore.get(`${this.curExam.ExamID}_${itemName}`) || '';
    return score;
  }

  doSelect(student: StudentRecord, itemName: string, needSetSeatNo: boolean, setFocus: boolean) {
    this.onTargetChange.emit({
      Student: student,
      // ExamID: this.curExam.ExamID,
      ItemName: itemName,
      NeedSetSeatNo: needSetSeatNo,
      SetFocus: setFocus
    });
  }
}

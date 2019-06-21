import { Component, Input, ElementRef, ViewChild, ChangeDetectorRef, NgZone, Output, EventEmitter, TemplateRef , OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Subject, combineLatest, Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs/operators';
import { StudentRecord, TargetRecord, ExamRecord, PerformanceDegree, CommentRecord } from '../data';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-input-block',
  templateUrl: './input-block.component.html',
  styleUrls: ['./input-block.component.css']
})
export class InputBlockComponent implements OnChanges {

  // 新成績
  curValue: string;
  // ng-template 切換用
  displayPage: TemplateRef<any>;
  // 學生切換模式
  curMode: 'SEAT' | 'SEQ' = 'SEQ';
  // 切換座號
  selectSeatNumber: string;

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  dispose$ = new Subject();
  affixTop = false;
  isMobile = false;
  
  private inputSeatNo: ElementRef;
  private inputTextScore: ElementRef;

  @Input()
  canEdit: boolean;

  @Input()
  curExam: ExamRecord = {} as ExamRecord;

  @Input()
  targetData: TargetRecord = {} as TargetRecord;

  @Input()
  studentList: StudentRecord[] = [];

  @Input()
  degreeCodeList: PerformanceDegree[] = [];

  @Input()
  textCodeList: CommentRecord[] = []

  @Output()
  onCurStudentChange: EventEmitter<StudentRecord> = new EventEmitter<StudentRecord>();

  @Output()
  onScoreChange: EventEmitter<StudentRecord> = new EventEmitter<StudentRecord>();

  @ViewChild('inputSeatNo') set _inputSeatNo(content: ElementRef) {
    this.inputSeatNo = content;
    this.changeDetectorRef.detectChanges();
  }
  @ViewChild('inputTextScore') set _inputTextScore(content: ElementRef) {
    this.inputTextScore = content;
    this.changeDetectorRef.detectChanges();
  }
  @ViewChild('tplSourceNoData') tplSourceNoData: TemplateRef<any>;
  @ViewChild('tplSourceLock') tplSourceLock: TemplateRef<any>;
  @ViewChild('tplTextType') tplTextType: TemplateRef<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private viewportScroller: ViewportScroller,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone,
    private modalService: BsModalService
  ) {
    this.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gi) ? true : false;

    // 偵測 scrollbar
    this.scrollDispatcher.scrolled().pipe(
      takeUntil(this.dispose$)
    ).subscribe(x => {
      this.zone.run(() => {
        this.setAffixTop();
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.canEdit) {
      this.setPage();
    }
    if (changes.targetData || changes.curExam) {
      const itemName: string = changes.targetData.currentValue.ItemName;
      const student: StudentRecord = changes.targetData.currentValue.Student;
      this.setTarget(student,itemName);
      this.setPage();
    }
  }

  /** 設定目前物件 */
  setTarget(student: StudentRecord, itemName: string) {
    this.targetData.Student = student;
    this.targetData.ItemName = itemName;
    this.curValue = this.targetData.Student.DailyLifeScore.get(`${this.curExam.ExamID}_${itemName}`); 
    this.selectSeatNumber = this.targetData.Student.SeatNumber;
    if (this.canEdit) {
      this.focusAndSelect(this.inputTextScore);
    }
  }

  /** 根據資料以及成績是否可編輯來切換樣板 */
  setPage() {
    if (this.targetData.Student && this.targetData.Student.DailyLifeScore) {
      if (!this.canEdit) {
        this.displayPage = this.tplSourceLock;
      } else {
        this.displayPage = this.tplTextType;
      }
    } else {
      this.displayPage = this.tplSourceNoData;
    }
  }

  /** 程度代碼轉換 */
  switchDegreeCode(code: string) {
    const result = this.degreeCodeList.find((dg: PerformanceDegree) => dg.Degree === code);
    if (result) {
      this.curValue = result.Desc;
    }
  }
  /** 文字代碼轉換 */
  switchTextCode(code: string) {
    const result = this.textCodeList.find((txt: CommentRecord) => txt.Code === code);
    if (result) {
      this.curValue = result.Comment;
    }
  }

  /** 驗證通過與否 */
  enterGrade() {
    this.curValue = this.curValue.trim();
    switch (this.curExam.ExamID) {
      case 'DailyBehavior':
        this.switchDegreeCode(this.curValue);
        break;
      case 'DailyLifeRecommend':
        this.switchTextCode(this.curValue);
        break;
      default:
        break;
    }
    this.submitGrade(this.curValue);
  }

  /** 更新成績且跳至下一位 */
  submitGrade = (score: any) => {
    this.targetData.Student.DailyLifeScore.set(`${this.curExam.ExamID}_${this.targetData.ItemName}`, score);
    this.onScoreChange.emit(this.targetData.Student);
    this.goNext();
  }

  /** 上一個座號的學生 */
  goPrev() {
    const currentIndex = this.targetData.Student ? this.targetData.Student.Index || 0 : 0;
    this.setTarget(
      (currentIndex === 0) ?
        this.studentList[this.studentList.length - 1] :
        this.studentList[currentIndex - 1]
      , this.targetData.ItemName);

    this.onCurStudentChange.emit(this.targetData.Student);  
    // $('.pg-grade-textbox:visible').focus().select();
  }

  /** 下一個座號的學生 */
  goNext() {
    const currentIndex = this.targetData.Student ? this.targetData.Student.Index || 0 : 0;
    this.setTarget(
      (currentIndex === this.studentList.length - 1) ?
        this.studentList[0] :
        this.studentList[currentIndex + 1]
      , this.targetData.ItemName);

    this.onCurStudentChange.emit(this.targetData.Student);
  }

  // 顯示文字代碼表
  openCommentCode(template: TemplateRef<any>) {
    if (template) {
      const _combine = combineLatest(
        this.modalService.onHide
      ).subscribe(() => this.changeDetectorRef.markForCheck());
  
      this.subscriptions.push(
        this.modalService.onHide.subscribe(() => {
          this.enterGrade();
          this.unsubscribe();
        })
      );
  
      this.subscriptions.push(_combine);
      this.modalRef = this.modalService.show(template);
    }
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  /**
   * 選擇代碼
   * 1. 將代碼資料寫入評分項目
   * 2. 分數提交
   */
  selectDegreeCode(code: PerformanceDegree) {

    this.curValue = this.curValue.trim();

    if (this.curValue) {
      this.curValue += `,${code.Desc}`
    } else {
      this.curValue = code.Desc;
    }
  }
  
  selectTextCode(code: CommentRecord) {
    this.curValue = this.curValue.trim();

    if (this.curValue) {
      this.curValue += `,${code.Comment}`
    } else {
      this.curValue = code.Comment;
    }
  }

  /**成績輸入切換座號、學生 */
  setCurMode(mode: 'SEAT' | 'SEQ') {
    this.curMode = mode;
    // this.changeDetectorRef.detectChanges();
    if (mode === 'SEAT') {
      this.focusAndSelect(this.inputSeatNo);
    }
  }

  /**指定座號，座號重複時會選擇同座號的下一位 */
  submitStudentNo() {
    if (this.isMobile) { return; }
    const curIndex = this.targetData.Student ? this.targetData.Student.Index : 0;

    const targetStudents: StudentRecord[] = this.studentList.filter((stu: StudentRecord) => stu.SeatNumber === this.selectSeatNumber);
    
    if (targetStudents.length > 0) {
      const targetStudent1: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index > curIndex);
      const targetStudent2: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index <= curIndex);

      this.setTarget(targetStudent1 || targetStudent2, this.targetData.ItemName);
      this.onCurStudentChange.emit(this.targetData.Student);  
    }
  }

  /**設定物件 focus 及選擇反白 */
  focusAndSelect(elementRef: ElementRef) {
    if (elementRef) {
      const input: HTMLInputElement = elementRef.nativeElement;

      setTimeout(() => {
        input.focus();
        input.select();
      }, 0);
    }
  }

  /**設定是否固定置頂 */
  setAffixTop() {
    const scroll = this.viewportScroller.getScrollPosition();
    if (scroll[1] >= 140) {
      this.affixTop = true;
    } else {
      this.affixTop = false;
    }
  }
  
}

import { Component, Input, ElementRef, ViewChild, ChangeDetectorRef, NgZone, TemplateRef , OnInit, OnDestroy} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { StudentRecord, ExamRecord, PerformanceDegree, CommentRecord } from '../data';
import { TargetDataService } from '../service/target-data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-input-block',
  templateUrl: './input-block.component.html',
  styleUrls: ['./input-block.component.css']
})
export class InputBlockComponent implements OnInit, OnDestroy {

  // 可否編輯
  canEdit: boolean;
  // 目前評量
  curExam: ExamRecord = {} as ExamRecord;
  // 目前評分項目
  curQuizName: string;
  // 學生清單
  studentList: StudentRecord[] = [];
  // 目前學生
  curStudent: StudentRecord = {} as StudentRecord;
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
  degreeCodeList: PerformanceDegree[] = [];

  @Input()
  textCodeList: CommentRecord[] = []

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
    private zone: NgZone,
    private viewportScroller: ViewportScroller,
    private scrollDispatcher: ScrollDispatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private targetDataSrv: TargetDataService
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

  ngOnInit() {
    // 訂閱資料
    this.targetDataSrv.canEdit$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((value: boolean) => {
      this.canEdit = value;
      // this.setPage();
    });

    this.targetDataSrv.studenList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
    });

    this.targetDataSrv.student$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stu: StudentRecord) => {
      this.curStudent = stu;
      this.selectSeatNumber = this.curStudent.SeatNumber;
      this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${this.targetDataSrv.quizName$.value}`);
      this.setPage();
    });

    this.targetDataSrv.exam$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((exam: ExamRecord) => {
      this.curExam = exam;
    });

    this.targetDataSrv.quizName$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((quiz: string) => {
      this.curQuizName = quiz;
      this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${quiz}`);
    });
  }

  ngOnDestroy() {
    this.dispose$.next();
  }

  /** 設定目前物件 */
  setQuiz(quizName: string) {
    this.curQuizName = quizName;
    this.targetDataSrv.setQuizName(this.curQuizName);

    if (this.curStudent.DailyLifeScore) {
      this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${quizName}`) || ''; 
    }
    if (this.canEdit) {
      this.focusAndSelect(this.inputTextScore);
    }
  }

  /** 根據資料以及成績是否可編輯來切換樣板 */
  setPage() {
    if (this.curStudent && this.curStudent.DailyLifeScore) {
      if (!this.canEdit) {
        this.displayPage = this.tplSourceLock;
      } else {
        this.displayPage = this.tplTextType;
        this.changeDetectorRef.detectChanges();
        this.focusAndSelect(this.inputTextScore);
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
    // 資料更新
    this.curStudent.DailyLifeScore.set(`${this.curExam.ExamID}_${this.curQuizName}`, score);
    const target = this.studentList.find((stu: StudentRecord) => stu.ID === this.curStudent.ID);
    if (target) {
      target.DailyLifeScore = this.curStudent.DailyLifeScore;
    }
    // service 資料更新
    this.targetDataSrv.setStudent(this.curStudent);
    this.targetDataSrv.setStudentList(this.studentList);
    
    this.goNext();
  }

  /** 上一個座號的學生 */
  goPrev() {
    const index = this.curStudent ? this.curStudent.Index || 0 : 0;
    this.curStudent = (index === 0) ? this.studentList[this.studentList.length - 1] : this.studentList[index - 1];
    this.setCurStudentAndValue();
  }

  /** 下一個座號的學生 */
  goNext() {
    const index = this.curStudent ? this.curStudent.Index || 0 : 0;
    this.curStudent = (index === this.studentList.length - 1) ? this.studentList[0] : this.studentList[index + 1];
    this.setCurStudentAndValue();
  }

  setCurStudentAndValue(){
    this.targetDataSrv.setStudent(this.curStudent);
    this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${this.curQuizName}`);
  }

  /** 開啟文字代碼表 */
  openCodeModal(template: TemplateRef<any>) {
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

  /** 選擇程度代碼 */
  selectDegreeCode(code: PerformanceDegree) {
    // this.curValue = this.curValue.trim();
    // if (this.curValue) {
    //   this.curValue += `,${code.Desc}`
    // } else {
    //   this.curValue = code.Desc;
    // }
    this.curValue = code.Desc;
  }
  
  /** 選擇文字代碼 */
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
    this.changeDetectorRef.detectChanges();
    if (mode === 'SEAT') {
      this.focusAndSelect(this.inputSeatNo);
    }
  }

  /**指定座號，座號重複時會選擇同座號的下一位 */
  submitStudentNo() {
    if (this.isMobile) { return; }
    const curIndex = this.curStudent ? this.curStudent.Index : 0;
    const targetStudents: StudentRecord[] = this.studentList.filter((stu: StudentRecord) => stu.SeatNumber === this.selectSeatNumber);

    if (targetStudents.length > 0) {
      const targetStudent1: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index > curIndex);
      const targetStudent2: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index <= curIndex);

      this.curStudent = targetStudent1 || targetStudent2;
      this.setCurStudentAndValue();
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

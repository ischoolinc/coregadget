import { Component, Input, ElementRef, ViewChild, ChangeDetectorRef, NgZone, TemplateRef , OnInit, OnDestroy} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { TargetDataService } from '../service/target-data.service';
import { StudentRecord, ExamRecord, LevelCode, CommentCode, EffortCode } from '../data';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest, Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-input-block',
  templateUrl: './input-block.component.html',
  styleUrls: ['./input-block.component.css']
})
export class InputBlockComponent implements OnInit, OnDestroy {

  // 是否可以編輯
  canEdit: boolean;
  // 目前評量
  curExam: ExamRecord = {} as ExamRecord;
  // 目前評分項目
  curQuizName: string;
  // 目前學生
  curStudent: StudentRecord = {} as StudentRecord;
  // 學生清單
  studentList: StudentRecord[] = [];
  // 新成績
  curValue: string;
  // 根據可否編輯、是否有成績資料等因素 切換template
  displayPage: TemplateRef<any>;
  // 是否顯示努力程度代碼表
  showEffortCode: boolean;
  // 學生切換模式
  curMode: 'SEAT' | 'SEQ' = 'SEQ';
  // 切換座號
  selectSeatNumber: string;
  // 團體活動子成績項目
  groupItemList: string[] = [];

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  dispose$ = new Subject();
  affixTop = false;
  isMobile = false;

  private inputSeatNo: ElementRef;
  private inputTextScore: ElementRef;

  @Input()
  levelCodeList: LevelCode[] = [];

  @Input()
  commentCodeList: CommentCode[] = []

  @Input()
  effortCodeList: EffortCode[] = [];

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

  ngOnInit(): void {
    /**訂閱資料 */
    this.targetDataSrv.canEdit$.pipe(
      takeUntil(this.dispose$)
    ).subscribe(value => {
      this.canEdit = value;
    });

    this.targetDataSrv.studentList$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stuList: StudentRecord[]) => {
      this.studentList = stuList;
    });

    this.targetDataSrv.student$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((stu: StudentRecord) => {
      this.curStudent = stu;
      this.selectSeatNumber = stu.SeatNumber;
      this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${this.targetDataSrv.quizName$.value}`);
    });

    this.targetDataSrv.exam$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((exam: ExamRecord) => {
      this.curExam = exam;
      this.setPage();
    });

    this.targetDataSrv.quizName$.pipe(
      takeUntil(this.dispose$)
    ).subscribe((quiz: string) => {
      this.setCurQuiz(quiz);
    });
  }

  ngOnDestroy(): void {
    this.dispose$.next();
  }

  /** 設定評分項目 */
  setQuiz(quiz: string) {
    this.curQuizName = quiz;
    this.targetDataSrv.setQuizName(quiz);

    if (this.curStudent.DailyLifeScore) {
      this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${quiz}`);
    }
    if (this.canEdit) {
      this.focusAndSelect(this.inputTextScore);
    }
  }

  /** 根據資料以及成績是否可編輯來切換樣板 */
  setPage() {
    if(this.curStudent && this.curExam.Item.length) {
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

  setCurQuiz(quiz: string) {
    this.curQuizName = quiz;
    this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${quiz}`);

    // GoupActivity 努力程度才需要顯示代碼表
    if (this.curExam.ExamID === 'GroupActivity') {
      this.showEffortCode = this.curQuizName.includes('努力程度');
    } else {
      this.showEffortCode = false;
    }
  }

  /** 表現程度代碼轉換 */
  switchLevelCode(code: string) {
    const result = this.levelCodeList.find((dg: LevelCode) => dg.Degree === code);
    if (result) {
      this.curValue = result.Desc;
    }
  }
  /** 導師評語代碼轉換 */
  switchCommentCode(code: string) {
    const result = this.commentCodeList.find((txt: CommentCode) => txt.Code === code);
    if (result) {
      this.curValue = result.Comment;
    }
  }

  /** 努力程度代碼轉換 */
  switchEffortCode(code: string) {
    const result = this.effortCodeList.find((effort: EffortCode) => effort.Code === code);
    if (result) {
      this.curValue = result.Name;
    }
  }

  /** 驗證通過與否 */
  enterGrade() {
    this.curValue = this.curValue.trim();
    switch (this.curExam.ExamID) {
      case 'DailyBehavior':
        this.switchLevelCode(this.curValue);
        break;
      case 'DailyLifeRecommend':
        this.switchCommentCode(this.curValue);
        break;
      case 'GroupActivity':
        if (this.curQuizName.includes('努力程度')) {
          this.switchEffortCode(this.curValue);
        }
        break;
      default:
        break;
    }
    this.submitGrade(this.curValue);
  }

  /** 更新成績且跳至下一位 */
  submitGrade = (score: any) => {
    // 資料更新
    this.curStudent.DailyLifeScore.set(`${this.curExam.ExamID}_${this.curQuizName}`,score);
    const target = this.studentList.find((stu: StudentRecord) => stu.ID === this.curStudent.ID);
    if (target) {
      target.DailyLifeScore = this.curStudent.DailyLifeScore;
    }
    // 資料推播
    this.targetDataSrv.setStudent(this.curStudent);
    this.targetDataSrv.setStudentList(this.studentList);

    this.goNext();
  }

  /** 上一個座號的學生 */
  goPrev() {
    const index = this.curStudent ? this.curStudent.Index || 0 : 0;
    this.curStudent = (index === 0) ? this.studentList[this.studentList.length - 1] : this.studentList[index - 1];
    this.setCurStudentAndValue();
    // $('.pg-grade-textbox:visible').focus().select();
  }

  /** 下一個座號的學生 */
  goNext() {
    const index = this.curStudent ? this.curStudent.Index || 0 : 0;
    this.curStudent = (index === this.studentList.length - 1) ? this.studentList[0] : this.studentList[index + 1];
    this.setCurStudentAndValue();
  }

  // 顯示文字代碼表
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

  /**選擇程度代碼 */
  selectLevelCode(code: LevelCode) {
    // this.curValue = this.curValue.trim();
    // if (this.curValue) {
    //   this.curValue += `,${code.Desc}`
    // } else {
    //   this.curValue = code.Desc;
    // }
    this.curValue = code.Desc;
  }

  /**選擇文字代碼 */
  selectCommentCode(code: CommentCode) {
    this.curValue = this.curValue.trim();

    if (this.curValue) {
      this.curValue += `,${code.Comment}`
    } else {
      this.curValue = code.Comment;
    }
  }

  /**選擇努力程度代碼 */
  selectEffortCode(code: EffortCode) {
    this.curValue = code.Name;
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
    const curIndex = this.curStudent ? this.curStudent.Index || 0 : 0;
    const targetStudents: StudentRecord[] = this.studentList.filter((stu: StudentRecord) => stu.SeatNumber === this.selectSeatNumber);
    
    if (targetStudents.length > 0) {
      const targetStudent1: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index > curIndex);
      const targetStudent2: StudentRecord = targetStudents.find((stu:StudentRecord) => stu.Index <= curIndex);
      this.curStudent = targetStudent1 || targetStudent2;
      this.setCurStudentAndValue();  
    }
  }

  setCurStudentAndValue(){
    this.targetDataSrv.setStudent(this.curStudent);
    this.curValue = this.curStudent.DailyLifeScore.get(`${this.curExam.ExamID}_${this.curQuizName}`);
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

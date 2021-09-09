import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CoreService } from '../core.service';
import { TeacherRec } from '../data/teacher';

@Component({
  selector: 'app-select-ateacher',
  templateUrl: './select-ateacher.component.html',
  styleUrls: ['./select-ateacher.component.scss']
})
export class SelectAteacherComponent implements OnInit, AfterViewInit, OnDestroy {

  /** list of select options */
  protected optionList: TeacherRec[] = [];

  /** control for the selected option */
  public optionCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public optionFilterCtrl: FormControl = new FormControl();

  /** list of options filtered by search keyword */
  public filteredOptions: ReplaySubject<TeacherRec[]> = new ReplaySubject<TeacherRec[]>(1);


  @Input() defaultValue?: string;

  @Output() doChange = new EventEmitter<string | undefined>();

  @ViewChild('singleSelect') singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor(
    private coreSrv: CoreService,
  ) { }

  ngOnInit() {
    this.optionList = [{ TeacherId: '-1', TeacherName: '不選擇' }].concat(this.coreSrv.teacherList || []);

    // set initial selection
    const defaultTeacher = this.optionList.find((v: TeacherRec) => v.TeacherId === this.defaultValue);
    if (this.defaultValue) this.optionCtrl.setValue(defaultTeacher);

    // load the initial bank list
    this.filteredOptions.next(this.optionList.slice());

    // listen for search field value changes
    this.optionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });

    this.optionCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((v: TeacherRec) => {
        this.doChange.emit((v.TeacherId === '-1') ? undefined : v.TeacherId);
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredOptions are loaded initially
   */
  protected setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: TeacherRec, b: TeacherRec) => a && b && a.TeacherId === b.TeacherId;
      });
  }

  protected filterOptions() {
    if (!this.optionList) {
      return;
    }
    // get the search keyword
    let search = this.optionFilterCtrl.value;
    if (!search) {
      this.filteredOptions.next(this.optionList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the options
    this.filteredOptions.next(
      this.optionList.filter(option => option.TeacherName.toLowerCase().indexOf(search) > -1)
    );
  }
}

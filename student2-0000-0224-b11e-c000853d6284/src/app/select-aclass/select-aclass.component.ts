import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ClassRec, CoreService } from '../core.service';


@Component({
  selector: 'app-select-aclass',
  templateUrl: './select-aclass.component.html',
  styleUrls: ['./select-aclass.component.scss']
})
export class SelectAclassComponent implements OnInit, AfterViewInit, OnDestroy {

  /** list of select options */
  protected optionList: ClassRec[] = [];

  /** control for the selected option */
  public optionCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public optionFilterCtrl: FormControl = new FormControl();

  /** list of options filtered by search keyword */
  public filteredOptions: ReplaySubject<ClassRec[]> = new ReplaySubject<ClassRec[]>(1);


  @Input() defaultValue?: string;

  @Output() doChange = new EventEmitter<string | undefined>();

  @ViewChild('singleSelect') singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor(
    private coreSrv: CoreService,
  ) { }

  async ngOnInit() {
    const classList = await this.coreSrv.getClassList();
    this.optionList = [{ ClassId: '-1', ClassName: '不選擇' }].concat(classList || []);

    // set initial selection
    const defaultClass = this.optionList.find((v: ClassRec) => v.ClassId === this.defaultValue);
    if (this.defaultValue) this.optionCtrl.setValue(defaultClass);

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
      .subscribe((v: ClassRec) => {
        this.doChange.emit((v.ClassId === '-1') ? undefined : v.ClassId);
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
        this.singleSelect.compareWith = (a: ClassRec, b: ClassRec) => a && b && a.ClassId === b.ClassId;
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
      this.optionList.filter(option => option.ClassName.toLowerCase().indexOf(search) > -1)
    );
  }

}

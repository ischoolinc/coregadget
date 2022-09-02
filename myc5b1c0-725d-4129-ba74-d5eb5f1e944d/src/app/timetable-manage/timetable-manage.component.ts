import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MyCourseRec } from '../core/data/my-course';
import { Period } from '../core/data/timetable';
import { Timetable } from '../core/states/timetable.actions';
import { TimetableState } from '../core/states/timetable.state';

@Component({
  selector: 'app-timetable-manage',
  templateUrl: './timetable-manage.component.html',
  styleUrls: ['./timetable-manage.component.scss']
})
export class TimetableManageComponent implements OnInit, OnDestroy {

  saving = false;
  weekdays = [
    { value: 1, name: '星期一' },
    { value: 2, name: '星期二' },
    { value: 3, name: '星期三' },
    { value: 4, name: '星期四' },
    { value: 5, name: '星期五' },
    { value: 6, name: '星期六' },
    { value: 7, name: '星期日' },
  ];
  periods: string[] = ['早自習'].concat(Array.from({ length: 12 }, (_, i) => (i + 1).toString() ));
  timetableMap: Map<string, { dayOfweek: number, period: string, isChecked: boolean }> = new Map();
  course: MyCourseRec = {} as MyCourseRec;
  unSubscribe$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TimetableManageComponent>,
    private store: Store,
  ) {
    this.course = data.course;
  }

  ngOnInit(): void {
    this.store.select(TimetableState.getCourse).pipe(
      map(fn => fn(this.course.CourseId))
      , takeUntil(this.unSubscribe$)
    ).subscribe(timetable => {
      new Array().concat(timetable?.periods || []).forEach((v: Period) => {
        const key = this.getKey(v.weekday, v.period);
        this.timetableMap.set(key, {
          dayOfweek: +v.weekday,
          period: '' + v.period,
          isChecked: true,
        })
      });
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
  }

  getKey(dayOfweek: string | number, period: string) {
    return `${dayOfweek}_${period}`;
  }

  getIsChecked(dayOfweek: number, period: string) {
    const key = this.getKey(dayOfweek, period);
    if (this.timetableMap.has(key)) {
      return this.timetableMap.get(key)!.isChecked;
    } else {
      return false;
    }
  }

  toggleTimetableChecked(dayOfweek: number, period: string) {
    const key = this.getKey(dayOfweek, period);
    if (!this.timetableMap.has(key)) {
      this.timetableMap.set(key, {
        dayOfweek: dayOfweek,
        period: period,
        isChecked: false
      });
    }
    this.timetableMap.get(key)!.isChecked = !this.timetableMap.get(key)!.isChecked;
  }

  saveTimetable() {
    if (this.saving) { return; }
    this.saving = true;

    const newData: { weekday: number, period: string }[] = [];
    this.timetableMap.forEach(v => {
      if (v.isChecked) {
        newData.push({ weekday: v.dayOfweek, period: v.period });
      }
    });

    this.store.dispatch(new Timetable.SetCourse({
      course_id: this.course.CourseId,
      periods: newData,
    })).toPromise();

    this.saving = false;
    this.dialogRef.close();
  }
}

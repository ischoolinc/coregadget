import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MyCourseRec } from '../core/data/my-course';
import { CustomizeService } from '../core/data/service-conf';
import { ServiceConfState } from '../core/states/conf.state';

@Component({
  selector: 'app-launcher-customize',
  templateUrl: './launcher-customize.component.html',
  styleUrls: ['./launcher-customize.component.scss']
})
export class LauncherCustomizeComponent implements OnInit, OnDestroy {

  services: CustomizeService[] = [];
  unSubscribe$ = new Subject();

  @Input() course: MyCourseRec = {} as MyCourseRec;

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.select(ServiceConfState.getServiceConf).pipe(
      map(fn => fn(this.course.CourseId, 'customize'))
      , takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      const services = v?.conf?.services || [];
      this.services = services.filter((item: CustomizeService) => item.enabled);
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
  }
}

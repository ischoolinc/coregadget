import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from '../core/loading.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  unSubscribe$ = new Subject();

  constructor(
    private loadSrv: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadSrv.loadingStatus.pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(v => {
      this.loading = v;
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

}

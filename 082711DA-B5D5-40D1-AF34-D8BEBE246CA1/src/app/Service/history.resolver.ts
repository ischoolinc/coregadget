import { Record } from './../vo';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryResolver implements Resolve<Record[]> {

  constructor(
    private datasrv: DataService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Record[]> {
    return this.datasrv.loadHistoryData();
  }
}

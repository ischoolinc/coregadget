import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { PlanModel } from '../state/plan.state';

@Injectable({
  providedIn: 'root'
})
export class PlanGuard implements CanActivate {

  constructor(
    private store: Store
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.store.select(state => state.plan).pipe(
      map((v: PlanModel) => {
        if (v.curPlan) {
          return true;
        }
        return false;
      })
    )
  }
  
}

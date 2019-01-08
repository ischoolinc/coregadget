import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from "./role.service";

@Injectable({
  providedIn: 'root'
})
export class CaseRoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.roleService.enableCase)
      return true;
    else {
      this.router.navigate(['/permission_denied'], {
        skipLocationChange: true
      });
      return false;
    }
  }
}
@Injectable({
  providedIn: 'root'
})
export class CounselRoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.roleService.enableCounsel)
      return true;
    else {
      this.router.navigate(['/permission_denied'], {
        skipLocationChange: true
      });
      return false;
    }
  }
}
@Injectable({
  providedIn: 'root'
})
export class CounselStatisticsRoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.roleService.enableCounselStatistics)
      return true;
    else {
      this.router.navigate(['/permission_denied'], {
        skipLocationChange: true
      });
      return false;
    }
  }
}
@Injectable({
  providedIn: 'root'
})
export class InterviewStatisticsRoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.roleService.enableInterviewStatistics)
      return true;
    else {
      this.router.navigate(['/permission_denied'], {
        skipLocationChange: true
      });
      return false;
    }
  }
}
@Injectable({
  providedIn: 'root'
})
export class ReferralRoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.roleService.enableReferral)
      return true;
    else {
      this.router.navigate(['/permission_denied'], {
        skipLocationChange: true, // minimal effect. see https://github.com/angular/angular/issues/17004
        queryParams: {
          url: state.url
        }
      });
      return false;
    }
  }
}

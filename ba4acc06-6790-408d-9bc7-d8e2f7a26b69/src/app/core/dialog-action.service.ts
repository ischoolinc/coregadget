import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogActionService {

  action$: BehaviorSubject<TemplateRef<any>>;

  constructor() {
    this.action$ = new BehaviorSubject<TemplateRef<any>>(null);
  }
}

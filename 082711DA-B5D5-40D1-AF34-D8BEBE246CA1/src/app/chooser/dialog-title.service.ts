import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DialogTitleService {

  title$: BehaviorSubject<TemplateRef<any> | null>;

  constructor() {
    this.title$ = new BehaviorSubject<TemplateRef<any> | null>(null);
  }

}

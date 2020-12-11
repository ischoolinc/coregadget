import { ListFormComponent } from '../list-form/list-form.component';
import { Injectable } from '@angular/core';

@Injectable()
export class ListControlService {

  constructor() { }

  list: ListFormComponent;

  public refreshList() {
    return this.list.loadDate();
  }
}

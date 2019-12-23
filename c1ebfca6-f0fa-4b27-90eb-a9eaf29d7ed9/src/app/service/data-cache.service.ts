import { Injectable } from '@angular/core';
import { ClassObj, ClassRecord } from './dsa.service';

@Injectable({
  providedIn: 'root'
})
export class DataCacheService {

  constructor() {
  }

  public selectedClass: ClassObj;

}


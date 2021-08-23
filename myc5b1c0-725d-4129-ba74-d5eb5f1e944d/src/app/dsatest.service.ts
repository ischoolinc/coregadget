import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Course } from './core/data/timetable';
import { DSAService } from './dsutil-ng/dsa.service';
import { DSAError } from './dsutil-ng/errors';

@Injectable({
  providedIn: 'root'
})
export class DsatestService {

  constructor(
    private dsa: DSAService,
  ) { }

}

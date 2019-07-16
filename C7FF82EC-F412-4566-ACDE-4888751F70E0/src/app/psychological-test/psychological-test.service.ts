import { Injectable } from '@angular/core';
import { Quiz } from './PsychologicalTest-vo';
@Injectable({
  providedIn: 'root'
})
export class PsychologicalTestService {

  constructor() { }

  public AllQuizList: Quiz[];
}


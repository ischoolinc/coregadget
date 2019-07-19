import { Injectable } from '@angular/core';
import { Quiz, ClassInfo } from './PsychologicalTest-vo';
@Injectable({
  providedIn: 'root'
})
export class PsychologicalTestService {

  constructor() { }

  // 題目
  public AllQuizList: Quiz[];
  
  // 班級
  public AllClassList: ClassInfo [];
}


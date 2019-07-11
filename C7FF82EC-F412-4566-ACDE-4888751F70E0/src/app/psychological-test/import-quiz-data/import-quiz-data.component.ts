import { Component, OnInit } from '@angular/core';
import { Quiz, QuizItem,  ItemCount } from '../PsychologicalTest-vo';
@Component({
  selector: 'app-import-quiz-data',
  templateUrl: './import-quiz-data.component.html',
  styleUrls: ['./import-quiz-data.component.css']
})
export class ImportQuizDataComponent implements OnInit {

  QuizData: Quiz = new Quiz();
  constructor() { }

  ngOnInit() {
  }

  save() {}

  onFileChange(){
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Quiz } from '../psychological-quiz-setup-vo';
import { DsaService } from "../../../dsa.service";

@Component({
  selector: 'app-del-psychological-quiz-data',
  templateUrl: './del-psychological-quiz-data.component.html',
  styleUrls: ['./del-psychological-quiz-data.component.css']
})
export class DelPsychologicalQuizDataComponent implements OnInit {

  quizData: Quiz = new Quiz();
  isCancel: boolean = true;
  constructor(private dsaService: DsaService) { }

  ngOnInit() {
  }

  cancel() {
    this.isCancel = true;
    $("#delPsychologicalQuizData").modal("hide");
  }

  del() {
    this.isCancel = false;
    this.DelCounselQuizByUID();
  }

  async DelCounselQuizByUID() {
    try {
      let resp = await this.dsaService.send("DelCounselQuizByUID", {
        Request: {
          QuizID: this.quizData.uid
        }
      });
      $("#delPsychologicalQuizData").modal("hide");
    } catch (err) {
      alert(err.dsaError.message);
    }
  }
}

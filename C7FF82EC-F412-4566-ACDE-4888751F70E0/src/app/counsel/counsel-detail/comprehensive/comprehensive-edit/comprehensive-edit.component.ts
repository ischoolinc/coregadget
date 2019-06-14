import { Component, OnInit, Optional } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  ParamMap,
  RoutesRecognized
} from "@angular/router";
import { DsaService } from 'src/app/dsa.service';
import { ComprehensiveComponent } from '../comprehensive.component';


@Component({
  selector: 'app-comprehensive-edit',
  templateUrl: './comprehensive-edit.component.html',
  styleUrls: ['./comprehensive-edit.component.css']
})
export class ComprehensiveEditComponent implements OnInit {

  isLoading = true;
  isSaving = false;
  studentID: string;
  fillInSectionId: string;
  fillInData: any[] = [];

  keySize: any = {
    '%TEXT%': '100px',
    '%TEXT1%': '30px',
    '%TEXT2%': '60px',
    '%TEXT3%': '100px',
    '%TEXT4%': '150px',
    '%TEXT5%': '300px',
    '%TEXTAREA%': '100%',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private dsaService: DsaService,
    @Optional()
    private comprehensiveComponent: ComprehensiveComponent
  ) { }

  ngOnInit() {
    this.studentID = this.comprehensiveComponent.studentID;
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.fillInSectionId = params.get("sectionID");
        this.comprehensiveComponent.setCurrentFillInSection(this.fillInSectionId, "edit");
        this.getFillInData();
      }
    );
  }

  async getFillInData() {
    this.isLoading = true;
    this.fillInData = [];
    try {
      if (this.fillInSectionId) {

        var fillInData = await this.dsaService.send("GetFillInData", {
          Request: {
            StudentID: this.studentID,
            FillInSectionID: this.fillInSectionId,
          }
        });
        fillInData.QuestionSubject = [].concat(fillInData.QuestionSubject || []);
        fillInData.QuestionSubject.forEach((subject) => {
          subject.QuestionGroup = [].concat(subject.QuestionGroup || []);
          subject.QuestionGroup.forEach(group => {
            group.QuestionQuery = [].concat(group.QuestionQuery || []);
            group.QuestionQuery.forEach(query => {
              query.HasText = false;
              query.QuestionText = [].concat(query.QuestionText || []);
              query.QuestionText.forEach(text => {
                if (text.Text) {
                  query.HasText = true;
                }
                text.Require = (text.Require == "true");
                text.Option = [].concat(text.Option || []);
                text.Option.forEach(option => {
                  option.AnswerChecked = (option.AnswerChecked == "true");
                  option.AnswerMatrix = [].concat(JSON.parse('' + option.AnswerMatrix) || []);
                  option.AnswerComplete = (option.AnswerComplete == "true");

                  option.change = function () {
                    switch (text.Type) {
                      case '單選':
                        if (!option.AnswerChecked) {
                          option.AnswerChecked = true;
                        }
                        text.Option.forEach(optionC => {
                          if (optionC != option) {
                            optionC.AnswerChecked = false;
                          }
                        });
                        break;
                      case '複選':
                        option.AnswerChecked = !option.AnswerChecked;
                        break;
                    }
                  };


                  option.Template = [];
                  var keyWord = [];
                  for (var key in this.keySize) {
                    keyWord.push(key);
                  }
                  keyWord.reverse();

                  var keySplit = function (query, keyWord) {
                    var key = keyWord.pop();
                    var list = query.split(key);

                    list.forEach(function (item, index) {
                      if (keyWord.length > 0) {
                        if (item)
                          keySplit(item, [].concat(keyWord));
                      }
                      else {
                        if (item == "" && (index == 0 || index + 1 == list.length)) {

                        }
                        else {
                          option.Template.push(item);
                        }
                      }
                      if (index + 1 != list.length) {
                        option.Template.push(key);
                      }
                    });
                  }
                  keySplit(option.OptionText, keyWord);
                });
              });
            });
          });
        });
        this.fillInData = fillInData.QuestionSubject;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }
}

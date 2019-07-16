import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-comprehensive-fill',
  templateUrl: './comprehensive-fill.component.html',
  styleUrls: ['./comprehensive-fill.component.css']
})
export class ComprehensiveFillComponent implements OnInit {

  dsns: string;
  fillInKey: string;

  schoolInfo: any;
  studentInfo: any;
  sectionInfo: any;

  questionSubject: any[] = [];
  requireList: any[];
  optionCodeMapping: any = {};

  isSaving: boolean = false;

  config: any = { key: "" };

  optionKey: any = {
    '%TEXT%': { element: 'input', style: { width: '100px' } },
    '%TEXT1%': { element: 'input', style: { width: '30px' } },
    '%TEXT2%': { element: 'input', style: { width: '60px' } },
    '%TEXT3%': { element: 'input', style: { width: '100px' } },
    '%TEXT4%': { element: 'input', style: { width: '150px' } },
    '%TEXT5%': { element: 'input', style: { width: '300px' } },
    '%TEXTAREA%': { element: 'textarea', style: { width: '100%' } }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.dsns = params.get("dsns");
        this.fillInKey = params.get("fill_in_key");//'A123456789'
        this.getSchoolInfo();
      }
    );
  }

  getSchoolInfo() {
    dsutil.creatConnection(this.dsns + "/1campus.counsel.public").send({
      service: "GetSchoolInfo",
      body: null,
      result: (rsp, err, xmlhttp) => {
        this.schoolInfo = rsp;
        if (this.fillInKey)
          this.getFillInData(false);
        else {
          $("#modal-key").modal({ show: true, backdrop: false, keyboard: false, focus: true });
        }
      }
    });
  }

  getFillInData(closeModal) {
    dsutil.creatConnection(this.dsns + "/1campus.counsel.public").send({
      service: "GetFillInData",
      body: { FillInKey: this.fillInKey },
      result: (rsp, err, xmlhttp) => {
        if(closeModal)
          $("#modal-key").modal('hide');
        rsp.QuestionSubject = [].concat(rsp.QuestionSubject || []);
        rsp.QuestionSubject.forEach((subject) => {
          subject.QuestionGroup = [].concat(subject.QuestionGroup || []);
          subject.QuestionGroup.forEach(group => {
            group.QuestionQuery = [].concat(group.QuestionQuery || []);
            group.QuestionQuery.forEach(query => {
              query.HasText = false;
              query.ShowMark = false;

              query.QuestionText = [].concat(query.QuestionText || []);
              query.QuestionText.forEach(text => {
                if (text.Text) {
                  query.HasText = true;
                }
                text.Require = (text.Require == "true");
                text.RequireLink = text.RequireLink || "";

                text.ShowMark = false;

                text.Option = [].concat(text.Option || []);
                text.Option.forEach(option => {
                  option.AnswerChecked = (option.AnswerChecked == "true");
                  option.AnswerComplete = (option.AnswerComplete == "true");

                  if (option.OptionCode) {
                    this.optionCodeMapping[option.OptionCode] = option;
                  }

                  switch (text.Type) {
                    case "單選":
                      option.change = () => {
                        if (!option.AnswerChecked) {
                          option.AnswerChecked = true;
                        }
                        text.Option.forEach(optionC => {
                          if (optionC != option) {
                            optionC.AnswerChecked = false;
                          }
                        });
                        this.refreshMark();
                      };
                      break;
                    case "複選":
                      option.change = () => {
                        option.AnswerChecked = !option.AnswerChecked;
                        this.refreshMark();
                      };
                      break;
                    case "填答":
                      option.AnswerChecked = true;
                      break;
                  }

                  option.AnswerMatrix = [].concat(JSON.parse(option.AnswerMatrix || '[]') || []);
                  option.IsTextArea = false;
                  option.Template = [];
                  //分割OptionText進Template
                  var splitTemplate = () => {
                    var keyWord = [];
                    for (var key in this.optionKey) {
                      keyWord.push(key);
                    }
                    keyWord.reverse();

                    var keySplit = (query, keyWord) => {
                      var key = keyWord.pop();
                      var list = query.split(key);

                      list.forEach((item, index) => {
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
                          if (this.optionKey[key].element == 'textarea') { option.IsTextArea = true; }
                          option.Template.push(key);
                        }
                      });
                    }
                    keySplit(option.OptionText, keyWord);
                  };
                  splitTemplate();
                });
              });
            });
          });
        });
        this.sectionInfo = rsp.Section;
        this.studentInfo = rsp.Student;
        this.questionSubject = rsp.QuestionSubject;
        this.changeDetectorRef.detectChanges();
        this.refreshMark();
      }
    });
  }

  refreshMark() {
    this.requireList = [];
    this.questionSubject.forEach(subject => {
      subject.QuestionGroup.forEach(group => {
        group.QuestionQuery.forEach(query => {
          query.ShowMark = false;
          query.QuestionText.forEach(text => {
            text.ShowMark = false;

            var hasChecked = false;
            var hasAllComplete = true;
            text.Option.forEach(option => {
              if (option.AnswerChecked) {
                option.AnswerComplete = true;
                hasChecked = true;
                option.Template.forEach((templateItem, index) => {
                  if (this.optionKey[templateItem]) {
                    if (!option.AnswerMatrix[index]) {
                      option.AnswerComplete = false;
                      hasAllComplete = false;
                    }
                  }
                  else {
                    if (option.AnswerMatrix.length > index) {
                      option.AnswerMatrix[index] = templateItem;
                    }
                    else {
                      option.AnswerMatrix.push(templateItem);
                    }
                  }
                });
                option.AnswerValue = option.AnswerMatrix.join("");
              }
              else {
                option.AnswerComplete = true;
                option.AnswerValue = "";
              }
            });

            if (
              text.Require ||
              (
                text.RequireLink
                && this.optionCodeMapping[text.RequireLink]
                && this.optionCodeMapping[text.RequireLink].AnswerChecked
              )
            ) {
              if (!hasChecked || !hasAllComplete) {
                // this.requireCount++;
                if (text.Text) {
                  this.requireList.push(subject.Subject + "/" + group.Group + "/" + query.Query + "/" + text.Text);
                  text.ShowMark = true;
                }
                else {
                  this.requireList.push(subject.Subject + "/" + group.Group + "/" + query.Query);
                  query.ShowMark = true;
                }
              }
            }
          });
        });
      });
    });
  }
  showRequireList() {
    alert(this.requireList.join("\n"));
  }

  setConfig(){
    if(this.config.key){
      this.fillInKey = this.config.key;
      this.getFillInData(true);
    }
  }

  async save() {
    if (this.isSaving) { return; }
    this.isSaving = true;
    const options = [];
    for (const subject of this.questionSubject) {
      for (const group of subject.QuestionGroup) {
        for (const query of group.QuestionQuery) {
          query.QuestionText.forEach(text => {
            text.Option.forEach(option => {
              options.push({
                AnswerChecked: option.AnswerChecked,
                AnswerComplete: option.AnswerComplete,
                AnswerID: option.AnswerID,
                AnswerMatrix: JSON.stringify(option.AnswerMatrix),
                AnswerValue: option.AnswerValue,
                OptionCode: option.OptionCode,
                OptionText: option.OptionText,
              });
            });
          });
        }
      }
    }
    console.log(options);
    dsutil.creatConnection(this.dsns + "/1campus.counsel.public").send({
      service: "SetFillInData",
      body: {
        FillInKey: this.fillInKey,
        Option: options
      },
      result: (rsp, err, xmlhttp) => {
        if (!err)
          alert("儲存完成");
        else {
          console.log(err);
          alert("儲存發生錯誤：\n" + JSON.stringify(err, null, 4));
        }
        this.isSaving = false;
      }
    });
  }
}

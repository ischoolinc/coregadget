
import { Component, OnInit, Optional, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-counsel-doc-editor',
  templateUrl: './counsel-doc-editor.component.html',
  styleUrls: ['./counsel-doc-editor.component.css']
})
export class CounselDocEditorComponent implements OnInit {

  reportData: any;

  config: any = {
    configName: ""
    , configXml: ""
  }

  constructor() { }

  ngOnInit() {
    $("#modal-editor").modal('show');
  }

  setConfig() {
    if (this.config.configXml) {
      try {
        var template = xml2json.parser(this.config.configXml).Template || {};
        template.FormPage = [].concat(template.FormPage || []);

        template.FormPage.forEach(formPage => {
          formPage.FormSubject = [].concat(formPage.FormSubject || []);
          formPage.FormSubject.forEach(formSubject => {
            var subjectCount = 0;
            formSubject.FormGroup = [].concat(formSubject.FormGroup || []);
            formSubject.FormGroup.forEach(formGroup => {
              var groupCount = 0;
              formGroup.FormQuery = [].concat(formGroup.FormQuery || []);
              formGroup.FormQuery.forEach(formQuery => {
                groupCount++;
                subjectCount++;
                formQuery.FormText = [].concat(formQuery.FormText || []);
              });
              formGroup.rowCount = groupCount;
            });
            formSubject.rowCount = subjectCount;
          });
        });

        this.reportData = {
          ReportName: this.config.configName
          , Template: template
        }
      }
      catch (exc) {
        alert("XML解析失敗：" + exc);
      }
      $("#modal-editor").modal('hide');
    }
  }
}

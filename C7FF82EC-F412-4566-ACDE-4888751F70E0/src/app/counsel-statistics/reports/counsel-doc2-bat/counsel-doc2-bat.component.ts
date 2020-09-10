import { Component, OnInit, Optional, TemplateRef, ViewChild, Input } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { DsaService } from 'src/app/dsa.service';
import { StudentDocument } from '../../CounselStatistics-vo';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-counsel-doc2-bat',
  templateUrl: './counsel-doc2-bat.component.html',
  styleUrls: ['./counsel-doc2-bat.component.css']
})
export class CounselDoc2BatComponent implements OnInit {
  isLoading = false;
  classID: string;
  printDocumentID: string;
  className: string = "";
  reportDataList: any[] = [];
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    private title: Title) { }

  ngOnInit() {
   
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.classID = params.get("classID");
        this.printDocumentID = params.get("printDocumentID");
        this.title.setTitle(params.get("title"));
        this.getReportData();
      }
    );
  }

  
  async getReportData() {

    this.isLoading = true;

    let StudentDocumentIDs: StudentDocument[] = [];
    // 透過班級ID 取得 student id
    try {
      let resp = await this.dsaService.send("GetStudentIDByClassID", {
        Request: {
          ClassIDs: this.classID
        }
      });

      let data = [].concat(resp.Student || []);

      if (data.length > 0) {

        data.forEach(item => {
          let da: StudentDocument = new StudentDocument();
          da.ClassID = item.ClassID;
          da.GradeYear = item.GradeYear;
          da.StudentID = item.StudentID;
          da.PrintDocumentID = this.printDocumentID;
          StudentDocumentIDs.push(da);
        });


      } else {
        alert("沒有資料");
      }
    } catch (err) {
      alert(err.dsaError.message);
    }

    try {
      
      for(const item of StudentDocumentIDs)
      {
        var reportData: any;

        reportData = await this.dsaService.send("GetPrintDocumentDetail", {
          StudentID: item.StudentID
          , PrintDocumentID: this.printDocumentID
        });
        var template = reportData.Template || {};
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
        this.reportDataList.push(reportData);
      }
     
    
    } catch (error) {
      alert(error.dsaError.message);
    } finally {
      this.isLoading = false;
    }
  }
}

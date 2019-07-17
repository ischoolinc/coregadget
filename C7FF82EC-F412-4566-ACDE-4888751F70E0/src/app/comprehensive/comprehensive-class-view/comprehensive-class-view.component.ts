import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DsaService } from '../../dsa.service';
import { ComprehensiveComponent } from "../comprehensive.component";

@Component({
  selector: 'app-comprehensive-class-view',
  templateUrl: './comprehensive-class-view.component.html',
  styleUrls: ['./comprehensive-class-view.component.css']
})
export class ComprehensiveClassViewComponent implements OnInit {

  fillInSectionID: string;
  classID: string;

  subjectList: string[];
  studentList: any[];

  dsns: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    @Optional()
    private comprehensiveComponent: ComprehensiveComponent
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.fillInSectionID = params.get("fill_in_section_id");
        this.classID = params.get("class_id");
        this.comprehensiveComponent.currentMode="view";
        this.comprehensiveComponent.sectionList.forEach(sectionRec => {
          if (sectionRec.FillInSectionID == this.fillInSectionID) {
            this.comprehensiveComponent.currentSection = sectionRec;
            sectionRec.Class.forEach(classRec => {
              if (classRec.ClassID == this.classID)
                this.comprehensiveComponent.currentClass = classRec;
            });
          }
        });
        this.comprehensiveComponent.changeDetectorRef.detectChanges();

        this.dsns = gadget.getApplication().accessPoint;
        this.load();
      }
    );
  }
  async load() {
    try {
      var rsp = await this.dsaService.send("GetFillInSectionClassStudent", { FillInSectionID: this.fillInSectionID, ClassID: this.classID });
      this.subjectList = [].concat(rsp.Subject || []);
      this.studentList = [].concat(rsp.Student || []);
      this.studentList.forEach(stuRec => {
        stuRec.Status = {};
        stuRec.Subject = [].concat(stuRec.Subject || []);
        stuRec.Subject.forEach(ss => {
          stuRec.Status[ss.Name] = ss.Finished == "true" ? "已完成" : "未完成";
        });
      });
    }
    catch (err) {
      alert(err);
    }
  }
}

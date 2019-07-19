import { Component, OnInit, Optional, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DsaService } from '../../dsa.service';
import { ComprehensiveComponent } from "../comprehensive.component";

@Component({
  selector: 'app-comprehensive-section',
  templateUrl: './comprehensive-section.component.html',
  styleUrls: ['./comprehensive-section.component.css']
})
export class ComprehensiveSectionComponent implements OnInit {

  fillInSectionID: string;
  statusCheck: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    public changeDetectorRef: ChangeDetectorRef,
    @Optional()
    public comprehensiveComponent: ComprehensiveComponent
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap): void => {
        this.fillInSectionID = params.get("fill_in_section_id");
        this.comprehensiveComponent.currentMode="view";
        this.comprehensiveComponent.currentClass = null;
        this.comprehensiveComponent.plugin = null;
        
        this.comprehensiveComponent.sectionList.forEach(sectionRec => {
          if (sectionRec.FillInSectionID == this.fillInSectionID) {
            this.comprehensiveComponent.currentSection = sectionRec;
          }
        });
        this.comprehensiveComponent.currentSection.Class.forEach(classRec => {
          this.comprehensiveComponent.currentSection.Subject.forEach(subject => {
            if (classRec.Subject.indexOf(subject) >= 0) {
              this.statusCheck[classRec.ClassName + "_" + subject] = "...";
            }
            else {
              this.statusCheck[classRec.ClassName + "_" + subject] = "--";
            }
          });
        });
        this.comprehensiveComponent.currentSection.Subject.forEach(subject => {
          gadget.getContract("1campus.counsel.teacher").send({
            service: "GetFillInSectionClassCount",
            body: {
              FillInSectionID: this.fillInSectionID,
              Subject: subject
            },
            result: (rsp, err, xmlhttp) => {
              if (err) {
                alert(err);
              } else {
                this.comprehensiveComponent.currentSection.Class.forEach(classRec => {
                  if (classRec.Subject.indexOf(subject) >= 0) {
                    this.statusCheck[classRec.ClassName + "_" + subject] = "已完成";
                  }
                  else {
                    this.statusCheck[classRec.ClassName + "_" + subject] = "--";
                  }
                });
                [].concat(rsp.Class || []).forEach(classRec => {
                  this.statusCheck[classRec.ClassName + "_" + subject] = classRec.Count;
                });
              }
              this.changeDetectorRef.detectChanges();
            }
          });
        });
        this.comprehensiveComponent.changeDetectorRef.detectChanges();
      }
    );
  }
}

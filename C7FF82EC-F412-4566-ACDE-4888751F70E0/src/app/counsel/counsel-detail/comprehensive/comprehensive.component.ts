import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprehensiveService } from './comprehensive.service';
import { CounselDetailComponent } from "../counsel-detail.component";
import { DsaService } from '../../../dsa.service';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.css']
})
export class ComprehensiveComponent implements OnInit {

  isLoading = true;
  isSaving = false;
  studentID: string;
  mode: string;

  fillInSection: any[];
  currentFillInSection: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private comprehensiveSrv: ComprehensiveService,
    private dsaService: DsaService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent
  ) { }

  async ngOnInit() {
    this.counselDetailComponent.setCurrentItem("comprehensive");
    this.studentID = this.counselDetailComponent.currentStudent.StudentID;

    this.isLoading = true;
    this.fillInSection = [];
    this.currentFillInSection = {};
    try {
      const rsp = await this.dsaService.send("GetFillInSection", {
        StudentID: this.studentID
      });
      this.fillInSection = [].concat(rsp.FillInSection || []);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  setCurrentFillInSection(sectionID: string, mode: string) {
    this.mode = mode;
    this.fillInSection.forEach((section) => {
      if (section.FillInSectionID == sectionID) {
        this.currentFillInSection = section;
      }
    });
  }
}

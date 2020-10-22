import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CounselDetailComponent } from '../../../shared-counsel-detail/counsel-detail.component';
import { DsaService } from '../../../dsa.service';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.css']
})
export class ComprehensiveDetailComponent implements OnInit {

  isLoading = true;
  isSaving = false;
  studentID: string;

  public comprehensiveStr: string = "綜合紀錄表";

  fillInSemester: any[];
  currentFillInSemester: any;

  plugin: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dsaService: DsaService,
    @Optional()
    private counselDetailComponent: CounselDetailComponent
  ) { }

  async ngOnInit() {
    this.counselDetailComponent.setCurrentItem("comprehensive");
    this.studentID = this.counselDetailComponent.currentStudent.StudentID;

    // 預設
    this.comprehensiveStr = "綜合紀錄表";

    if (gadget.params.system_counsel_position === 'freshman') {
      // 新生特有
      this.comprehensiveStr = "填報資料";
    }


    this.isLoading = true;
    this.fillInSemester = [];
    this.currentFillInSemester = {};
    try {
      const rsp = await this.dsaService.send("GetFillInSemester", {
        StudentID: this.studentID
      });
      this.fillInSemester = [].concat(rsp.FillInSemester || []);
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  setCurrentSemester(schoolYear: string, semester: string) {
    this.currentFillInSemester = null;
    this.fillInSemester.forEach(sem => {
      if (sem.SchoolYear == schoolYear && sem.Semester == semester) {
        this.currentFillInSemester = sem;
      }
    });
  }
  // setCurrentFillInSection(sectionID: string) {
  //   this.fillInSection.forEach((section) => {
  //     if (section.FillInSectionID == sectionID) {
  //       this.currentFillInSection = section;
  //     }
  //   });
  // }
}

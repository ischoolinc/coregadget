import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ComprehensiveService } from '../comprehensive.service';
import { FormControl } from '@angular/forms';
// import alldata from './../example0';
import { QQuery, QSubject } from '../core/data_model';

@Component({
  selector: 'app-comprehensive-fill',
  templateUrl: './comprehensive-fill.component.html',
  styleUrls: ['./comprehensive-fill.component.css']
})
export class ComprehensiveFillComponent implements OnInit {

  isLoading = true;
  isSaving = false;
  studentId: string;
  fillInSectionId: string;
  fulldata: QSubject[] = [];

  constructor(private route: ActivatedRoute,
    private comprehensiveSrv: ComprehensiveService) { }

  ngOnInit() {
    this.route.parent.parent.paramMap.subscribe((params: ParamMap): void => {
      this.studentId = params.get('studentID');
      if (this.studentId) {
        this.getLastFillInSection();
      }
    });
  }

  async getLastFillInSection() {
    try {
      // for (const subject of alldata) {
      //   for (const group of subject.QuestionGroup) {
      //     for (const query of group.QuestionQuery) {
      //       (query as any).QuestionTextControls = new FormControl(query.QuestionText);
      //     }
      //   }
      // }
      // this.fulldata = alldata as QSubject[];

      const rsp = await this.comprehensiveSrv.getFillInSection(this.studentId);
      this.fillInSectionId = rsp[0] && rsp[0].FillInSectionID;
      if (this.fillInSectionId) {
        const fulldata = await this.comprehensiveSrv.getFillInData(this.studentId, this.fillInSectionId);
        for (const subject of fulldata) {
          for (const group of subject.QuestionGroup) {
            for (const query of group.QuestionQuery) {
              query.QuestionTextControls = new FormControl(query.QuestionText);
            }
          }
        }
        this.fulldata = fulldata;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  async save() {
    try {
      if (this.isSaving) { return; }

      this.isSaving = true;
      const data = [];
      for (const subject of this.fulldata) {
        for (const group of subject.QuestionGroup) {
          for (const query of group.QuestionQuery) {
            console.log(query.QuestionTextControls.value);
          }
        }
      }
      this.isSaving = false;
    } catch (error) {
      console.log('error');
    }
  }
}

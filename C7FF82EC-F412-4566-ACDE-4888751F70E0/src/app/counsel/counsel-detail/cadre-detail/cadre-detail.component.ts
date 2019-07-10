import { Component, OnInit } from '@angular/core';
import { CounselStudentDataService, CadreRecord } from '../../../counsel-student-data.service';
import { CounselDetailComponent } from '../../counsel-detail/counsel-detail.component';

@Component({
  selector: 'app-cadre-detail',
  templateUrl: './cadre-detail.component.html',
  styleUrls: ['./cadre-detail.component.css']
})
export class CadreDetailComponent implements OnInit {

  isLoading: boolean;
  // 目前學生編號
  studentID: string;
  // 幹部資料
  cadreList: CadreRecord[] = [];

  constructor(
    private stuDataSrv: CounselStudentDataService,
    private counselDetailComponent: CounselDetailComponent
  ) { }

  async ngOnInit() {

    try {
      this.isLoading = true;
      this.studentID = this.counselDetailComponent.currentStudent.StudentID;
      // 取得學生幹部資料
      {
        const body = `
<Request>
    <StudentID>
      ${this.studentID}
    </StudentID>
</Request>
      `;
        this.cadreList = await this.stuDataSrv.getStudentCadre(body);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

}

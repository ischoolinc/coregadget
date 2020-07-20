import { Component, OnInit } from '@angular/core';
import { CounselStudentDataService, ServiceLearningRecord } from '../../../counsel-student-data.service';
import { CounselDetailComponent } from '../../../shared-counsel-detail';


@Component({
  selector: 'app-service-learning-detail',
  templateUrl: './service-learning-detail.component.html',
  styleUrls: ['./service-learning-detail.component.css']
})
export class ServiceLearningDetailComponent implements OnInit {

  isLoading: boolean;
  // 目前學生編號
  studentID: string;
  // 服務學習資料
  serviceList: ServiceLearningRecord[] = [];

  constructor(
    private stuDataSrv: CounselStudentDataService,
    private counselDetailComponent: CounselDetailComponent
  ) { }

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.studentID = this.counselDetailComponent.currentStudent.StudentID;
      // 取得學生服務學習資料
      {
        const body = `
<Request>
    <StudentID>
      ${this.studentID}
    </StudentID>
</Request>
      `;
        this.serviceList = await this.stuDataSrv.getStudentServiceLearning(body);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

}

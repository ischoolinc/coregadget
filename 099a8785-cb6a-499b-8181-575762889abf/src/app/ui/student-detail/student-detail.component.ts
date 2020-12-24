import { DisciplineService, parseXmlDisciplineDetail, studentInfoDetail } from './../../dal/discipline.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  selectedSeatNum: string;
  selectedId: string;
  selectedName: string;
  sortedStudentList = [];
  studentInfoTable: Map<string, studentInfoDetail[]> = new Map();
  studentDetail: parseXmlDisciplineDetail[] = [];
  constructor(private disciplineService: DisciplineService) { }

  async ngOnInit(): Promise<void> {
    this.selectedSeatNum = this.disciplineService.selectedSeatNum;
    console.log('seatNum', this.disciplineService.selectedSeatNum);
    this.selectedId = this.disciplineService.selectedStudentID;
    this.selectedName = this.disciplineService.selectedName;
    this.studentDetail = await this.disciplineService.getStudentDisciplineDetail(this.selectedId);
    await this.parseDetail();
  }

  parseDetail() {
    this.studentDetail.forEach((detail) => {
      const tableKey = `${detail.school_year}_${detail.semester}`;
      if (!this.studentInfoTable.get(tableKey)) {
        this.studentInfoTable.set(tableKey, []);
      }
      const tempDetail = this.studentInfoTable.get(tableKey);
      tempDetail.push(new studentInfoDetail(detail, this.selectedSeatNum, this.selectedName));
      this.studentInfoTable.set(tableKey, tempDetail);
    });
    console.log(this.studentInfoTable);
  }

  getArray() {
    return Array.from(this.studentInfoTable);
  }

  parseTableKey(content:string) {
    const text = content.split('_');
    return `${text[0]}學年第${text[1]}學期`;
  }
}

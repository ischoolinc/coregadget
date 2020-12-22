import { DisciplineService } from './../../dal/discipline.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  selectedId: string;
  selectedName: string;
  sortedStudentList = [];
  constructor(private disciplineService: DisciplineService) { }

  ngOnInit(): void {
    this.selectedId = this.disciplineService.selectedStudentID;
    this.selectedName = this.disciplineService.selectedName;
  }

}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PlanService } from '../../core/plan.service';

@Component({
  selector: 'app-plan-config',
  templateUrl: './plan-config.component.html',
  styleUrls: ['./plan-config.component.scss']
})
export class PlanConfigComponent implements OnInit {

  displayedColumns: string[] = ['course_type', 'group_type', 'entry_year', 'group_code', 'setting'];
  dataSource = new MatTableDataSource<GroupCodeRec>();;

  constructor(
    private planSrv: PlanService
  ) { }

  ngOnInit(): void {
    this.getGroupCode();
  }

  async getGroupCode () {
    const rsp = await this.planSrv.getMoeGroupCode();
    this.dataSource.data = [].concat(rsp.code || []);
  }

}

interface GroupCodeRec {
  course_type: string;
  group_type: string;
  entry_year: string;
  group_code: string;
  // --
  setting: boolean;
}

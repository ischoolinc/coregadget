import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicService } from '../../../service';

@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css']
})
export class AdmissionListComponent implements OnInit {

  loadState: 'finish' | 'loading' | 'error' = 'loading';
  admittedList: any[] = [];
  waitingList: any[] = [];

  @Input() alumniId:string;
  @Output() onClickMyName = new EventEmitter();

  constructor(
    private basicSrv: BasicService,
  ) { }

  async ngOnInit() {
    try {
      // 取得單一課程正備取名單
      if (this.alumniId) {
        const rsp = await this.basicSrv.getAdmissionList(this.alumniId);

        const data1 = [];
        const data2 = [];
        for (const item of rsp) {
          if (item.IsAdmitted === 't') {
            data1.push(item);
          } else {
            data2.push(item);
          }
        }
        this.admittedList = data1;
        this.waitingList = data2;
        this.loadState = 'finish';
      } else {
        this.loadState = 'error';
      }
    } catch (error) {
      this.loadState = 'error';
    }
  }

  clickMyName() {
    this.onClickMyName.emit();
  }
}

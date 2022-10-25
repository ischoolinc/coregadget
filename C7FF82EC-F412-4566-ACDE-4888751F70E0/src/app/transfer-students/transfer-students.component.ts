import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DsaService } from '../dsa.service';

@Component({
  selector: 'app-transfer-students',
  templateUrl: './transfer-students.component.html',
  styleUrls: ['./transfer-students.component.css']
})
export class TransferStudentsComponent implements OnInit {

  isLoading = true;
  deny = false;
  currentItem: 'TRANSFER_IN' | 'TRANSFER_OUT' = 'TRANSFER_IN';
  hasNewTransferIn = false;
  hasNewTransferOut = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional() private appComponent: AppComponent,
    private dsaService: DsaService,
  ) {
    if (this.appComponent) this.appComponent.currentComponent = "transfer-students";
  }

  async ngOnInit() {
    if (this.appComponent) {
      const pointState = await this.appComponent.getRadPointState();
      this.hasNewTransferIn = !!(pointState.find(v => v.Code === '轉入申請' && v.Enabled === 't'));
      this.hasNewTransferOut = !!(pointState.find(v => v.Code === '轉出核可' && v.Enabled === 't'));
    }

    this.isLoading = false;
  }

  async routeTo(to) {

    if (to === 'transfer_in') {
      await this.dsaService.send('TransferStudent.SetRedPoint', {
        Code: '轉入申請',
        Enabled: 'false',
      });
      if (this.appComponent) this.appComponent.checkHasNewTransfer();
      this.hasNewTransferIn = false;
    } else if (to === 'transfer_out') {
      await this.dsaService.send('TransferStudent.SetRedPoint', {
        Code: '轉出核可',
        Enabled: 'false',
      });
      if (this.appComponent) this.appComponent.checkHasNewTransfer();
      this.hasNewTransferOut = false;
    }

    //讓特效跑
    setTimeout(
      function () {
        this.router.navigate([].concat(to || []), {
          relativeTo: this.activatedRoute
        });
      }.bind(this),
      200
    );
  }

}

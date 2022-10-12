import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transfer-students',
  templateUrl: './transfer-students.component.html',
  styleUrls: ['./transfer-students.component.css']
})
export class TransferStudentsComponent implements OnInit {

  isLoading = true;
  deny = false;
  currentItem: 'TRANSFER_IN' | 'TRANSFER_OUT' = 'TRANSFER_IN';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.isLoading = false;
  }

  routeTo(to) {
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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PlanRec } from 'src/app/data';
import { PlanModel } from 'src/app/state/plan.state';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {

  @Select((state: { plan: any; }) => state.plan)plan$: Observable<PlanModel> | undefined;
  planList: PlanRec[] = [];
  planForm = new FormGroup({
    year: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    plan: new FormControl(null, [Validators.required])
  });

  constructor(
    public dialogRef: MatDialogRef<NewPlanComponent>
  ) { }

  ngOnInit(): void {
    this.plan$?.pipe(
      take(1)
    ).subscribe(v => {
      this.planList = v.planList;
    });
  }

  save() {
    this.dialogRef.close({
      year: this.planForm.get('year')?.value,
      name: this.planForm.get('name')?.value,
      plan: this.planForm.get('plan')?.value
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}

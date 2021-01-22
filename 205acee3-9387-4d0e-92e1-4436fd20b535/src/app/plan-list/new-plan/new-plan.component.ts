import { Jsonx } from '@1campus/jsonx';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PlanRec } from 'src/app/data';
import { NewPlan } from 'src/app/state/plan.action';
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
    public dialogRef: MatDialogRef<NewPlanComponent>,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.plan$?.pipe(
      take(1)
    ).subscribe(v => {
      // 自訂課程規劃表名稱驗證規則
      this.planForm.get('name')?.setValidators([Validators.required, PlanNameValidator(v.planList)]);
      this.planList = [{id: '', name: '== 不複製現有課程規劃 ==', content: '', school_year: ''}].concat(v.planList);
    });
  }

  save() {
    const year = this.planForm.get('year')?.value;
    const name = this.planForm.get('name')?.value;
    const plan:PlanRec = this.planForm.get('plan')?.value;

    if (plan.id) { // 複製現有課程規劃表
      const jx = Jsonx.parse(plan.content);
      if (year > 0) {
        jx.child('GraduationPlan').setAttr('SchoolYear', year);
        this.store.dispatch(new NewPlan(name, jx.toXml())).pipe(
          take(1)
        ).subscribe(() => {
          this.close();
        });
      } else { // 不分入學年
        const subjectContent = jx.child('GraduationPlan').children('Subject').toXml('Subject');
        this.store.dispatch(new NewPlan(name, `<GraduationPlan>${subjectContent}</GraduationPlan>`)).pipe(
          take(1)
        ).subscribe(() => {
          this.close();
        });
      }
    } else {
      if (year > 0) {
        this.store.dispatch(new NewPlan(name, `<GraduationPlan SchoolYear="${year}"></GraduationPlan>`)).pipe(
          take(1)
        ).subscribe(() => {
          this.close();
        });
      } else {
        this.store.dispatch(new NewPlan(name, `<GraduationPlan></GraduationPlan>`)).pipe(
          take(1)
        ).subscribe(() => {
          this.close();
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

}

export function PlanNameValidator(plans: PlanRec[]): ValidatorFn {
  return (control: AbstractControl) => {
      const forbidden = plans.find(plan => plan.name === control.value);
      return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

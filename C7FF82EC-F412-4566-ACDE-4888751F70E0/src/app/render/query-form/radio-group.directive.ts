import { Directive, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

/** 負責取得 Question FormGroup */
@Directive({
  selector: '[formGroup][appRadioGroup],[formGroupName][appRadioGroup]'
})
export class RadioGroupDirective {

  constructor(
    private parent: ControlContainer
  ) { }

  public get formGroup(): FormGroup {
    return this.parent.control as FormGroup;
  }
}

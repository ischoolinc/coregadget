import { Component, Input, Optional } from '@angular/core';
import { RadioGroupDirective } from './radio-group.directive';


let nextUniqueId = 0;

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent {

  inputId = `input_radio_${nextUniqueId++}`;
  checked: boolean = false;
  _disabled = false;
  _required = false;

  @Input() tabIndex: number | undefined;
  @Input() name: string | undefined;
  @Input() value: any;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled) {
    this._disabled = this.coerceBooleanProperty(disabled);
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(required) {
    this._required = this.coerceBooleanProperty(required);
  }

  constructor(@Optional() private radioGroup: RadioGroupDirective) {
    if (this.radioGroup) {
      radioGroup.radios.push(this);
    } else {
      console.log('你是不是忘了加 appRadioGroup directive.');
    }
  }

  onInputChange(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this.radioGroup.checkRadio(this);
    }
  }

  onInputClick(event: Event) {
    event.stopPropagation();
  }

  private coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }
}

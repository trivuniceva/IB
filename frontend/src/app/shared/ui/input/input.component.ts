import {Component, EventEmitter, Input, Output, forwardRef} from '@angular/core';
import {CommonModule, NgSwitch, NgSwitchCase} from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';


@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  private internalValue: any;

  @Output() valueChange = new EventEmitter<any>();

  @Input() min?: number;
  @Input() max?: number;


  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.internalValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @Input()
  get value(): any {
    return this.internalValue;
  }
  set value(val: any) {
    this.internalValue = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onInput(value: any): void {
    this.internalValue = value;
    this.onChange(this.internalValue);
    this.valueChange.emit(this.internalValue);
  }

  onNumberInput(event: Event) {
    let inputValue = +(event.target as HTMLInputElement).value;

    if (this.min !== undefined && inputValue < this.min) {
      inputValue = this.min;
    }
    if (this.max !== undefined && inputValue > this.max) {
      inputValue = this.max;
    }

    this.onInput(inputValue);
    (event.target as HTMLInputElement).value = String(inputValue);
  }

}

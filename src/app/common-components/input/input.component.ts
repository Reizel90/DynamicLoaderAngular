
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CanvasBaseComponent } from '../common-components.interface';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label *ngIf="label">{{ label }}</label>
    <input [(ngModel)]="value" [placeholder]="placeholder" />
  `
})
export class InputComponent extends CanvasBaseComponent {
  // id!: string;
  value: any = '';

  @Input() label: string = '';
  @Input() placeholder: string = '';

  getValue() {
    return this.value;
  }

  setValue(val: any) {
    this.value = val;
  }
}
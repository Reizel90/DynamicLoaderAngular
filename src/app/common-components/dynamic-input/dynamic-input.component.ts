import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-input.component.html',
  styleUrl: './dynamic-input.component.scss'
})
export class DynamicInputComponent {
  id!: string;
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

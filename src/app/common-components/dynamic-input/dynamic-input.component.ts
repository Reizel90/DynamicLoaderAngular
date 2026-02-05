import { Component, Input } from '@angular/core';
import { DynamicComponentApi } from '../common-components.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss']
})
export class DynamicInputComponent implements DynamicComponentApi {
  @Input() id!: string;
  @Input() label = '';
  @Input() placeholder = '';

  value = '';

  getValue() {
    return this.value;
  }

  setValue(v: any) {
    this.value = String(v ?? '');
  }
}

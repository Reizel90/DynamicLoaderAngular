import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-checkbox.component.html',
  styleUrl: './dynamic-checkbox.component.scss'
})
export class DynamicCheckboxComponent {
  @Input() control!: FormControl;
  @Input() label!: string;

}

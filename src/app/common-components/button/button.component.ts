
import { Component, Input } from '@angular/core';
import { CanvasBaseComponent } from '../common-components.interface';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button (click)="onClick()">{{ label }}</button>`
})
export class ButtonComponent extends CanvasBaseComponent {
  // id!: string;
  @Input() onClick: () => void = () => {};
  @Input() label: string = 'Click';
  @Input() expression: string = '';
}
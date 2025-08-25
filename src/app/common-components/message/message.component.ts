
import { Component, Input } from '@angular/core';
import { CanvasBaseComponent } from '../common-components.interface';

@Component({
  selector: 'app-message',
  standalone: true,
  template: `<span>{{ message }}</span>`
})
export class MessageComponent extends CanvasBaseComponent {

  @Input() message: string = 'messaggio';

  setValue(val: string) {
    this.message = val;
  }

  getValue() {
    return this.message;
  }
}
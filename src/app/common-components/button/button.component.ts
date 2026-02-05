import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicComponentApi } from '../common-components.interface';

@Component({
  selector: 'app-button',
  template: `<button type="button" (click)="clicked.emit()">{{ label }}</button>`
})
export class ButtonComponent implements DynamicComponentApi {
  @Input() id!: string;
  @Input() label = 'OK';

  @Output() clicked = new EventEmitter<void>();
}

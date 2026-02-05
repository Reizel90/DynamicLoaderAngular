import { Component, Input } from '@angular/core';
import { DynamicComponentApi } from '../common-components.interface';

@Component({
  selector: 'app-message',
  template: ` <div>{{ message }}</div> `
})
export class MessageComponent implements DynamicComponentApi {
  @Input() id!: string;
  @Input() message = '';

  setValue(v: any) {
    this.message = String(v ?? '');
  }

  getValue() {
    return this.message;
  }
}

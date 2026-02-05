import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentConfig } from '../component-config';

@Component({
  selector: 'app-unknown',
  template: `
    <div style="border:1px dashed #999;padding:12px;border-radius:8px;">
      <strong>Unknown component</strong>
      <div>type: {{ config?.type }}</div>
      <div>id: {{ config?.id }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnknownComponent {
  @Input() config?: ComponentConfig;
}

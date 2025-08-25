import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentsMapService } from '../../services/components-map.service';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CdkDropList],
  template: `
    <div class="column" cdkDropList (cdkDropListDropped)="onDrop($event)">
      <ng-template #container></ng-template>
    </div>
  `,
  styles: [
    `
    .column {
      padding: 12px;
      border: 1px solid #ccc;
      margin-bottom: 10px;
    }
    `
  ]
})
export class ColumnComponent {
  @Input() id!: string;
  @Input() config: any;

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(private componentMapService: ComponentsMapService) {}

  onDrop(event: CdkDragDrop<any[]>) {
    const data = event.item.data;
    const componentType = this.componentMapService.getComponentByName(data.type);
    if (!componentType) return;

    const componentRef = this.container.createComponent(componentType);
    componentRef.instance.id = crypto.randomUUID();
    componentRef.instance.config = {
      id: componentRef.instance.id,
      label: data.label || '',
      ...(data.props || {})
    };
  }
}

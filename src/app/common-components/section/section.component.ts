
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentsMapService } from '../../services/components-map.service';


@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CdkDropList],
  template: `
    <div class="section" cdkDropList (cdkDropListDropped)="onDrop($event)">
      <ng-template #container></ng-template>
    </div>
  `,
  styles: [
    `
    .section {
      border: 2px dashed #999;
      padding: 16px;
      margin: 12px 0;
      background-color: #f5f5f5;
    }
    `
  ]
})
export class SectionComponent {
  id!: string;
  @Input() config: any = null;
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
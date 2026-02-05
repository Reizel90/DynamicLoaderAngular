import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [CommonModule, CdkDropList],
  template: `
    <div class="row"
         cdkDropList
         (cdkDropListDropped)="onDrop($event)">
      <ng-container #contentHost></ng-container>
    </div>
  `,
  styles: [`
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px;
      border: 1px solid #ddd;
      margin: 8px 0;
      background-color: #fafafa;
      min-height: 50px;
    }
  `]
})
export class RowComponent {
  @Input() id!: string;

  /** opzionale: config del nodo (utile lato builder) */
  @Input() config: any;

  /**
   * Host per i children: il renderer userà questo.
   * Row NON renderizza children da sola.
   */
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  /**
   * Evento builder: il parent (builder/editor o engine) aggiorna la config
   * e poi re-renderizza.
   */
  @Output() nodeDropped = new EventEmitter<any>();

  onDrop(event: CdkDragDrop<any[]>) {
    const data = event.item.data;

    const newNode = {
      type: data.type,
      id: data.id ?? this.generateId(),
      label: data.label ?? undefined,
      ...(data.props ?? {})
    };

    this.nodeDropped.emit(newNode);
  }

  private generateId(): string {
    return `node_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  }
}

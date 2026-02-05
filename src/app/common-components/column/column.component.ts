import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, CdkDropList],
  template: `
    <div class="column"
         [ngStyle]="getColumnStyles()"
         cdkDropList
         (cdkDropListDropped)="onDrop($event)">
      <ng-container #contentHost></ng-container>
    </div>
  `,
  styles: [`
    .column {
      flex: 1;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      min-height: 100px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  `]
})
export class ColumnComponent {
  @Input() id!: string;

  /** opzionale: config completa del nodo layout (se ti serve nel builder) */
  @Input() config: any;

  /** layout props */
  @Input() flex: number = 1;
  @Input() width?: string;

  /**
   * IMPORTANT: il renderer userà questo per montare i figli.
   * Non renderizzare children qui dentro.
   */
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  /**
   * Evento builder: quando droppi un item, emetto un "node config"
   * e sarà il builder/engine a inserirlo in children e re-renderizzare.
   */
  @Output() nodeDropped = new EventEmitter<any>();

  getColumnStyles(): any {
    const styles: any = {};
    if (this.width) {
      styles.width = this.width;
      styles.flex = 'none';
    } else {
      styles.flex = `${this.flex} ${this.flex} 0`;
    }
    return styles;
  }

  onDrop(event: CdkDragDrop<any[]>) {
    const data = event.item.data;

    // qui NON creo componenti, creo un "config node"
    const newNode = {
      type: data.type,
      id: data.id ?? this.generateId(),
      ...(data.props ?? {}),
      label: data.label ?? undefined
    };

    this.nodeDropped.emit(newNode);
  }

  private generateId(): string {
    // evita crypto hard dependency (SSR-safe)
    return `node_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  }
}

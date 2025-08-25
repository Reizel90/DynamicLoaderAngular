import { CdkDragEnd, DragDropModule, Point } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, SimpleChanges } from '@angular/core';
import { ComponentsMapService } from '../../services/components-map.service';

@Component({
  selector: 'app-canvas-item',
  templateUrl: './canvas-item-content.component.html',
  styleUrls: ['./canvas-item-content.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule]
})
export class CanvasItemContentComponent {
  @Input() item!: any;
  @Input() selected = false;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() itemDragEnd = new EventEmitter<{ x: number; y: number }>();

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  // private ref: any  = null; 

  constructor(
    private componentMapService: ComponentsMapService,
  ) {}

  ngOnInit(){
    console.log("canvas Item", this.item)
    
    const compType = this.componentMapService.getComponentByName(this.item.type);
    console.log("canvas compType", compType)

    if (!compType) { throw Error("tipo di componente non trovato")};

    const compRef = this.container.createComponent(compType);
    const instance = compRef.instance;
    // instance.id = this.item.id;

    this.item.ref = instance;
    // this.ref = instance;
    console.log("convas instance", instance)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.item) {
    //   this.position = { x: this.item.x, y: this.item.y };
    // }
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.itemSelected.emit(); //(this.ref);
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.itemSelected.emit();
  }

  onDragEnd(event: CdkDragEnd) {
    console.log("onDragEnd event", event)
    const pos = event.source.getFreeDragPosition();
    console.log("onDragEnd pos", pos)
    this.item.x = pos.x;
    this.item.y = pos.y;
    this.itemDragEnd.emit({ x: pos.x, y: pos.y });
  }
} 

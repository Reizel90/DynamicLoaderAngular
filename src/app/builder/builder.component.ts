
import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragEnd, CdkDragMove, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ComponentsMapService } from '../services/components-map.service';
import { FormsModule } from '@angular/forms';
import { CanvasItemContentComponent } from './canvas-item-content/canvas-item-content.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, CanvasItemContentComponent],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  componentRefs: ComponentRef<any>[] = [];
  selectedComponentRef: ComponentRef<any> | null = null;
  isDragging = false;

  constructor(private componentMapService: ComponentsMapService) { }

  // get availableComponents() {
  //   return this.componentMapService.getAvailableComponents();
  // }
  availableComponents: any[] = [];

  ngOnInit() {
    this.availableComponents = this.componentMapService.getAvailableComponents();
  }

  getComponentType(ref: ComponentRef<any>): string {
    const component = ref.componentType;
    const entry = Object.entries(this.componentMapService['componentMap']).find(
      ([_, type]) => type === component
    );
    return entry?.[0] || 'unknown';
  }





  //#region TEST ANGULAR

  paletteItems = [
    { type: 'button', label: 'Button' },
    { type: 'text', label: 'Text Field' },
    { type: 'image', label: 'Image' },
  ];

  canvasItems: any[] = [];
  selectedItem: any = null;
  selectedItemKeys: any = null;
  jsonExport = '';

  @ViewChild('canvasContainer', { read: ElementRef })
  canvasRef!: ElementRef<HTMLElement>;

  onCanvasDrop(event: CdkDragDrop<any>) {
    console.log("onCanvasDrop")
    if (event.previousContainer === event.container) return;

    const data = event.item.data;
    const mouseEvent = event.event as MouseEvent;
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();

    this.canvasItems.push({
      ...data,
      x: mouseEvent.clientX - canvasRect.left,
      y: mouseEvent.clientY - canvasRect.top,
      id: Date.now() + Math.random(),
    });
  }

  selectItem(item: any) {
    console.log("select item", item)
    this.selectedItem = item;
    this.selectedItemKeys = this.getRefProperties(item);
  }

  getRefProperties(item: any): string[] {
    if (!item?.ref) return [];
    return Object.keys(item.ref).filter(
      key => !key.startsWith('__') && typeof item.ref[key] !== 'function'
    );
  }

  updateItemPosition(item: any, pos: { x: number; y: number }) {
    console.log("updateItemPosition", item, pos)
    item.x = pos.x;
    item.y = pos.y;
    this.canvasItems = [...this.canvasItems];
  }

  deleteSelectedItem() {
    if (this.selectedItem) {
      this.canvasItems = this.canvasItems.filter(i => i.id !== this.selectedItem!.id);
      this.selectedItem = null;
    }
  }

  exportToJson() {
    this.jsonExport = JSON.stringify(this.canvasItems, null, 2);
  }

  importFromJson() {
    try {
      const parsed = JSON.parse(this.jsonExport);
      if (Array.isArray(parsed)) {
        this.canvasItems = parsed;
        this.selectedItem = null;
      }
    } catch {
      alert('JSON non valido');
    }
  }
  //#endregion TEST ANGULAR

}


interface CanvasItem {
  id: number;
  type: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  [key: string]: any; // estensibilità
}

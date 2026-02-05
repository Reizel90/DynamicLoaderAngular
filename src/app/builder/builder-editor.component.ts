import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, CdkDropList, copyArrayItem } from '@angular/cdk/drag-drop';
import { LayoutBuilder, LayoutElement, LayoutContainer } from '../services/layout-builder.service';

interface BuilderElement extends LayoutElement {
  children?: BuilderElement[];
}

interface ComponentType {
  type: string;
  label: string;
}

@Component({
  selector: 'app-builder-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: 'builder-editor.component.html',
  styleUrl: 'builder-editor.component.scss'
})
export class BuilderEditorComponent implements OnInit, AfterViewInit {
  elements: BuilderElement[] = [];
  selectedElement: BuilderElement | null = null;

  @Output() configChanged = new EventEmitter<string>();
  @ViewChild('componentsList', { read: CdkDropList }) componentsList!: CdkDropList<ComponentType[]>;
  @ViewChild('canvasList', { read: CdkDropList }) canvasList!: CdkDropList<BuilderElement[]>;

  availableComponents: ComponentType[] = [
    { type: 'section', label: '📦 Section' },
    { type: 'row', label: '📏 Row' },
    { type: 'column', label: '📊 Column' },
    { type: 'input', label: '📝 Input' },
    { type: 'message', label: '💬 Message' },
    { type: 'button', label: '🔘 Button' },
    { type: 'dynamic-checkbox', label: '☑️ Checkbox' }
  ];

  connectedLists: CdkDropList<any>[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Carica una configurazione di esempio
    const example = LayoutBuilder.section('s1', 'Esempio', [
      LayoutBuilder.row('r1', [
        LayoutBuilder.column('c1', 1, [
          LayoutBuilder.input('i1', 'Nome', 'Inserisci nome')
        ])
      ])
    ]);
    this.elements = [example as BuilderElement];
    this.emitChanges();
  }

  ngAfterViewInit() {
    // Dopo che le ViewChild sono state inicializzate,
    // aggiorna la lista connessa per il binding
    if (this.componentsList) {
      this.connectedLists = [this.componentsList];
      this.cdr.detectChanges();
    }
    queueMicrotask(() => {
      this.connectedLists = this.componentsList ? [this.componentsList] : [];
    });
  }

  onCanvasDrop(event: CdkDragDrop<BuilderElement[]>) {
    const draggedData = event.item.data;

    // Se il dato non è definito, non fare nulla
    if (!draggedData) {
      return;
    }

    const component = draggedData as ComponentType;

    // Se non ha la proprietà 'type', non è un ComponentType valido
    if (!component.type) {
      return;
    }

    const newElement: BuilderElement = {
      type: component.type,
      id: this.generateId(component.type),
      ...this.getDefaultProperties(component.type)
    };

    if (this.isContainerType(component.type)) {
      newElement.children = [];
    }

    // Se viene da componenti disponibili (non è uno spostamento interno)
    if (!event.previousContainer.id?.includes('canvas')) {
      this.elements.push(newElement);
    } else {
      // Spostamento interno (riordinamento)
      this.elements = event.container.data;
    }

    this.emitChanges();
  }

  onChildDrop(event: CdkDragDrop<BuilderElement[]>, parent: BuilderElement) {
    const item = event.item.data;

    // Se è un ComponentType (da lista componenti)
    if (item.label) {
      const component = item as ComponentType;

      if (!parent.children) {
        parent.children = [];
      }

      const newElement: BuilderElement = {
        type: component.type,
        id: this.generateId(component.type),
        ...this.getDefaultProperties(component.type)
      };

      if (this.isContainerType(component.type)) {
        newElement.children = [];
      }

      parent.children.push(newElement);
    } else {
      // Spostamento interno
      if (parent.children) {
        parent.children = event.container.data;
      }
    }

    this.emitChanges();
  }

  selectElement(element: BuilderElement) {
    this.selectedElement = element;
  }

  removeElement(index: number) {
    const removed = this.elements[index];
    this.elements.splice(index, 1);
    if (this.selectedElement === removed) {
      this.selectedElement = null;
    }
    this.emitChanges();
  }


  removeChild(parent: BuilderElement, index: number) {
    if (parent.children) {
      const removed = parent.children[index];
      parent.children.splice(index, 1);
      if (this.selectedElement === removed) {
        this.selectedElement = null;
      }
      this.emitChanges();
    }
  }

  clearCanvas() {
    if (confirm('Sei sicuro di voler eliminare tutto?')) {
      this.elements = [];
      this.selectedElement = null;
      this.emitChanges();
    }
  }

  getJSON(): string {
    return JSON.stringify(this.elements, null, 2);
  }

  copyJSON() {
    navigator.clipboard.writeText(this.getJSON());
    alert('JSON copiato negli appunti!');
  }

  downloadJSON() {
    const json = this.getJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout-config.json';
    a.click();
  }

  openImportDialog() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const json = e.target?.result as string;
        const parsed = JSON.parse(json);

        // Valida che sia un array o un oggetto con struttura corretta
        if (!Array.isArray(parsed)) {
          throw new Error('Il file deve contenere un array JSON');
        }

        // Carica gli elementi
        this.elements = parsed as BuilderElement[];
        this.selectedElement = null;
        this.emitChanges();

        alert('✅ Configurazione caricata con successo!');

        // Resetta l'input
        target.value = '';
      } catch (error) {
        alert(`❌ Errore nel parsing del file: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
        target.value = '';
      }
    };

    reader.readAsText(file);
  }

  private emitChanges() {
    this.configChanged.emit(this.getJSON());
  }

  private generateId(type: string): string {
    return `${type.substring(0, 3)}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isContainerType(type: string): boolean {
    return ['section', 'row', 'column'].includes(type);
  }

  private getDefaultProperties(type: string): any {
    switch (type) {
      case 'section':
        return { title: 'Nuova Sezione' };
      case 'input':
        return { label: 'Label', placeholder: 'Placeholder' };
      case 'message':
        return { message: 'Messaggio' };
      case 'button':
        return { label: 'Bottone' };
      case 'column':
        return { flex: 1 };
      case 'dynamic-checkbox':
        return { label: 'Checkbox', checked: false };
      default:
        return {};
    }
  }
}

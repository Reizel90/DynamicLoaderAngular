import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderEditorComponent } from '../builder/builder-editor.component';
import { DynamicRendererComponent, SimpleNodeConfig } from '../dynamic-renderer/dynamic-renderer.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-config-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, BuilderEditorComponent, DynamicRendererComponent, HttpClientModule],
  template: `
    <div class="config-builder">
      <div class="editor-section">
        <app-builder-editor 
          #editor
          (configChanged)="onConfigChanged($event)">
        </app-builder-editor>
      </div>
      <div class="preview-section">
        <div class="preview-header">
          <h2>👁️ Anteprima</h2>
          <button (click)="togglePreview()" class="btn-toggle">
            {{ showPreview ? 'Nascondi' : 'Mostra' }}
          </button>
        </div>
        <div *ngIf="showPreview" class="preview-content">
          <app-dynamic-renderer 
            [nodes]="nodes">
          </app-dynamic-renderer>
        </div>
        <div *ngIf="!showPreview" class="preview-empty">
          Clicca "Mostra" per visualizzare l'anteprima
        </div>
      </div>
    </div>
  `,
  styles: [`
    .config-builder {
      display: flex;
      height: 100vh;
      gap: 0;
    }

    .editor-section {
      flex: 1;
      border-right: 2px solid #ddd;
    }

    .preview-section {
      width: 400px;
      background: #fff;
      display: flex;
      flex-direction: column;
      border-left: 2px solid #ddd;
    }

    .preview-header {
      padding: 12px 16px;
      background: #2196F3;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-header h2 {
      margin: 0;
      font-size: 16px;
    }

    .btn-toggle {
      padding: 6px 12px;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid white;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    }

    .btn-toggle:hover {
      background: rgba(255,255,255,0.3);
    }

    .preview-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #fafafa;
    }

    .preview-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class ConfigBuilderComponent {
  @ViewChild('editor') editor!: BuilderEditorComponent;
  showPreview = true;
  previewJSON = '[]';
  nodes: SimpleNodeConfig[] = [];

  loadConfig(rawJson: string) {
    try {
      const parsed = JSON.parse(rawJson);
      this.nodes = parsed;
    } catch (e) {
      console.error('Config JSON non valida', e);
      this.nodes = [];
    }
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  onConfigChanged(json: string) {
    this.previewJSON = json;
    this.loadConfig(this.previewJSON);
  }
}

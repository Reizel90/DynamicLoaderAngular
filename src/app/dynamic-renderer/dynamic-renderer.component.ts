import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { ComponentsMapService } from '../services/components-map.service';

@Component({
  selector: 'app-dynamic-renderer',
  template: `<ng-container #container></ng-container>`,
  standalone: true
})
export class DynamicRendererComponent implements OnInit {
  @Input() elementsJSON: string = '';
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  private refs: { [id: string]: any } = {}; // lista degli oggetti renderizzati
  dynamicComponents: Array<pageElement> = [];

  constructor(
    private componentMapService: ComponentsMapService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.elementsJSON) return;

    try {
      this.dynamicComponents = JSON.parse(this.elementsJSON);
      this.loadComponents(this.dynamicComponents);
    } catch (e) {
      console.error('Errore nel parsing JSON:', e);
    }
  }

  loadComponents(components: Array<pageElement>) {
    for (const item of components) {
      const compType = this.componentMapService.getComponentByName(item.type);
      if (!compType) continue;

      const compRef = this.container.createComponent(compType);
      const instance = compRef.instance;
      instance.id = item.id;

      this.refs[item.id] = instance;

      Object.keys(item).forEach(key => {
        if (['type', 'id', 'expression'].includes(key)) return;
        if (key in instance) {
          instance[key] = item[key];
        }
      });

      if (item.type === 'button' && item['expression']) {
        instance.onClick = () => this.executeExpression(item['expression']);
      }
    }
  }

  private executeExpression(expression: string) {
    const context: any = {
      utils: {
        log: console.log,
        sendToServer: (data: any) => {
          this.http.post('/api/data', data).subscribe({
            next: () => console.log('Dati inviati con successo'),
            error: err => console.error('Errore invio dati:', err)
          });
        },
        upper: (s: string) => s.toUpperCase()
      }
    };

    Object.entries(this.refs).forEach(([id, instance]) => {
      context[id] = instance;
    });

    try {
      const fn = new Function(...Object.keys(context), expression);
      fn(...Object.values(context));
    } catch (e) {
      console.error('Errore nell\'esecuzione dell\'expression:', e);
    }
  }
}

export type pageElement = {
  id: string;
  type: string;
  [key: string]: any;
};

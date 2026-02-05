import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  EnvironmentInjector,
  ComponentRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ComponentsMapService } from '../services/components-map.service';
import { RuntimeRegistryService } from '../services/runtime-registry.service';
import { ExpressionEngineService } from '../services/expression-engine.service';
import { DynamicComponentApi } from '../common-components/common-components.interface';

export type SimpleNodeConfig = {
  type: string;
  id: string;
  label?: string;
  placeholder?: string;
  message?: string;
  expression?: string;
  children?: SimpleNodeConfig[];
  [key: string]: any;
};

@Component({
  selector: 'app-dynamic-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-renderer.component.html',
  styleUrls: ['./dynamic-renderer.component.scss'],
})
export class DynamicRendererComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) nodes: SimpleNodeConfig[] = [];

  @ViewChild('host', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;

  private refs: ComponentRef<any>[] = [];
  private subs: Subscription[] = [];

  constructor(
    private envInjector: EnvironmentInjector,
    private componentsMap: ComponentsMapService,
    private registry: RuntimeRegistryService,
    private expr: ExpressionEngineService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.host) return;
    if (changes['nodes']) this.render();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private render(): void {
    this.cleanup();
    this.host.clear();
    this.registry.clear();
    this.refs = [];
    for (const node of this.nodes) this.renderNodeInto(this.host, node);
  }

  private renderNodeInto(container: ViewContainerRef, node: SimpleNodeConfig): ComponentRef<any> {
    const cmpType = this.componentsMap.resolve(node.type);
    const ref = container.createComponent<any>(cmpType, { environmentInjector: this.envInjector });
    this.refs.push(ref);

    ref.instance.id = node.id;
    if (node.label != null) ref.instance.label = node.label;
    if (node.placeholder != null) ref.instance.placeholder = node.placeholder;
    if (node.message != null) ref.instance.message = node.message;

    for (const [k, v] of Object.entries(node)) {
      if (['type', 'id', 'children', 'expression'].includes(k)) continue;
      if (v !== undefined) ref.instance[k] = v;
    }

    const api = ref.instance as DynamicComponentApi;
    api.id = node.id;
    this.registry.register(node.id, api);

    if (node.type === 'button' && node.expression) {
      this.attachExpressionToButton(ref.instance, node.expression);
    }

    const childHost = (ref.instance as any).contentHost as ViewContainerRef | undefined;
    if (childHost && node.children?.length) {
      childHost.clear();
      for (const child of node.children) this.renderNodeInto(childHost, child);
    }

    const nodeDropped = (ref.instance as any).nodeDropped;
    if (nodeDropped?.subscribe) {
      const s = nodeDropped.subscribe((newNode: any) => {
        node.children = node.children ?? [];
        node.children.push(newNode);
        this.render();
      });
      this.subs.push(s);
    }

    ref.changeDetectorRef.detectChanges();
    return ref;
  }

  private attachExpressionToButton(buttonInstance: any, expression: string): void {
    const run = () => this.expr.run(expression, this.registry.toScope());

    if (buttonInstance?.clicked?.subscribe) {
      this.subs.push(buttonInstance.clicked.subscribe(run));
      return;
    }
    if (typeof buttonInstance?.onClick === 'function') {
      const original = buttonInstance.onClick.bind(buttonInstance);
      buttonInstance.onClick = () => { original(); run(); };
      return;
    }
    if (typeof buttonInstance?.click === 'function') {
      const original = buttonInstance.click.bind(buttonInstance);
      buttonInstance.click = () => { original(); run(); };
      return;
    }
    if (typeof buttonInstance?.handleClick === 'function') {
      const original = buttonInstance.handleClick.bind(buttonInstance);
      buttonInstance.handleClick = () => { original(); run(); };
    }
  }

  private cleanup(): void {
    for (const s of this.subs) s.unsubscribe();
    this.subs = [];
    this.refs = [];
  }
}

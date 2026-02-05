import { Injectable, EnvironmentInjector, ViewContainerRef, ComponentRef } from '@angular/core';
import { ComponentConfig } from '../common-components/component-config';
import { ComponentsMapService } from './components-map.service';
import { BindingEngineService, RenderContext } from './binding-engine.service';

@Injectable({ providedIn: 'root' })
export class DynamicRenderService {
  constructor(
    private registry: ComponentsMapService,
    private binder: BindingEngineService
  ) {}

  renderTree(
    host: ViewContainerRef,
    nodes: ComponentConfig[],
    ctx: RenderContext,
    injector: EnvironmentInjector
  ): ComponentRef<any>[] {
    host.clear();
    const refs: ComponentRef<any>[] = [];
    for (const node of nodes) {
      refs.push(this.renderNode(host, node, ctx, injector));
    }
    return refs;
  }

  renderNode(
    host: ViewContainerRef,
    node: ComponentConfig,
    ctx: RenderContext,
    injector: EnvironmentInjector
  ): ComponentRef<any> {
    const componentType = this.registry.resolve(node.type);

    const ref = host.createComponent(componentType, { environmentInjector: injector });

    // apply inputs/bindings/config
    this.binder.apply(ref.instance, node, ctx);

    // children support (se il componente espone un "contentHost" ViewContainerRef)
    // pattern: nei layout component metti @ViewChild('contentHost', {read: ViewContainerRef}) contentHost!: ViewContainerRef;
    const childHost = (ref.instance as any).contentHost as ViewContainerRef | undefined;
    if (childHost && node.children?.length) {
      for (const child of node.children) {
        this.renderNode(childHost, child, ctx, injector);
      }
    }

    // TODO: wire actions/output (step successivo)
    ref.changeDetectorRef.detectChanges();
    return ref;
  }
}

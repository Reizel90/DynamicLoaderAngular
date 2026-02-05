import { Injectable } from '@angular/core';
import { ComponentConfig } from '../common-components/component-config';

export interface RenderContext {
  state: Record<string, any>;
  utils?: Record<string, (...args: any[]) => any>;
  api?: Record<string, (...args: any[]) => any>;
}

@Injectable({ providedIn: 'root' })
export class BindingEngineService {

  /** Applica props statiche + bindings dinamici su un'istanza component */
  apply(componentInstance: any, config: ComponentConfig, ctx: RenderContext): void {
    // 1) props statiche
    if (config.props) {
      for (const [k, v] of Object.entries(config.props)) {
        componentInstance[k] = v;
      }
    }

    // 2) bindings dinamici
    if (config.bindings) {
      for (const [k, expr] of Object.entries(config.bindings)) {
        componentInstance[k] = this.resolve(expr, ctx);
      }
    }

    // 3) passa config se utile a componenti tipo layout/unknown
    if ('config' in componentInstance) {
      componentInstance['config'] = config;
    }
  }

  /**
   * MVP: solo path tipo "{{state.user.name}}" oppure "state.user.name"
   * (niente new Function)
   */
  resolve(binding: string, ctx: RenderContext): any {
    if (!binding) return binding;

    const trimmed = binding.trim();
    const unwrapped = trimmed.startsWith('{{') && trimmed.endsWith('}}')
      ? trimmed.slice(2, -2).trim()
      : trimmed;

    // supporto minimo: "state.a.b.c"
    const path = unwrapped.startsWith('state.') ? unwrapped : null;
    if (!path) return binding;

    return this.getPath(ctx, path);
  }

  private getPath(obj: any, path: string): any {
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }
}

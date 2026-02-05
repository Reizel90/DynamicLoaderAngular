import { Injectable } from '@angular/core';
import { DynamicComponentApi } from '../common-components/common-components.interface';

@Injectable({ providedIn: 'root' })
export class RuntimeRegistryService {
  private readonly byId = new Map<string, DynamicComponentApi>();

  clear() {
    this.byId.clear();
  }

  register(id: string, instance: DynamicComponentApi) {
    if (!id) return;
    this.byId.set(id, instance);
  }

  get(id: string): DynamicComponentApi | undefined {
    return this.byId.get(id);
  }

  /** utile per espressioni: crea uno scope { username: instance, welcome: instance, ... } */
  toScope(): Record<string, DynamicComponentApi> {
    return Object.fromEntries(this.byId.entries());
  }
}

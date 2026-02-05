import { Injectable } from '@angular/core';
import { DynamicComponentApi } from '../common-components/common-components.interface';

@Injectable({ providedIn: 'root' })
export class ExpressionEngineService {
  private cache = new Map<string, Function>();

  /**
   * Compila un'espressione con parametri = ids della pagina
   * Esempio: ids = ["welcome","username"]
   * new Function("welcome","username", "return ( ... );")
   */
  compile(expression: string, ids: string[]): Function {
    const key = `${ids.join(',')}::${expression}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    // NOTA: qui stai facendo esecuzione di codice. È ok per prototipo,
    // ma va "messa in gabbia" più avanti (DSL/whitelist).
    const fn = new Function(...ids, expression);
    this.cache.set(key, fn);
    return fn;
  }

  run(expression: string, scope: Record<string, DynamicComponentApi>) {
    const ids = Object.keys(scope);
    const fn = this.compile(expression, ids);
    const args = ids.map(id => scope[id]);
    return fn(...args);
  }
}

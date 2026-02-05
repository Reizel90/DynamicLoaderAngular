# Dynamic Renderer

Il Dynamic Renderer prende una configurazione e la **trasforma in componenti Angular reali** creati a runtime.

Cartella:
- `dynamic-renderer.component.*` :contentReference[oaicite:8]{index=8}


## Input

Il renderer accetta una **stringa JSON** tramite l’input:

```ts
@Input() elementsJSON: string;

## Pipeline di rendering (idea)

Per ogni nodo:
1) `resolve(type)` tramite `components-map.service.ts`
2) creazione dinamica del componente
3) applicazione delle proprietà (set input)
4) se nodo container: render dei children (ricorsivo)

## Come interagisce con il resto

- Condivide i tipi/componenti con la palette del Builder grazie al registry unico.
- Viene alimentato dalla `view` (selezione config) e/o dal `builder` (preview live).

## Estensioni tipiche

- binding dinamici (espressioni) valutati su un `context`
- eventi (click/change) che aggiornano `context`
- supporto a funzioni “utility” centralizzate

# Builder

Il Builder fornisce un'interfaccia grafica per comporre una pagina tramite drag & drop e modifica proprietà.

## Palette (componenti disponibili)
La lista dei componenti trascinabili viene ottenuta da `ComponentsMapService.getAvailableComponents()`.
Attualmente il service espone in palette solo questi type:
- `section`
- `column`
- `message`
- `input`
- `button`

> Nota: anche se `ComponentsMapService` contiene altri componenti registrati (`HelloWorld`, `DynamicInput`, ecc.), questi non compaiono in palette perché non inclusi in `availableTypes`.

## Canvas (creazione elementi)
Il canvas è un `cdkDropList` collegato alla palette.
Quando un componente viene droppato:
- viene aggiunto un nuovo item a `canvasItems`
- vengono calcolate le coordinate `x/y` relative al canvas usando la posizione del mouse
- viene assegnato un `id` univoco

Ogni item nel canvas contiene almeno:
`{ id, type, label, x, y }`

## Rendering nel canvas (istanze reali)
Ogni elemento del canvas viene renderizzato tramite `CanvasItemContentComponent`, che:
- risolve la classe del componente usando `ComponentsMapService.getComponentByName(item.type)`
- crea dinamicamente il componente con `ViewContainerRef.createComponent()`
- salva l'istanza del componente dentro l'item (`item.ref = instance`)

Questo significa che il Builder mostra componenti Angular reali nel canvas (preview runtime), non una rappresentazione statica.

## Selezione e modifica proprietà
Cliccando un item, il builder lo imposta come `selectedItem` e costruisce la lista delle proprietà editabili leggendo le chiavi di `selectedItem.ref` (esclude funzioni e campi `__*`).
Le proprietà vengono modificate direttamente sull'istanza del componente tramite `ngModel`.

## Salva / Carica JSON (stato attuale)
`exportToJson()` serializza direttamente `canvasItems`.
Poiché gli item contengono anche `ref` (istanze Angular non serializzabili), è necessario escludere `ref` o convertire l'item in un modello serializzabile (es. `{type, x, y, props}`) prima di salvare.

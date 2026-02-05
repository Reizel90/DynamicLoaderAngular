# Common Components

Questa cartella contiene i componenti **riutilizzabili e renderizzabili dinamicamente**.

Esempi presenti:
- `section` / `column` → componenti “container” (layout, supportano children)
- `dynamic-input`, `dynamic-checkbox` → componenti controllati da config
- `message`, `button`, `hello-world`, `goodbye-world` → esempi/leaf components

File importanti:
- `common-components.interface.ts` → contratto condiviso (input attesi / pattern di configurazione)
- `component-config.ts` → modello di configurazione (shape dei dati passati ai componenti)
- `common-components.module.ts` → modulo (se usato) o supporto di export/aggregazione :contentReference[oaicite:5]{index=5}

## Contratto consigliato (idea)

Ogni componente dinamico dovrebbe poter ricevere:
- `config` (o input equivalenti) → proprietà dichiarative (testo, label, placeholder…)
- `context` (opzionale) → stato/variabili condivise per binding dinamici
- `children` (solo per container) → nodi figli da renderizzare

## Container vs Leaf

### Container (layout)
Esempi: Section, Column
- responsabilità: disporre i children (grid/row/col ecc.)
- devono renderizzare i figli tramite renderer ricorsivo (o delegando al dynamic-renderer)

### Leaf (contenuto)
Esempi: Input, Checkbox, Message
- responsabilità: mostrare UI e aggiornare stato/emit eventi
- non gestiscono children

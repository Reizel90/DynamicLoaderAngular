# DynamicLoaderAngular

Progetto Angular che dimostra un **sistema di pagine dinamiche** basato su:
- **Builder**: interfaccia grafica per comporre una pagina (layout + componenti).
- **Registry/Map**: una mappa unica dei componenti disponibili (usata sia dal Builder che dal Renderer).
- **Dynamic Renderer**: renderizza una pagina a runtime a partire da una configurazione JSON.
- **View**: selezione delle configurazioni/pagine da mostrare.

Struttura principale (cartelle rilevanti):
- `src/app/builder` → editor visuale della pagina (composizione e struttura)
- `src/app/common-components` → libreria di componenti “renderizzabili”
- `src/app/services/components-map.service.ts` → registry centrale dei componenti
- `src/app/dynamic-renderer` → rendering della configurazione
- `src/app/view` → selettore configurazioni / pagina di preview

> Nota: le configurazioni di esempio sono in `src/app/builder/page-configs.ts`. :contentReference[oaicite:1]{index=1}

---

## Come funziona il flusso (alto livello)

### 1) Registry unico (components map)
Il servizio `components-map.service.ts` rappresenta **l’unica sorgente di verità** sui componenti disponibili:
- elenco componenti (palette del builder)
- associazione `type` → classe Angular (per il rendering)
- (opzionale) metadati di configurazione (label, proprietà supportate, default)

### 2) Builder (creazione)
Il Builder permette di costruire una “pagina” come **albero/struttura**:
- layout (es. Section/Column)
- elementi leaf (es. Input, Checkbox, Message, Button, ecc.)
La pagina prodotta è (o può essere) serializzabile come JSON e salvabile.

### 3) Renderer (esecuzione)
Il Dynamic Renderer riceve la configurazione (JSON o oggetto) e:
- risolve ogni nodo in un componente tramite `components-map.service`
- crea dinamicamente i componenti
- applica le proprietà (binding “statico” o “dinamico”)
- renderizza ricorsivamente eventuali `children` (layout annidati)

### 4) View (selezione)
La View è il “contenitore” per:
- scegliere quale config mostrare (es. da `page-configs.ts`)
- inviare la config al renderer (preview)
- (opzionale) aprire il builder sulla config selezionata

---

## Punti chiave del progetto

- **Separazione delle responsabilità**
  - `common-components`: componenti UI
  - `builder`: UI di editing
  - `dynamic-renderer`: UI di rendering dinamico
  - `services`: registry e servizi condivisi

- **Contratto comune dei componenti**
  I componenti dinamici dovrebbero condividere un’interfaccia (presente in `common-components.interface.ts`)
  per garantire input coerenti e supporto ai children dove necessario. :contentReference[oaicite:2]{index=2}

---

## Avvio progetto

Classico Angular:
- `npm install`
- `npm start` (o `ng serve`)

---

## Dove mettere mano se vuoi estendere

- Aggiungere un nuovo componente dinamico:
  1) crealo in `src/app/common-components/<nome>`
  2) registralo nel `components-map.service.ts` (type + classe + metadati)
  3) se deve supportare children (layout), implementa lo stesso “contratto” dei container (es. Section/Column)

- Aggiungere una nuova pagina demo:
  - aggiungila a `src/app/builder/page-configs.ts` :contentReference[oaicite:3]{index=3}



+-- .
|   +-- src
|   |   +-- app
|   |   |   +-- builder
|   |   |   |   +-- canvas-item-content
|   |   |   |   |   |   canvas-item-content.component.html
|   |   |   |   |   |   canvas-item-content.component.scss
|   |   |   |   |   |   canvas-item-content.component.ts
|   |   |   |   |   builder.component.html
|   |   |   |   |   builder.component.scss
|   |   |   |   |   builder.component.ts
|   |   |   |   |   config.component.spec.ts
|   |   |   |   |   page-configs.ts
|   |   |   +-- common-components
|   |   |   |   +-- button
|   |   |   |   |   |   button.component.ts
|   |   |   |   +-- column
|   |   |   |   |   |   column.component.html
|   |   |   |   |   |   column.component.scss
|   |   |   |   |   |   column.component.spec.ts
|   |   |   |   |   |   column.component.ts
|   |   |   |   +-- dynamic-checkbox
|   |   |   |   |   |   dynamic-checkbox.component.html
|   |   |   |   |   |   dynamic-checkbox.component.scss
|   |   |   |   |   |   dynamic-checkbox.component.spec.ts
|   |   |   |   |   |   dynamic-checkbox.component.ts
|   |   |   |   +-- dynamic-input
|   |   |   |   |   |   dynamic-input.component.html
|   |   |   |   |   |   dynamic-input.component.scss
|   |   |   |   |   |   dynamic-input.component.spec.ts
|   |   |   |   |   |   dynamic-input.component.ts
|   |   |   |   +-- goodbye-world
|   |   |   |   |   |   goodbye-world.component.html
|   |   |   |   |   |   goodbye-world.component.scss
|   |   |   |   |   |   goodbye-world.component.spec.ts
|   |   |   |   |   |   goodbye-world.component.ts
|   |   |   |   +-- hello-world
|   |   |   |   |   |   hello-world.component.html
|   |   |   |   |   |   hello-world.component.scss
|   |   |   |   |   |   hello-world.component.spec.ts
|   |   |   |   |   |   hello-world.component.ts
|   |   |   |   +-- input
|   |   |   |   |   |   input.component.ts
|   |   |   |   +-- message
|   |   |   |   |   |   message.component.ts
|   |   |   |   +-- section
|   |   |   |   |   |   section.component.html
|   |   |   |   |   |   section.component.scss
|   |   |   |   |   |   section.component.spec.ts
|   |   |   |   |   |   section.component.ts
|   |   |   |   |   common-components.interface.ts
|   |   |   |   |   common-components.module.ts
|   |   |   |   |   component-config.ts
|   |   |   +-- dynamic-renderer
|   |   |   |   |   dynamic-renderer.component.html
|   |   |   |   |   dynamic-renderer.component.scss
|   |   |   |   |   dynamic-renderer.component.spec.ts
|   |   |   |   |   dynamic-renderer.component.ts
|   |   |   +-- services
|   |   |   |   |   components-map.service.ts
|   |   |   +-- view
|   |   |   |   |   view.component.html
|   |   |   |   |   view.component.scss
|   |   |   |   |   view.component.spec.ts
|   |   |   |   |   view.component.ts
|   |   |   |   app.component.html
|   |   |   |   app.component.scss
|   |   |   |   app.component.spec.ts
|   |   |   |   app.component.ts
|   |   |   |   app.config.server.ts
|   |   |   |   app.config.ts
|   |   |   |   app.routes.ts
|   |   |   |   config-access.guard.spec.ts
|   |   |   |   config-access.guard.ts
|   |   |   favicon.ico
|   |   |   index.html
|   |   |   main.server.ts
|   |   |   main.ts
|   |   |   styles.scss
|   |   .gitignore
|   |   angular.json
|   |   package-lock.json
|   |   package.json
|   |   printer.ps1
|   |   README.md
|   |   server.ts
|   |   tsconfig.app.json
|   |   tsconfig.json
|   |   tsconfig.spec.json
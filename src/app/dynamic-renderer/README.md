# Dynamic Renderer

Il **Dynamic Renderer** è il motore di runtime del progetto:  
riceve una configurazione JSON e la trasforma in **componenti Angular reali**, creati e configurati dinamicamente.

È pensato per consumare configurazioni prodotte dal Builder (o da qualsiasi altra sorgente JSON compatibile).

---

## Input

Il renderer accetta una **stringa JSON** tramite l’input:

```ts
@Input() elementsJSON: string;
```

La stringa deve rappresentare un array di elementi (`pageElement`):

```json
[
  {
    "id": "input1",
    "type": "input",
    "placeholder": "Inserisci testo"
  },
  {
    "id": "btn1",
    "type": "button",
    "label": "Invia",
    "expression": "utils.log(input1.value)"
  }
]
```

Se l’input è vuoto o il JSON non è valido, il renderer non produce output.

---

## Modello dati (`pageElement`)

Ogni elemento deve contenere almeno:

- `id` → identificatore univoco usato a runtime
- `type` → chiave del componente (risolta tramite `ComponentsMapService`)

Tutte le altre proprietà sono considerate **dati dichiarativi** e vengono copiate sull’istanza del componente se compatibili.

```ts
export type pageElement = {
  id: string;
  type: string;
  [key: string]: any;
};
```

---

## Pipeline di rendering

Il rendering avviene in `ngOnInit()` ed è composto da questi passaggi:

1. Parsing della stringa JSON
2. Iterazione sequenziale degli elementi
3. Risoluzione del componente tramite `ComponentsMapService.getComponentByName(type)`
4. Creazione dinamica del componente con `ViewContainerRef.createComponent()`
5. Assegnazione delle proprietà dichiarate nel JSON all’istanza del componente

Il rendering è **flat**:  
tutti i componenti vengono inseriti nello stesso container, senza supporto per layout annidati o `children`.

---

## Binding delle proprietà

Durante la creazione del componente:

- le chiavi `type`, `id`, `expression` sono riservate
- tutte le altre chiavi vengono copiate sull’istanza **solo se la proprietà esiste già** sul componente

Questo rende il renderer dichiarativo e previene l’assegnazione di proprietà non supportate.

---

## Registry runtime dei componenti

Il renderer mantiene un registry interno:

```ts
refs: { [id: string]: any }
```

Ogni componente renderizzato viene salvato usando il suo `id`.

Questo registry è utilizzato esclusivamente per consentire alle **expression dinamiche** di accedere alle istanze degli altri componenti.

---

## Expression dinamiche

Gli elementi di tipo `button` possono definire una proprietà `expression`.

Se presente:
- l’handler `onClick` del componente viene sovrascritto
- al click viene eseguita l’expression associata

### Contesto di esecuzione

Le expression vengono eseguite come JavaScript tramite `new Function(...)` e hanno accesso a:

#### `utils`
- `log(...)` → `console.log`
- `upper(string)` → converte in maiuscolo
- `sendToServer(data)` → HTTP POST verso `/api/data`

#### Componenti renderizzati
Ogni componente è accessibile tramite il proprio `id`.

Esempio di expression:

```js
input1.value = utils.upper(input1.value);
utils.sendToServer({ value: input1.value });
```

---

## Sicurezza

Le expression sono **codice JavaScript arbitrario**, eseguito a runtime senza sandboxing.

Questo approccio è adatto solo a:
- ambienti controllati
- configurazioni fidate
- prototipi o sistemi interni

Non è sicuro per input provenienti da utenti non fidati.

---

## Dipendenze chiave

- `ComponentsMapService`  
  Risoluzione dei componenti a partire dal `type`.

- `HttpClient`  
  Supporto a chiamate HTTP nelle expression.

---

## Limitazioni attuali

- Nessun supporto a layout annidati o `children`
- Il renderer accetta solo JSON string, non oggetti
- Le expression non sono sandboxate
- Il rendering è sequenziale e flat

---

## Ruolo nell’architettura

Il Dynamic Renderer è il livello di **esecuzione** del sistema:

- il Builder produce una configurazione
- il `ComponentsMapService` risolve i componenti
- il Dynamic Renderer crea e collega le istanze a runtime

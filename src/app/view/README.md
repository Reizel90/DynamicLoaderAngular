# View

La View è la sezione “applicativa” che consente di:
- selezionare una configurazione di pagina (es. da `page-configs.ts`)
- visualizzare il risultato tramite `dynamic-renderer`

Cartella:
- `view.component.*` :contentReference[oaicite:9]{index=9}

## Ruolo

- Fa da “shell” per scegliere quale pagina/config mostrare
- Passa la configurazione al `dynamic-renderer`
- (opzionale) può includere un link/apertura al builder per modificare la stessa config

## Relazioni

- dipende dai dati in `builder/page-configs.ts` (demo)
- usa `dynamic-renderer` per la visualizzazione

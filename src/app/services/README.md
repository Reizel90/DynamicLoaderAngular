# Services

## components-map.service.ts

`ComponentsMapService` è il **registry centrale dei componenti dinamici** del progetto.

Il suo ruolo è fornire un mapping univoco tra:
- un identificatore testuale (`type`)
- una classe di componente Angular (`Type<any>`)

Sia il **Builder** che il **Dynamic Renderer** dipendono da questo service per risolvere i componenti a runtime.

---

### Perché è importante
Avere un registry unico evita:
- duplicazione di liste “builder vs renderer”
- disallineamenti tra cosa puoi trascinare e cosa puoi renderizzare
- errori runtime per type non registrati


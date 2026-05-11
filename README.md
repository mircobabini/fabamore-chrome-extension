# FabaMore per Faba e Faba+
- [Chrome Extension](https://chromewebstore.google.com/detail/fabamore-do-more-with-you/lceoahoffijefgjgepcnilmdlmjeeidn)
- [How to](https://mircobabini.dev/fabamore-per-faba-e-faba-plus/)
- Supporta il caricamento di file WAV o MP3; i file MP3 vengono convertiti automaticamente in WAV.

## Firefox build (same app)
Per Firefox usa `manifest.firefox.json` come `manifest.json` nel pacchetto finale. Esempio:

```bash
mkdir -p dist/firefox && cp -R assets content.js fabamore-swal2-icon.jpg fabamore_16.jpg fabamore_48.jpg fabamore_64.jpg fabamore_128.jpg README.md dist/firefox/ && cp manifest.firefox.json dist/firefox/manifest.json && (cd dist/firefox && zip -r ../fabamore-firefox.zip . -x "*\.DS_Store")
```

## Firefox release procedure (AMO)

Usa questa procedura per ogni aggiornamento su Firefox Add-ons (AMO).

### 1. Preparazione release
1. Completa le modifiche al codice.
2. Aggiorna la versione in `manifest.firefox.json` (deve essere maggiore rispetto alla versione già pubblicata su AMO).
3. Aggiorna il changelog in questo file (`README.md`) con:
   - numero versione;
   - data release;
   - elenco sintetico delle modifiche visibili agli utenti.
4. Esegui smoke test locale caricando l'estensione temporanea in Firefox da `about:debugging#/runtime/this-firefox`.

### 2. Creazione pacchetto upload
1. Genera il pacchetto Firefox con i file estensione alla root dell'archivio (non dentro una cartella padre).
2. Assicurati che nel pacchetto il nome file sia `manifest.json` (copiato da `manifest.firefox.json`).
3. Non includere `.git/`, file temporanei o `.DS_Store`.

Comando consigliato:
```bash
mkdir -p dist/firefox && cp -R assets content.js fabamore-swal2-icon.jpg fabamore_16.jpg fabamore_48.jpg fabamore_64.jpg fabamore_128.jpg README.md dist/firefox/ && cp manifest.firefox.json dist/firefox/manifest.json && (cd dist/firefox && zip -r ../fabamore-firefox.zip . -x "*.DS_Store")
```

### 3. Upload su Firefox Add-ons
1. Apri il Developer Hub: `https://addons.mozilla.org/developers/`.
2. Seleziona l'add-on `FabaMore` (oppure creane uno nuovo se è la prima pubblicazione).
3. Apri `Upload New Version`.
4. Carica `dist/fabamore-firefox.zip`.
5. Verifica eventuali warning su compatibilità o permessi.

### 4. Invio revisione
1. Controlla che descrizione, privacy e metadati listing siano aggiornati.
2. Invia la versione in review.
3. Nel campo note per i reviewer AMO, incolla questo testo se compaiono warning su `eval`/`innerHTML`:

```text
The flagged patterns (“Function constructor is eval” and “Unsafe assignment to innerHTML”) originate from the bundled third-party library assets/js/sweetalert2@11.min.js, used only for local modal UI rendering.

No remote scripts are fetched or executed. All JavaScript is packaged inside the add-on at build/upload time. Our first-party script (content.js) does not use eval/new Function and does not assign to innerHTML.
```

4. Se AMO segnala problemi o rifiuta la versione:
   - non riprovare più volte con la stessa argomentazione;
   - passa subito al fallback tecnico: rimuovere SweetAlert2 e sostituire i popup con UI nativa/custom;
   - incrementa di nuovo la versione, rigenera ZIP e ricarica.

### 5. Pubblicazione e verifica post-release
1. Dopo approvazione, pubblica la versione (o conferma autopublish se configurato).
2. Verifica che la pagina AMO mostri la nuova versione.
3. Installa/aggiorna da AMO e ripeti uno smoke test rapido sul flusso principale in `studio.myfaba.com`.

### Note importanti AMO
- Mantieni stabile `browser_specific_settings.gecko.id` tra tutte le versioni pubblicate.
- Ogni update richiede una versione più alta del manifest.
- Se cambiano i permessi, Firefox può richiedere una nuova accettazione agli utenti.
- Strategia approvata per questo progetto: primo tentativo "keep-and-explain"; se AMO rifiuta anche una sola volta per questi warning, passare direttamente al refactor senza ulteriore negoziazione.

# Changelog

## 2.3 - 2026-05-11
- On the final invite step, route review links by browser and language (`it` vs non-`it`) for both Chrome Web Store and Firefox Add-ons.

## 2.2 - 2026-05-06
- On the final invite step, route the review CTA to Chrome Web Store on Chrome and to Firefox Add-ons on Firefox.

## 2.1 - 2026-04-29
- Add dedicated `manifest.firefox.json` for Firefox WebExtensions, mirroring the Chrome behavior and assets.
- Keep runtime behavior identical between Chrome and Firefox builds; only packaging metadata differs.

## 2.0 - 2026-04-28
- Bump extension version to 2.0.
- Add a new SweetAlert2 welcome popup on MyFaba invite pages with custom icon and version badge.
- Add two CTAs in the welcome popup: `Preferisco registrare io` and `Carica audio`.
- Add a second SweetAlert2 form flow that uploads audio (`.wav`/`.mp3`) to `/invites/{invite}/recordings?token=...` with `audio`, `name`, and `title`.
- Align invite upload with MyFaba standard API endpoint (`api.myfaba.com/api/v3/studio/...`) and payload fields (`audio`, `creator`, `title`), with `.webm` support.
- Make popup icon accessible via MV3 `web_accessible_resources`, refine CTA spacing/colors, add help link and post-upload review link.
- Optimize invite uploads by preparing lighter audio candidates before upload, with in-modal progress feedback.
- Add local `lamejs` integration to generate mono MP3 candidates in-browser for invite uploads when that actually reduces file size.
- Prevent the FabaMore popup from opening on invalid invite/error pages unless the real `Continua` CTA is present.
- Show an in-modal progress bar while audio files are analyzed and converted before upload.
- Disable outside-click dismissal for all SweetAlert2 popups.

## 1.8 - 2026-04-28
- Detect MyFaba Studio invite/recording pages (`/invites/`) and show a SweetAlert2 maintenance notice.
- Temporarily disable extension flow on invite pages while adapting to the MyFaba Studio backend revamp.
- Update maintenance popup copy and style the `Ho capito` button to match the primary MyFaba CTA.

## 1.7 - 2026-04-26
- Restrict content script injection to `studio.myfaba.com` (hostname-based) instead of all websites.
- Relax host permission from `/character-contents/*` to the full Studio hostname to avoid path lock-in.
- Initialize FabaMore when the target button selector appears in the DOM, so activation no longer depends on a fixed page URL.

## 1.6 - 2026-04-02
- Update badge to show current version (FabaMore 1.6)
- Add `required` attribute to file input to prevent empty submissions
- Add custom "Invia a FABA" submit button with loading state
- Hide original Vue-powered submit buttons to keep custom flow visible
- Add form submit handler to show "Caricamento..." state during upload

## 1.5 - 2026-03-27
- Hide the built-in form submit controls and add the new `Invia a FABA` button so the custom upload flow stays visible.
- Keep the recorder block collapsed and keep the file upload form visible with instructional text when the new button is used.
- Suppress the original Vue-powered submit flow so the extension's custom submit stays front and center.

## 1.4 - 2026-01-01
- Set big file threshold notice at 120MB
- Fix SweetAlert2 (Swal2) buttons appearance
- Enhance messages and use Swal2 for notifications
- Add downsampling and mono audio support
- Add "not supported format" message

## 1.3 - 2025-08-31
- Added .mp3 support
- Allow MP3 uploads by converting to WAV

## 1.2 - 2025-01-09
- Initial release

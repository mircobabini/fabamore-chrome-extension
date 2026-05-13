# FabaMore per Faba e Faba+
- [Chrome Extension](https://chromewebstore.google.com/detail/fabamore-do-more-with-you/lceoahoffijefgjgepcnilmdlmjeeidn)
- [How to](https://mircobabini.dev/fabamore-per-faba-e-faba-plus/)
- Supporta il caricamento di file WAV o MP3; i file MP3 vengono convertiti automaticamente in WAV.

## Build
Usa lo script dedicato per generare gli zip release in `dist/`:

```bash
./scripts/build-release.sh chrome
./scripts/build-release.sh firefox
./scripts/build-release.sh both
```

Output:
- `dist/fabamore-chrome.zip`
- `dist/fabamore-firefox.zip`

Note:
- Chrome usa `manifest.json`.
- Firefox usa `manifest.firefox.json`, copiato nello zip come `manifest.json`.

## Release checklist
Prima di pubblicare:
1. Completa le modifiche.
2. Aggiorna la versione nel manifest corretto:
   - Chrome: `manifest.json`
   - Firefox: `manifest.firefox.json`
3. Aggiorna il changelog in `README.md`.
4. Rigenera lo zip con `./scripts/build-release.sh <target>`.
5. Fai uno smoke test locale:
   - Chrome: `chrome://extensions` > `Load unpacked`
   - Firefox: `about:debugging#/runtime/this-firefox` > `Load Temporary Add-on`

## Chrome release
1. Apri il [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
2. Seleziona `FabaMore`.
3. Carica `dist/fabamore-chrome.zip`.
4. Controlla warning su permessi o package contents.
5. Verifica listing e privacy info, poi invia la release in review.
6. Dopo approvazione, pubblica subito o usa publish differito se preferisci.
7. Verifica che lo store mostri la nuova versione e fai un rapido smoke test sulla build pubblicata.

## Firefox release
1. Apri il [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/).
2. Seleziona `FabaMore`.
3. Carica `dist/fabamore-firefox.zip` con `Upload New Version`.
4. Controlla warning su compatibilità o permessi.
5. Verifica listing e privacy info, poi invia la release in review.
6. Dopo approvazione, pubblica la release e verifica la nuova versione su AMO.
7. Installa o aggiorna l’add-on pubblicato e fai un rapido smoke test.

## Firefox reviewer note
Se AMO segnala warning su `eval` o `innerHTML`, usa questa nota per i reviewer:

```text
The flagged patterns (“Function constructor is eval” and “Unsafe assignment to innerHTML”) originate from the bundled third-party library assets/js/sweetalert2@11.min.js, used only for local modal UI rendering.

No remote scripts are fetched or executed. All JavaScript is packaged inside the add-on at build/upload time. Our first-party script (content.js) does not use eval/new Function and does not assign to innerHTML.
```

Se AMO rifiuta comunque la release, passa al fallback tecnico: rimuovere SweetAlert2 e sostituire i popup con UI nativa/custom.

# Changelog

## 2.1 - 2026-05-13
- Auto-detect the current language and translate all FabaMore-added UI strings in English, Italian, French, and Spanish, with English fallback for unsupported locales.
- Detect valid FabaMe invite pages from the invite Ajax response instead of translated page text, so the FabaMore popup opens only after a real successful invite payload is received.
- Read `remainingTime` from the invite response and stop uploads early when the selected audio is longer than the time still available on that FabaMe.
- Bundle SweetAlert2 CSS inside the extension so the FabaMore popup renders as a real modal again on invite pages.
- Load SweetAlert2 JavaScript only after the page head is ready, avoiding the early `appendChild` crash introduced by invite detection at `document_start`.

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

# FabaMore per Faba e Faba+
- [Chrome Extension](https://chromewebstore.google.com/detail/fabamore-do-more-with-you/lceoahoffijefgjgepcnilmdlmjeeidn)
- [How to](https://mircobabini.dev/fabamore-per-faba-e-faba-plus/)
- Supporta il caricamento di file WAV o MP3; i file MP3 vengono convertiti automaticamente in WAV.

# Changelog

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

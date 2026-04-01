# AGENTS.md

## Project Overview

This repository contains the `FabaMore` Chrome extension.

Current structure:
- `manifest.json`: extension metadata and version.
- `content.js`: main content script injected into the target Faba pages.
- `assets/js/`: third-party browser-side dependencies.
- `assets/css/`: stylesheet assets loaded by the content script.
- `README.md`: public-facing project notes and changelog.

## Working Agreements

- Keep the extension compatible with Manifest V3.
- Treat `content.js` as the main source of behavior changes.
- When behavior changes in a user-visible way, update `README.md` changelog in the same task.
- When releasing, always bump `manifest.json` version before packaging.
- Avoid adding build steps unless they are clearly needed; this repo currently works as a simple packaged extension.
- Do not remove or overwrite user changes that are unrelated to the requested task.

## Local Validation Checklist

Before a release:

1. Open `manifest.json` and confirm the version is incremented.
2. Review `git diff` and make sure the changelog in `README.md` matches the actual changes.
3. Load the unpacked extension in Chrome from `chrome://extensions`.
4. Enable Developer mode if needed.
5. Click `Load unpacked` and select this repository folder.
6. Test the main flow on the target Faba page:
   - the custom upload button appears;
   - the upload input is visible when expected;
   - `.wav` and `.mp3` selection still work;
   - any custom submit button still submits correctly;
   - no obvious console/runtime errors appear.

## Release Procedure

Use this procedure for every Chrome Web Store release.

### 1. Prepare the release

1. Finish the code changes.
2. Bump the extension version in `manifest.json`.
3. Add a new changelog entry in `README.md` with:
   - version number;
   - release date;
   - concise bullets describing user-visible changes.
4. Run a final manual smoke test by loading the unpacked extension in Chrome.

### 2. Create the upload package

Create a ZIP that contains the extension files at the root of the archive, not inside a parent folder.

Recommended contents:
- `manifest.json`
- `content.js`
- `assets/`
- icon/image files required by the manifest

Do not include:
- `.git/`
- local notes or temporary files
- editor/system files such as `.DS_Store`

Example command from the repo root:

```bash
zip -r fabamore-chrome-extension.zip manifest.json content.js assets fabamore_16.jpg fabamore_48.jpg fabamore_64.jpg fabamore_128.jpg README.md -x "*.DS_Store"
```

If the listed files change in the future, update the command accordingly.

### 3. Upload to the Chrome Web Store

1. Open the Chrome WebStore Developer Console https://chrome.google.com/webstore/devconsole/.
2. Select the existing `FabaMore` extension item.
3. Open the package/upload area for the item.
4. Upload the new ZIP package.
5. Review any warnings about permissions or package contents.

### 4. Submit the update for review

1. Confirm the store listing and privacy information are still accurate.
2. Submit the updated item for review.
3. Choose one of these release modes:
   - automatic publish after approval;
   - deferred publish, if you want the item approved first and published manually later.

### 5. Publish and verify

After approval:

1. If the release was deferred, publish it manually from the dashboard before the staged submission expires.
2. Confirm the Web Store listing shows the new version.
3. Re-install or update the extension in Chrome and verify the released package behaves like the local tested build.
4. Watch for user reports or store review issues after rollout.

## Important Notes For Chrome Web Store Releases

- Chrome Web Store updates require a higher `manifest.json` version than the currently published item.
- If an update adds or changes permissions, users may be prompted to re-accept the extension.
- Deferred publishing is useful when the review finishes before you want the update to go live.
- If Google rejects the submission, address the feedback, upload a new package, and resubmit.

## Sources

- Chrome manifest version reference: https://developer.chrome.com/docs/extensions/reference/manifest/version
- Chrome Web Store update guide: https://developer.chrome.com/docs/webstore/update/
- Chrome Web Store publish guide: https://developer.chrome.com/docs/webstore/publish/

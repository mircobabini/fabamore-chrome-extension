#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
TMP_DIR="$DIST_DIR/.build-tmp"

CHROME_MANIFEST="$ROOT_DIR/manifest.json"
FIREFOX_MANIFEST="$ROOT_DIR/manifest.firefox.json"

COMMON_FILES=(
  assets
  content.js
  fabamore-swal2-icon.jpg
  fabamore_16.jpg
  fabamore_48.jpg
  fabamore_64.jpg
  fabamore_128.jpg
  README.md
)

usage() {
  cat <<'EOF'
Usage: scripts/build-release.sh [chrome|firefox|both]

Build release zip archives in dist/ for:
  chrome   Build Chrome package using manifest.json
  firefox  Build Firefox package using manifest.firefox.json renamed to manifest.json
  both     Build both packages

If no target is provided, the script builds both packages.
EOF
}

require_file() {
  local path="$1"
  if [[ ! -e "$path" ]]; then
    echo "Missing required file: $path" >&2
    exit 1
  fi
}

prepare_dir() {
  local dir="$1"
  rm -rf "$dir"
  mkdir -p "$dir"
}

copy_common_files() {
  local target_dir="$1"
  local item

  for item in "${COMMON_FILES[@]}"; do
    require_file "$ROOT_DIR/$item"
    cp -R "$ROOT_DIR/$item" "$target_dir/$item"
  done
}

build_zip() {
  local browser="$1"
  local source_manifest="$2"
  local staging_dir="$TMP_DIR/$browser"
  local output_zip="$DIST_DIR/fabamore-$browser.zip"

  require_file "$source_manifest"
  prepare_dir "$staging_dir"
  copy_common_files "$staging_dir"
  cp "$source_manifest" "$staging_dir/manifest.json"

  rm -f "$output_zip"
  (
    cd "$staging_dir"
    zip -qr "$output_zip" . -x "*.DS_Store"
  )

  echo "Built $output_zip"
}

main() {
  local target="${1:-both}"

  mkdir -p "$DIST_DIR"
  rm -rf "$TMP_DIR"

  case "$target" in
    chrome)
      build_zip "chrome" "$CHROME_MANIFEST"
      ;;
    firefox)
      build_zip "firefox" "$FIREFOX_MANIFEST"
      ;;
    both)
      build_zip "chrome" "$CHROME_MANIFEST"
      build_zip "firefox" "$FIREFOX_MANIFEST"
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unsupported target: $target" >&2
      usage >&2
      exit 1
      ;;
  esac

  rm -rf "$TMP_DIR"
}

main "$@"

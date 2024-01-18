# just manual: https://github.com/casey/just#readme

_default:
  @just --list

# Runs project in development mode
dev:
  npm run tauri dev

# Builds project in production mode
build:
  npm run tauri build

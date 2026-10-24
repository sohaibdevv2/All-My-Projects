#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  GAME OF DSA — Build Script
#  Usage:
#    ./scripts/build.sh            # Desktop build (Release)
#    ./scripts/build.sh debug      # Desktop build (Debug)
#    ./scripts/build.sh web        # WebAssembly build via Emscripten
#    ./scripts/build.sh clean      # Remove build directories
# ─────────────────────────────────────────────────────────────────────────────

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
cd "$ROOT"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
log() { echo -e "${CYAN}[BUILD]${NC} $1"; }
ok()  { echo -e "${GREEN}[OK]${NC}    $1"; }
warn(){ echo -e "${YELLOW}[WARN]${NC}  $1"; }
err() { echo -e "${RED}[ERR]${NC}   $1"; exit 1; }

MODE="${1:-release}"

# ── Clean ──────────────────────────────────────────────────────────────────
if [ "$MODE" = "clean" ]; then
    log "Cleaning build directories..."
    rm -rf build-desktop build-debug build-web docs
    ok "Clean complete"
    exit 0
fi

# ── Web Build ──────────────────────────────────────────────────────────────
if [ "$MODE" = "web" ]; then
    log "Building for WebAssembly with Emscripten..."

    # Check emsdk
    EMSDK_ENV=""
    if [ -d "$HOME/emsdk" ]; then
        EMSDK_ENV="$HOME/emsdk/emsdk_env.sh"
    elif [ -d "/opt/emsdk" ]; then
        EMSDK_ENV="/opt/emsdk/emsdk_env.sh"
    elif command -v emcc &>/dev/null; then
        log "emcc found in PATH"
    else
        err "Emscripten SDK not found! Install with:
  git clone https://github.com/emscripten-core/emsdk.git ~/emsdk
  cd ~/emsdk && ./emsdk install latest && ./emsdk activate latest"
    fi

    if [ -n "$EMSDK_ENV" ]; then
        source "$EMSDK_ENV"
        log "Emscripten version: $(emcc --version | head -1)"
    fi

    mkdir -p build-web
    emcmake cmake -B build-web \
        -DCMAKE_BUILD_TYPE=Release \
        2>&1 | tail -5

    cmake --build build-web --parallel "$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"

    # Copy to docs/ for GitHub Pages
    mkdir -p docs
    for f in index.html index.js index.wasm index.data; do
        [ -f "build-web/$f" ] && cp "build-web/$f" "docs/$f" && ok "Copied $f"
    done
    [ -d assets ] && cp -r assets docs/
    ok "Web build complete → docs/"
    log "To test locally run: cd docs && python3 -m http.server 8080"
    exit 0
fi

# ── Desktop Build ──────────────────────────────────────────────────────────
BUILD_TYPE="Release"
BUILD_DIR="build-desktop"
if [ "$MODE" = "debug" ]; then
    BUILD_TYPE="Debug"
    BUILD_DIR="build-debug"
fi

log "Building Desktop ($BUILD_TYPE)..."

# Dependencies check
if ! command -v cmake &>/dev/null; then
    err "CMake not found! Install cmake first."
fi

mkdir -p "$BUILD_DIR"
cmake -B "$BUILD_DIR" \
    -DCMAKE_BUILD_TYPE="$BUILD_TYPE" \
    2>&1 | grep -E "^(--)|error|warning" | head -20

cmake --build "$BUILD_DIR" \
    --parallel "$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)" \
    --config "$BUILD_TYPE"

# Find the binary
BINARY=$(find "$BUILD_DIR" -name "GameOfDSA" -o -name "GameOfDSA.exe" 2>/dev/null | head -1)
if [ -n "$BINARY" ]; then
    ok "Build succeeded: $BINARY"
    log "Run with: $BINARY"
else
    err "Build may have failed — binary not found"
fi

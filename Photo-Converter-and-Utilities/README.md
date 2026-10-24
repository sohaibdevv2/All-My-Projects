# Image Converter & Compressor

An interactive, premium, offline-first client-side web application for batch image conversion, quality-preserving canvas compression, pixel-perfect resizing, PDF to image series rendering, and metadata analysis.

Designed with high-contrast, modern slate aesthetics using **React 19**, **Tailwind CSS v4**, and **Vite**, this tool performs all complex rendering directly inside your browser. No files are ever sent to external servers, guaranteeing absolute data security and zero latency.

---

## 🚀 Live Preview & Deployment
- **Development App:** `https://ais-dev-ojsppyl4ak73bpt7ho22gl-194249544891.asia-east1.run.app`
- **Shared App:** `https://ais-pre-ojsppyl4ak73bpt7ho22gl-194249544891.asia-east1.run.app`

---

## ✨ Features Breakdown

### 1. Batch Image Converter & Compressor
- **Multi-Format Output:** Easily trade formats between `PNG`, `JPEG`, `WEBP`, `GIF`, `BMP`, and `TIFF`.
- **Sliding Quality Controls:** Adjust targeted balance compression from 1% to 100% with real-time file size predictions.
- **Dynamic Dimension Scale:** Upscale or downscale output canvas width and height percentage scales fluidly.
- **Download Automation:** Saves files as standalone assets or automatically packs multi-selections into a custom-grouped ZIP structure using `JSZip`.

### 2. PDF to HD Image Series Extractor
- **Progressive Sheet Rendering:** Converts multi-page documents (brochures, balance sheets, certificates, tax sheets) into high-resolution JPG or lossless PNG images.
- **Adjustable DPI Scales:** Render in standard HD, rapid Draft, or pixel-perfect Retina 3x DPI for razor-sharp physical prints.
- **Modular Previews & Downloads:** Track render percentages through interactive status notifications and choose to download isolated page images or single-click zip series bundles.

### 3. Precision Geometry & Filter Studio
- **Transform Tools:** Instant 90-degree rotations, vertical/horizontal flips, and absolute custom pixel sizing with proportional aspect-ratio lock keys.
- **Tuning Sliders:** Finetune brightness, high-contrast balances, color saturation, and dynamic Gaussian burring.
- **Instant Visual Presets:** Single-click styling filters (Vibrant Vivid, Warm Editorial, Vintage Sepia, Inverted Negative, Classic Monochromatic).

### 4. Raw Metadata Inspector
- **Header Analysis:** Extract granular internal file metadata including raw string name paths, format MIME types, physical canvas dimensions, and precise aspect fractions.
- **Metadata Share Sheet:** Instantly compile the metadata sheet and copy to clipboard safe for transfer.

---

## 🛡️ Privacy Guarantee (100% Offline Processing)
This suite is built defensively around **data sovereign security guidelines**:
- All operations (PDF decoding, image transformations, zip bundlings, filter renderings, and meta parses) run locally on your browser container via standard HTML5 Canvas blocks.
- **Zero telemetries, tracking scripts, or backend logging servers** are deployed inside this build. Your critical documents and private files remain entirely yours.

---

## 🛠️ Technology Stack
- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Static Type-Safety)
- **Bundler:** [Vite v6](https://vite.dev/) (Instant hot reloads)
- **Styles:** [Tailwind CSS v4](https://tailwindcss.com/) (Fluid Layouts & Elegant Slate/Indigo Accents)
- **Icons:** [Lucide React](https://lucide.dev/) (Modern vector system)
- **Animations:** [Motion React](https://motion.dev/) (Smooth framer-motion keyframe ease effects)
- **Libraries:**
  - `JSZip` - Seamless file compression and archive bundling.
  - `pdfjs-dist` (Integrated PDF core decoder).

---

## 💻 Local Development Setup

To roll this workspace container locally on your device:

1. **Clone Repo:**
   ```bash
   git clone <your-repository-url>
   cd image-converter-compressor
   ```

2. **Install Sandbox Packages:**
   ```bash
   npm install
   ```

3. **Start Development Host:**
   ```bash
   npm run dev
   ```
   *The live instance binds instantaneously on `http://localhost:3000`.*

4. **Production Build & Compile:**
   ```bash
   npm run build
   ```
   *Static compilation deposits high-speed HTML/JS chunks cleanly into `/dist` which can be hosted instantly on any static provider (Cloudflare Pages, Netlify, GitHub Pages, or Vercel).*

---

## 📂 Codebase Architecture
```text
├── src/
│   ├── components/
│   │   ├── BatchConverter.tsx   # Batch Engine, Slider Weights, ZIP bundling
│   │   ├── PdfToImage.tsx       # PDF progressive loader, scale presets, index hashes
│   │   ├── ImageEditor.tsx      # Multi-effect presets, aspect-ratio lock, color filters
│   │   ├── MetadataViewer.tsx   # Binary inspector, aspect-fraction finder, spec sheet copier
│   │   └── TabSelector.tsx      # Seamless tab transition container
│   ├── utils/
│   │   └── imageHelpers.ts      # Shared logic: canvas scaling, rotates, conversions, bytes formats
│   ├── App.tsx                  # Base frame and layout setup
│   ├── main.tsx                 # Core bundle mount point
│   └── index.css                # Global Tailwind directives & font mappings
├── index.html                   # HTML template entry
├── package.json                 # Dependency manifest
└── metadata.json                # Sandboxed application configuration
```

---

_Created with care using Google AI Studio. Designed for efficiency, reliability, and modern aesthetic elegance._

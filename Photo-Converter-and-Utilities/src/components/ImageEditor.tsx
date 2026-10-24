import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  RotateCw,
  Sliders,
  ChevronRight,
  Download,
  AlertCircle,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Compass,
  Contrast,
  Sun,
  Eye,
  Activity,
  Maximize2
} from 'lucide-react';
import { formatBytes, applyEditorAdjustments, getImageDimensions } from '../utils/imageHelpers';

interface PresetFilter {
  name: string;
  id: string;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
}

const PRESETS: PresetFilter[] = [
  { name: 'Original', id: 'original', brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: false, sepia: false, invert: false },
  { name: 'Pristine Vivid', id: 'vibrant', brightness: 110, contrast: 115, saturation: 135, blur: 0, grayscale: false, sepia: false, invert: false },
  { name: 'Warm Editorial', id: 'warm', brightness: 105, contrast: 105, saturation: 110, blur: 0, grayscale: false, sepia: false, invert: false },
  { name: 'Muted Cool', id: 'cool', brightness: 95, contrast: 100, saturation: 75, blur: 0, grayscale: false, sepia: false, invert: false },
  { name: 'Classic Mono', id: 'grayscale', brightness: 100, contrast: 125, saturation: 100, blur: 0, grayscale: true, sepia: false, invert: false },
  { name: 'Vintage Sepia', id: 'sepia', brightness: 100, contrast: 90, saturation: 100, blur: 0, grayscale: false, sepia: true, invert: false },
  { name: 'Invert Film', id: 'invert', brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: false, sepia: false, invert: true },
];

export default function ImageEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [editedUrl, setEditedUrl] = useState<string>('');
  
  // Sizing details
  const [originalDim, setOriginalDim] = useState<{ width: number; height: number } | null>(null);
  const [editedDim, setEditedDim] = useState<{ width: number; height: number } | null>(null);
  const [resizeWidth, setResizeWidth] = useState<string>('');
  const [resizeHeight, setResizeHeight] = useState<string>('');
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);

  // Transformations state
  const [rotation, setRotation] = useState<number>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);

  // Manual Color / Detail Settings
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [sepia, setSepia] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);

  // Output controls
  const [outputFormat, setOutputFormat] = useState<string>('image/png');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected Preset state index
  const [activePreset, setActivePreset] = useState<string>('original');

  // Load uploaded image file
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      resetEditorState();

      if (originalUrl) URL.revokeObjectURL(originalUrl);
      const mainUrl = URL.createObjectURL(selected);
      setOriginalUrl(mainUrl);

      try {
        const dim = await getImageDimensions(mainUrl);
        setOriginalDim(dim);
        setEditedDim(dim);
        setResizeWidth(dim.width.toString());
        setResizeHeight(dim.height.toString());
      } catch (err) {
        console.error("Calculating dimensions collapsed", err);
      }
    }
  };

  // Reset editor properties
  const resetEditorState = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setGrayscale(false);
    setSepia(false);
    setInvert(false);
    setActivePreset('original');
  };

  // Preset Applier
  const applyPreset = (preset: PresetFilter) => {
    setActivePreset(preset.id);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setBlur(preset.blur);
    setGrayscale(preset.grayscale);
    setSepia(preset.sepia);
    setInvert(preset.invert);
  };

  // Handle Resize Constraints with locked aspect ratios
  const handleResizeWidthChange = (val: string) => {
    setResizeWidth(val);
    if (maintainRatio && originalDim && val && !isNaN(Number(val))) {
      const computedHeight = Math.round((Number(val) / originalDim.width) * originalDim.height);
      setResizeHeight(computedHeight.toString());
    }
  };

  const handleResizeHeightChange = (val: string) => {
    setResizeHeight(val);
    if (maintainRatio && originalDim && val && !isNaN(Number(val))) {
      const computedWidth = Math.round((Number(val) / originalDim.height) * originalDim.width);
      setResizeWidth(computedWidth.toString());
    }
  };

  // Compile adjustments on canvas trigger
  const runEditorCompilation = async () => {
    if (!originalUrl) return;
    setIsCompiling(true);

    try {
      const w = resizeWidth ? Number(resizeWidth) : null;
      const h = resizeHeight ? Number(resizeHeight) : null;

      const { url, width, height } = await applyEditorAdjustments(
        originalUrl,
        {
          rotation,
          flipHorizontal,
          flipVertical,
          brightness,
          contrast,
          saturation,
          blur,
          grayscale,
          sepia,
          invert,
          resizeWidth: w,
          resizeHeight: h,
        },
        outputFormat,
        0.92
      );

      if (editedUrl) URL.revokeObjectURL(editedUrl);
      setEditedUrl(url);
      setEditedDim({ width, height });
    } catch (err) {
      console.error("Compilation error in editor block", err);
    } finally {
      setIsCompiling(false);
    }
  };

  // Re-run edits when adjustments are changed (with debounce logic)
  useEffect(() => {
    if (originalUrl) {
      const handler = setTimeout(() => {
        runEditorCompilation();
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [
    originalUrl,
    rotation,
    flipHorizontal,
    flipVertical,
    brightness,
    contrast,
    saturation,
    blur,
    grayscale,
    sepia,
    invert,
    resizeWidth,
    resizeHeight,
    outputFormat,
  ]);

  // Download Output File
  const triggerDownload = () => {
    if (!editedUrl || !file) return;
    const a = document.createElement('a');
    a.href = editedUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = outputFormat.split('/')[1] === 'jpeg' ? 'jpg' : outputFormat.split('/')[1];
    a.download = `${baseName}_edited.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Clear current active record
  const ejectImage = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (editedUrl) URL.revokeObjectURL(editedUrl);
    setFile(null);
    setOriginalUrl('');
    setEditedUrl('');
    setOriginalDim(null);
    setEditedDim(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Panel Column - Simple light card */}
      <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit space-y-6">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Adjustment Tools</h3>
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-505 hover:border-indigo-500 bg-white hover:bg-indigo-50/15 p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-slate-800">Select image file</p>
            <p className="text-[10.5px] text-slate-500 mt-1 max-w-[180px] leading-relaxed">
              Upload any picture to rotate pages, resize custom widths or apply visual effects.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-slate-200 shadow-2xs">
              <div className="min-w-0 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded border border-slate-150 overflow-hidden flex-shrink-0">
                  <img src={originalUrl} className="object-cover w-full h-full" alt="thumbnail" referrerPolicy="no-referrer" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-850 text-slate-800 truncate" title={file.name}>{file.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 font-semibold">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={ejectImage} 
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Geometry adjustments */}
            <div className="space-y-4">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Geometry Configuration</span>
              
              <div className="grid grid-cols-3 gap-2">
                {/* Rotate button */}
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="py-2 px-1 border border-slate-250 text-[11px] font-bold rounded-lg text-slate-700 bg-white hover:bg-slate-50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <RotateCw className="w-4 h-4 text-indigo-600" />
                  <span>Rotate 90°</span>
                </button>

                {/* Flip horizontal */}
                <button
                  onClick={() => setFlipHorizontal((prev) => !prev)}
                  className={`py-2 px-1 border text-[11px] font-bold rounded-lg flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    flipHorizontal 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                      : 'border-slate-250 text-slate-700 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Flip Lib</span>
                </button>

                {/* Flip Vertical */}
                <button
                  onClick={() => setFlipVertical((prev) => !prev)}
                  className={`py-2 px-1 border text-[11px] font-bold rounded-lg flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    flipVertical 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                      : 'border-slate-250 text-slate-700 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-slate-500 rotate-90" />
                  <span>Flip Vert</span>
                </button>
              </div>

              {/* Advanced Resize Box */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 col-span-1 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Custom Sizing (px)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-indigo-650 font-bold select-none">
                    <input
                      type="checkbox"
                      checked={maintainRatio}
                      onChange={(e) => setMaintainRatio(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    Lock Aspect Ratio
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500">WIDTH</span>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => handleResizeWidthChange(e.target.value)}
                      placeholder="Origin px"
                      className="w-full text-xs py-1.5 px-2.5 border border-slate-350 bg-slate-50 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500">HEIGHT</span>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => handleResizeHeightChange(e.target.value)}
                      placeholder="Origin px"
                      className="w-full text-xs py-1.5 px-2.5 border border-slate-350 bg-slate-50 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Presets and Filters */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vibrant Filters Preset</span>
              <div className="flex flex-wrap gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`py-1 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      activePreset === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Color Sliders */}
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Manual Quality Tuning</span>
              
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-slate-500" /> Brightness</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => { setBrightness(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1"><Contrast className="w-3.5 h-3.5 text-slate-500" /> Contrast</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => { setContrast(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-slate-500" /> Saturation</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => { setSaturation(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>💧 Detail Blurring</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={blur}
                  onChange={(e) => { setBlur(Number(e.target.value)); setActivePreset('custom'); }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Extra toggles */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                <label className="flex flex-col items-center gap-1 p-2 bg-white hover:bg-slate-50 border border-slate-250 rounded-lg cursor-pointer text-[10px] text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={grayscale}
                    onChange={(e) => { setGrayscale(e.target.checked); setActivePreset('custom'); }}
                    className="accent-indigo-650 accent-indigo-600 rounded"
                  />
                  <span>Grayscale</span>
                </label>

                <label className="flex flex-col items-center gap-1 p-2 bg-white hover:bg-slate-50 border border-slate-250 rounded-lg cursor-pointer text-[10px] text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={sepia}
                    onChange={(e) => { setSepia(e.target.checked); setActivePreset('custom'); }}
                    className="accent-indigo-650 accent-indigo-600 rounded"
                  />
                  <span>Sepia Color</span>
                </label>

                <label className="flex flex-col items-center gap-1 p-2 bg-white hover:bg-slate-50 border border-slate-250 rounded-lg cursor-pointer text-[10px] text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={invert}
                    onChange={(e) => { setInvert(e.target.checked); setActivePreset('custom'); }}
                    className="accent-indigo-650 accent-indigo-600 rounded"
                  />
                  <span>Invert Colors</span>
                </label>
              </div>
            </div>

            {/* Download Export configurations */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Export format Type</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-xl text-center">
                  {([['image/png', 'PNG'], ['image/jpeg', 'JPG'], ['image/webp', 'WEBP']] as const).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => setOutputFormat(type)}
                      className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                        outputFormat === type
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={triggerDownload}
                disabled={isCompiling}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                {isCompiling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Saving edits...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Edited Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Renders stage viewport (Right/Center) */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 p-6 rounded-2xl min-h-[460px]">
        {file ? (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-550 text-indigo-600" />
                Edits Workspace Preview
                {isCompiling && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-650 ml-1" />}
              </span>

              {editedDim && (
                <span className="text-[11px] font-mono bg-indigo-50 border border-indigo-100 py-0.5 px-2.5 rounded-md text-indigo-700 font-bold">
                  {editedDim.width} x {editedDim.height} pixels
                </span>
              )}
            </div>

            {/* Comparative Canvas viewer */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative max-w-full max-h-[400px] border border-slate-200 bg-slate-100 rounded-2xl overflow-hidden shadow-2xs flex items-center justify-center p-2">
                <img
                  src={editedUrl || originalUrl}
                  alt="edited rendering results"
                  referrerPolicy="no-referrer"
                  className="object-contain max-w-full max-h-[380px] rounded-lg"
                  style={{ minWidth: '240px', minHeight: '200px' }}
                />
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-500 font-medium leading-relaxed leading-normal">
              Any changes applied in manual bars or filters are instantaneously re-compiled onto a background canvas and displayed above. Aspect-ratio locks guarantee correct pixel scaling.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full min-h-[360px]">
            <Maximize2 className="w-12 h-12 text-slate-300 stroke-1 mb-3 animate-pulse" />
            <span className="text-sm font-bold text-slate-700">Editor workspace idle</span>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-normal">
              Select or drop an image file in the side panel to initiate visual filters, rotates, and custom geometric scaling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

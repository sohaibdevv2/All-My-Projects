import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  ArrowRight,
  Download,
  AlertCircle,
  Loader2,
  Sliders,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  Eye,
  Percent,
  TrendingDown,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { formatBytes, processImage, getImageDimensions } from '../utils/imageHelpers';

export default function Compressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  
  // Controls
  const [quality, setQuality] = useState<number>(75);
  const [scale, setScale] = useState<number>(100);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');

  // Metadata sizes
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalDim, setOriginalDim] = useState<{ width: number; height: number } | null>(null);
  const [compressedDim, setCompressedDim] = useState<{ width: number; height: number } | null>(null);

  // Drag Slider State
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const isDraggingSlider = useRef<boolean>(false);
  const comparisonContainerRef = useRef<HTMLDivElement>(null);

  const [isCompacting, setIsCompacting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state on cleanup
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  // Read upload
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setOriginalSize(selected.size);

      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);

      const srcUrl = URL.createObjectURL(selected);
      setOriginalUrl(srcUrl);
      setCompressedUrl('');
      setCompressedSize(0);

      try {
        const dim = await getImageDimensions(srcUrl);
        setOriginalDim(dim);
      } catch (err) {
        console.error("Could not calculate dimensions", err);
      }
    }
  };

  // Run Compression
  const handleCompress = async () => {
    if (!originalUrl || !originalDim) return;
    setIsCompacting(true);

    try {
      const q = quality / 100;
      const targetW = Math.round((originalDim.width * scale) / 100);
      const targetH = Math.round((originalDim.height * scale) / 100);

      const { blob, width, height } = await processImage(originalUrl, {
        targetMimeType: format,
        quality: q,
        targetWidth: targetW,
        targetHeight: targetH,
      });

      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      
      const compressedSrc = URL.createObjectURL(blob);
      setCompressedUrl(compressedSrc);
      setCompressedSize(blob.size);
      setCompressedDim({ width, height });
    } catch (err) {
      console.error("Compression failed", err);
    } finally {
      setIsCompacting(false);
    }
  };

  // Automatically re-trigger compression when sliders shift
  useEffect(() => {
    if (originalUrl) {
      const timer = setTimeout(() => {
        handleCompress();
      }, 250); // debounce to avoid stuttering on quick slider moves
      return () => clearTimeout(timer);
    }
  }, [quality, scale, format, originalUrl]);

  // Drag divider mouse events
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingSlider.current || !comparisonContainerRef.current) return;

    const rect = comparisonContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    isDraggingSlider.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingSlider.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
  };

  // Extract reduction calculations
  const reductionPercent = originalSize && compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  // Single download
  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = format === 'image/jpeg' ? 'jpg' : 'webp';
    a.download = `${baseName}_compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Panel - Clear structured Light card */}
      <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit space-y-6">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Compressor Controls</h3>
        </div>

        {/* Upload Slot */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/15 p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
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
            <p className="text-[10.5px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              Upload a JPG or WEBP image to see side-by-side compression previews.
            </p>
          </div>
        ) : (
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 bg-slate-100 border border-slate-150 rounded-lg overflow-hidden flex-shrink-0">
                <img src={originalUrl} className="object-cover w-full h-full" alt="thumbnail" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-800 truncate" title={file.name}>{file.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono font-semibold">{formatBytes(originalSize)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOriginalUrl('');
                setCompressedUrl('');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline px-2.5 py-1.5 cursor-pointer"
            >
              Change
            </button>
          </div>
        )}

        <div className="space-y-5 pt-2">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Output Compression Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('image/jpeg')}
                disabled={!file}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  !file ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  format === 'image/jpeg'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Pristine JPEG
              </button>
              <button
                type="button"
                onClick={() => setFormat('image/webp')}
                disabled={!file}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  !file ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  format === 'image/webp'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Modern WebP
              </button>
            </div>
          </div>

          {/* Compression Level/Quality Ratio */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Compression Level</label>
              <span className="text-xs font-extrabold font-mono text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Quality: {quality}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={!file}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[9.5px] text-slate-500 mt-1">
              <span>High Compression (Eco)</span>
              <span>Maximum Sharpness</span>
            </div>
          </div>

          {/* Scale Dimension Controls */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Reduce Dimension Size</label>
              <span className="text-xs font-extrabold font-mono text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                {scale}% Scale
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={scale}
              disabled={!file}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[9.5px] text-slate-500 mt-1">
              <span>10% Tiny Thumbnail</span>
              <span>Original Sizing (100%)</span>
            </div>
          </div>
        </div>

        {file && compressedUrl && (
          <div className="border-t border-slate-200 pt-5">
            <button
              onClick={handleDownload}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
              Download Compressed Image File
            </button>
          </div>
        )}
      </div>

      {/* Comparison Workstage Slider Canvas (Right Side) */}
      <div className="lg:col-span-8 flex flex-col justify-between h-full bg-white border border-slate-200 p-6 rounded-2xl shadow-3xs">
        {file ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            {/* Header telemetry detailing shrinkage */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Before Original</span>
                <span className="text-sm font-bold font-mono text-slate-800 mt-0.5 block">{formatBytes(originalSize)}</span>
                <span className="text-[10px] font-mono text-slate-500 block font-semibold mt-0.5">
                  {originalDim ? `${originalDim.width} x ${originalDim.height} px` : 'Calculating...'}
                </span>
              </div>

              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-center flex flex-col items-center justify-center">
                <span className="block text-[10px] text-indigo-700 font-bold uppercase tracking-wider">Savings Ratio</span>
                {reductionPercent > 0 ? (
                  <span className="text-sm font-extrabold text-indigo-705 text-indigo-600 mt-0.5 block flex items-center gap-0.5">
                    <TrendingDown className="w-4 h-4 text-indigo-600 inline" />
                    -{reductionPercent}%
                  </span>
                ) : (
                  <span className="text-xs font-bold text-indigo-600 mt-0.5 block">No Change</span>
                )}
                <span className="text-[9px] text-slate-500 block leading-none mt-1">Shrunk files load faster</span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-150 text-center">
                <span className="block text-[10px] text-emerald-800 font-bold uppercase tracking-wider">After Compressed</span>
                <span className="text-sm font-bold font-mono text-emerald-800 mt-0.5 block">
                  {compressedSize ? formatBytes(compressedSize) : 'Calculating...'}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 block font-semibold mt-0.5">
                  {compressedDim ? `${compressedDim.width} x ${compressedDim.height} px` : 'Compiling...'}
                </span>
              </div>
            </div>

            {/* Split Screen interactable workspace canvas */}
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div 
                ref={comparisonContainerRef}
                className="relative w-full max-w-full aspect-video md:aspect-[16/10] bg-slate-900 border border-slate-300 rounded-2xl overflow-hidden shadow-xs cursor-ew-resize select-none h-[400px]"
                onMouseMove={(e) => isDraggingSlider.current && handleMouseMove(e.nativeEvent)}
                onTouchMove={(e) => isDraggingSlider.current && handleMouseMove(e.nativeEvent)}
              >
                {/* Left Side: Original Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{ minWidth: '100%', minHeight: '100%' }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/70 text-white font-bold backdrop-blur-xs text-[10px] py-1 px-2.5 rounded-lg border border-white/10 z-20">
                    Original File Plain
                  </div>
                </div>

                {/* Right Side: Compressed Image (Clipped dynamically based on slider position) */}
                <div 
                  className="absolute inset-0 h-full overflow-hidden border-r-2 border-indigo-500 z-10"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={compressedUrl || originalUrl}
                    alt="Compressed Preview"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{ 
                      width: comparisonContainerRef.current?.getBoundingClientRect().width,
                      maxHeight: '100%',
                      minWidth: '100%',
                      minHeight: '100%'
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white font-bold text-[10px] py-1 px-2.5 rounded-lg shadow-sm z-20 whitespace-nowrap">
                    Compressed Output
                  </div>
                </div>

                {/* Central Drag Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-indigo-500 cursor-ew-resize z-30 flex items-center justify-center group"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                    <span className="text-[10px] font-bold select-none">↔</span>
                  </div>
                </div>
              </div>

              {/* Informative Micro Help Bar */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-slate-500 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Drag the center circle badge **left or right** to compare quality live.</span>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 leading-normal">
              Our instant responsive compression updates your pixels on-the-fly. Look closely for compression noise before saving!
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[360px]">
            <ImageIcon className="w-14 h-14 text-slate-300 stroke-1 mb-3 animate-pulse" />
            <span className="text-sm font-bold text-slate-700">Compressor workscreen idle</span>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              Upload an image file in the left control bar to adjust compression settings, resize aspect scales, and access the split-screen compare slide!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

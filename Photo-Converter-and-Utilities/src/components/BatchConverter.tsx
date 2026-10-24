import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  ArrowRight, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  Sliders, 
  FileArchive, 
  Plus, 
  X,
  FileCheck2,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { ConvertedFile } from '../types';
import { formatBytes, getImageDimensions, processImage } from '../utils/imageHelpers';
import JSZip from 'jszip';

export default function BatchConverter() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [globalFormat, setGlobalFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/jpeg');
  const [globalQuality, setGlobalQuality] = useState<number>(90); // 1-100
  const [globalResizeWidth, setGlobalResizeWidth] = useState<string>('');
  const [globalResizeHeight, setGlobalResizeHeight] = useState<string>('');
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Trigger file dialog
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Convert File object to local state
  const handleUploadedFiles = async (uploadedList: FileList) => {
    const newFiles: ConvertedFile[] = [];
    
    for (let i = 0; i < uploadedList.length; i++) {
      const file = uploadedList[i];
      const id = crypto.randomUUID();
      const originalUrl = URL.createObjectURL(file);
      
      let dimensions = { width: null as number | null, height: null as number | null };
      try {
        dimensions = await getImageDimensions(originalUrl);
      } catch (err) {
        console.error("Could not load image dimensions", err);
      }

      newFiles.push({
        id,
        name: file.name,
        originalSize: file.size,
        originalType: file.type,
        originalUrl,
        convertedSize: null,
        convertedType: globalFormat,
        convertedUrl: null,
        status: 'idle',
        width: dimensions.width,
        height: dimensions.height,
        targetWidth: dimensions.width,
        targetHeight: dimensions.height,
        maintainAspectRatio: true,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  // File Input Handler
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadedFiles(e.target.files);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadedFiles(e.dataTransfer.files);
    }
  };

  // Remove a file
  const removeFile = (id: string, url: string, convertedUrl: string | null) => {
    URL.revokeObjectURL(url);
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Clear all files
  const clearAll = () => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.originalUrl);
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
  };

  // Single file parameter updates
  const updateFileTargetType = (id: string, type: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif') => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, convertedType: type, status: 'idle' } : f))
    );
  };

  // Run conversion for a single file
  const convertSingleFile = async (id: string) => {
    const fileItem = files.find((f) => f.id === id);
    if (!fileItem) return;

    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'pending' as const } : f))
    );

    try {
      const q = globalQuality / 100;
      let targetW: number | null = fileItem.targetWidth;
      let targetH: number | null = fileItem.targetHeight;

      if (globalResizeWidth && !isNaN(Number(globalResizeWidth))) {
        targetW = Number(globalResizeWidth);
      }
      if (globalResizeHeight && !isNaN(Number(globalResizeHeight))) {
        targetH = Number(globalResizeHeight);
      }

      const { blob, width, height } = await processImage(fileItem.originalUrl, {
        targetMimeType: fileItem.convertedType,
        quality: q,
        targetWidth: targetW,
        targetHeight: targetH,
      });

      const convertedUrl = URL.createObjectURL(blob);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                convertedSize: blob.size,
                convertedUrl,
                status: 'success' as const,
              }
            : f
        )
      );
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'error' as const } : f))
      );
    }
  };

  // Convert all files concurrently
  const convertAllFiles = async () => {
    setIsProcessingAll(true);
    const pendingConversions = files.map((file) => convertSingleFile(file.id));
    await Promise.all(pendingConversions);
    setIsProcessingAll(false);
  };

  // Trigger download for a single converted item
  const downloadSingle = (file: ConvertedFile) => {
    if (!file.convertedUrl) return;
    const extension = file.convertedType.split('/')[1] === 'jpeg' ? 'jpg' : file.convertedType.split('/')[1];
    const originalBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = file.convertedUrl;
    link.download = `${originalBaseName}_converted.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Zip packing helper
  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    const processed = files.filter((f) => f.status === 'success' && f.convertedUrl && f.convertedSize);
    
    if (processed.length === 0) return;

    for (let i = 0; i < processed.length; i++) {
      const f = processed[i];
      const ext = f.convertedType.split('/')[1] === 'jpeg' ? 'jpg' : f.convertedType.split('/')[1];
      const originalBase = f.name.substring(0, f.name.lastIndexOf('.')) || f.name;
      const response = await fetch(f.convertedUrl!);
      const blob = await response.blob();
      zip.file(`${originalBase}_converted.${ext}`, blob);
    }

    const compiledZip = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(compiledZip);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `converted_images_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
  };

  const successCount = files.filter((f) => f.status === 'success').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Control panel (Left) */}
      <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 h-fit">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Conversion Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Format selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Target Image Format
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
              {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => {
                const label = fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WEBP';
                const isSelected = globalFormat === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => {
                      setGlobalFormat(fmt);
                      // Auto-update non-customized queue items too for convenience
                      setFiles((prev) => prev.map((f) => f.status === 'idle' ? { ...f, convertedType: fmt } : f));
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-250'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-slate-500 mt-1.5 leading-normal">
              <strong>JPG</strong>: Best for photographs. <strong>PNG</strong>: Lossless, best for screenshots & logos. <strong>WEBP</strong>: Tiny file sizes.
            </p>
          </div>

          {/* Sizing box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-3xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Optional Resize Sizing
              </span>
              {(globalResizeWidth || globalResizeHeight) && (
                <button 
                  onClick={() => { setGlobalResizeWidth(''); setGlobalResizeHeight(''); }} 
                  className="text-[10px] text-rose-500 hover:underline cursor-pointer font-bold"
                >
                  Reset Sizing
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-[9px] text-slate-500 font-bold mb-1">WIDTH (Pixels)</span>
                <input
                  type="number"
                  placeholder="Keep Original"
                  value={globalResizeWidth}
                  onChange={(e) => setGlobalResizeWidth(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 font-bold mb-1">HEIGHT (Pixels)</span>
                <input
                  type="number"
                  placeholder="Keep Original"
                  value={globalResizeHeight}
                  onChange={(e) => setGlobalResizeHeight(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Leave these blank to keep your image aspect ratio and pixels perfectly original.
            </p>
          </div>

          {/* Quality Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Output Image Quality
              </label>
              <span className="text-xs font-extrabold font-mono text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {globalQuality}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={globalQuality}
              onChange={(e) => setGlobalQuality(Number(e.target.value))}
              disabled={globalFormat === 'image/png'}
              className={`w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer ${
                globalFormat === 'image/png' ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            />
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
              {globalFormat === 'image/png' 
                ? 'PNG uses lossless compression (quality is always 100%).'
                : 'Lowering quality shrinks storage size tremendously.'}
            </p>
          </div>
        </div>

        {/* Global actions (Only shows up when files exist) */}
        {files.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            <button
              onClick={convertAllFiles}
              disabled={isProcessingAll}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
            >
              {isProcessingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Converting your images...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-white" />
                  Convert All ({files.length} Files)
                </>
              )}
            </button>

            {successCount > 0 && (
              <button
                onClick={downloadAllAsZip}
                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all border border-slate-800"
              >
                <FileArchive className="w-4 h-4 text-slate-300" />
                Download Files Pack (ZIP) ({successCount})
              </button>
            )}

            <button
              onClick={clearAll}
              className="w-full bg-slate-100 hover:bg-slate-200 text-rose-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-slate-200"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              Clear Selection Queue
            </button>
          </div>
        )}
      </div>

      {/* Main Board Workstage (Right/Center) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Upload Terminal Box (Extremely welcoming) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99] shadow-inner'
              : 'border-slate-300 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-indigo-50 group-hover:scale-110 transition-all">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">
            Drag & drop your files here
          </h4>
          <p className="text-xs text-slate-600 mb-3 text-center max-w-sm">
            Or click to pick photos from your laptop or phone. Supports JPG, PNG, WEBP, GIF, SVG, BMP and ICO.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <span className="text-[10px] font-bold bg-white text-slate-600 py-1 px-3 rounded-full border border-slate-200 shadow-2xs">
              ⚡ Multi-file Batch Action
            </span>
            <span className="text-[10px] font-bold bg-white text-slate-600 py-1 px-3 rounded-full border border-slate-200 shadow-2xs">
              🔒 Safe & Private (Offline)
            </span>
          </div>
        </div>

        {/* Uploaded Queue Section */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                Your queue items
                <span className="bg-indigo-600/10 font-bold font-mono text-[11px] py-0.5 px-2.5 rounded-full text-indigo-700">
                  {files.length}
                </span>
              </h4>
              <span className="text-xs text-slate-500">
                Double check formats below before saving
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file) => {
                  const extension = file.convertedType.split('/')[1] === 'jpeg' ? 'jpg' : file.convertedType.split('/')[1];
                  const hasReduction = file.convertedSize && file.convertedSize < file.originalSize;
                  const ratio = file.convertedSize 
                    ? Math.round(((file.originalSize - file.convertedSize) / file.originalSize) * 100)
                    : 0;

                  return (
                    <motion.div
                       key={file.id}
                       initial={{ opacity: 0, y: 12 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, x: -50 }}
                       className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Preview + Basic Meta */}
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                          <img
                            src={file.originalUrl}
                            alt={file.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 max-w-64">
                          <h5 className="font-bold text-xs text-slate-800 truncate" title={file.name}>
                            {file.name}
                          </h5>
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-slate-500">
                            <span>{formatBytes(file.originalSize)}</span>
                            {file.width && (
                              <>
                                <span className="text-slate-350">•</span>
                                <span>{file.width}x{file.height} px</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Formatting Controls */}
                      <div className="flex flex-wrap items-center gap-3 md:gap-6 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        {/* Format selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-600">Convert to:</span>
                          <select
                            value={file.convertedType}
                            onChange={(e) => updateFileTargetType(file.id, e.target.value as any)}
                            disabled={file.status === 'processing' || file.status === 'pending'}
                            className="bg-white border md:px-2 border-slate-300 font-bold text-xs py-1 px-1.5 rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="image/jpeg">JPG</option>
                            <option value="image/png">PNG</option>
                            <option value="image/webp">WEBP</option>
                            <option value="image/gif">GIF</option>
                          </select>
                        </div>

                        {/* Compression status / Dynamic updates */}
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                          
                          {file.status === 'success' && file.convertedSize ? (
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-50 text-emerald-800 text-[10.5px] font-bold py-0.5 px-2 rounded-md border border-emerald-100 flex items-center gap-1 font-mono">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                                {formatBytes(file.convertedSize)}
                              </span>
                              {hasReduction && ratio > 0 && (
                                <span className="bg-indigo-55 bg-indigo-50 text-indigo-705 text-[10px] font-extrabold py-0.5 px-1.5 rounded border border-indigo-100 flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3 text-indigo-600" />
                                  Saved {ratio}%
                                </span>
                              )}
                            </div>
                          ) : file.status === 'pending' || file.status === 'processing' ? (
                            <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-extrabold">
                              <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                              Extracting...
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[10.59px] font-medium text-[11px]">Pending action</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-end gap-1.5 border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0">
                        {file.status === 'success' ? (
                          <button
                            onClick={() => downloadSingle(file)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer font-bold shadow-xs transition-colors"
                            title="Download Converted Image"
                          >
                            <Download className="w-3.5 h-3.5 text-white" />
                            <span>Download</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => convertSingleFile(file.id)}
                            disabled={file.status === 'pending'}
                            className="bg-white hover:bg-slate-50 text-indigo-600 border border-slate-300 py-1.5 px-3.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          >
                            Convert
                          </button>
                        )}

                        <button
                          onClick={() => removeFile(file.id, file.originalUrl, file.convertedUrl)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

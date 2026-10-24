import React, { useState, useRef } from 'react';
import { 
  Info, 
  Upload, 
  FileText, 
  ClipboardCopy, 
  FileCode, 
  Maximize, 
  Sparkles, 
  Coins, 
  Calendar 
} from 'lucide-react';
import { formatBytes, getImageDimensions } from '../utils/imageHelpers';

interface FileInfo {
  name: string;
  mimeType: string;
  dimensions: string;
  aspectRatio: string;
  size: string;
  lastModified: string;
}

export default function MetadataViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<FileInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedField = e.target.files[0];
      setFile(selectedField);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const objectUrl = URL.createObjectURL(selectedField);
      setPreviewUrl(objectUrl);

      let dimensionsLabel = 'Non-visual file';
      let aspectLabel = 'N/A';

      if (selectedField.type.startsWith('image/')) {
        try {
          const dims = await getImageDimensions(objectUrl);
          dimensionsLabel = `${dims.width} px x ${dims.height} px`;
          
          // Calculate rational fraction approximation
          const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
          const divisor = gcd(dims.width, dims.height);
          const ratioWidth = dims.width / divisor;
          const ratioHeight = dims.height / divisor;
          aspectLabel = `${ratioWidth}:${ratioHeight} (${(dims.width / dims.height).toFixed(2)}x)`;
        } catch (err) {
          console.error("Calculating size dimensions failed", err);
          dimensionsLabel = 'Could not calculate pixels';
        }
      }

      setMetadata({
        name: selectedField.name,
        mimeType: selectedField.type || 'unknown/binary',
        dimensions: dimensionsLabel,
        aspectRatio: aspectLabel,
        size: formatBytes(selectedField.size),
        lastModified: selectedField.lastModified 
          ? new Date(selectedField.lastModified).toLocaleString() 
          : 'Unknown'
      });
    }
  };

  const handleCopyMeta = () => {
    if (!metadata) return;
    const summary = `
File Specifications Sheet:
---------------------------
File Name: ${metadata.name}
Format standardType: ${metadata.mimeType}
Canvas dimensions: ${metadata.dimensions}
Aspect proportions: ${metadata.aspectRatio}
File weight size: ${metadata.size}
Last modified dates: ${metadata.lastModified}
    `.trim();

    navigator.clipboard.writeText(summary);
    alert("Copied specs summary sheet safely to your clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* File Upload card */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-6">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <Info className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">File Metadata Inspector</h3>
          </div>

          {!file ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-350 hover:border-indigo-500 bg-white hover:bg-slate-50/55 p-12 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group lg:min-h-[280px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-slate-800">Upload File to Inspect</p>
              <p className="text-[10.5px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Choose any jpeg, png, single webp, or pdf sheet to inspect details immediately.
              </p>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-100 group aspect-[4/3] flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt="inspected sheet preview"
                    referrerPolicy="no-referrer"
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FileText className="w-16 h-16 mx-auto stroke-1 text-indigo-600" />
                    <span className="block text-xs mt-2 font-mono text-slate-700 font-bold">{file.name}</span>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setFile(null);
                    setMetadata(null);
                    setPreviewUrl('');
                  }}
                  className="absolute bottom-3 right-3 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg hover:bg-black transition-colors cursor-pointer"
                >
                  Clear Inspect File
                </button>
              </div>

              {metadata && (
                <button
                  onClick={handleCopyMeta}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ClipboardCopy className="w-3.5 h-3.5 text-white" />
                  Copy Specs Summary
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid Specification Sheets */}
      <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl shadow-3xs">
        {metadata ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">File Header Properties</h4>
              <span className="bg-indigo-100 border border-indigo-200 py-0.5 px-2.5 rounded-lg font-mono text-[10px] text-indigo-700 font-extrabold uppercase">
                Active Detail List
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Name */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3 min-w-0">
                <div className="p-2 bg-indigo-105 bg-indigo-50 text-indigo-650 text-indigo-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block">File Name</span>
                  <span className="text-xs font-bold text-slate-800 block truncate mt-0.5" title={metadata.name}>{metadata.name}</span>
                </div>
              </div>

              {/* Format Mime Type */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block">Format standard</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">{metadata.mimeType}</span>
                </div>
              </div>

              {/* Pixel Dimensions */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Maximize className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block">Dimensions Sizing</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{metadata.dimensions}</span>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3">
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block">Aspect fractional ratio</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5 font-mono">{metadata.aspectRatio}</span>
                </div>
              </div>

              {/* Memory Weight */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3 sm:col-span-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Coins className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block">File Byte Size</span>
                  <span className="text-xs font-bold text-slate-800 block truncate mt-0.5 font-mono">{metadata.size}</span>
                </div>
              </div>

              {/* Date Metadata */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-start gap-3 sm:col-span-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider block">Last modified on device</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{metadata.lastModified}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 border border-slate-200 rounded-2xl min-h-[300px]">
            <ClipboardCopy className="w-12 h-12 text-slate-350 stroke-1 mb-3 animate-pulse" />
            <span className="text-sm font-bold text-slate-705 text-slate-700">Inspector workspace idle</span>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-normal">
              Load an image or document in the left upload zone to extract exact canvas metrics, aspect fractions, format standard headers, and modified records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

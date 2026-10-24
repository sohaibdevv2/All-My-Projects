import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  FileCheck2,
  FileArchive,
  Image as ImageIcon,
  CheckCircle,
  Hash,
  HelpCircle
} from 'lucide-react';
import { formatBytes } from '../utils/imageHelpers';
import JSZip from 'jszip';

interface PdfMetadata {
  name: string;
  size: number;
  totalPages: number;
}

interface PageRenderItem {
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
  status: 'rendering' | 'success' | 'error';
  blob?: Blob;
}

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfMeta, setPdfMeta] = useState<PdfMetadata | null>(null);
  const [pages, setPages] = useState<PageRenderItem[]>([]);
  const [isRenderAllPending, setIsRenderAllPending] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [scale, setScale] = useState<number>(2); // 1.5x, 2x, 3x DPI options
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [pdfInstance, setPdfInstance] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean objects on remove
  const clearCurrentPdf = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.imageUrl));
    setFile(null);
    setPdfMeta(null);
    setPages([]);
    setRenderProgress(0);
    setPdfInstance(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      pages.forEach((p) => URL.revokeObjectURL(p.imageUrl));
    };
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPages([]);
      setRenderProgress(0);

      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        alert("PDF extraction core is loading. Please give it a brief moment.");
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = async function() {
        try {
          setIsRenderAllPending(true);
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
          
          setPdfInstance(pdfDoc);
          setPdfMeta({
            name: selected.name,
            size: selected.size,
            totalPages: pdfDoc.numPages
          });

          // Prebuild empty slots
          const placeholderPages: PageRenderItem[] = Array.from({ length: pdfDoc.numPages }, (_, index) => ({
            pageNumber: index + 1,
            imageUrl: '',
            width: 0,
            height: 0,
            status: 'rendering'
          }));
          setPages(placeholderPages);
          setIsRenderAllPending(false);
          
          // Trigger automated progressive rendering of all pages
          startProgressiveRender(pdfDoc, pdfDoc.numPages);

        } catch (err) {
          console.error("PDF Parsing crashed", err);
          setIsRenderAllPending(false);
        }
      };

      fileReader.readAsArrayBuffer(selected);
    }
  };

  // Progressive rendering so that user doesn't wait for entire PDF to finish to see previews
  const startProgressiveRender = async (pdfDoc: any, totalCount: number) => {
    const mimeType = outputFormat;
    const quality = 0.92;

    for (let pageNum = 1; pageNum <= totalCount; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPages((prev) =>
              prev.map((p) =>
                p.pageNumber === pageNum
                  ? {
                      ...p,
                      status: 'success',
                      imageUrl: url,
                      width: viewport.width,
                      height: viewport.height,
                      blob: blob
                    }
                  : p
              )
            );
          }
        }, mimeType, quality);

        // Update progress percentage
        setRenderProgress(Math.round((pageNum / totalCount) * 100));

      } catch (err) {
        console.error("Failed page render renderProgress", pageNum, err);
        setPages((prev) =>
          prev.map((p) => (p.pageNumber === pageNum ? { ...p, status: 'error' } : p))
        );
      }
    }
  };

  const handleRerunRender = () => {
    if (!pdfInstance || !pdfMeta) return;
    
    // Revoke old objects
    pages.forEach((p) => {
      if (p.imageUrl) URL.revokeObjectURL(p.imageUrl);
    });

    const refreshed: PageRenderItem[] = Array.from({ length: pdfMeta.totalPages }, (_, index) => ({
      pageNumber: index + 1,
      imageUrl: '',
      width: 0,
      height: 0,
      status: 'rendering'
    }));
    
    setPages(refreshed);
    setRenderProgress(0);
    startProgressiveRender(pdfInstance, pdfMeta.totalPages);
  };

  const downloadSinglePage = (p: PageRenderItem) => {
    if (!p.imageUrl) return;
    const ext = outputFormat === 'image/png' ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = p.imageUrl;
    const baseName = file?.name.substring(0, file.name.lastIndexOf('.')) || 'extracted_doc';
    link.download = `${baseName}_page_${p.pageNumber}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllPagesZip = async () => {
    const successItems = pages.filter((p) => p.status === 'success' && p.blob);
    if (successItems.length === 0) return;

    const zip = new JSZip();
    const ext = outputFormat === 'image/png' ? 'png' : 'jpg';
    const baseName = file?.name.substring(0, file.name.lastIndexOf('.')) || 'extracted_doc';

    for (let i = 0; i < successItems.length; i++) {
      const p = successItems[i];
      zip.file(`${baseName}_page_${p.pageNumber}.${ext}`, p.blob!);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = `${baseName}_pages_bundle.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Panel Column (Left) */}
      <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit space-y-6">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">PDF Extract Controls</h3>
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-550 hover:border-indigo-550 hover:indigo-50 bg-white hover:bg-indigo-50/15 p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept=".pdf"
              className="hidden"
            />
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-slate-800">Select PDF document</p>
            <p className="text-[10.5px] text-slate-500 mt-1 max-w-[180px] leading-relaxed">
              Convert multipage PDF brochures, tax sheets or files into HD images.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Meta details */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs min-w-0">
              <FileText className="w-8 h-8 text-indigo-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-800 truncate" title={pdfMeta?.name}>
                  {pdfMeta?.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                  <span className="font-mono font-semibold">{formatBytes(pdfMeta?.size || 0)}</span>
                  <span className="font-extrabold bg-indigo-50 py-0.5 px-2 rounded text-indigo-650 border border-indigo-100">
                    {pdfMeta?.totalPages} Pages
                  </span>
                </div>
              </div>
            </div>

            {/* Rendering Progress Indicator */}
            {renderProgress < 100 && renderProgress > 0 && (
              <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-650 font-bold">Rendering Document...</span>
                  <span className="font-extrabold text-indigo-600">{renderProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-350"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Settings block */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              {/* Output Format Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Extraction Format</label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
                  {(['image/png', 'image/jpeg'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        outputFormat === fmt
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-250'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                      }`}
                    >
                      {fmt === 'image/png' ? 'PNG (Lossless)' : 'JPEG (Standard)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Resolution Density (DPI Scale)</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200 text-center font-mono">
                  {([1.2, 2, 3] as const).map((dpi) => (
                    <button
                      key={dpi}
                      onClick={() => setScale(dpi)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        scale === dpi
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-250'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                      }`}
                    >
                      {dpi === 1.2 ? 'Draft' : dpi === 2 ? 'HD 2x' : 'Retina 3x'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 px-1 leading-normal">
                  Retina (3x DPI) outputs razor-sharp print quality but generates slowly. Standard (HD 2x) is highly recommended.
                </p>
              </div>

              {/* Rerun Trigger */}
              <button
                onClick={handleRerunRender}
                className="w-full border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                Apply & Rerender Pages
              </button>
            </div>

            {/* Global Zip Button */}
            {pages.some((p) => p.status === 'success') && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={downloadAllPagesZip}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors border border-slate-800"
                >
                  <FileArchive className="w-4 h-4 text-slate-305" />
                  Download Saved Pages (ZIP)
                </button>
                <button
                  onClick={clearCurrentPdf}
                  className="w-full text-rose-600 hover:text-rose-700 text-[11px] font-bold py-1 select-none cursor-pointer hover:underline"
                >
                  Unload Current PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Renders stage viewport (Right/Center) */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 p-6 rounded-2xl">
        {file ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-bold text-slate-850 text-sm text-slate-800">
                Document individual pages list
              </h4>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {pages.filter((p) => p.status === 'success').length} of {pages.length} Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence>
                {pages.map((p) => (
                  <motion.div
                    key={p.pageNumber}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    {/* Visual container */}
                    <div className="aspect-[3/4] bg-slate-150 border-b border-slate-200 relative flex items-center justify-center group overflow-hidden">
                      {p.status === 'rendering' ? (
                        <div className="flex flex-col items-center gap-1.5 text-slate-500 text-xs text-center p-4">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-550 text-indigo-600" />
                          <span className="font-semibold">Extracting page {p.pageNumber}...</span>
                        </div>
                      ) : p.status === 'error' ? (
                        <div className="flex flex-col items-center gap-1 text-rose-500 text-xs text-center p-4">
                          <AlertCircle className="w-5 h-5" />
                          <span>Page failed to render</span>
                        </div>
                      ) : (
                        <>
                          <img
                            src={p.imageUrl}
                            alt={`page ${p.pageNumber}`}
                            referrerPolicy="no-referrer"
                            className="object-contain w-full h-full max-h-full transition-transform group-hover:scale-[1.02]"
                          />
                          {/* Floating Download Overlay on hover in desktop */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => downloadSinglePage(p)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md scale-95 group-hover:scale-100 transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Save Page
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Metadata Footer bar */}
                    <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-slate-200">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        Page number {p.pageNumber}
                      </span>
                      {p.status === 'success' && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono font-bold">
                            {p.width} x {p.height} px
                          </span>
                          <button
                            onClick={() => downloadSinglePage(p)}
                            className="text-indigo-600 hover:text-indigo-800 p-1 cursor-pointer transition-colors"
                            title="Download this page single"
                          >
                            <Download className="w-4 h-4 text-indigo-600 mt-0.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-12 rounded-3xl min-h-[380px] flex flex-col items-center justify-center text-center">
            <FileText className="w-14 h-14 text-slate-350 stroke-1 mb-3 animate-pulse" />
            <span className="text-sm font-bold text-slate-700">PDF Document workspace vacant</span>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Drag or drop a `.pdf` file in the left menu dashboard to convert document structures into downloadable JPG or lossless PNG images instantly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

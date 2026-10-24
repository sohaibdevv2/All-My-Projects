/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  RefreshCw, 
  Minimize2, 
  FileText, 
  Sliders, 
  Info, 
  Sparkles, 
  Lock,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import BatchConverter from './components/BatchConverter';
import Compressor from './components/Compressor';
import PdfToImage from './components/PdfToImage';
import ImageEditor from './components/ImageEditor';
import MetadataViewer from './components/MetadataViewer';

type ActiveTab = 'converter' | 'compressor' | 'pdf' | 'editor' | 'metadata';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('converter');
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const MENU_ITEMS = [
    { id: 'converter', label: 'Convert Image Types', desc: 'Change format (JPG/PNG/WebP/GIF)', icon: RefreshCw },
    { id: 'compressor', label: 'Shrink File Size', desc: 'Reduce file bytes & preserve quality', icon: Minimize2 },
    { id: 'pdf', label: 'PDF Page Extractor', desc: 'Convert PDF pages into image sheets', icon: FileText },
    { id: 'editor', label: 'Quick Layout & Style', desc: 'Rotate, flip, resize and style photos', icon: Sliders },
    { id: 'metadata', label: 'Inspect Photo Specs', desc: 'Check dimensions, file weight & format', icon: Info },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top designer accent line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col space-y-6 relative z-10">
        
        {/* Crisp Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-[10.5px] font-bold uppercase py-1 px-3 rounded-full flex items-center gap-1 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Private Sandbox Engine
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[10.5px] font-bold py-1 px-3 rounded-full flex items-center gap-1 border border-emerald-100">
                <Lock className="w-3.5 h-3.5 text-emerald-550" /> 100% Offline Secure
              </span>
            </div>
            <h1 className="font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight mt-2">
              Simple Offline Photo Converter & Utilities
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              An easy, safe design tool to convert image types, compress large sizes, extract clean PDF sheets, and tweak configurations.
              All operations are done <strong>inside your web browser</strong>—no photos are ever sent to any website server, so it is fully confidential and private.
            </p>
          </div>
        </header>

        {/* Dynamic step-by-step assistant for beginners */}
        <section className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100 rounded-2xl overflow-hidden shadow-xs">
          <button 
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between p-4 bg-white/70 hover:bg-white transition-colors cursor-pointer text-left focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">First time here? View our 3-step dynamic guide</h4>
                <p className="text-[11px] text-slate-500">Learn how to easily modify your files under 1 minute.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
              <span>{isGuideOpen ? 'Hide Tips' : 'Show Tips'}</span>
              {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isGuideOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border-t border-indigo-50 bg-white/30">
              {/* Step 1 */}
              <div className="bg-white p-4 rounded-xl border border-indigo-50/80 shadow-2xs flex gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 mb-0.5">Select a Utility</h5>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Click the tab bars below to open the specific format converter, PDF extractor, photo compressor, or metadata specs viewer.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-4 rounded-xl border border-indigo-50/80 shadow-2xs flex gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 mb-0.5">Choose & Drop Files</h5>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Drag and drop your target images or PDFs into the file dashed zone, or browse device storage. They will immediately render.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-4 rounded-xl border border-indigo-50/80 shadow-2xs flex gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 mb-0.5">Tune Settings & Save</h5>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Slide simple quality knobs, change sizes, view the instant comparison on screen, and click "Save" to export to your device!
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Tab Selection Navigation Grid (Responsive and ultra approachable) */}
        <nav className="grid grid-cols-2 lg:grid-cols-5 gap-2 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-3xs">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md border border-slate-200 scale-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-indigo-650 text-indigo-600' : 'text-slate-450'}`} />
                <span className="text-xs">{item.label}</span>
                <span className="text-[9.5px] text-slate-500 mt-1 text-center hidden md:inline truncate w-full px-1">{item.desc}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Tool Workspace Stage with pleasant borders */}
        <section className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-full">
            {activeTab === 'converter' && <BatchConverter />}
            {activeTab === 'compressor' && <Compressor />}
            {activeTab === 'pdf' && <PdfToImage />}
            {activeTab === 'editor' && <ImageEditor />}
            {activeTab === 'metadata' && <MetadataViewer />}
          </div>
        </section>

      </main>

      {/* Structured Human Footer with security assurances */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 relative z-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} Image Converter & Compressor Suite. Open-source browser client tools.</span>
          <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 py-1 px-3.5 rounded-full text-slate-600 font-medium">
            <span>Powered by HTML5 Local GPU Acceleration</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

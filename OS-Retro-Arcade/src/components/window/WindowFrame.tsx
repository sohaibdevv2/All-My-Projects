import React, { useState, useRef, useEffect } from 'react';
import { WindowInstance } from '../../types';
import { Minus, Square, Copy, X, LayoutGrid } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface WindowFrameProps {
  window: WindowInstance;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onSnap: (id: string, side: 'left' | 'right' | 'full') => void;
  onMove: (id: string, pos: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onSnap,
  onMove,
  onResize,
  children
}) => {
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; winX: number; winY: number }>({
    mouseX: 0,
    mouseY: 0,
    winX: 0,
    winY: 0
  });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 0,
    startH: 0
  });

  // Handle Dragging
  const handleTitlePointerDown = (e: React.PointerEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    onFocus(win.id);
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: win.position.x,
      winY: win.position.y
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTitlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    const newX = Math.max(0, dragStartRef.current.winX + dx);
    const newY = Math.max(0, dragStartRef.current.winY + dy);
    onMove(win.id, { x: newX, y: newY });
  };

  const handleTitlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Handle Resizing
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (win.isMaximized) return;

    onFocus(win.id);
    isResizingRef.current = true;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: win.size.width,
      startH: win.size.height
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizingRef.current) return;
    const dw = e.clientX - resizeStartRef.current.mouseX;
    const dh = e.clientY - resizeStartRef.current.mouseY;
    const newW = Math.max(340, resizeStartRef.current.startW + dw);
    const newH = Math.max(280, resizeStartRef.current.startH + dh);
    onResize(win.id, { width: newW, height: newH });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - 48px)', // leave space for taskbar
        zIndex: win.zIndex,
        borderRadius: 0
      }
    : {
        position: 'absolute',
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex
      };

  return (
    <div
      style={style}
      onPointerDown={() => onFocus(win.id)}
      className={`flex flex-col bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden transition-all duration-75 ${
        win.isMaximized ? 'rounded-none border-none' : 'rounded-xl'
      }`}
    >
      {/* Title Bar */}
      <div
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onDoubleClick={() => {
          sounds.playWhoosh(!win.isMaximized);
          onToggleMaximize(win.id);
        }}
        className="flex items-center justify-between h-9 px-3 bg-slate-950/80 border-b border-white/10 select-none cursor-default"
      >
        {/* App Icon & Title */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 truncate">
          <span className="text-base">{win.icon}</span>
          <span className="truncate">{win.title}</span>
        </div>

        {/* Window Controls (Windows 11 Fluent) */}
        <div className="flex items-center space-x-1 relative">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playWhoosh(false);
              onMinimize(win.id);
            }}
            className="w-8 h-7 flex items-center justify-center hover:bg-white/10 rounded text-slate-300 hover:text-white transition"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize & Snap Layouts trigger */}
          <div
            className="relative"
            onMouseEnter={() => setShowSnapMenu(true)}
            onMouseLeave={() => setShowSnapMenu(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playWhoosh(!win.isMaximized);
                onToggleMaximize(win.id);
              }}
              className="w-8 h-7 flex items-center justify-center hover:bg-white/10 rounded text-slate-300 hover:text-white transition"
              title={win.isMaximized ? 'Restore Down' : 'Maximize'}
            >
              {win.isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            </button>

            {/* Windows 11 Snap Layouts Popover */}
            {showSnapMenu && (
              <div className="absolute right-0 top-8 z-50 p-2 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex space-x-2 animate-in fade-in zoom-in-95">
                {/* Snap Left / Right */}
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-slate-400">Split 50/50</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSnap(win.id, 'left');
                        setShowSnapMenu(false);
                      }}
                      className="w-7 h-9 border border-white/20 hover:border-sky-400 hover:bg-sky-500/30 rounded flex items-center justify-center"
                      title="Snap Left Half"
                    >
                      <span className="text-[9px] text-slate-300">L</span>
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSnap(win.id, 'right');
                        setShowSnapMenu(false);
                      }}
                      className="w-7 h-9 border border-white/20 hover:border-sky-400 hover:bg-sky-500/30 rounded flex items-center justify-center"
                      title="Snap Right Half"
                    >
                      <span className="text-[9px] text-slate-300">R</span>
                    </button>
                  </div>
                </div>

                {/* Snap Full */}
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-slate-400">Maximize</span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSnap(win.id, 'full');
                      setShowSnapMenu(false);
                    }}
                    className="w-14 h-9 border border-white/20 hover:border-sky-400 hover:bg-sky-500/30 rounded flex items-center justify-center"
                    title="Fullscreen"
                  >
                    <Square className="w-3 h-3 text-slate-300" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              onClose(win.id);
            }}
            className="w-8 h-7 flex items-center justify-center hover:bg-red-600 rounded text-slate-300 hover:text-white transition"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Resize Handle (bottom-right corner) */}
      {!win.isMaximized && (
        <div
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Save, FileText, Sparkles, Copy, Check } from 'lucide-react';
import { sounds } from '../../utils/audio';

const DEFAULT_CHEATS_TEXT = `=========================================
  WINDOWS 11 RETRO ARCADE - SECRET MANUAL
=========================================

Welcome to the Windows 11 Retro Arcade suite!
Here are the gameplay tips and secret strategies:

[1] SUPER MARIO BROS ARCADE:
- Jump on Goombas from above to bounce and eliminate them (+200 pts).
- Hit the flashing '?' blocks from underneath to uncover coins and Super Mushrooms.
- Collect Super Mushrooms to double your height and survive an extra hit!
- When you are Super Mario, hitting brown brick blocks will shatter them into debris (+50 pts).
- Sprint with Shift / J to jump across wide gaps.
- Touch the flagpole at the far right to finish Course 1-1 with bonus points!

[2] TURBO NITRO HIGHWAY RACER:
- Keep your speed over 180 KM/H for maximum distance scoring.
- Collect blue N2O bottles to replenish your Nitro tank.
- Tap Space / Shift to trigger radical Nitro acceleration up to 260 KM/H!
- Dodge black oil slicks which cause emergency steering loss.
- Pick up green [+] repair kits to restore your car's chassis health.

[3] GALAXY DEFENDER 1982:
- Shoot descending aliens before they touch your defense shields.
- The red Mystery UFO passes across the top of the sky periodically: hit it for +200 bonus pts!
- Alien speed accelerates as their armada numbers dwindle.

[4] NEON SNAKE 3310:
- Grab golden stars for +250 points before the timer runs out.
- Toggle the authentic CRT Phosphor mode in the top bar!

Enjoy playing!
- Windows 11 Arcade Team
`;

export const NotepadApp: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_CHEATS_TEXT);
  const [copied, setCopied] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    sounds.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 font-mono text-xs select-none">
      {/* Menu bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-800/90 border-b border-slate-700/60 text-[11px]">
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="hover:text-white cursor-pointer">File</span>
          <span className="hover:text-white cursor-pointer">Edit</span>
          <span className="hover:text-white cursor-pointer">View</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-3 overflow-hidden bg-slate-950/80">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent text-slate-300 outline-none resize-none font-mono text-xs leading-relaxed select-text"
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>UTF-8</span>
          <span>Windows (CRLF)</span>
        </div>
      </div>
    </div>
  );
};

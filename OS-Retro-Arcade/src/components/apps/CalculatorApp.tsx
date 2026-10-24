import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [clearOnNext, setClearOnNext] = useState(false);

  const handleNumber = (n: string) => {
    sounds.playClick();
    if (display === '0' || clearOnNext) {
      setDisplay(n);
      setClearOnNext(false);
    } else {
      setDisplay(display + n);
    }
  };

  const handleOperator = (op: string) => {
    sounds.playClick();
    setEquation(`${display} ${op}`);
    setClearOnNext(true);
  };

  const handleEquals = () => {
    sounds.playClick();
    if (!equation) return;
    const parts = equation.split(' ');
    const num1 = parseFloat(parts[0]);
    const op = parts[1];
    const num2 = parseFloat(display);
    let result = 0;

    switch (op) {
      case '+': result = num1 + num2; break;
      case '−': result = num1 - num2; break;
      case '×': result = num1 * num2; break;
      case '÷': result = num2 !== 0 ? num1 / num2 : 0; break;
      default: return;
    }

    const resStr = String(Math.round(result * 100000) / 100000);
    setHistory(prev => [`${equation} ${display} = ${resStr}`, ...prev.slice(0, 5)]);
    setDisplay(resStr);
    setEquation('');
    setClearOnNext(true);
  };

  const handleClear = () => {
    sounds.playClick();
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    sounds.playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    { label: '%', action: () => setDisplay(String(parseFloat(display) / 100)), type: 'fn' },
    { label: 'CE', action: () => setDisplay('0'), type: 'fn' },
    { label: 'C', action: handleClear, type: 'fn' },
    { label: '⌫', action: handleBackspace, type: 'fn' },

    { label: '¹/x', action: () => setDisplay(String(1 / parseFloat(display))), type: 'fn' },
    { label: 'x²', action: () => setDisplay(String(Math.pow(parseFloat(display), 2))), type: 'fn' },
    { label: '√x', action: () => setDisplay(String(Math.sqrt(parseFloat(display)))), type: 'fn' },
    { label: '÷', action: () => handleOperator('÷'), type: 'op' },

    { label: '7', action: () => handleNumber('7'), type: 'num' },
    { label: '8', action: () => handleNumber('8'), type: 'num' },
    { label: '9', action: () => handleNumber('9'), type: 'num' },
    { label: '×', action: () => handleOperator('×'), type: 'op' },

    { label: '4', action: () => handleNumber('4'), type: 'num' },
    { label: '5', action: () => handleNumber('5'), type: 'num' },
    { label: '6', action: () => handleNumber('6'), type: 'num' },
    { label: '−', action: () => handleOperator('−'), type: 'op' },

    { label: '1', action: () => handleNumber('1'), type: 'num' },
    { label: '2', action: () => handleNumber('2'), type: 'num' },
    { label: '3', action: () => handleNumber('3'), type: 'num' },
    { label: '+', action: () => handleOperator('+'), type: 'op' },

    { label: '±', action: () => setDisplay(String(-parseFloat(display))), type: 'num' },
    { label: '0', action: () => handleNumber('0'), type: 'num' },
    { label: '.', action: () => { if (!display.includes('.')) setDisplay(display + '.'); }, type: 'num' },
    { label: '=', action: handleEquals, type: 'eq' }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none p-3">
      {/* Display Screen */}
      <div className="bg-slate-950/60 rounded-xl p-3 mb-3 border border-slate-800 flex flex-col justify-end text-right h-24">
        <div className="text-xs text-slate-400 font-mono h-4 truncate">{equation}</div>
        <div className="text-3xl font-bold tracking-tight text-white font-mono truncate">{display}</div>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-4 gap-1.5 flex-1">
        {buttons.map((btn, i) => {
          let bg = 'bg-slate-800/80 hover:bg-slate-700 text-white';
          if (btn.type === 'fn') bg = 'bg-slate-800/40 hover:bg-slate-700 text-slate-300';
          if (btn.type === 'op') bg = 'bg-sky-950/60 hover:bg-sky-900 border border-sky-800/50 text-sky-300';
          if (btn.type === 'eq') bg = 'bg-sky-600 hover:bg-sky-500 text-white font-bold';

          return (
            <button
              key={i}
              onClick={btn.action}
              className={`${bg} rounded-lg flex items-center justify-center text-sm font-semibold transition active:scale-95 shadow-sm`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

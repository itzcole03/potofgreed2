import React from "react";
import { Backspace } from "lucide-react";

interface NumpadKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const NumpadKeyboard: React.FC<NumpadKeyboardProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const handleNumberClick = (num: string) => {
    onChange(value + num);
  };

  const handleDecimalClick = () => {
    if (!value.includes(".")) {
      onChange(value + ".");
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-slate-800 rounded-t-xl p-4 border-t border-slate-600">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Enter Amount</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <div className="text-right">
            <span className="text-white/60 text-lg">$</span>
            <span className="text-white text-2xl font-mono">
              {value || "0"}
            </span>
          </div>
        </div>

        {/* Numpad Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Row 1 */}
          <button
            onClick={() => handleNumberClick("1")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">1</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("2")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">2</div>
              <div className="text-xs text-white/60">abc</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("3")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">3</div>
              <div className="text-xs text-white/60">def</div>
            </div>
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleNumberClick("4")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">4</div>
              <div className="text-xs text-white/60">ghi</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("5")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">5</div>
              <div className="text-xs text-white/60">jkl</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("6")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">6</div>
              <div className="text-xs text-white/60">mno</div>
            </div>
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleNumberClick("7")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">7</div>
              <div className="text-xs text-white/60">pqrs</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("8")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">8</div>
              <div className="text-xs text-white/60">tuv</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("9")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">9</div>
              <div className="text-xs text-white/60">wxyz</div>
            </div>
          </button>

          {/* Row 4 */}
          <button
            onClick={handleDecimalClick}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">.</div>
            </div>
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl">0</div>
            </div>
          </button>
          <button
            onClick={handleBackspace}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Backspace className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumpadKeyboard;

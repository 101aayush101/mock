import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, PenTool, Trash2, StickyNote, RotateCcw, Download } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'text'>('canvas');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#1e293b');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [roughNotes, setRoughNotes] = useState<string>(() => {
    return localStorage.getItem('ssc_cgl_scratchpad_notes') || '';
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'canvas') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize dimensions with high DPI scaling
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    }
  }, [isOpen, activeTab]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (historyRef.current.length > 15) {
      historyRef.current.shift();
    }
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? 24 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyRef.current.pop();
    const prevState = historyRef.current[historyRef.current.length - 1];
    if (prevState) {
      ctx.putImageData(prevState, 0, 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRoughNotes(e.target.value);
    try {
      localStorage.setItem('ssc_cgl_scratchpad_notes', e.target.value);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl h-[85vh] max-h-[680px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Digital Rough Sheet / Scratchpad
                <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700">
                  Calculations &amp; Reasoning
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  activeTab === 'canvas' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Drawing Board
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  activeTab === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Text Pad
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Close Scratchpad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar for Drawing Board */}
        {activeTab === 'canvas' && (
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-2 flex-wrap text-xs shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTool('pen')}
                className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
                  tool === 'pen'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Pen</span>
              </button>

              <button
                onClick={() => setTool('eraser')}
                className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
                  tool === 'eraser'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Colors */}
              <div className="flex items-center gap-1">
                {['#0f172a', '#2563eb', '#dc2626', '#16a34a'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      setTool('pen');
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition ${
                      color === c && tool === 'pen' ? 'scale-110 border-slate-900 shadow-xs' : 'border-white'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Stroke */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500 text-[11px]">Size:</span>
                {[2, 4, 6].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setLineWidth(sz)}
                    className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                      lineWidth === sz ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    {sz === 2 ? 'Fine' : sz === 4 ? 'Med' : 'Thick'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition"
                title="Undo last stroke"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Undo</span>
              </button>
              <button
                onClick={handleClear}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center gap-1 transition font-medium"
                title="Clear entire canvas"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 relative overflow-hidden bg-slate-50">
          {activeTab === 'canvas' ? (
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none bg-white block"
            />
          ) : (
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 text-xs text-slate-500 border-b border-slate-200">
                <span>Quickly note equations, formulas, or numbers. Auto-saved.</span>
                <button
                  onClick={() => setRoughNotes('')}
                  className="text-rose-600 hover:underline font-medium"
                >
                  Clear Notes
                </button>
              </div>
              <textarea
                value={roughNotes}
                onChange={handleTextChange}
                placeholder="Type your calculations, shortcuts, or notes here...&#10;e.g. 17 × 19 = (18-1)(18+1) = 324 - 1 = 323"
                className="flex-1 w-full p-4 mt-2 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed resize-none text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>Tip: You can keep rough notes or calculations open anytime during the mock.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useWhiteboard, Resource } from '../hooks/useWhiteboard';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const Whiteboard: React.FC = () => {
  const { resources, addResource, removeResource, canvasData, saveCanvas, clearCanvas } = useWhiteboard();
  const [activeTab, setActiveTab] = useState<'resources' | 'board'>('resources');

  // Resource Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<Resource['category']>('Other');
  const [isAddingResource, setIsAddingResource] = useState(false);

  // Canvas State & Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize Canvas
  useEffect(() => {
    if (activeTab === 'board' && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size to match parent container dynamically or fixed large size
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = '#000000'; // Default black
        context.lineWidth = 3;
        setCtx(context);

        // Load saved data
        if (canvasData) {
          const img = new Image();
          img.src = canvasData;
          img.onload = () => {
            context.drawImage(img, 0, 0);
          };
        }
      }
    }
  }, [activeTab]); // canvasData dependency omitted to prevent reload loop while drawing

  // Handle Add Resource
  const handleAddResource = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    addResource(newTitle, newUrl, newCategory);
    setNewTitle('');
    setNewUrl('');
    setIsAddingResource(false);
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    ctx.closePath();
    setIsDrawing(false);
    saveCanvas(canvasRef.current.toDataURL());
  };

  const handleClearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    if (confirm('Clear the entire whiteboard?')) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      clearCanvas();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/60 dark:bg-black/20 backdrop-blur-[40px] border border-white/40 dark:border-white/5 overflow-hidden animate-in fade-in duration-1000 shadow-xl shadow-black/5 dark:shadow-black/40">

      {/* Header & Tabs */}
      <div className="p-8 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team Hub</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-2">Shared Resources & Ideas</p>
        </div>

        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'resources'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-white/60'
              }`}
          >
            <ListBulletIcon className="w-4 h-4" />
            Resources
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'board'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-white/60'
              }`}
          >
            <PencilIcon className="w-4 h-4" />
            Whiteboard
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="h-full overflow-y-auto p-10 scrollbar-none">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Add Resource Button */}
              {!isAddingResource ? (
                <button
                  onClick={() => setIsAddingResource(true)}
                  className="w-full py-6 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-[24px] text-slate-400 dark:text-white/30 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-500/5 transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-primary-500/10 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Add New Resource</span>
                </button>
              ) : (
                <div className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-black/5 dark:border-white/5 animate-in slide-in-from-top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">New Resource</h3>
                    <button onClick={() => setIsAddingResource(false)} className="text-xs font-bold text-red-500 hover:underline">Cancel</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Title (e.g., Design System)"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="px-4 py-3 bg-black/5 dark:bg-black/20 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="px-4 py-3 bg-black/5 dark:bg-black/20 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Other">Other</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Documentation">Documentation</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="URL (e.g., figma.com/...)"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-black/20 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                  />
                  <button
                    onClick={handleAddResource}
                    disabled={!newTitle || !newUrl}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save Resource
                  </button>
                </div>
              )}

              {/* Resource List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(resource => (
                  <div key={resource.id} className="group relative bg-white/40 dark:bg-white/5 p-6 rounded-[24px] border border-white/40 dark:border-white/5 hover:border-primary-500/30 transition-all hover:shadow-lg hover:shadow-primary-500/5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${resource.category === 'Design' ? 'bg-primary-500/10 text-primary-500' :
                            resource.category === 'Development' ? 'bg-primary-500/10 text-primary-500' :
                              resource.category === 'Documentation' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-slate-500/10 text-slate-500'
                          }`}>
                          {resource.category}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-white/20">
                          {new Date(resource.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => removeResource(resource.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-opacity"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{resource.title}</h3>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-slate-500 dark:text-white/40 hover:text-primary-500 dark:hover:text-primary-400 truncate block transition-colors"
                    >
                      {resource.url}
                    </a>
                  </div>
                ))}
              </div>

              {resources.length === 0 && !isAddingResource && (
                <div className="text-center py-20 opacity-50">
                  <p className="text-sm font-bold text-slate-400 dark:text-white/30">No resources shared yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOARD TAB */}
        {activeTab === 'board' && (
          <div className="h-full w-full relative bg-white dark:bg-[#1a1a1a] cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute inset-0 w-full h-full"
            />

            {/* Toolbar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-black border border-white"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Pen</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <button
                onClick={handleClearCanvas}
                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Board
              </button>
            </div>

            <div className="absolute top-8 left-8 bg-black/5 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl pointer-events-none">
              <p className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">
                Local Sketchpad
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Whiteboard;

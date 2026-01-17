
import React, { useState, useRef, useCallback } from 'react';
import { AppMode, GeneratedResult } from './types';
import { CREATE_PRESETS, EDIT_PRESETS } from './constants';
import { generateAIImage } from './services/geminiService';

export default function App() {
  const [mode, setMode] = useState<AppMode>('create');
  const [activeFunction, setActiveFunction] = useState<string>('free');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Images for upload
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setActiveFunction(newMode === 'create' ? 'free' : 'add-remove');
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slot: number = 0) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (slot === 1) setImage1(base64String);
        else if (slot === 2) setImage2(base64String);
        else setImage1(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Por favor, descreva sua ideia.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const currentPreset = (mode === 'create' ? CREATE_PRESETS : EDIT_PRESETS).find(p => p.id === activeFunction);
      const imageUrl = await generateAIImage(
        prompt,
        activeFunction,
        mode,
        image1 || undefined,
        (currentPreset?.requiresTwo ? image2 : undefined) || undefined
      );

      setResult({
        url: imageUrl,
        prompt: prompt,
        mode: mode,
        function: activeFunction
      });
    } catch (err: any) {
      setError("Erro ao gerar imagem. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `ai-studio-${Date.now()}.png`;
    link.click();
  };

  const editCurrentImage = () => {
    if (!result) return;
    setImage1(result.url);
    setMode('edit');
    setActiveFunction('retouch');
    setResult(null);
  };

  const activePresets = mode === 'create' ? CREATE_PRESETS : EDIT_PRESETS;
  const currentPreset = activePresets.find(p => p.id === activeFunction);
  const showDualUpload = mode === 'edit' && currentPreset?.requiresTwo;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row p-4 md:p-6 gap-6 max-w-[1600px] mx-auto">
      
      {/* LEFT PANEL */}
      <div className="w-full md:w-[450px] flex flex-col gap-6 overflow-y-auto pr-2">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
            <span className="text-lime-400">✧</span> Mestres AI Studio
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Gerador profissional de imagens</p>
        </header>

        {/* Prompt Section */}
        <section className="bg-[#111111] p-5 rounded-2xl border border-zinc-800 lime-glow">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Qual a sua ideia:</div>
          <textarea
            id="prompt"
            className="w-full h-32 bg-transparent text-white border-none focus:ring-0 placeholder-zinc-700 resize-none font-medium leading-relaxed"
            placeholder="Ex: Um mestre da IA demitindo 30 empregados..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </section>

        {/* Mode Toggle */}
        <div className="flex bg-[#111111] p-1.5 rounded-xl border border-zinc-800 gap-1">
          <button
            onClick={() => handleModeChange('create')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all mode-btn ${
              mode === 'create' ? 'bg-lime-400 text-black shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            CRIAR
          </button>
          <button
            onClick={() => handleModeChange('edit')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all mode-btn ${
              mode === 'edit' ? 'bg-lime-400 text-black shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            EDITAR
          </button>
        </div>

        {/* Functions Grid */}
        <div className="grid grid-cols-4 gap-3">
          {activePresets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveFunction(p.id)}
              className={`function-card flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                activeFunction === p.id 
                  ? 'border-lime-400 bg-lime-400/10 text-lime-400' 
                  : 'border-zinc-800 bg-[#111111] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              <div className="icon mb-1">
                {p.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content: Upload Areas */}
        <div className="space-y-4">
          {showDualUpload ? (
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="relative group h-40 bg-[#111111] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-lime-400/50 transition-all overflow-hidden"
                onClick={() => fileInput1Ref.current?.click()}
              >
                {image1 ? (
                  <img src={image1} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-zinc-600 mb-2 group-hover:text-lime-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Img 1</span>
                  </>
                )}
                <input type="file" ref={fileInput1Ref} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 1)} />
              </div>
              <div 
                className="relative group h-40 bg-[#111111] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-lime-400/50 transition-all overflow-hidden"
                onClick={() => fileInput2Ref.current?.click()}
              >
                {image2 ? (
                  <img src={image2} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-zinc-600 mb-2 group-hover:text-lime-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Img 2</span>
                  </>
                )}
                <input type="file" ref={fileInput2Ref} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 2)} />
              </div>
            </div>
          ) : (
            (mode === 'edit' || (mode === 'create' && activeFunction !== 'free')) && (
              <div 
                className="relative group h-48 bg-[#111111] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-lime-400/50 transition-all overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {image1 ? (
                  <img src={image1} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-zinc-600 mb-2 group-hover:text-lime-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <span className="text-xs text-zinc-500 font-bold uppercase mb-1">Arraste uma imagem</span>
                    <span className="text-[10px] text-zinc-600 uppercase">PNG, JPG, WebP (máx. 10MB)</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {image1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setImage1(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className={`w-full py-5 rounded-2xl text-black font-extrabold flex items-center justify-center gap-3 transition-all lime-glow-hover ${
            isGenerating ? 'bg-lime-600 cursor-not-allowed' : 'bg-lime-400 hover:bg-lime-300'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full spinner"></div>
              <span className="uppercase tracking-widest">Processando...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"></path></svg>
              <span className="uppercase tracking-widest">Gerar Imagem</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT PANEL: RESULTS */}
      <div className="flex-1 min-h-[500px] bg-[#0a0a0a] border border-zinc-900 rounded-[32px] overflow-hidden relative flex items-center justify-center">
        
        {!isGenerating && !result && (
          <div className="flex flex-col items-center gap-4 text-center px-10">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-500">Sua obra de arte aparecerá aqui</h3>
            <p className="text-zinc-700 max-w-sm text-sm">Use o painel ao lado para descrever o que você imagina e a nossa IA cuidará do resto.</p>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center gap-6 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full spinner"></div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-lime-400">Gerando sua imagem...</h3>
              <p className="text-zinc-500 text-sm">Isso pode levar alguns segundos.</p>
            </div>
          </div>
        )}

        {result && (
          <div className="w-full h-full p-6 flex flex-col group">
            <div className="relative flex-1 overflow-hidden rounded-2xl shadow-2xl border border-zinc-800">
              <img src={result.url} alt="Generated" className="w-full h-full object-contain" />
              
              {/* Overlay Actions */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <button 
                  onClick={editCurrentImage}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  EDITAR
                </button>
                <button 
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  DOWNLOAD
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

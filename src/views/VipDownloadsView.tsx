import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Search, FileText, BookOpen, Layers, CheckCircle, Award } from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';

interface VipDownloadsViewProps {
  controller: AppControllerType;
}

export default function VipDownloadsView({ controller }: VipDownloadsViewProps) {
  const { lang, triggerToast } = controller;
  const isPt = lang === 'pt-BR';

  const [search, setSearch] = useState('');

  const translate = {
    pt: {
      title: 'Downloads & Recursos Exclusivos',
      sub: 'Arquivos PDF de alta definição, planilhas inteligentes de cálculo de dosagem física e checklists organizacionais para garantir uma operação de bar impecável.',
      searchPlaceholder: 'Filtrar planilhas e e-books...',
      format: 'Formato',
      size: 'Tamanho',
      download: 'Baixar Recurso'
    },
    en: {
      title: 'VIP Premium Assets & Manuals',
      sub: 'High-definition PDF recipe collections, smart spreadsheet mixers, and operational checklists to secure a spotless live bar performance.',
      searchPlaceholder: 'Search ebooks and formulas...',
      format: 'Format',
      size: 'Size',
      download: 'Download Asset'
    }
  }[isPt ? 'pt' : 'en'];

  const resources = controller.downloads;

  const filtered = resources.filter(res => 
    res.title.toLowerCase().includes(search.toLowerCase()) || 
    res.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left font-sans text-neutral-200"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/15 text-amber-400 text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border border-amber-500/30">
            VIP CLOUD RESOURCES
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">{translate.title}</h1>
        <p className="text-xs text-neutral-450 max-w-2xl leading-relaxed">{translate.sub}</p>
      </div>

      {/* Search Input bar */}
      <div className="relative w-full max-w-md bg-neutral-950 p-1.5 rounded-2xl border border-neutral-900">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translate.searchPlaceholder}
            className="w-full bg-black border border-neutral-900 focus:border-amber-500/45 outline-none rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-600"
          />
        </div>
      </div>

      {/* Resources Table List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? filtered.map((res) => (
          <div key={res.id} className="bg-neutral-950 border border-neutral-900 hover:border-amber-500/15 transition-colors rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start space-x-4 max-w-[75%] text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                {res.type === 'E-book' ? <BookOpen className="w-5 h-5" /> : res.type === 'Calculator' ? <Layers className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider font-bold bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                    {res.type}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {res.format}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{res.title}</h3>
                <p className="text-xs text-neutral-450 leading-relaxed">{res.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end border-t border-neutral-900 md:border-t-0 pt-3 md:pt-0">
              <div className="text-left md:text-right font-mono text-[10px] text-neutral-500">
                <p>{translate.size}</p>
                <p className="text-xs font-bold text-neutral-300 mt-0.5">{res.size}</p>
              </div>
              
              <button
                id={`download-asset-btn-${res.id}`}
                onClick={() => {
                  triggerToast(isPt ? `Download de "${res.title}" iniciado com sucesso!` : `Downloading "${res.title}"... Done!`);
                }}
                className="flex items-center space-x-2 bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-850 px-5 py-3 rounded-xl text-xs font-bold text-amber-400 transition-all cursor-pointer select-none"
              >
                <Download className="w-4 h-4" />
                <span>{translate.download}</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-neutral-800 bg-black/30 p-6 text-center text-xs text-neutral-500">
            {isPt ? 'Nenhum dado disponível' : 'No data available'}
          </div>
        )}
      </div>
    </motion.div>
  );
}

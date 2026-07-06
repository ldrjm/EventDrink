import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Play, Clock, User, X, Sparkles, Award, Heart } from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';

interface VipVideosViewProps {
  controller: AppControllerType;
}

export default function VipVideosView({ controller }: VipVideosViewProps) {
  const { lang, triggerToast } = controller;
  const isPt = lang === 'pt-BR';

  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const translate = {
    pt: {
      title: 'Masterclasses & Vídeos VIP',
      sub: 'Aprenda técnicas profissionais de bartenders campeões internacionais. Aulas em alta definição para dominar a defumação, cortes de gelo e finalizações.',
      instructor: 'Instrutor',
      duration: 'Duração',
      watch: 'Assistir Aula',
      playing: 'Reproduzindo Vídeo Demonstrativo VIP',
      simulatedDesc: 'O sistema está emulando a transmissão em tempo real do stream. Coloque fones de ouvido para as explicações técnicas do bartender.'
    },
    en: {
      title: 'VIP Video Masterclasses',
      sub: 'Acquire professional skills from champion mixologists globally. High-definition modules covering ice carving, smoking glassware, and fine balances.',
      instructor: 'Instructor',
      duration: 'Duration',
      watch: 'Watch Lesson',
      playing: 'Streaming VIP Video Masterclass',
      simulatedDesc: 'The platform is simulating real-time high-fidelity streaming. Plug in headphones for detailed bartender guides.'
    }
  }[isPt ? 'pt' : 'en'];

  const videos = controller.courses;

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
            VIP MOVIE CHANNELS
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">{translate.title}</h1>
        <p className="text-xs text-neutral-450 max-w-2xl leading-relaxed">{translate.sub}</p>
      </div>

      {/* Grid of Videos */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden group hover:border-amber-500/15 transition-all flex flex-col justify-between">
            <div>
              {/* Image play container */}
              <div 
                className="aspect-video w-full overflow-hidden relative bg-neutral-900 cursor-pointer"
                onClick={() => setActiveVideo(v)}
              >
                <SafeImage src={v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" category="spirits" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md border border-neutral-800 rounded px-2 py-0.5 text-[9px] font-mono text-neutral-300">
                  {v.duration}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 font-bold uppercase">
                  <span>{v.difficulty}</span>
                  <span>•</span>
                  <span>{v.views}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">{v.title}</h3>
                <p className="text-xs text-neutral-450 leading-relaxed">{v.desc}</p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-center justify-between border-t border-neutral-900 pt-3 text-[11px] text-neutral-450">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-400" /> {v.author}</span>
                <button
                  id={`play-masterclass-${v.id}`}
                  onClick={() => setActiveVideo(v)}
                  className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  {translate.watch}
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-black/30 p-6 text-center text-xs text-neutral-500">
          {isPt ? 'Nenhum dado disponível' : 'No data available'}
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/95"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-amber-500/20 max-w-4xl w-full rounded-3xl overflow-hidden relative z-10 shadow-2xl"
            >
              {/* Mock Video Stream Area */}
              <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                <SafeImage src={activeVideo.img} alt={activeVideo.title} className="absolute inset-0 w-full h-full object-cover opacity-35 blur-sm" category="spirits" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black" />
                
                {/* Simulated video playback loading line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="h-full bg-amber-500 shadow-lg shadow-amber-500/50"
                  />
                </div>

                {/* Simulated playback visual components */}
                <div className="relative z-10 text-center space-y-4 px-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse mx-auto">
                    <Video className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-amber-400 font-mono font-bold tracking-widest uppercase">{translate.playing}</p>
                    <h3 className="text-lg md:text-xl font-black text-white">{activeVideo.title}</h3>
                    <p className="text-[11px] text-neutral-450 max-w-lg mx-auto">{translate.simulatedDesc}</p>
                  </div>
                </div>

                <button
                  id="close-masterclass-modal"
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/80 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subtitles / Credits Panel */}
              <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0d0d0d] border-t border-neutral-900 gap-4">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-mono text-neutral-500 uppercase">{translate.instructor}</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> {activeVideo.author}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    id="video-like-btn"
                    onClick={() => triggerToast(isPt ? 'Aula favoritada com sucesso!' : 'Lesson added to bookmarks!')}
                    className="p-3 bg-neutral-900 border border-neutral-850 text-neutral-300 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    id="video-mark-complete-btn"
                    onClick={() => {
                      triggerToast(isPt ? 'Aula concluída! Parabéns!' : 'Lesson marked as complete!');
                      setActiveVideo(null);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    {isPt ? 'Concluir Aula' : 'Complete Lesson'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

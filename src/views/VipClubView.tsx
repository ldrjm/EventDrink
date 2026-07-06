import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wine, 
  Sparkles, 
  Lock, 
  Unlock, 
  Play, 
  Download, 
  BookOpen, 
  Users, 
  Calendar, 
  Compass, 
  Award,
  Video,
  FileDown,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Language } from '../types';
import { SafeImage } from '../components/SafeImage';
import { AppControllerType } from '../controllers/AppController';

interface VipClubViewProps {
  lang: Language;
  controller: AppControllerType;
  currentUser: {
    name: string;
    email: string;
    isLoggedIn: boolean;
    badge: 'Premium Host' | 'VIP Member' | 'Basic Organizer';
    phone?: string;
  } | null;
  onOpenLogin: () => void;
  onToggleUserTier: () => void;
}

export default function VipClubView({ 
  lang,
  controller,
  currentUser, 
  onOpenLogin,
  onToggleUserTier 
}: VipClubViewProps) {
  const isVip = currentUser?.isLoggedIn && (currentUser.badge === 'VIP Member' || currentUser.badge === 'Premium Host');
  const isPt = lang === 'pt-BR';
  
  const text = {
    'pt-BR': {
      headerTitle: 'Clube Event Drink',
      headerSub: 'Sua assinatura exclusiva de alta coquetelaria, mixologia molecular e conteúdo educativo de elite.',
      badgeVip: 'MEMBRO DO CLUBE VIP',
      badgeFree: 'CONTA DIGITAL GRÁTIS',
      unlockedMsg: 'Acesso VIP Liberado! Aproveite os conteúdos exclusivos com detalhes dourados.',
      lockedBannerTitle: '🔒 Conteúdo Exclusivo do Clube Event Drink',
      lockedBannerSub: 'Este material é restrito para membros cadastrados do Clube. Faça o login ou mude para o plano VIP em um único clique para liberar receitas autorais, cursos certificados, downloads de guias e workshops ao vivo.',
      btnUnlock: 'Desbloquear Acesso VIP',
      btnBackFree: 'Voltar ao Plano Grátis',
      tabRecipes: 'Receitas Premium',
      tabVideos: 'Masterclasses',
      tabCourses: 'Cursos Certificados',
      tabDownloads: 'Guias & PDFs',
      tabWorkshops: 'Workshops ao Vivo',
      tabCommunity: 'Comunidade VIP',
      exclusiveLabel: 'EXCLUSIVO DO CLUBE',
      playVideo: 'Assistir Aula',
      downloadPdf: 'Baixar PDF',
      enrollCourse: 'Iniciar Curso',
      workshopDate: 'Próxima transmissão ao vivo',
      commentPlaceholder: 'Deixe um comentário na comunidade exclusiva...',
      btnPostComment: 'Publicar',
    },
    'en': {
      headerTitle: 'Event Drink VIP Club',
      headerSub: 'Your exclusive subscription for high mixology, molecular cocktails, and elite bar guidance.',
      badgeVip: 'VIP CLUB MEMBER',
      badgeFree: 'FREE DIGITAL ACCOUNT',
      unlockedMsg: 'VIP Access Unlocked! Enjoy exclusive resources with exquisite golden accents.',
      lockedBannerTitle: '🔒 Exclusive VIP Club Content',
      lockedBannerSub: 'This section is reserved for verified Club members. Sign in or upgrade to VIP with one click to unlock signature recipes, certification courses, download guides, and live workshops.',
      btnUnlock: 'Unlock VIP Premium',
      btnBackFree: 'Return to Free Plan',
      tabRecipes: 'Premium Recipes',
      tabVideos: 'Masterclasses',
      tabCourses: 'Certified Courses',
      tabDownloads: 'Guides & PDFs',
      tabWorkshops: 'Live Workshops',
      tabCommunity: 'VIP Forum',
      exclusiveLabel: 'VIP CLUB ONLY',
      playVideo: 'Watch Lecture',
      downloadPdf: 'Download PDF',
      enrollCourse: 'Enroll Course',
      workshopDate: 'Next live streaming',
      commentPlaceholder: 'Post a message in our verified members forum...',
      btnPostComment: 'Post Comment',
    }
  }[lang];

  const premiumRecipes = controller.courses.slice(0, 6).map((course) => ({
    title: course.title,
    level: course.difficulty,
    time: course.duration,
    desc: course.desc,
    img: course.img || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80'
  }));

  const premiumVideos = controller.courses.slice(0, 4).map((course) => ({
    title: course.title,
    duration: course.duration,
    author: course.author,
    desc: course.desc,
    img: course.img || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80'
  }));

  const premiumDownloads = controller.downloads.slice(0, 6).map((download) => ({
    title: download.title,
    size: download.size,
    format: download.format,
    iconKey: download.type === 'Calculator' ? 'excel' : 'book'
  }));

  const premiumWorkshops: { title: string; date: string; link: string }[] = [];

  const [activeSubTab, setActiveSubTab] = useState<'recipes' | 'videos' | 'downloads'>('recipes');
  const [comments, setComments] = useState<{ user: string; text: string; time: string }[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_premium_comments');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const nextComments = [
      { user: currentUser?.name || (lang === 'pt-BR' ? 'Membro VIP' : 'VIP Member'), text: newComment.trim(), time: lang === 'pt-BR' ? 'Agora' : 'Just now' },
      ...comments
    ];
    setComments(nextComments);
    setNewComment('');
    try {
      localStorage.setItem('eventdrink_premium_comments', JSON.stringify(nextComments));
    } catch (e) {}
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left font-sans"
    >
      
      {/* 1. HEADER SECTION WITH GOLD DETAILS */}
      <div className={`p-6 md:p-8 rounded-3xl relative overflow-hidden border ${
        isVip 
          ? 'bg-gradient-to-br from-neutral-900 via-[#1c160d] to-neutral-950 border-amber-500/20 shadow-[0_4px_30px_rgba(254,157,0,0.05)]'
          : 'bg-neutral-900 border-neutral-800'
      }`}>
        {/* Glow effects for VIP mode */}
        {isVip && (
          <div className="absolute right-[-20px] top-[-20px] w-48 h-48 rounded-full bg-amber-500/10 blur-[60px]" />
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-black tracking-widest ${
              isVip 
                ? 'bg-amber-500/20 text-[#fe9d00] border border-amber-500/30'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700/60'
            }`}>
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isVip ? text.badgeVip : text.badgeFree}</span>
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mt-2">
              {text.headerTitle}
            </h1>
            <p className="text-xs text-neutral-400 max-w-2xl font-sans mt-2">
              {text.headerSub}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!currentUser?.isLoggedIn ? (
              <button 
                onClick={onOpenLogin}
                className="bg-gradient-to-r from-amber-500 to-[#ff5d00] text-black font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                {lang === 'pt-BR' ? 'Acessar com E-mail' : 'Access VIP Portal'}
              </button>
            ) : (
              <button 
                onClick={onToggleUserTier}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isVip 
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold'
                }`}
              >
                {isVip ? text.btnBackFree : text.btnUnlock}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. SECURITY GATE/BANNER IF USER IS FREE */}
      {!isVip ? (
        <div className="bg-gradient-to-br from-[#0c0c0c] to-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xl">
          <div className="w-16 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-[#fe9d00] animate-pulse" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-extrabold text-white">{text.lockedBannerTitle}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-3xl">
              {text.lockedBannerSub}
            </p>
          </div>
          <button 
            onClick={currentUser?.isLoggedIn ? onToggleUserTier : onOpenLogin}
            className="w-full md:w-auto bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-black text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg shrink-0 whitespace-nowrap"
          >
            {text.btnUnlock}
          </button>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 px-6 rounded-2xl text-xs font-semibold flex items-center space-x-3">
          <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{text.unlockedMsg}</span>
        </div>
      )}

      {/* 3. TABS SELECTOR */}
      <div className="flex border-b border-neutral-900 space-x-2 overflow-x-auto pb-px">
        {[
          { id: 'recipes', label: text.tabRecipes },
          { id: 'videos', label: text.tabVideos },
          { id: 'downloads', label: text.tabDownloads },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'border-[#fe9d00] text-[#fe9d00] font-extrabold'
                : 'border-transparent text-neutral-450 hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. MAIN WORKSPACE TABS */}
      <div className="relative">
        
        {/* Guard protection mask (visual blur layer if FREE user) */}
        {!isVip && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[5px] rounded-3xl z-10 flex items-center justify-center p-6">
            <div className="bg-[#121212] border border-neutral-800 p-6 rounded-2xl shadow-xl max-w-sm text-center space-y-4">
              <Lock className="w-8 h-8 text-[#fe9d00] mx-auto animate-bounce" />
              <h4 className="font-bold text-white text-sm">{lang === 'pt-BR' ? 'Acesso Restrito' : 'Premium Lock Active'}</h4>
              <p className="text-[11px] text-neutral-450 font-sans leading-relaxed">
                {lang === 'pt-BR' 
                  ? 'Torne-se um assinante gratuito do Clube Event Drink para liberar instantaneamente este painel.' 
                  : 'Upgrade to VIP for 100% unlocked access to tutorials and calculators.'}
              </p>
              <button 
                onClick={currentUser?.isLoggedIn ? onToggleUserTier : onOpenLogin}
                className="w-full bg-[#fe9d00] text-black font-extrabold text-xs py-2 rounded-lg"
              >
                {lang === 'pt-BR' ? 'Desbloquear Agora' : 'Unlock Now'}
              </button>
            </div>
          </div>
        )}

        <div className={!isVip ? 'select-none pointer-events-none' : ''}>
          
          {/* TAB: Premium Recipes */}
          {activeSubTab === 'recipes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumRecipes.length === 0 ? (
                <div className="col-span-full border border-dashed border-amber-500/20 rounded-3xl p-12 text-center space-y-3">
                  <Wine className="w-10 h-10 text-[#fe9d00] mx-auto opacity-60" />
                  <h3 className="font-extrabold text-white text-base">{lang === 'pt-BR' ? 'Nenhuma Receita Disponível' : 'No Signature Recipes'}</h3>
                  <p className="text-xs text-neutral-450 font-sans max-w-sm mx-auto leading-relaxed">
                    {lang === 'pt-BR' 
                      ? 'Nossos mixologistas parceiros ainda não publicaram receitas autorais premium no momento.' 
                      : 'No exclusive partner recipes have been published in our premium cellar registry yet.'}
                  </p>
                </div>
              ) : (
                premiumRecipes.map((item, index) => (
                  <div 
                    key={index}
                    className={`bg-neutral-950 border rounded-2xl overflow-hidden flex flex-col justify-between text-left transition-all ${
                      isVip ? 'border-amber-500/10 hover:border-amber-500/30 shadow-lg' : 'border-neutral-900'
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden relative">
                      <SafeImage src={item.img} alt={item.title} className="w-full h-full object-cover" category="spirits" />
                      <span className="absolute top-3 left-3 bg-[#fe9d00] text-black font-black text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-md uppercase">
                        {text.exclusiveLabel}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-450">
                          <span>{item.level}</span>
                          <span>•</span>
                          <span>{item.time}</span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full text-xs font-bold py-2 bg-neutral-900 hover:bg-[#fe9d00] hover:text-black border border-neutral-800 text-[#fe9d00] rounded-xl transition-all cursor-pointer">
                        {lang === 'pt-BR' ? 'Ver Ficha Completa' : 'View Full Recipe'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Video Tutorials (Masterclasses) */}
          {activeSubTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {premiumVideos.length === 0 ? (
                <div className="col-span-full border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-3">
                  <Play className="w-10 h-10 text-[#fe9d00] mx-auto opacity-60" />
                  <h3 className="font-extrabold text-white text-base">{lang === 'pt-BR' ? 'Nenhuma Masterclass Disponível' : 'No Masterclasses Found'}</h3>
                  <p className="text-xs text-neutral-450 font-sans max-w-sm mx-auto leading-relaxed">
                    {lang === 'pt-BR' 
                      ? 'Nossos cursos certificados e masterclasses práticas estão em fase de gravação e estarão disponíveis em breve.' 
                      : 'Certified mixology classes and video tutorials are currently in production and will launch soon.'}
                  </p>
                </div>
              ) : (
                premiumVideos.map((video, index) => (
                  <div 
                    key={index}
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden flex flex-col lg:flex-row text-left hover:border-amber-500/20 transition-all"
                  >
                    <div className="w-full lg:w-48 aspect-video lg:aspect-auto overflow-hidden relative shrink-0">
                      <SafeImage src={video.img} alt={video.title} className="w-full h-full object-cover" category="spirits" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg animate-pulse">
                          <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#fe9d00] font-bold tracking-wider uppercase">{video.duration}</span>
                        <h4 className="font-extrabold text-white text-sm leading-snug">{video.title}</h4>
                        <p className="text-[10px] text-neutral-450 font-sans">{video.author}</p>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed pt-1">{video.desc}</p>
                      </div>
                      <button className="text-xs font-bold text-[#fe9d00] flex items-center space-x-1.5 hover:text-white pt-2 cursor-pointer">
                        <span>{text.playVideo}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Guias e Downloads */}
          {activeSubTab === 'downloads' && (
            <div className="space-y-4">
              {premiumDownloads.length === 0 ? (
                <div className="border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-3">
                  <FileDown className="w-10 h-10 text-[#fe9d00] mx-auto opacity-60" />
                  <h3 className="font-extrabold text-white text-base">{lang === 'pt-BR' ? 'Sem Manuais de Bar' : 'No Guides Available'}</h3>
                  <p className="text-xs text-neutral-450 font-sans max-w-sm mx-auto leading-relaxed">
                    {lang === 'pt-BR' 
                      ? 'Nenhum guia, manual em PDF ou planilha de cálculo está disponível no momento para baixar.' 
                      : 'No manuals, PDF checklist bar plans, or modifier Excel tools are currently linked.'}
                  </p>
                </div>
              ) : (
                premiumDownloads.map((dl, index) => (
                  <div 
                    key={index}
                    className="bg-neutral-950 border border-neutral-900 p-4 px-6 rounded-2xl flex items-center justify-between hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#fe9d00]">
                        {dl.iconKey === 'book' ? <BookOpen className="w-5 h-5" /> : dl.iconKey === 'excel' ? <Download className="w-5 h-5" /> : <FileDown className="w-5 h-5" />}
                      </div>
                      <div className="text-left leading-tight">
                        <h4 className="text-xs font-bold text-white">{dl.title}</h4>
                        <p className="text-[10px] text-neutral-450 font-mono mt-0.5">{dl.format} • {dl.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center space-x-1 px-4 py-2 bg-neutral-900 hover:bg-[#fe9d00] hover:text-black border border-neutral-850 rounded-xl text-xs font-bold text-[#fe9d00] transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{text.downloadPdf}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>

      {/* 5. LIVESTREAM & FORUM COMMUNITY AREA (VIP ACCESS ONLY) */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-neutral-900 ${!isVip ? 'opacity-30 select-none pointer-events-none' : ''}`}>
        
        {/* Live Workshop Broadcast list */}
        <div className="lg:col-span-5 text-left space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <Video className="w-5 h-5 text-[#fe9d00]" />
            <h3 className="text-base font-extrabold">{text.tabWorkshops}</h3>
          </div>
          <div className="space-y-4">
            {premiumWorkshops.length === 0 ? (
              <div className="border border-dashed border-neutral-800 rounded-3xl p-8 text-center space-y-2">
                <Calendar className="w-6 h-6 text-neutral-500 mx-auto opacity-60" />
                <h4 className="font-extrabold text-white text-xs">{lang === 'pt-BR' ? 'Sem Transmissões Agendadas' : 'No Events Scheduled'}</h4>
                <p className="text-[11px] text-neutral-450 font-sans leading-relaxed">
                  {lang === 'pt-BR' 
                    ? 'A agenda de webinars, mentorias e workshops práticos está sendo atualizada.' 
                    : 'The masterclass agenda, group live coaching, and clinic topics are under update.'}
                </p>
              </div>
            ) : (
              premiumWorkshops.map((item, index) => (
                <div 
                  key={index}
                  className="bg-neutral-950 border border-neutral-900 p-4 rounded-2xl text-left space-y-2 hover:border-amber-500/20 transition-all"
                >
                  <span className="inline-block text-[9px] font-mono tracking-widest text-[#a2d729] font-bold uppercase bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">ONLINE CLINIC</span>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-neutral-450 font-sans flex items-center space-x-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#fe9d00]" />
                    <span>{item.date}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exclusive verified VIP Forums */}
        <div className="lg:col-span-7 text-left space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <Users className="w-5 h-5 text-[#fe9d00]" />
            <h3 className="text-base font-extrabold">{text.tabCommunity}</h3>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
            {/* Input feedback comment */}
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={text.commentPlaceholder}
                className="flex-1 bg-neutral-900 border border-neutral-800 text-xs px-4 py-2.5 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe9d00]"
              />
              <button 
                onClick={handlePostComment}
                className="bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-extrabold text-xs px-4 rounded-xl transition-all"
              >
                {text.btnPostComment}
              </button>
            </div>

            {/* Forums feeds list */}
            <div className="space-y-4 pt-2">
              {comments.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Users className="w-8 h-8 text-neutral-600 mx-auto opacity-50" />
                  <h4 className="text-xs font-bold text-neutral-450">{lang === 'pt-BR' ? 'Mural VIP Vazio' : 'No Conversations Yet'}</h4>
                  <p className="text-[11px] text-neutral-550 font-sans max-w-xs mx-auto leading-relaxed">
                    {lang === 'pt-BR' 
                      ? 'Nenhuma mensagem publicada. Seja o primeiro a postar uma dica ou dúvida de mixologia!' 
                      : 'Share your wedding setup ideas, question our bar checklist, or say hello to peers!'}
                  </p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="flex gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-[10px] font-black font-mono text-black">
                      {comment.user.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1 bg-neutral-900/40 p-3 rounded-xl border border-neutral-900/60">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-neutral-200">{comment.user}</span>
                        <span className="text-neutral-500 font-mono">{comment.time}</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}

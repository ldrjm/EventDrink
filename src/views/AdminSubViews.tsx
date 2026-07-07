import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  DollarSign, 
  Download, 
  BookOpen, 
  Cpu, 
  Settings, 
  Plus, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Lock,
  Trash2,
  Edit2
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';

interface SubViewProps {
  lang: 'pt-BR' | 'en';
  triggerToast: (msg: string) => void;
  controller: AppControllerType;
}

// 1. ADMIN EVENTS VIEW
export function AdminEventsView({ lang, triggerToast, controller }: SubViewProps) {
  const isPt = lang === 'pt-BR';
  
  // Directly bind events to controller orders list
  const events = controller.orders;

  // Load staff allocations map from localStorage
  const [staffMap, setStaffMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_staff_allocations');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('eventdrink_staff_allocations', JSON.stringify(staffMap));
  }, [staffMap]);

  const handleAssignStaff = (id: string) => {
    setStaffMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    triggerToast(isPt ? 'Bartender adicional alocado com sucesso!' : 'Additional staff bartender allocated!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-red-400" />
          {isPt ? 'Controle de Eventos e Escalonamento' : 'Events & Staff Scheduling'}
        </h2>
        <p className="text-xs text-neutral-500">{isPt ? 'Gerencie as festas ativas planejadas por usuários e aloque equipes de bartenders.' : 'Supervise user-planned parties and allocate bartender crews.'}</p>
      </div>

      <div className="bg-black/20 border border-neutral-900 rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-neutral-300">
          <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
            <tr>
              <th className="px-5 py-3 text-left">Event / Client</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Guests</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-center">Bartenders</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {events.map(ev => {
              const eventTitle = isPt ? (ev.namePt || ev.title) : (ev.nameEn || ev.title);
              const eventDate = isPt ? (ev.datePt || ev.date) : (ev.dateEn || ev.date);
              const eventStatus = ev.status === 'processing' ? (isPt ? 'Pendente' : 'Pending') : ev.status;
              const bartendersCount = staffMap[ev.id] !== undefined ? staffMap[ev.id] : 0;
              
              return (
                <tr key={ev.id} className="hover:bg-neutral-900/30">
                  <td className="px-5 py-3.5 font-bold text-white">{eventTitle}</td>
                  <td className="px-5 py-3.5 font-mono text-neutral-400">{eventDate || 'Hoje'}</td>
                  <td className="px-5 py-3.5 font-mono">{ev.guests || 50}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      eventStatus === 'Confirmed' || eventStatus === 'delivered' ? 'bg-[#a2d729]/10 text-[#a2d729]' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {eventStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono font-bold">{bartendersCount}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleAssignStaff(ev.id)}
                      className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-red-500 hover:text-white border border-neutral-800 text-neutral-400 transition-colors text-[10px] cursor-pointer"
                    >
                      + {isPt ? 'Alocar Staff' : 'Assign Staff'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. ADMIN FINANCIAL VIEW
export function AdminFinancialView({ lang, triggerToast, controller }: SubViewProps) {
  const isPt = lang === 'pt-BR';

  // Bind directly to real controller lists
  const orders = controller.orders;
  const users = controller.usersList;

  // Dynamic calculations
  const vipCount = users.filter(u => u.role === 'VIP').length;
  const mrrTotal = vipCount * 49.90; // Each VIP pays R$ 49.90
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const conversionRate = users.length > 0 ? ((vipCount / users.length) * 100).toFixed(1) : '0.0';

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      triggerToast(isPt ? 'Nenhuma transação disponível para exportar!' : 'No transactions available to export!');
      return;
    }
    const headers = isPt 
      ? 'ID,Nome (PT),Nome (EN),Data (PT),Data (EN),Convidados,Economia,Status,Total,Metodo Pagamento,Email Usuario\n'
      : 'ID,Name (PT),Name (EN),Date (PT),Date (EN),Guests,Savings,Status,Total,Payment Method,User Email\n';
    
    const rows = orders.map(o => {
      const fields = [
        o.id,
        `"${o.namePt || ''}"`,
        `"${o.nameEn || ''}"`,
        `"${o.datePt || ''}"`,
        `"${o.dateEn || ''}"`,
        o.guests || 0,
        o.savedAmount || 0,
        o.status,
        o.total,
        `"${o.paymentMethod || 'PIX'}"`,
        `"${o.userEmail || ''}"`
      ];
      return fields.join(',');
    }).join('\n');

    const csvContent = headers + rows;
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eventdrink_relatorio_financeiro_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    triggerToast(isPt ? 'Relatório financeiro CSV baixado com sucesso!' : 'Financial CSV statement downloaded!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-red-400" />
          {isPt ? 'Financeiro & Receita de Vendas' : 'Financial Ledger & Receipts'}
        </h2>
        <p className="text-xs text-neutral-500">{isPt ? 'Monitore transações em tempo real e faturamento recorrente.' : 'Analyze real-time payouts, conversion values, and recurrent plans.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5">
          <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Faturamento Recorrente VIP (MRR)' : 'Monthly Recurring Revenue (VIP)'}</p>
          <p className="text-xl font-mono font-black text-white mt-1">R$ {mrrTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-[9px] text-[#a2d729] font-semibold">{vipCount} {isPt ? 'assinantes VIP ativos' : 'active VIP members'}</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5">
          <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Ticket Médio por Evento' : 'Average Order Ticket'}</p>
          <p className="text-xl font-mono font-black text-white mt-1">R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-[9px] text-blue-400 font-semibold">{isPt ? 'Estável' : 'Optimized Dilution'}</span>
        </div>
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Taxa de Conversão VIP' : 'VIP Conversion Ratio'}</p>
            <p className="text-xl font-mono font-black text-white">{conversionRate}%</p>
          </div>
          <button
            onClick={exportOrdersCSV}
            className="px-3 py-2 bg-neutral-900 hover:bg-red-500 hover:text-white border border-neutral-850 rounded-xl text-[10px] font-bold text-neutral-400 transition-colors cursor-pointer"
          >
            📊 CSV
          </button>
        </div>
      </div>

      <div className="bg-black/20 border border-neutral-900 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-neutral-950/50 border-b border-neutral-900 font-mono text-[10px] text-neutral-500 uppercase font-bold">
          {isPt ? 'Histórico Recente de Transações' : 'Recent Receipts'}
        </div>
        <div className="divide-y divide-neutral-900">
          {orders.map((tx, index) => {
            const clientName = tx.host || (isPt ? 'Anfitrião do Evento' : 'Event Host');
            const paymentType = tx.paymentMethod || 'PIX';
            const txTitle = isPt ? tx.namePt : tx.nameEn;
            
            return (
              <div key={tx.id || index} className="px-5 py-3.5 flex justify-between items-center text-xs hover:bg-neutral-900/20">
                <div className="text-left space-y-0.5">
                  <p className="font-bold text-white">{txTitle}</p>
                  <p className="text-[10px] text-neutral-500">{clientName} • {paymentType.toUpperCase()}</p>
                </div>
                <div className="text-right space-y-0.5 font-mono">
                  <p className="text-sm font-bold text-[#a2d729]">R$ {(tx.total || 0).toFixed(2)}</p>
                  <p className="text-[10px] text-neutral-500">{isPt ? (tx.datePt || 'Hoje') : (tx.dateEn || 'Today')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 3. ADMIN DOWNLOADS VIEW
export function AdminDownloadsView({ lang, triggerToast, controller }: SubViewProps) {
  const isPt = lang === 'pt-BR';
  const downloads = controller.downloads;

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('E-book');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newSize, setNewSize] = useState('2.5 MB');

  // Edit State (the U in CRUD)
  const [editingFile, setEditingFile] = useState<any | null>(null);

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newObj = {
      id: `d_${Date.now()}`,
      title: newTitle.trim(),
      desc: isPt ? 'Arquivo cadastrado dinamicamente pelo painel administrativo.' : 'File dynamically published from administration board.',
      type: newType,
      format: newFormat,
      size: newSize
    };

    await controller.addDownload(newObj);
    setNewTitle('');
    triggerToast(isPt ? 'Novo recurso inserido com sucesso no repositório VIP!' : 'New resource published to VIP repository!');
  };

  const handleDeleteFile = async (id: string) => {
    await controller.removeDownload(id);
    triggerToast(isPt ? 'Recurso removido com sucesso!' : 'Resource removed successfully!');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile || !editingFile.title.trim()) return;
    await controller.editDownload(editingFile.id, {
      title: editingFile.title,
      type: editingFile.type,
      format: editingFile.format,
      size: editingFile.size
    });
    setEditingFile(null);
    triggerToast(isPt ? 'Recurso atualizado com sucesso!' : 'Resource updated successfully!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-red-400" />
          {isPt ? 'Gerenciador de Mídia e Downloads VIP' : 'Media Storage & PDF Repository'}
        </h2>
        <p className="text-xs text-neutral-500">{isPt ? 'Envie, atualize ou remova e-books, checklists ou tabelas em PDF disponíveis para usuários VIP.' : 'Publish, update or remove manuals, reference sheets, or calculators.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add File Form */}
        <form onSubmit={handleAddFile} className="lg:col-span-5 bg-black/40 border border-neutral-900 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white mb-2">{isPt ? 'Cadastrar Novo Arquivo' : 'Publish VIP Resource'}</h4>
          
          <div className="space-y-1">
            <label htmlFor="res-title-input" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Título do Recurso' : 'Resource Title'}</label>
            <input 
              id="res-title-input"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Manual de Técnicas de Gelo Cristalino"
              className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="res-type-select" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Tipo' : 'Type'}</label>
              <select
                id="res-type-select"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="E-book">E-book</option>
                <option value="Calculator">Calculator</option>
                <option value="Reference">Reference</option>
                <option value="Checklist">Checklist</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="res-size-input" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Tamanho' : 'Size'}</label>
              <input 
                id="res-size-input"
                type="text"
                required
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isPt ? 'Cadastrar Recurso' : 'Publish Resource'}</span>
          </button>
        </form>

        {/* File Table */}
        <div className="lg:col-span-7 bg-black/20 border border-neutral-900 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
              <tr>
                <th className="px-5 py-3 text-left">File Name</th>
                <th className="px-5 py-3 text-left">Format</th>
                <th className="px-5 py-3 text-left">Size</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {downloads.map(dw => (
                <tr key={dw.id} className="hover:bg-neutral-900/30">
                  <td className="px-5 py-3.5 font-bold text-white">
                    <p>{dw.title}</p>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{dw.type}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-amber-400">{dw.format || 'PDF'}</td>
                  <td className="px-5 py-3.5 font-mono">{dw.size}</td>
                  <td className="px-5 py-3.5 text-center flex items-center justify-center gap-2">
                    <button
                      id={`edit-file-btn-${dw.id}`}
                      onClick={() => setEditingFile({ ...dw })}
                      className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={isPt ? "Editar Recurso" : "Edit Resource"}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(dw.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      title={isPt ? "Excluir Recurso" : "Delete Resource"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (the U in CRUD) */}
      <AnimatePresence>
        {editingFile && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-850 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  {isPt ? 'Editar Recurso VIP' : 'Edit VIP Resource'}
                </h3>
                <button 
                  onClick={() => setEditingFile(null)}
                  className="text-neutral-400 hover:text-white text-xs uppercase font-bold"
                >
                  {isPt ? 'Fechar' : 'Close'}
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="edit-res-title" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Título' : 'Title'}</label>
                  <input 
                    id="edit-res-title"
                    type="text"
                    required
                    value={editingFile.title}
                    onChange={(e) => setEditingFile({ ...editingFile, title: e.target.value })}
                    className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="edit-res-type" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Tipo' : 'Type'}</label>
                    <select
                      id="edit-res-type"
                      value={editingFile.type}
                      onChange={(e) => setEditingFile({ ...editingFile, type: e.target.value })}
                      className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="E-book">E-book</option>
                      <option value="Calculator">Calculator</option>
                      <option value="Reference">Reference</option>
                      <option value="Checklist">Checklist</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="edit-res-size" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Tamanho' : 'Size'}</label>
                    <input 
                      id="edit-res-size"
                      type="text"
                      required
                      value={editingFile.size}
                      onChange={(e) => setEditingFile({ ...editingFile, size: e.target.value })}
                      className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-res-format" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Formato' : 'Format'}</label>
                  <input 
                    id="edit-res-format"
                    type="text"
                    required
                    value={editingFile.format || 'PDF'}
                    onChange={(e) => setEditingFile({ ...editingFile, format: e.target.value })}
                    className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingFile(null)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer border border-neutral-800"
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    id="edit-file-save-btn"
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-450 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                  >
                    {isPt ? 'Salvar Alterações' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 4. ADMIN COURSES VIEW
export function AdminCoursesView({ lang, triggerToast, controller }: SubViewProps) {
  const isPt = lang === 'pt-BR';
  const courses = controller.courses;

  const [newTitle, setNewTitle] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newDuration, setNewDuration] = useState('15:00');

  // Edit State (the U in CRUD)
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInstructor.trim()) return;

    const newObj = {
      id: `v_${Date.now()}`,
      title: newTitle.trim(),
      author: newInstructor.trim(),
      duration: newDuration,
      difficulty: isPt ? 'Intermediário' : 'Intermediate',
      img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
      views: '100 views',
      desc: isPt ? 'Vídeo aula adicionada no painel de administração.' : 'VIP Video Lesson registered from admin panel.'
    };

    await controller.addCourse(newObj);
    setNewTitle('');
    setNewInstructor('');
    triggerToast(isPt ? 'Nova vídeo aula adicionada ao portfólio VIP!' : 'Video class integrated to VIP catalog!');
  };

  const handleDeleteVideo = async (id: string) => {
    await controller.removeCourse(id);
    triggerToast(isPt ? 'Vídeo aula removida!' : 'Video class deleted!');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title.trim()) return;
    await controller.editCourse(editingCourse.id, {
      title: editingCourse.title,
      author: editingCourse.author,
      duration: editingCourse.duration,
      desc: editingCourse.desc
    });
    setEditingCourse(null);
    triggerToast(isPt ? 'Vídeo aula atualizada com sucesso!' : 'Video lesson updated successfully!');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-400" />
          {isPt ? 'Gerenciador de Vídeo Aulas e Masterclasses' : 'VIP Video Course Manager'}
        </h2>
        <p className="text-xs text-neutral-500">{isPt ? 'Cadastre, atualize ou remova aulas práticas em vídeo transmitidas na plataforma VIP.' : 'Add, update or remove professional training videos.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Form */}
        <form onSubmit={handleAddVideo} className="lg:col-span-5 bg-black/40 border border-neutral-900 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white mb-2">{isPt ? 'Adicionar Novo Vídeo' : 'Publish Video Lesson'}</h4>
          
          <div className="space-y-1">
            <label htmlFor="course-title-input" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Título da Aula' : 'Video Title'}</label>
            <input 
              id="course-title-input"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Como fazer espumas com Sifão de CO2"
              className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="course-instructor-input" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Instrutor' : 'Instructor'}</label>
              <input 
                id="course-instructor-input"
                type="text"
                required
                value={newInstructor}
                onChange={(e) => setNewInstructor(e.target.value)}
                placeholder="Ex: Pedro Mix"
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="course-duration-input" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Duração' : 'Duration'}</label>
              <input 
                id="course-duration-input"
                type="text"
                required
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isPt ? 'Adicionar Vídeo Aula' : 'Register Video'}</span>
          </button>
        </form>

        {/* Video List */}
        <div className="lg:col-span-7 bg-black/20 border border-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-900">
          <div className="px-5 py-3 bg-neutral-950 font-mono text-[10px] text-neutral-500 uppercase font-bold text-left">
            {isPt ? 'Vídeos Ativos' : 'Active VIP Masterclasses'}
          </div>
          {courses.map(c => (
            <div key={c.id} className="p-4 flex justify-between items-center text-xs hover:bg-neutral-900/10">
              <div className="text-left space-y-0.5 max-w-[70%]">
                <p className="font-bold text-white">{c.title}</p>
                <p className="text-[10px] text-neutral-500">{isPt ? 'Mestre' : 'Master'}: {c.author} • {c.duration}</p>
                {c.desc && <p className="text-[11px] text-neutral-450 truncate mt-0.5">{c.desc}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id={`edit-course-btn-${c.id}`}
                  onClick={() => setEditingCourse({ ...c })}
                  className="p-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                  title={isPt ? "Editar Vídeo" : "Edit Video"}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteVideo(c.id)}
                  className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors cursor-pointer"
                  title={isPt ? "Excluir Vídeo" : "Delete Video"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Course Modal (the U in CRUD) */}
      <AnimatePresence>
        {editingCourse && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-850 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  {isPt ? 'Editar Vídeo Aula VIP' : 'Edit VIP Video Lesson'}
                </h3>
                <button 
                  onClick={() => setEditingCourse(null)}
                  className="text-neutral-400 hover:text-white text-xs uppercase font-bold"
                >
                  {isPt ? 'Fechar' : 'Close'}
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="edit-course-title" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Título' : 'Title'}</label>
                  <input 
                    id="edit-course-title"
                    type="text"
                    required
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="edit-course-instructor" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Mestre / Instrutor' : 'Instructor'}</label>
                    <input 
                      id="edit-course-instructor"
                      type="text"
                      required
                      value={editingCourse.author}
                      onChange={(e) => setEditingCourse({ ...editingCourse, author: e.target.value })}
                      className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="edit-course-duration" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Duração' : 'Duration'}</label>
                    <input 
                      id="edit-course-duration"
                      type="text"
                      required
                      value={editingCourse.duration}
                      onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                      className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-course-desc" className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Descrição' : 'Description'}</label>
                  <textarea 
                    id="edit-course-desc"
                    required
                    rows={3}
                    value={editingCourse.desc || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, desc: e.target.value })}
                    className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer border border-neutral-800"
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    id="edit-course-save-btn"
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-450 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                  >
                    {isPt ? 'Salvar Alterações' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5. ADMIN AI CONFIG VIEW
export function AdminIAView({ lang, triggerToast }: SubViewProps) {
  const isPt = lang === 'pt-BR';
  const [promptText, setPromptText] = useState(() => {
    try {
      const saved = localStorage.getItem('eventdrink_ai_prompt');
      if (saved) return saved;
    } catch (e) {}
    return isPt 
      ? `Você é o Concierge Virtual Inteligente do EventDrink Pro v4.0. 
Seu papel é orientar anfitriões a calcularem quantidades físicas ideais de bebidas em casamentos e reuniões corporativas. 
A matriz de diluição deve priorizar: 1 garrafa de vinho para cada 3 pessoas, 1 litro de chopp por convidado ativo para 4 horas de evento e gelo trincado na proporção de 1kg por litro.`
      : `You are the Virtual Intelligent Concierge of EventDrink Pro v4.0. 
Your goal is to guide hosts on physical liquid quantities required for social gatherings. 
Calculation parameters: 1 wine bottle per 3 drinking guests, 1 liter of draft beer per guest for a 4-hour slot, and crushed ice at 1kg weight per liter.`;
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setTimeout(() => {
      localStorage.setItem('eventdrink_ai_prompt', promptText);
      setIsDeploying(false);
      triggerToast(isPt ? 'Nova instrução de prompt compilada e implantada nos servidores!' : 'AI core instruction compiled & deployed to cluster!');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-red-400" />
          {isPt ? 'Configuração e Engenharia de Prompt da IA' : 'AI Core Instructions & Prompt Engine'}
        </h2>
        <p className="text-xs text-neutral-500">{isPt ? 'Personalize o prompt de sistema que molda as respostas do assistente conversacional do usuário.' : 'Fine-tune system instructions for user conversational chatbots.'}</p>
      </div>

      <form onSubmit={handleDeploy} className="bg-black/40 border border-neutral-900 rounded-3xl p-6 space-y-4">
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
            System Instructions Prompt
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={8}
            className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-2xl px-4 py-3 text-xs text-neutral-300 leading-relaxed font-mono resize-y"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">
            {isPt ? 'Servidor Ativo: gemini-2.5-flash-pro' : 'Server Core: gemini-2.5-flash-pro'}
          </span>
          <button
            id="deploy-ai-instructions-btn"
            type="submit"
            disabled={isDeploying}
            className="bg-red-500 hover:bg-red-400 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isDeploying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isDeploying ? (isPt ? 'Gravando...' : 'Deploying...') : (isPt ? 'Aplicar Instruções' : 'Deploy Instructions')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// 6. ADMIN CONFIGURATION VIEW
export function AdminConfigView({ lang, triggerToast, controller }: SubViewProps) {
  const isPt = lang === 'pt-BR';
  const maintenance = controller.maintenanceStatus;
  const [warningMinutes, setWarningMinutes] = useState(10);
  const [debugLogs, setDebugLogs] = useState(true);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!maintenance.isScheduled || maintenance.scheduledFor === null) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, maintenance.scheduledFor - Date.now());
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [maintenance.isScheduled, maintenance.scheduledFor]);

  const handleWipeDatabase = () => {
    const isConfirmed = window.confirm(
      isPt 
        ? 'ATENÇÃO: Deseja apagar o histórico local de receitas premium, logs e usuários salvos de teste? Esta ação é irreversível.'
        : 'WARNING: Do you wish to clear all local databases, custom recipes, and mock logs? This is permanent.'
    );
    if (isConfirmed) {
      localStorage.removeItem('eventdrink_premium_recipes');
      localStorage.removeItem('eventdrink_users_list');
      localStorage.removeItem('eventdrink_orders');
      localStorage.removeItem('eventdrink_downloads');
      localStorage.removeItem('eventdrink_courses');
      localStorage.removeItem('eventdrink_staff_allocations');
      localStorage.removeItem('eventdrink_ai_prompt');
      triggerToast(isPt ? 'Banco de dados local restaurado!' : 'Database wiped successfully!');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-400" />
          {isPt ? 'Configurações de Sistemas Internos' : 'System Variables & Parameters'}
        </h2>
        <p className="text-xs text-neutral-500">{isPt ? 'Controle flags do sistema, manutenção operacional e backups de segurança.' : 'Tweak operations, maintenance, and backup triggers.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toggle options */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">{isPt ? 'Chaves Operacionais' : 'Operational Switches'}</h4>
          
          <div className="space-y-3 border-b border-neutral-900 py-2">
            <div className="flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-white">{isPt ? 'Modo de Manutenção' : 'Maintenance Window'}</p>
                <p className="text-[10px] text-neutral-500">{isPt ? 'Ativa o aviso para usuários ativos e, após o tempo escolhido, bloqueia o acesso.' : 'Warn active users first, then lock the site after the selected delay.'}</p>
              </div>
              <input 
                type="checkbox"
                checked={maintenance.isEnabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    controller.activateMaintenance(0);
                    triggerToast(isPt ? 'Manutenção ativada imediatamente!' : 'Maintenance enabled immediately!');
                  } else {
                    controller.deactivateMaintenance();
                    triggerToast(isPt ? 'Modo de manutenção desativado!' : 'Maintenance mode disabled!');
                  }
                }}
                className="w-4 h-4 rounded border-neutral-800 accent-red-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-neutral-900 bg-neutral-950/70 p-3">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                {isPt ? 'Avisar em X minutos' : 'Warn in X minutes'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={warningMinutes}
                  onChange={(e) => setWarningMinutes(Number(e.target.value) || 1)}
                  className="w-20 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    controller.activateMaintenance(warningMinutes);
                    triggerToast(isPt ? `Aviso agendado para ${warningMinutes} minuto(s)!` : `Maintenance warning scheduled for ${warningMinutes} minute(s)!`);
                  }}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-red-500/20"
                >
                  {isPt ? 'Agendar aviso' : 'Schedule warning'}
                </button>
              </div>
              {maintenance.isScheduled && countdown && (
                <p className="text-[10px] text-amber-400">
                  {isPt ? `Manutenção iniciará em ${countdown}` : `Maintenance will start in ${countdown}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="text-left space-y-0.5">
              <p className="text-xs font-bold text-white">{isPt ? 'Habilitar Debug Logs' : 'Stream Debug Level logs'}</p>
              <p className="text-[10px] text-neutral-500">{isPt ? 'Grava todas as chamadas de API internas no painel de logs.' : 'Verbose logging for testing socket streams.'}</p>
            </div>
            <input 
              type="checkbox"
              checked={debugLogs}
              onChange={(e) => {
                setDebugLogs(e.target.checked);
                triggerToast(isPt ? 'Nível de logs reconfigurado!' : 'Diagnostics level modified!');
              }}
              className="w-4 h-4 rounded border-neutral-800 accent-red-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Destructive options */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">{isPt ? 'Zona Vermelha de Perigo' : 'Danger Zone'}</h4>
            <p className="text-xs text-neutral-400">{isPt ? 'Operações destrutivas permanentes que redefinem o ambiente de testes local.' : 'Irreversible actions that format structural environments.'}</p>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={() => triggerToast(isPt ? 'Backup compactado gravado com sucesso!' : 'Secure cloud backup compressed!')}
              className="flex-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              🔒 {isPt ? 'Fazer Backup' : 'Backup DB'}
            </button>
            <button
              onClick={handleWipeDatabase}
              className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isPt ? 'Limpar Banco' : 'Format System'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

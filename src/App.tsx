/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Filter, 
  Search, 
  TrendingUp, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  User,
  LayoutDashboard,
  Table as TableIcon,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Plus,
  Trash2,
  Trash,
  Check,
  X,
  AlertCircle,
  FileText,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Status = 'Devam Ediyor' | 'Olumlu' | 'Olumsuz' | 'Yedek Aday';
type Decision = 'Teklif Yapıldı' | 'Reddedildi' | 'Beklemede' | 'İşe Alındı';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  status: 'Açık' | 'Kapalı' | 'Durduruldu';
  createdAt: string;
}

interface Candidate {
  id: string;
  position: string;
  department: string;
  name: string;
  applicationDate: string;
  experienceYears: number;
  lastCompany: string;
  education: string;
  technicalScore: number; // 1-5
  competencies: {
    communication: number;
    teamwork: number;
    problemSolving: number;
  };
  salaryExpectation: string;
  interviewer: string;
  interviewDate: string;
  generalNote: string;
  pros: string;
  cons: string;
  rejectionReason?: string;
  status: Status;
  isReevaluable: boolean;
  finalDecision: Decision;
  decisionDate: string;
  contactInfo: string;
}

// --- Mock Data ---
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    position: 'Senior Frontend Developer',
    department: 'Teknoloji',
    applicationDate: '2024-02-15',
    experienceYears: 8,
    lastCompany: 'Tech Solutions Inc.',
    education: 'ODTÜ - Bilgisayar Mühendisliği',
    technicalScore: 5,
    competencies: { communication: 4, teamwork: 5, problemSolving: 5 },
    salaryExpectation: '120.000 TL',
    interviewer: 'Mehmet Demir',
    interviewDate: '2024-03-01',
    generalNote: 'Teknik bilgisi çok derin, React ve ekosistemine hakim. Ekip liderliği potansiyeli yüksek.',
    pros: 'Derin teknik bilgi, mükemmel iletişim, çözüm odaklı yaklaşım.',
    cons: 'Mevcut projesinden ayrılma süresi biraz uzun (2 ay).',
    status: 'Olumlu',
    isReevaluable: true,
    finalDecision: 'Teklif Yapıldı',
    decisionDate: '2024-03-05',
    contactInfo: 'ayse.yilmaz@email.com | 0555 123 45 67'
  },
  {
    id: '2',
    name: 'Burak Kaya',
    position: 'UI/UX Designer',
    department: 'Tasarım',
    applicationDate: '2024-02-20',
    experienceYears: 4,
    lastCompany: 'Creative Agency',
    education: 'Mimar Sinan - Grafik Tasarım',
    technicalScore: 4,
    competencies: { communication: 5, teamwork: 4, problemSolving: 3 },
    salaryExpectation: '85.000 TL',
    interviewer: 'Selin Aksoy',
    interviewDate: '2024-03-02',
    generalNote: 'Portfolyosu çok güçlü, modern tasarım trendlerini takip ediyor. Figma kullanımı üst düzey.',
    pros: 'Görsel estetik anlayışı, kullanıcı odaklı tasarım yaklaşımı.',
    cons: 'Teknik sınırlamalar konusunda bazen esnekliği düşük olabiliyor.',
    status: 'Devam Ediyor',
    isReevaluable: true,
    finalDecision: 'Beklemede',
    decisionDate: '-',
    contactInfo: 'burak.kaya@email.com | 0555 987 65 43'
  },
  {
    id: '3',
    name: 'Caner Özdemir',
    position: 'Backend Developer',
    department: 'Teknoloji',
    applicationDate: '2024-02-10',
    experienceYears: 6,
    lastCompany: 'Fintech Corp',
    education: 'İTÜ - Yazılım Mühendisliği',
    technicalScore: 3,
    competencies: { communication: 3, teamwork: 3, problemSolving: 4 },
    salaryExpectation: '100.000 TL',
    interviewer: 'Mehmet Demir',
    interviewDate: '2024-02-25',
    generalNote: 'Node.js ve PostgreSQL tecrübesi var ancak mimari konularda bazı eksikleri mevcut.',
    pros: 'Sorumluluk sahibi, dürüst and öğrenmeye açık.',
    cons: 'Karmaşık sistem mimarilerinde deneyim eksikliği.',
    status: 'Olumsuz',
    isReevaluable: true,
    finalDecision: 'Reddedildi',
    decisionDate: '2024-02-28',
    rejectionReason: 'Teknik mülakat performansı beklentinin altında kaldı.',
    contactInfo: 'caner.ozdemir@email.com | 0555 444 33 22'
  }
];

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string, value: string | number, icon: any, trend?: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className={cn("p-2 rounded-xl", color)}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="mt-2">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<'dashboard' | 'table' | 'positions'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('Hepsi');
  const [filterStatus, setFilterStatus] = useState('Hepsi');
  const [jobPositions, setJobPositions] = useState<JobPosition[]>(() => {
    const saved = localStorage.getItem('hr_job_positions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing job positions:', e);
        return [];
      }
    }
    return [
      { id: '1', title: 'Senior Frontend Developer', department: 'Teknoloji', status: 'Açık', createdAt: '2024-01-01' },
      { id: '2', title: 'UI/UX Designer', department: 'Tasarım', status: 'Açık', createdAt: '2024-01-05' },
      { id: '3', title: 'Backend Developer', department: 'Teknoloji', status: 'Açık', createdAt: '2024-01-10' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hr_job_positions', JSON.stringify(jobPositions));
  }, [jobPositions]);

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('hr_candidates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing candidates from localStorage:', e);
        return MOCK_CANDIDATES;
      }
    }
    return MOCK_CANDIDATES;
  });

  useEffect(() => {
    localStorage.setItem('hr_candidates', JSON.stringify(candidates));
  }, [candidates]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<Candidate | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleAddJobPosition = (newPosition: Omit<JobPosition, 'id' | 'createdAt'>) => {
    const positionWithId: JobPosition = {
      ...newPosition,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobPositions(prev => [positionWithId, ...prev]);
    setIsPositionModalOpen(false);
  };

  const handleDeleteJobPosition = (id: string) => {
    if (window.confirm('Bu pozisyonu silmek istediğinize emin misiniz?')) {
      setJobPositions(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateJobPositionStatus = (id: string, status: JobPosition['status']) => {
    setJobPositions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleAddCandidate = (newCandidate: Omit<Candidate, 'id'>) => {
    const candidateWithId: Candidate = {
      ...newCandidate,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCandidates(prev => [candidateWithId, ...prev]);
    setIsModalOpen(false);
  };

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    setIsModalOpen(false);
    setEditingCandidate(null);
  };

  const openEditModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleDeleteCandidate = (id: string) => {
    if (!id) return;
    
    const confirmed = window.confirm('Bu adayı silmek istediğinize emin misiniz?');
    if (confirmed) {
      setCandidates(prev => prev.filter(c => c.id !== id));
      
      if (selectedCandidateForDetail?.id === id) {
        setIsDetailModalOpen(false);
        setSelectedCandidateForDetail(null);
      }
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Tüm aday kayıtlarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      setCandidates([]);
    }
  };

  const handleSort = (key: keyof Candidate) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = [
      'Aday Adı Soyadı',
      'Pozisyon',
      'Departman',
      'Başvuru Tarihi',
      'Deneyim (Yıl)',
      'Eğitim',
      'Teknik Puan',
      'Mülakat Tarihi',
      'Süreç Durumu',
      'Son Karar'
    ];

    const rows = filteredCandidates.map(c => [
      c.name,
      c.position,
      c.department,
      c.applicationDate,
      c.experienceYears,
      c.education,
      c.technicalScore,
      c.interviewDate,
      c.status,
      c.finalDecision
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aday_listesi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- KPI Calculations ---
  const kpis = useMemo(() => {
    const total = candidates.length;
    const hired = candidates.filter(c => c.finalDecision === 'İşe Alındı').length;
    const rejected = candidates.filter(c => c.finalDecision === 'Reddedildi').length;
    const inProgress = candidates.filter(c => c.status === 'Devam Ediyor').length;
    
    // Time to hire (simplified: days between application and decision for hired ones)
    const hiredCandidates = candidates.filter(c => c.finalDecision === 'İşe Alındı');
    const avgTimeToHire = hiredCandidates.length > 0 
      ? Math.round(hiredCandidates.reduce((acc, c) => {
          const start = new Date(c.applicationDate).getTime();
          const end = new Date(c.decisionDate).getTime();
          return acc + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / hiredCandidates.length)
      : 0;

    const rejectionRate = Math.round((rejected / total) * 100);
    const salaryMismatchRate = Math.round((candidates.filter(c => c.rejectionReason === 'Ücret Uyuşmazlığı').length / total) * 100);

    const positive = candidates.filter(c => c.status === 'Olumlu').length;

    return { total, hired, rejected, inProgress, avgTimeToHire, rejectionRate, salaryMismatchRate, positive };
  }, [candidates]);

  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach(c => {
      counts[c.department] = (counts[c.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [candidates]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    let result = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = filterPosition === 'Hepsi' || c.position === filterPosition;
      const matchesStatus = filterStatus === 'Hepsi' || c.status === filterStatus;
      return matchesSearch && matchesPosition && matchesStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [candidates, searchTerm, filterPosition, filterStatus, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCandidates, currentPage, itemsPerPage]);

  // Reset page when filters or data change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [filteredCandidates.length, totalPages, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPosition, filterStatus, sortConfig]);

  const positions = ['Hepsi', ...Array.from(new Set(jobPositions.map(p => p.title)))];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar / Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">HR Pro</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setView('dashboard')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              view === 'dashboard' ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setView('table')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              view === 'table' ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <TableIcon size={20} />
            Aday Listesi
          </button>
          <button 
            onClick={() => setView('positions')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              view === 'positions' ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Briefcase size={20} />
            Pozisyonlar
          </button>
        </nav>

        <div className="mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Kullanıcı</p>
            <p className="font-semibold mt-1">İnsan Kaynakları Uzmanı</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Sistem Aktif
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pl-64 min-h-screen">
        <header className="h-20 bg-white border-bottom border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {view === 'dashboard' ? 'Genel Bakış & KPI Analizi' : view === 'table' ? 'Aday Değerlendirme Tablosu' : 'Açık Pozisyon Yönetimi'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Aday veya pozisyon ara..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {view === 'positions' ? (
              <button 
                onClick={() => setIsPositionModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <Briefcase size={18} />
                Yeni Pozisyon Ekle
              </button>
            ) : (
              <>
                <button 
                  onClick={exportToCSV}
                  className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  <Download size={18} />
                  Dışa Aktar
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Tüm aday kayıtlarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
                      setCandidates([]);
                    }
                  }}
                  className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={18} />
                  Tümünü Sil
                </button>
                <button 
                  onClick={() => {
                    setEditingCandidate(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  <UserPlus size={18} />
                  Yeni Aday Ekle
                </button>
              </>
            )}
          </div>
        </header>

        <div className="p-8">
          {view === 'dashboard' ? (
            <div className="flex flex-col gap-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Toplam Aday" 
                  value={kpis.total} 
                  icon={Users} 
                  color="bg-blue-500" 
                />
                <StatCard 
                  title="Pozisyon Kapanma (Gün)" 
                  value={kpis.avgTimeToHire} 
                  icon={Clock} 
                  trend="-12%" 
                  color="bg-emerald-500" 
                />
                <StatCard 
                  title="Aktif Pozisyonlar" 
                  value={jobPositions.filter(p => p.status === 'Açık').length} 
                  icon={Briefcase} 
                  color="bg-amber-500" 
                />
                <StatCard 
                  title="Olumlu Aday Oranı" 
                  value={`%${Math.round((kpis.positive / kpis.total) * 100) || 0}`} 
                  icon={CheckCircle2} 
                  trend="+5%" 
                  color="bg-indigo-500" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Open Positions Quick View */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Briefcase size={20} className="text-indigo-600" />
                      Açık Pozisyonlar
                    </h3>
                    <button 
                      onClick={() => setIsPositionModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      + Yeni Ekle
                    </button>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {jobPositions.filter(p => p.status === 'Açık').length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Info size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Şu an açık pozisyon bulunmuyor.</p>
                      </div>
                    ) : (
                      jobPositions.filter(p => p.status === 'Açık').map(pos => (
                        <div key={pos.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all group">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{pos.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{pos.department}</p>
                            </div>
                            <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-400">
                              {candidates.filter(c => c.position === pos.title).length} Aday
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button 
                    onClick={() => setView('positions')}
                    className="mt-6 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    Tüm Pozisyonları Yönet
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Charts & Activity (Now adjusted to 2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Departman Dağılımı</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: '#f8fafc'}} 
                              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Süreç Durumları</h3>
                      <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-2 ml-4">
                          {statusData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                              <span className="text-xs font-medium text-slate-600">{entry.name}: {entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold">Son Değerlendirilen Adaylar</h3>
                      <button onClick={() => setView('table')} className="text-sm text-indigo-600 font-semibold hover:underline">Tümünü Gör</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="px-6 py-4">Aday</th>
                            <th className="px-6 py-4">Pozisyon</th>
                            <th className="px-6 py-4">Puan</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4">Karar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {candidates.slice(0, 3).map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                    {c.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="font-medium text-slate-900">{c.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{c.position}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <Award size={14} className="text-amber-500" />
                                  <span className="text-sm font-bold">{c.technicalScore}/5</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                                  c.status === 'Olumlu' ? "bg-emerald-50 text-emerald-700" :
                                  c.status === 'Olumsuz' ? "bg-rose-50 text-rose-700" :
                                  c.status === 'Yedek Aday' ? "bg-amber-50 text-amber-700" :
                                  "bg-blue-50 text-blue-700"
                                )}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-medium text-slate-700">{c.finalDecision}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : view === 'table' ? (
            <div className="flex flex-col gap-6">
              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Filter size={18} />
                  Filtrele:
                </div>
                <select 
                  className="bg-slate-50 border-none rounded-xl text-sm font-medium px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                >
                  {positions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select 
                  className="bg-slate-50 border-none rounded-xl text-sm font-medium px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Hepsi">Tüm Durumlar</option>
                  <option value="Devam Ediyor">Devam Ediyor</option>
                  <option value="Olumlu">Olumlu</option>
                  <option value="Olumsuz">Olumsuz</option>
                  <option value="Yedek Aday">Yedek Aday</option>
                </select>
                
                <div className="ml-auto flex items-center gap-4 text-sm text-slate-400">
                  <button 
                    onClick={exportToCSV}
                    className="text-indigo-600 font-semibold flex items-center gap-2 hover:underline"
                  >
                    <Download size={16} />
                    CSV Olarak İndir
                  </button>
                  <div className="w-px h-4 bg-slate-200" />
                  <button 
                    onClick={handleDeleteAll}
                    className="text-rose-600 font-semibold flex items-center gap-2 hover:underline"
                  >
                    <XCircle size={16} />
                    Tümünü Sil
                  </button>
                  <div className="w-px h-4 bg-slate-200" />
                  <span><span className="font-medium text-slate-900">{filteredCandidates.length}</span> aday listeleniyor</span>
                </div>
              </div>

              {/* Main Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th 
                          className="px-4 py-4 sticky left-0 bg-slate-50 z-10 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Aday Adı Soyadı
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'name' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('applicationDate')}
                        >
                          <div className="flex items-center gap-2">
                            Başvuru Tarihi
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'applicationDate' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('position')}
                        >
                          <div className="flex items-center gap-2">
                            Pozisyon / Departman
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'position' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('experienceYears')}
                        >
                          <div className="flex items-center gap-2">
                            Deneyim
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'experienceYears' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th className="px-4 py-4">Eğitim</th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('technicalScore')}
                        >
                          <div className="flex items-center gap-2">
                            Teknik Puan
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'technicalScore' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('interviewDate')}
                        >
                          <div className="flex items-center gap-2">
                            Mülakat Tarihi
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'interviewDate' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Süreç Durumu
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'status' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => handleSort('finalDecision')}
                        >
                          <div className="flex items-center gap-2">
                            Son Karar
                            <ArrowUpDown size={14} className={cn(sortConfig.key === 'finalDecision' ? "text-indigo-600" : "text-slate-300")} />
                          </div>
                        </th>
                        <th className="px-4 py-4 text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedCandidates.map(c => (
                        <tr 
                          key={c.id} 
                          onClick={() => {
                            setSelectedCandidateForDetail(c);
                            setIsDetailModalOpen(true);
                          }}
                          className={cn(
                            "group transition-colors cursor-pointer",
                            c.status === 'Olumlu' ? "bg-emerald-50/40 hover:bg-emerald-100/50" :
                            c.status === 'Olumsuz' ? "bg-rose-50/40 hover:bg-rose-100/50" :
                            c.status === 'Yedek Aday' ? "bg-amber-50/40 hover:bg-amber-100/50" :
                            "hover:bg-slate-50"
                          )}
                        >
                          <td className={cn(
                            "px-4 py-5 sticky left-0 z-10 transition-colors",
                            c.status === 'Olumlu' ? "bg-emerald-50/40 group-hover:bg-emerald-100/50" :
                            c.status === 'Olumsuz' ? "bg-rose-50/40 group-hover:bg-rose-100/50" :
                            c.status === 'Yedek Aday' ? "bg-amber-50/40 group-hover:bg-amber-100/50" :
                            "bg-white group-hover:bg-slate-50"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                                {c.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{c.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              <span className="text-sm font-medium">{c.applicationDate}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{c.position}</span>
                              <span className="text-xs text-slate-400">{c.department}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-slate-400" />
                              <span className="text-sm font-medium">{c.experienceYears} Yıl</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <GraduationCap size={14} className="text-slate-400" />
                              <span className="text-xs font-medium max-w-[150px] truncate" title={c.education}>{c.education}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <div 
                                  key={star} 
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    star <= c.technicalScore ? "bg-amber-400" : "bg-slate-200"
                                  )} 
                                />
                              ))}
                              <span className="ml-2 text-xs font-bold text-slate-700">{c.technicalScore}/5</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              <span className="text-xs font-medium">{c.interviewDate}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <span className={cn(
                              "text-xs font-bold px-3 py-1 rounded-lg inline-flex items-center gap-1.5",
                              c.status === 'Olumlu' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              c.status === 'Olumsuz' ? "bg-rose-50 text-rose-700 border border-rose-100" :
                              c.status === 'Yedek Aday' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              "bg-blue-50 text-blue-700 border border-blue-100"
                            )}>
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                c.status === 'Olumlu' ? "bg-emerald-500" :
                                c.status === 'Olumsuz' ? "bg-rose-500" :
                                c.status === 'Yedek Aday' ? "bg-amber-500" :
                                "bg-blue-500"
                              )} />
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              {c.finalDecision === 'İşe Alındı' && <CheckCircle2 size={16} className="text-emerald-500" />}
                              {c.finalDecision === 'Reddedildi' && <XCircle size={16} className="text-rose-500" />}
                              <span className="text-sm font-medium text-slate-700">{c.finalDecision}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidateForDetail(c);
                                  setIsDetailModalOpen(true);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-800 font-semibold text-xs flex items-center gap-1"
                              >
                                <Eye size={14} />
                                Detay
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(c);
                                }}
                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600 hover:text-indigo-700 font-semibold text-xs"
                              >
                                Düzenle
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCandidate(c.id);
                                }}
                                className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-rose-500 hover:text-rose-600"
                                title="Sil"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-3xl">
                    <div className="text-sm text-slate-500">
                      Toplam <span className="font-semibold text-slate-900">{filteredCandidates.length}</span> adaydan 
                      <span className="font-semibold text-slate-900"> {(currentPage - 1) * itemsPerPage + 1}</span> - 
                      <span className="font-semibold text-slate-900"> {Math.min(currentPage * itemsPerPage, filteredCandidates.length)}</span> arası gösteriliyor
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-10 h-10 rounded-lg text-sm font-semibold transition-all",
                              currentPage === page 
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                                : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                            )}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pivot Structure Suggestion */}
              <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl mt-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Pivot Tablo & Analiz Önerisi</h3>
                    <p className="text-indigo-100 mb-6 leading-relaxed">
                      Veri setinizi Excel'e aktardığınızda aşağıdaki pivot yapılarını kullanarak derinlemesine analizler yapabilirsiniz:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">1</div>
                        <span className="text-sm"><strong>Satırlar:</strong> Departman, <strong>Değerler:</strong> Aday Sayısı (Başvuru yoğunluğu analizi)</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">2</div>
                        <span className="text-sm"><strong>Satırlar:</strong> Mülakatı Yapan, <strong>Değerler:</strong> Ortalama Teknik Puan (Görüşmeci objektifliği)</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">3</div>
                        <span className="text-sm"><strong>Sütunlar:</strong> Süreç Durumu, <strong>Değerler:</strong> Yüzde (Pipeline verimliliği)</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center shrink-0">4</div>
                        <span className="text-sm"><strong>Filtreler:</strong> Pozisyon, <strong>Değerler:</strong> Karar Tarihi (Kapanma süresi takibi)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-full md:w-64 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold mb-4 text-indigo-200 uppercase text-xs tracking-widest">Kritik KPI'lar</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-indigo-300">İşe Alım Verimliliği</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-1">
                          <div className="h-full w-3/4 bg-emerald-400 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-indigo-300">Aday Deneyimi Skoru</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-1">
                          <div className="h-full w-4/5 bg-indigo-400 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-indigo-300">Bütçe Uyumu</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-1">
                          <div className="h-full w-1/2 bg-amber-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Job Positions Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-6 py-4">Pozisyon Başlığı</th>
                        <th className="px-6 py-4">Departman</th>
                        <th className="px-6 py-4">Durum</th>
                        <th className="px-6 py-4">Oluşturulma</th>
                        <th className="px-6 py-4">Aday Sayısı</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Quick Add Row */}
                      <tr className="bg-indigo-50/30">
                        <td className="px-6 py-4" colSpan={6}>
                          <form 
                            className="flex items-center gap-4"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              const title = formData.get('title') as string;
                              const department = formData.get('department') as string;
                              if (title && department) {
                                handleAddJobPosition({ title, department, status: 'Açık' });
                                (e.target as HTMLFormElement).reset();
                              }
                            }}
                          >
                            <div className="flex-1">
                              <input 
                                required
                                name="title"
                                type="text" 
                                placeholder="Yeni Pozisyon Başlığı (Örn: Senior Frontend Developer)" 
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </div>
                            <div className="w-64">
                              <input 
                                required
                                name="department"
                                type="text" 
                                placeholder="Departman" 
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </div>
                            <button 
                              type="submit"
                              className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shrink-0"
                            >
                              <Plus size={16} />
                              Hızlı Ekle
                            </button>
                          </form>
                        </td>
                      </tr>
                      {jobPositions.filter(p => 
                        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.department.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((pos) => (
                        <tr key={pos.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-900">{pos.title}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{pos.department}</td>
                          <td className="px-6 py-4">
                            <select 
                              value={pos.status}
                              onChange={(e) => handleUpdateJobPositionStatus(pos.id, e.target.value as JobPosition['status'])}
                              className={cn(
                                "text-xs font-bold px-3 py-1 rounded-full border-none focus:ring-0 cursor-pointer",
                                pos.status === 'Açık' ? "bg-emerald-50 text-emerald-600" : 
                                pos.status === 'Kapalı' ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-600"
                              )}
                            >
                              <option value="Açık">Açık</option>
                              <option value="Kapalı">Kapalı</option>
                              <option value="Durduruldu">Durduruldu</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{pos.createdAt}</td>
                          <td className="px-6 py-4">
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-xs font-bold">
                              {candidates.filter(c => c.position === pos.title).length} Aday
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteJobPosition(pos.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Position Modal */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Yeni Pozisyon Ekle</h3>
                <p className="text-indigo-100 text-xs mt-1">İşe alım sürecini başlatmak için detayları girin.</p>
              </div>
              <button onClick={() => setIsPositionModalOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form 
              className="p-8"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddJobPosition({
                  title: formData.get('title') as string,
                  department: formData.get('department') as string,
                  status: 'Açık'
                });
              }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Pozisyon Başlığı</label>
                  <input required name="title" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: Senior Backend Developer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Departman</label>
                  <input required name="department" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: Teknoloji" />
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsPositionModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    Pozisyonu Aç
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {isDetailModalOpen && selectedCandidateForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-slate-50 to-white">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-indigo-200">
                  {selectedCandidateForDetail.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-bold text-slate-900">{selectedCandidateForDetail.name}</h2>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      selectedCandidateForDetail.status === 'Olumlu' ? "bg-emerald-100 text-emerald-700" :
                      selectedCandidateForDetail.status === 'Olumsuz' ? "bg-rose-100 text-rose-700" :
                      selectedCandidateForDetail.status === 'Yedek Aday' ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {selectedCandidateForDetail.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={16} className="text-indigo-500" />
                      {selectedCandidateForDetail.position}
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-indigo-500" />
                      {selectedCandidateForDetail.department}
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedCandidateForDetail(null);
                }}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all group"
              >
                <XCircle size={32} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Stats */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Profil Özeti</h3>
                    <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">İletişim</span>
                        <span className="text-sm font-bold text-slate-900">{selectedCandidateForDetail.contactInfo}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Deneyim</span>
                        <span className="text-sm font-bold text-slate-900">{selectedCandidateForDetail.experienceYears} Yıl</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Eğitim</span>
                        <span className="text-sm font-bold text-slate-900 text-right max-w-[150px]">{selectedCandidateForDetail.education}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Son Şirket</span>
                        <span className="text-sm font-bold text-slate-900">{selectedCandidateForDetail.lastCompany}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Ücret Beklentisi</span>
                        <span className="text-sm font-bold text-indigo-600">{selectedCandidateForDetail.salaryExpectation}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Yetkinlik Skorları</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600 font-medium">Teknik Bilgi</span>
                          <span className="font-bold text-indigo-600">{selectedCandidateForDetail.technicalScore}/5</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(selectedCandidateForDetail.technicalScore / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600 font-medium">İletişim</span>
                          <span className="font-bold text-emerald-600">{selectedCandidateForDetail.competencies.communication}/5</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(selectedCandidateForDetail.competencies.communication / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600 font-medium">Takım Çalışması</span>
                          <span className="font-bold text-amber-600">{selectedCandidateForDetail.competencies.teamwork}/5</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(selectedCandidateForDetail.competencies.teamwork / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Süreç Bilgileri</h3>
                    <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50 space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-indigo-500" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Mülakat Tarihi</p>
                          <p className="text-sm font-bold text-slate-900">{selectedCandidateForDetail.interviewDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-indigo-500" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Mülakatı Yapan</p>
                          <p className="text-sm font-bold text-slate-900">{selectedCandidateForDetail.interviewer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award size={18} className="text-indigo-500" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Son Karar</p>
                          <p className="text-sm font-bold text-slate-900">{selectedCandidateForDetail.finalDecision}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Notes & Analysis */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare size={20} className="text-indigo-500" />
                      <h3 className="text-lg font-bold text-slate-900">Genel Değerlendirme</h3>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm italic text-slate-600 leading-relaxed">
                      "{selectedCandidateForDetail.generalNote || 'Not eklenmemiş.'}"
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <h3 className="text-lg font-bold text-slate-900">Güçlü Yönler (Pros)</h3>
                      </div>
                      <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 min-h-[150px]">
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {selectedCandidateForDetail.pros || 'Belirtilmemiş.'}
                        </p>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle size={20} className="text-rose-500" />
                        <h3 className="text-lg font-bold text-slate-900">Gelişim Alanları (Cons)</h3>
                      </div>
                      <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-6 min-h-[150px]">
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {selectedCandidateForDetail.cons || 'Belirtilmemiş.'}
                        </p>
                      </div>
                    </section>
                  </div>

                  {selectedCandidateForDetail.rejectionReason && (
                    <section className="bg-slate-900 rounded-3xl p-8 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <Info size={24} className="text-rose-400" />
                        <h3 className="text-xl font-bold">Ret Nedeni</h3>
                      </div>
                      <p className="text-slate-300 text-lg">
                        {selectedCandidateForDetail.rejectionReason}
                      </p>
                    </section>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="text-sm text-slate-400">
                Başvuru Tarihi: <span className="font-bold text-slate-600">{selectedCandidateForDetail.applicationDate}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedCandidateForDetail(null);
                  }}
                  className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all"
                >
                  Kapat
                </button>
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openEditModal(selectedCandidateForDetail);
                  }}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => {
                    handleDeleteCandidate(selectedCandidateForDetail.id);
                  }}
                  className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {editingCandidate ? <MessageSquare className="text-indigo-600" /> : <UserPlus className="text-indigo-600" />}
                {editingCandidate ? 'Aday Değerlendirmesini Düzenle' : 'Yeni Aday Kaydı'}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCandidate(null);
                }}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <XCircle size={24} className="text-slate-400" />
              </button>
            </div>
            
            <form 
              className="p-8 overflow-y-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                
                const candidateData = {
                  name: data.name as string,
                  position: data.position as string,
                  department: data.department as string,
                  applicationDate: data.applicationDate as string,
                  experienceYears: Number(data.experienceYears),
                  lastCompany: data.lastCompany as string,
                  education: data.education as string,
                  technicalScore: Number(data.technicalScore),
                  competencies: editingCandidate?.competencies || {
                    communication: 3,
                    teamwork: 3,
                    problemSolving: 3
                  },
                  salaryExpectation: data.salaryExpectation as string,
                  interviewer: data.interviewer as string,
                  interviewDate: data.interviewDate as string,
                  generalNote: data.generalNote as string,
                  pros: data.pros as string,
                  cons: data.cons as string,
                  contactInfo: data.contactInfo as string,
                  status: (data.status as Status) || editingCandidate?.status || 'Devam Ediyor',
                  isReevaluable: data.isReevaluable === 'on',
                  finalDecision: (data.finalDecision as Decision) || editingCandidate?.finalDecision || 'Beklemede',
                  decisionDate: data.decisionDate as string || editingCandidate?.decisionDate || '-'
                };

                if (editingCandidate) {
                  handleUpdateCandidate({ ...candidateData, id: editingCandidate.id });
                } else {
                  handleAddCandidate(candidateData);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Temel Bilgiler</h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ad Soyad</label>
                    <input required name="name" type="text" defaultValue={editingCandidate?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: Can Yılmaz" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">İletişim Bilgisi</label>
                    <input required name="contactInfo" type="text" defaultValue={editingCandidate?.contactInfo} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="E-posta veya Telefon" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Pozisyon</label>
                      <select 
                        required 
                        name="position" 
                        defaultValue={editingCandidate?.position} 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      >
                        <option value="">Seçiniz...</option>
                        {jobPositions.map(p => (
                          <option key={p.id} value={p.title}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Departman</label>
                      <input required name="department" type="text" defaultValue={editingCandidate?.department} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: Tasarım" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Başvuru Tarihi</label>
                      <input required name="applicationDate" type="date" defaultValue={editingCandidate?.applicationDate || new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Deneyim (Yıl)</label>
                      <input required name="experienceYears" type="number" defaultValue={editingCandidate?.experienceYears} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: 5" />
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Profesyonel Detaylar</h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Eğitim Durumu</label>
                    <input required name="education" type="text" defaultValue={editingCandidate?.education} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: İTÜ - Endüstri Ürünleri Tasarımı" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Mevcut / Son Şirket</label>
                    <input required name="lastCompany" type="text" defaultValue={editingCandidate?.lastCompany} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: Global Agency" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Teknik Puan (1-5)</label>
                      <select name="technicalScore" defaultValue={editingCandidate?.technicalScore || 3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        <option value="1">1 - Zayıf</option>
                        <option value="2">2 - Orta</option>
                        <option value="3">3 - İyi</option>
                        <option value="4">4 - Çok İyi</option>
                        <option value="5">5 - Mükemmel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ücret Beklentisi</label>
                      <input required name="salaryExpectation" type="text" defaultValue={editingCandidate?.salaryExpectation} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Örn: 80.000 TL" />
                    </div>
                  </div>
                </div>

                {/* Interview & Status Info */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Mülakat & Karar Süreci</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Mülakatı Yapan</label>
                      <input required name="interviewer" type="text" defaultValue={editingCandidate?.interviewer} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="İsim Soyisim" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Mülakat Tarihi</label>
                      <input required name="interviewDate" type="date" defaultValue={editingCandidate?.interviewDate} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Süreç Durumu</label>
                      <select name="status" defaultValue={editingCandidate?.status || 'Devam Ediyor'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        <option value="Devam Ediyor">Devam Ediyor</option>
                        <option value="Olumlu">Olumlu</option>
                        <option value="Olumsuz">Olumsuz</option>
                        <option value="Yedek Aday">Yedek Aday</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Son Karar</label>
                      <select name="finalDecision" defaultValue={editingCandidate?.finalDecision || 'Beklemede'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        <option value="Beklemede">Beklemede</option>
                        <option value="Teklif Yapıldı">Teklif Yapıldı</option>
                        <option value="İşe Alındı">İşe Alındı</option>
                        <option value="Reddedildi">Reddedildi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Karar Tarihi</label>
                      <input name="decisionDate" type="date" defaultValue={editingCandidate?.decisionDate !== '-' ? editingCandidate?.decisionDate : ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase text-emerald-600">Olumlu Yönler (Pros)</label>
                      <textarea name="pros" defaultValue={editingCandidate?.pros} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-20" placeholder="Adayın güçlü yanları..."></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase text-rose-600">Olumsuz Yönler (Cons)</label>
                      <textarea name="cons" defaultValue={editingCandidate?.cons} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all h-20" placeholder="Gelişim alanları..."></textarea>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Genel Değerlendirme Notu</label>
                    <textarea name="generalNote" defaultValue={editingCandidate?.generalNote} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-20" placeholder="Aday hakkında genel kanaat..."></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCandidate(null);
                  }}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  {editingCandidate ? 'Değişiklikleri Kaydet' : 'Adayı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

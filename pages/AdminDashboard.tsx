
import React from 'react';
import { 
  Shield, CheckCircle, XCircle, Users, ClipboardCheck, Briefcase, 
  Settings, Layout, Bell, FileText, Search, Filter, Ban, RefreshCw,
  AlertTriangle, List, History, Key, PieChart, MoreVertical, Check, Lock, 
  Trash2, MessageSquare, Clock, ArrowLeftRight, CheckCircle2, Wifi
} from 'lucide-react';
import { ServiceRequest, User as AppUser, Category, Complaint, SystemLog, AdminAccessRole, RequestStatus } from '../types';

interface AdminDashboardProps {
  users: AppUser[];
  requests: ServiceRequest[];
  complaints: Complaint[];
  logs: SystemLog[];
  categories: Category[];
  systemSettings: any;
  adminAccessRole: AdminAccessRole;
  onUpdateStatus: (id: string, status: RequestStatus, notes?: string) => void;
  onApproveTech: (id: string) => void;
  onBlockUser: (id: string) => void;
  onUpdateCMS: (key: string, val: string) => void;
  onReassign: (requestId: string, technicianId: string) => void;
  onDeleteRequest: (id: string) => void;
  onUpdatePasswords: (role: AdminAccessRole, newPass: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, requests, complaints, logs, categories, systemSettings, adminAccessRole,
  onUpdateStatus, onApproveTech, onBlockUser, onUpdateCMS, onReassign, onDeleteRequest, onUpdatePasswords, onLogout
}) => {
  const [activeTab, setActiveTab] = React.useState<'stats' | 'requests' | 'users' | 'techs' | 'cms' | 'complaints' | 'logs' | 'passwords'>('stats');
  const [requestView, setRequestView] = React.useState<'active' | 'archive'>('active');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [actionModal, setActionModal] = React.useState<{id: string, type: 'status', currentStatus: RequestStatus} | null>(null);
  const [reassigningId, setReassigningId] = React.useState<string | null>(null);
  const [statusNotes, setStatusNotes] = React.useState('');

  const isManager = adminAccessRole === 'manager';

  const handleStatusUpdate = (status: RequestStatus) => {
    if (actionModal) {
      onUpdateStatus(actionModal.id, status, statusNotes);
      setActionModal(null);
      setStatusNotes('');
    }
  };

  const stats = {
    totalUsers: users.length,
    totalRequests: requests.length,
    activeRequests: requests.filter(r => r.status === 'pending' || r.status === 'accepted').length,
    completedRequests: requests.filter(r => r.status === 'completed').length,
    activeTechs: users.filter(u => u.role === 'technician' && u.status === 'available').length,
  };

  const filteredRequests = (requestView === 'active' ? 
    requests.filter(r => r.status === 'pending' || r.status === 'accepted') : 
    requests.filter(r => r.status !== 'pending' && r.status !== 'accepted')
  ).filter(r => r.customerName.includes(searchQuery) || r.id.includes(searchQuery));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Central Portal Theme */}
      <aside className="w-full lg:w-72 bg-blue-950 text-white p-6 shrink-0 shadow-2xl z-20 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20"><Shield size={28} /></div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">الأسطى <span className="text-orange-500">HQ</span></h1>
            <p className="text-[10px] font-bold text-orange-200 mt-1 uppercase tracking-widest">{isManager ? 'المدير العام' : 'مشرف العمليات'}</p>
          </div>
        </div>
        
        <nav className="space-y-1 flex-grow">
          <NavItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<PieChart />} label="لوحة المعلومات" />
          <NavItem active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon={<ClipboardCheck />} label="إدارة العمليات" count={stats.activeRequests} />
          <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users />} label="قاعدة البيانات" />
          
          {isManager && (
            <>
              <div className="pt-4 pb-2 px-4 text-[10px] font-black text-blue-300 uppercase tracking-widest opacity-50">نظام الإدارة</div>
              <NavItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<History />} label="سجل المزامنة" />
              <NavItem active={activeTab === 'passwords'} onClick={() => setActiveTab('passwords')} icon={<Lock />} label="الأمان والرموز" />
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
           <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-900/50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter flex items-center gap-1">
                <Wifi size={10} /> Live Synchronized
              </span>
           </div>
           <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-black text-red-300 hover:bg-red-500/10 transition-all">
              <Lock size={22} />
              <span>خروج آمن</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8 space-y-8 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-right">
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">البوابة المركزية</h2>
            <p className="text-gray-500 font-medium">متابعة لحظية لكافة العمليات والطلبات القادمة</p>
          </div>
          <div className="flex gap-4">
            <div className="hidden md:flex flex-col items-end justify-center px-4 border-r pr-6">
               <span className="text-xs font-black text-gray-400 uppercase">الحالة الآن</span>
               <span className="text-sm font-black text-blue-900">متصل بالخادم المحلي</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-blue-900">
               <Bell size={20} />
            </div>
          </div>
        </header>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            <StatCard title="الطلبات النشطة" value={stats.activeRequests} growth="مباشر" icon={<Clock className="text-orange-600" />} color="bg-orange-100" />
            <StatCard title="الفنيين المتاحين" value={stats.activeTechs} growth="+2" icon={<Briefcase className="text-green-600" />} color="bg-green-100" />
            <StatCard title="إجمالي المستخدمين" value={stats.totalUsers} growth="+12%" icon={<Users className="text-blue-600" />} color="bg-blue-100" />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex bg-white p-1.5 rounded-2xl border w-fit shadow-sm">
               <button onClick={() => setRequestView('active')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${requestView === 'active' ? 'bg-blue-900 text-white shadow-lg' : 'text-gray-400 hover:text-blue-900'}`}>العمليات الحالية</button>
               <button onClick={() => setRequestView('archive')} className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${requestView === 'archive' ? 'bg-blue-900 text-white shadow-lg' : 'text-gray-400 hover:text-blue-900'}`}>الأرشيف المتزامن</button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
               <div className="p-6 bg-gray-50/50 border-b flex items-center justify-between">
                  <div className="relative max-w-md w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="بحث فوري..." className="w-full p-4 pr-12 rounded-2xl bg-white border outline-none text-right font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400">
                    <RefreshCw size={14} className="animate-spin text-blue-600" /> تحديث تلقائي مفعل
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gray-100/50 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="p-6">العميل / المعرف</th>
                        <th className="p-6">الخدمة</th>
                        <th className="p-6">الحالة</th>
                        <th className="p-6 text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredRequests.map(req => (
                        <tr key={req.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="p-6">
                             <p className="font-black text-blue-950">{req.customerName}</p>
                             <p className="text-[10px] text-gray-400 font-mono">#{req.id}</p>
                          </td>
                          <td className="p-6 font-bold text-sm">{req.category}</td>
                          <td className="p-6"><StatusBadge status={req.status} /></td>
                          <td className="p-6">
                             <div className="flex justify-center gap-2">
                               <button onClick={() => setActionModal({id: req.id, type: 'status', currentStatus: req.status})} className="p-3 bg-blue-900 text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-900/10"><Settings size={18} /></button>
                               {isManager && <button onClick={() => onDeleteRequest(req.id)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"><Trash2 size={18} /></button>}
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {/* Sync Logs Table */}
        {activeTab === 'logs' && (
           <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden animate-in fade-in">
              <div className="p-8 border-b bg-gray-50/50">
                 <h3 className="text-xl font-black text-blue-950 flex items-center gap-2">
                    <History className="text-orange-500" /> سجل العمليات المتزامن
                 </h3>
              </div>
              <div className="divide-y">
                 {logs.map(log => (
                    <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-gray-50">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner"><Wifi size={18} /></div>
                       <div className="text-right flex-grow">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-black text-blue-900">{log.action}</span>
                             <span className="text-[10px] text-gray-400 font-mono">{new Date(log.timestamp).toLocaleTimeString('ar-EG')}</span>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">{log.details}</p>
                          <p className="text-[10px] font-black text-orange-600 mt-2 uppercase tracking-tighter">بواسطة: {log.user}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>

      {/* Modals */}
      {actionModal && (
         <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
               <div className="text-center">
                  <h3 className="text-2xl font-black text-blue-950">تحديث الحالة فوراً</h3>
                  <p className="text-gray-400 font-medium mt-1">سيتم بث التحديث لكافة الأجهزة</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleStatusUpdate('completed')} className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 hover:border-green-500 hover:bg-green-50 transition-all">
                     <CheckCircle className="text-green-500" size={32} />
                     <span className="font-black text-xs">تم التنفيذ</span>
                  </button>
                  <button onClick={() => handleStatusUpdate('execution_error')} className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 hover:border-red-500 hover:bg-red-50 transition-all">
                     <AlertTriangle className="text-red-500" size={32} />
                     <span className="font-black text-xs">خطأ/عطل</span>
                  </button>
               </div>
               <textarea className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-right font-bold text-sm" placeholder="ملاحظات المزامنة..." value={statusNotes} onChange={e => setStatusNotes(e.target.value)} />
               <button onClick={() => setActionModal(null)} className="w-full py-4 text-gray-400 font-bold">إلغاء</button>
            </div>
         </div>
      )}
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, count }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl font-black transition-all group ${active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'text-blue-100/70 hover:bg-white/10 hover:text-white'}`}>
    <div className="flex items-center gap-4">
       <span className={active ? 'text-white' : 'text-orange-500'}>{React.cloneElement(icon, { size: 22 })}</span>
       <span>{label}</span>
    </div>
    {count !== undefined && count > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>{count}</span>}
  </button>
);

const StatCard = ({ title, value, growth, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-4 group hover:shadow-xl transition-all relative overflow-hidden">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
    <div className="text-right">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <div className="flex items-end justify-start gap-3 mt-1 flex-row-reverse">
        <span className="text-3xl font-black text-blue-950 tracking-tight">{value}</span>
        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{growth}</span>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-gray-100 text-gray-500',
    execution_error: 'bg-red-100 text-red-800',
    deleted: 'bg-black text-white'
  };
  const labels = {
    pending: 'قيد المراجعة',
    accepted: 'جاري التنفيذ',
    completed: 'مكتمل',
    rejected: 'مرفوض',
    execution_error: 'خطأ',
    deleted: 'محذوف'
  };
  return <span className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-tight ${styles[status]}`}>{labels[status]}</span>;
};

export default AdminDashboard;

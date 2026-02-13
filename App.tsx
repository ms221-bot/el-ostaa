
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RequestService from './pages/RequestService';
import TechnicianSignup from './pages/TechnicianSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import QuickOrders from './pages/QuickOrders'; // استيراد الصفحة الجديدة
import { User, ServiceRequest, Complaint, SystemLog, AdminAccessRole, RequestStatus } from './types';
import { CATEGORIES } from './constants';
import { Lock, User as UserIcon, Phone, MapPin, Eye, EyeOff, UserPlus, LogIn, ShieldCheck, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const loadData = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [users, setUsers] = React.useState<User[]>(() => loadData('ostaa_users', [
    { id: '1', name: 'أحمد المشرف', phone: '01012345678', password: '123', role: 'admin' },
    { id: '2', name: 'محمد حسن', phone: '01198765432', password: '123', role: 'customer', location: 'المعادي، القاهرة' },
  ]));
  
  const [currentUser, setCurrentUser] = React.useState<User | null>(() => loadData('ostaa_session', null));
  const [requests, setRequests] = React.useState<ServiceRequest[]>(() => loadData('ostaa_requests', []));
  const [logs, setLogs] = React.useState<SystemLog[]>(() => loadData('ostaa_logs', []));
  const [showPass, setShowPass] = React.useState(false);

  const [adminAuth, setAdminAuth] = React.useState<{role: AdminAccessRole | null, isAuthenticated: boolean, name: string}>(() => {
    const role = localStorage.getItem('admin_role') as AdminAccessRole;
    const token = localStorage.getItem('admin_token');
    const name = localStorage.getItem('admin_name') || '';
    return { role, isAuthenticated: !!token, name };
  });

  const [adminPasswords] = React.useState({
    manager: localStorage.getItem('pass_manager') || 'manager123',
    staff_admin: localStorage.getItem('pass_admin') || 'admin123'
  });

  const [systemSettings] = React.useState({
    heroHeadline: localStorage.getItem('hero_headline') || 'اطلب أسطى محترف في دقائق',
    heroSubtext: localStorage.getItem('hero_subtext') || 'أفضل السباكين والكهربائيين والفنيين في منطقتك، متاحون الآن لخدمتك بضمان وجودة.'
  });

  React.useEffect(() => {
    localStorage.setItem('ostaa_requests', JSON.stringify(requests));
    localStorage.setItem('ostaa_users', JSON.stringify(users));
    localStorage.setItem('ostaa_logs', JSON.stringify(logs));
  }, [requests, users, logs]);

  React.useEffect(() => {
    localStorage.setItem('ostaa_session', JSON.stringify(currentUser));
  }, [currentUser]);

  const addLog = (action: string, details: string) => {
    const logUser = adminAuth.isAuthenticated ? adminAuth.name : (currentUser?.name || 'نظام');
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      user: logUser,
      timestamp: new Date().toISOString(),
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAdminLogin = (role: AdminAccessRole, password: string, name: string) => {
    if (password === adminPasswords[role]) {
      localStorage.setItem('admin_token', 'active');
      localStorage.setItem('admin_role', role);
      localStorage.setItem('admin_name', name);
      setAdminAuth({ role, isAuthenticated: true, name });
      addLog('دخول إداري', `تم الدخول للبوابة المركزية بصلاحية ${role}`);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_name');
    setAdminAuth({ role: null, isAuthenticated: false, name: '' });
    addLog('خروج إداري', 'تم تسجيل الخروج');
  };

  const handleUpdateStatus = (id: string, status: RequestStatus, notes?: string) => {
    setRequests(p => p.map(r => r.id === id ? { ...r, status, notes: notes || r.notes } : r));
    addLog('تحديث طلب', `تعديل حالة الطلب ${id} إلى ${status}`);
  };

  const handleCustomerLogin = (phone: string, pass: string) => {
    const user = users.find(u => u.phone === phone && u.password === pass);
    if (user) {
      if (user.isBlocked) { alert('هذا الحساب محظور من الإدارة'); return false; }
      setCurrentUser(user);
      addLog('دخول عميل', `العميل ${user.name} دخل المنصة`);
      return true;
    }
    alert('بيانات الدخول غير صحيحة، يرجى التأكد من الهاتف وكلمة المرور');
    return false;
  };

  const handleCustomerRegister = (data: any) => {
    const exists = users.find(u => u.phone === data.phone);
    if (exists) { alert('هذا الرقم مسجل بالفعل!'); return false; }
    
    const newUser: User = { 
      id: 'cust-' + Math.random().toString(36).substr(2, 5), 
      ...data, 
      role: 'customer' 
    };
    setUsers(p => [...p, newUser]);
    setCurrentUser(newUser);
    addLog('تسجيل جديد', `انضم عميل جديد: ${newUser.name}`);
    return true;
  };

  return (
    <Router>
      <Layout currentUser={currentUser} onLogout={adminAuth.isAuthenticated ? handleAdminLogout : () => setCurrentUser(null)}>
        <Routes>
          <Route path="/" element={<Home settings={systemSettings} />} />
          <Route path="/request-service" element={<RequestService currentUser={currentUser} onSubmitRequest={(req) => {
             setRequests(p => [req, ...p]);
             addLog('طلب جديد', `طلب خدمة من العميل ${req.customerName}`);
          }} />} />
          <Route path="/technician-signup" element={<TechnicianSignup onRegister={(u) => setUsers(p => [...p, u])} />} />
          <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          <Route path="/orders" element={<QuickOrders />} /> {/* مسار صفحة الأوردرات المباشرة */}
          
          <Route path="/admin" element={adminAuth.isAuthenticated ? (
            <AdminDashboard 
              users={users} 
              requests={requests} 
              complaints={[]}
              logs={logs}
              categories={CATEGORIES}
              systemSettings={systemSettings}
              adminAccessRole={adminAuth.role!}
              onUpdateStatus={handleUpdateStatus}
              onApproveTech={(id) => setUsers(p => p.map(u => u.id === id ? { ...u, status: 'available' } : u))}
              onBlockUser={(id) => setUsers(p => p.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))}
              onUpdateCMS={() => {}}
              onReassign={(rid, tid) => {
                const tech = users.find(u => u.id === tid);
                setRequests(p => p.map(r => r.id === rid ? { ...r, technicianId: tid, technicianName: tech?.name, status: 'accepted' } : r));
              }}
              onDeleteRequest={(id) => {
                if(window.confirm('حذف؟')) setRequests(p => p.filter(r => r.id !== id));
              }}
              onUpdatePasswords={() => {}}
              onLogout={handleAdminLogout}
            />
          ) : <Navigate to="/admin/login" />} />
          
          <Route path="/login" element={
            <div className="max-w-4xl mx-auto py-20 px-4 animate-in zoom-in-95">
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                <div className="flex-1 bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[6rem]"></div>
                  <div className="w-20 h-20 bg-blue-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 shadow-xl shadow-blue-900/20 rotate-3">
                    <LogIn size={40} />
                  </div>
                  <h2 className="text-3xl font-black mb-8 text-blue-900 relative z-10">دخول العملاء</h2>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    if (handleCustomerLogin(target.phone.value, target.password.value)) {
                      window.location.hash = '#/profile';
                    }
                  }} className="space-y-5 relative z-10 text-right">
                    <div className="relative group">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                      <input name="phone" type="tel" required placeholder="رقم الهاتف" className="w-full p-5 pr-12 rounded-2xl border-2 bg-gray-50 outline-none focus:border-blue-800 transition-all font-bold text-center text-lg" />
                    </div>
                    
                    <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                      <input name="password" type={showPass ? "text" : "password"} required placeholder="كلمة المرور" className="w-full p-5 pr-12 rounded-2xl border-2 bg-gray-50 outline-none focus:border-blue-800 transition-all font-bold text-center text-lg tracking-widest" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900">
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <button type="submit" className="w-full bg-blue-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-950 shadow-2xl shadow-blue-900/20 transition-all active:scale-95">دخول</button>
                    <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-100">
                      <p className="text-gray-500 font-bold">ليس لديك حساب؟ <Link to="/register" className="text-orange-500 hover:underline">سجل الآن</Link></p>
                      <Link to="/orders" className="flex items-center justify-center gap-2 text-blue-600 font-black hover:bg-blue-50 py-3 rounded-xl border-2 border-dashed border-blue-200 transition-all">
                        <ShoppingBag size={18} /> تتبع الأوردرات المباشرة (Firebase)
                      </Link>
                    </div>
                  </form>
                </div>

                <div className="md:w-72 bg-blue-950 p-10 rounded-[3.5rem] shadow-2xl text-center flex flex-col justify-center items-center gap-6 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-50"></div>
                   <div className="relative z-10 w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-xl font-black text-white mb-2 tracking-tight">بوابة الإدارة المركزية</h3>
                      <p className="text-blue-200 text-xs font-bold leading-relaxed opacity-70">خاص بالمشرفين ومديري العمليات فقط للمتابعة الفورية</p>
                   </div>
                   <Link to="/admin/login" className="relative z-10 w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 py-4 rounded-xl font-black transition-all">
                      دخول الإدارة
                   </Link>
                </div>
              </div>
            </div>
          } />

          <Route path="/register" element={
            <div className="max-w-md mx-auto py-20 px-4 animate-in zoom-in-95">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[6rem]"></div>
                <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 shadow-xl shadow-orange-500/20 -rotate-3">
                  <UserPlus size={40} />
                </div>
                <h2 className="text-3xl font-black mb-8 text-blue-900 relative z-10">حساب عميل جديد</h2>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const data = {
                    name: target.name.value,
                    phone: target.phone.value,
                    password: target.password.value,
                    location: target.location.value
                  };
                  if (handleCustomerRegister(data)) window.location.hash = '#/profile';
                }} className="space-y-4 relative z-10 text-right">
                  <div className="relative group">
                    <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input name="name" required placeholder="الاسم الكامل" className="w-full p-5 pr-12 rounded-2xl border-2 bg-gray-50 outline-none focus:border-orange-500 transition-all font-bold text-center" />
                  </div>
                  
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input name="phone" type="tel" required placeholder="رقم الهاتف" className="w-full p-5 pr-12 rounded-2xl border-2 bg-gray-50 outline-none focus:border-orange-500 transition-all font-bold text-center" />
                  </div>

                  <div className="relative group">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input name="location" required placeholder="عنوانك الحالي" className="w-full p-5 pr-12 rounded-2xl border-2 bg-gray-50 outline-none focus:border-orange-500 transition-all font-bold text-center" />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input name="password" type={showPass ? "text" : "password"} required placeholder="كلمة المرور" className="w-full p-5 pr-12 rounded-2xl border-2 bg-gray-50 outline-none focus:border-orange-500 transition-all font-bold text-center tracking-widest" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-orange-500 text-white py-6 rounded-2xl font-black text-xl hover:bg-orange-600 shadow-2xl shadow-orange-500/20 transition-all active:scale-95 mt-4">إنشاء الحساب</button>
                  <p className="text-gray-500 font-bold mt-4 text-center">لديك حساب بالفعل؟ <Link to="/login" className="text-blue-900 hover:underline">سجل دخول</Link></p>
                </form>
              </div>
            </div>
          } />

          <Route path="/profile" element={currentUser ? (
              <div className="max-w-4xl mx-auto p-8 animate-in fade-in">
                 <div className="bg-blue-900 text-white p-10 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <h1 className="text-4xl font-black mb-2 relative z-10">{currentUser.name}</h1>
                    <p className="opacity-70 font-bold relative z-10">{currentUser.phone}</p>
                 </div>
                 <h2 className="text-3xl font-black mb-8 text-blue-900 text-right">طلباتك الحالية</h2>
                 <div className="space-y-4">
                   {requests.filter(r => r.customerId === currentUser.id).map(r => (
                     <div key={r.id} className="bg-white p-8 rounded-3xl border-2 flex justify-between items-center shadow-sm hover:border-blue-300 transition-all">
                        <div className="text-right">
                           <h4 className="font-black text-xl text-blue-950">{r.category}</h4>
                           <p className="text-gray-400 text-sm font-bold">{r.preferredTime}</p>
                        </div>
                        <StatusBadge status={r.status} />
                     </div>
                   ))}
                   {requests.filter(r => r.customerId === currentUser.id).length === 0 && (
                    <p className="text-center py-10 text-gray-400 font-bold italic">لا توجد طلبات مسجلة بعد</p>
                   )}
                 </div>
              </div>
          ) : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

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
    completed: 'تم بنجاح',
    rejected: 'مرفوض',
    execution_error: 'خطأ',
    deleted: 'محذوف'
  };
  return <span className={`px-4 py-1.5 rounded-full font-black text-[9px] ${styles[status]}`}>{labels[status]}</span>;
};

export default App;

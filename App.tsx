
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RequestService from './pages/RequestService';
import TechnicianSignup from './pages/TechnicianSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { User, ServiceRequest, SystemLog, AdminAccessRole, RequestStatus } from './types';
import { CATEGORIES } from './constants';
import { Lock, User as UserIcon, Phone, MapPin, Eye, EyeOff, UserPlus, LogIn, ShieldCheck, ArrowRightLeft } from 'lucide-react';

const App: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>(() => {
    const saved = localStorage.getItem('ostaa_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = React.useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('ostaa_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = React.useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('ostaa_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('ostaa_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [systemSettings, setSystemSettings] = React.useState({
    heroHeadline: 'الأسطى.. أسهل طريقة تخلص بيها مشاكلك المنزلية',
    heroSubtext: 'نوفر لك أفضل الفنيين المعتمدين لصيانة منزلك بضغطة زر. جودة، أمان، وسرعة في التنفيذ.'
  });

  const [adminAuth, setAdminAuth] = React.useState<{role: AdminAccessRole | null, isAuthenticated: boolean, name: string}>(() => {
    const role = localStorage.getItem('admin_role') as AdminAccessRole;
    const token = localStorage.getItem('admin_token');
    const name = localStorage.getItem('admin_name') || '';
    return { role, isAuthenticated: !!token, name };
  });

  const [showPass, setShowPass] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('ostaa_users', JSON.stringify(users));
    localStorage.setItem('ostaa_requests', JSON.stringify(requests));
    localStorage.setItem('ostaa_logs', JSON.stringify(logs));
    localStorage.setItem('ostaa_session', JSON.stringify(currentUser));
  }, [users, requests, logs, currentUser]);

  const addLog = (action: string, details: string) => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      user: adminAuth.isAuthenticated ? adminAuth.name : (currentUser?.name || 'نظام'),
      details,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAdminLogin = (role: AdminAccessRole, password: string, name: string) => {
    const managerPass = "manager123";
    const staffPass = "admin123";
    const correctPass = role === 'manager' ? managerPass : staffPass;

    if (password === correctPass) {
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
    addLog('خروج إداري', 'تم تسجيل الخروج من لوحة التحكم');
  };

  const handleCustomerLogin = (phone: string, pass: string) => {
    const user = users.find(u => u.phone === phone && u.password === pass);
    if (user) {
      if (user.isBlocked) { alert('هذا الحساب محظور من الإدارة'); return false; }
      setCurrentUser(user);
      addLog('دخول عميل', `العميل ${user.name} دخل المنصة`);
      return true;
    }
    alert('رقم الهاتف أو كلمة المرور غير صحيحة');
    return false;
  };

  const handleCustomerRegister = (data: any) => {
    if (users.find(u => u.phone === data.phone)) {
      alert('هذا الرقم مسجل بالفعل!');
      return false;
    }
    const newUser: User = { ...data, id: Math.random().toString(36).substr(2, 9), role: 'customer' };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    addLog('تسجيل جديد', `انضم عميل جديد: ${newUser.name}`);
    return true;
  };

  const handleUpdateStatus = (id: string, status: RequestStatus, notes?: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, notes: notes || r.notes } : r));
    addLog('تحديث طلب', `تم تغيير حالة الطلب ${id} إلى ${status}`);
  };

  return (
    <Router>
      <Layout currentUser={currentUser} onLogout={adminAuth.isAuthenticated ? handleAdminLogout : () => setCurrentUser(null)}>
        <Routes>
          <Route path="/" element={<Home settings={systemSettings} />} />
          
          <Route path="/request-service" element={<RequestService currentUser={currentUser} onSubmitRequest={(req) => {
            setRequests(prev => [req, ...prev]);
            addLog('طلب خدمة', `طلب جديد من ${req.customerName}`);
          }} />} />
          
          <Route path="/technician-signup" element={<TechnicianSignup onRegister={(tech) => {
            setUsers(prev => [...prev, tech]);
            addLog('تسجيل فني', `انضمام فني جديد: ${tech.name}`);
          }} />} />

          <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          
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
              onApproveTech={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'available' } : u))}
              onBlockUser={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))}
              onUpdateCMS={(key, val) => setSystemSettings(prev => ({ ...prev, [key]: val }))}
              onReassign={(rid, tid) => {
                const tech = users.find(u => u.id === tid);
                setRequests(prev => prev.map(r => r.id === rid ? { ...r, technicianId: tid, technicianName: tech?.name, status: 'accepted' } : r));
              }}
              onDeleteRequest={(id) => setRequests(prev => prev.filter(r => r.id !== id))}
              onUpdatePasswords={() => {}}
              onLogout={handleAdminLogout}
            />
          ) : <Navigate to="/admin/login" />} />

          {/* New Login UI based on the user screenshot */}
          <Route path="/login" element={
            <div className="max-w-4xl mx-auto py-20 px-4 animate-in zoom-in-95">
              <div className="flex flex-col md:flex-row gap-0 items-stretch bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
                
                {/* Left Side: Admin Portal (Blue) */}
                <div className="md:w-72 bg-blue-950 p-12 text-center flex flex-col justify-center items-center gap-6 relative">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg mb-2">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-white">بوابة الإدارة المركزية</h3>
                    <p className="text-blue-200 text-xs font-bold leading-relaxed opacity-80">
                      خاص بالمشرفين ومديري العمليات فقط للمتابعة الفورية
                    </p>
                  </div>
                  <Link to="/admin/login" className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-xl font-black transition-all text-sm mt-4">
                    دخول الإدارة
                  </Link>
                </div>

                {/* Right Side: Customer Login (White) */}
                <div className="flex-1 bg-white p-12 md:p-20 text-center relative overflow-hidden">
                  {/* Decorative Circle */}
                  <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-blue-50 rounded-full opacity-50"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <LogIn size={32} />
                    </div>
                    
                    <h2 className="text-3xl font-black mb-10 text-blue-900">دخول العملاء</h2>
                    
                    <form onSubmit={(e: any) => {
                      e.preventDefault();
                      if (handleCustomerLogin(e.target.phone.value, e.target.password.value)) {
                        window.location.hash = '#/profile';
                      }
                    }} className="space-y-5 text-right max-w-sm mx-auto">
                      <div className="relative group">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input 
                          name="phone" 
                          type="tel" 
                          required 
                          placeholder="رقم الهاتف" 
                          className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none focus:border-blue-800 focus:bg-white transition-all font-bold text-center text-lg" 
                        />
                      </div>
                      
                      <div className="relative group">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input 
                          name="password" 
                          type={showPass ? "text" : "password"} 
                          required 
                          placeholder="كلمة المرور" 
                          className="w-full p-5 pr-12 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none focus:border-blue-800 focus:bg-white transition-all font-bold text-center text-lg tracking-widest" 
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900">
                          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      <button type="submit" className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-950 shadow-2xl shadow-blue-900/20 transition-all active:scale-95 mt-4">
                        دخول
                      </button>
                      
                      <div className="mt-8">
                        <p className="text-gray-500 font-bold text-sm">
                          ليس لديك حساب؟ <Link to="/register" className="text-orange-500 font-black hover:underline">سجل الآن</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          } />

          <Route path="/register" element={
            <div className="max-w-md mx-auto py-20 px-4">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                  <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-black mb-8 text-blue-900">إنشاء حساب جديد</h2>
                <form onSubmit={(e: any) => {
                  e.preventDefault();
                  const data = {
                    name: e.target.username.value,
                    phone: e.target.phone.value,
                    password: e.target.password.value,
                    location: e.target.location.value
                  };
                  if (handleCustomerRegister(data)) window.location.hash = '#/profile';
                }} className="space-y-4">
                  <input name="username" required placeholder="الاسم الكامل" className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-orange-500 font-bold text-center" />
                  <input name="phone" type="tel" required placeholder="رقم الهاتف" className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-orange-500 font-bold text-center" />
                  <input name="location" required placeholder="منطقة السكن" className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-orange-500 font-bold text-center" />
                  <input name="password" type="password" required placeholder="كلمة المرور" className="w-full p-4 rounded-xl border bg-gray-50 outline-none focus:border-orange-500 font-bold text-center" />
                  <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/10">إنشاء الحساب</button>
                  <p className="text-gray-500 font-bold text-sm mt-4">لديك حساب بالفعل؟ <Link to="/login" className="text-blue-900 underline">تسجيل الدخول</Link></p>
                </form>
              </div>
            </div>
          } />

          <Route path="/profile" element={currentUser ? (
              <div className="max-w-4xl mx-auto p-8">
                 <div className="bg-blue-900 text-white p-10 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <h1 className="text-4xl font-black mb-2 relative z-10">{currentUser.name}</h1>
                    <p className="opacity-70 font-bold relative z-10">{currentUser.phone}</p>
                 </div>
                 <h2 className="text-3xl font-black mb-8 text-blue-900 text-right">طلباتك السابقة</h2>
                 <div className="space-y-4">
                   {requests.filter(r => r.customerId === currentUser.id).map(r => (
                     <div key={r.id} className="bg-white p-8 rounded-3xl border flex justify-between items-center shadow-sm">
                        <div className="text-right">
                           <h4 className="font-black text-xl text-blue-950">{r.category}</h4>
                           <p className="text-gray-400 text-sm font-bold">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</p>
                        </div>
                        <span className="px-4 py-1.5 rounded-full font-black text-xs bg-blue-50 text-blue-600">{r.status === 'pending' ? 'قيد المراجعة' : r.status}</span>
                     </div>
                   ))}
                   {requests.filter(r => r.customerId === currentUser.id).length === 0 && (
                    <p className="text-center py-10 text-gray-400 font-bold italic">لا توجد طلبات سابقة</p>
                   )}
                 </div>
              </div>
          ) : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, UserCheck, Settings, Users, ArrowRight, User } from 'lucide-react';
import { AdminAccessRole } from '../types';

interface AdminLoginProps {
  onLogin: (role: AdminAccessRole, pass: string, name: string) => boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [step, setStep] = React.useState<'role' | 'password'>('role');
  const [selectedRole, setSelectedRole] = React.useState<AdminAccessRole | null>(null);
  const [adminName, setAdminName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: AdminAccessRole) => {
    setSelectedRole(role);
    setStep('password');
    setError('');
    setPassword('');
    setAdminName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !adminName.trim()) {
      setError('يرجى إدخال الاسم بالكامل');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // محاكاة عملية التحقق من الهوية (JWT)
    setTimeout(() => {
       if (onLogin(selectedRole, password, adminName)) {
         navigate('/admin');
       } else {
         setError('رمز الأمان غير صحيح لهذا الدور.');
         setIsLoading(false);
       }
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="max-w-xl w-full flex flex-col items-center">
         <div className="mb-8 flex items-center gap-3">
            <div className="bg-blue-900 p-3 rounded-2xl shadow-xl rotate-3">
               <Shield size={32} className="text-orange-500" />
            </div>
            <h2 className="text-4xl font-black text-blue-900">الأسطى <span className="text-orange-500 text-sm font-bold tracking-widest">CONTROL</span></h2>
         </div>

        <div className="w-full bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-[8rem] -z-0"></div>
          
          {step === 'role' ? (
            <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-black text-blue-950">بوابة الإدارة</h1>
                <p className="text-gray-400 font-medium">يرجى تحديد مستوى الصلاحية المطلوب</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleRoleSelect('manager')}
                  className="group p-6 rounded-[2rem] border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50/30 transition-all text-right space-y-3"
                >
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-blue-900">المدير العام (Manager)</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">تحكم كامل في الإعدادات، كلمات المرور، وحظر المستخدمين</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleRoleSelect('staff_admin')}
                  className="group p-6 rounded-[2rem] border-2 border-gray-100 hover:border-blue-600 hover:bg-blue-50/30 transition-all text-right space-y-3"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-blue-900">مشرف (Admin)</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">صلاحيات محدودة لمتابعة الطلبات والشكاوى بدون تعديل الإعدادات</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-right-4">
              <button 
                onClick={() => setStep('role')}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-900 font-bold mb-4 transition-colors group"
              >
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                رجوع للاختيار
              </button>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-800 text-xs font-black">
                  <UserCheck size={14} />
                  {selectedRole === 'manager' ? 'دخول: مدير النظام' : 'دخول: مشرف العمليات'}
                </div>
                <h1 className="text-2xl font-black text-blue-950">بيانات التحقق</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 text-right">
                   <label className="text-sm font-bold text-gray-600 mr-2">الاسم بالكامل</label>
                   <div className="relative group">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                      <input 
                        type="text"
                        required
                        className="w-full p-5 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 outline-none transition-all font-bold text-lg"
                        placeholder="اكتب اسمك هنا..."
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-2 text-right">
                   <label className="text-sm font-bold text-gray-600 mr-2">رمز الأمان</label>
                   <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600" size={20} />
                      <input 
                        type={showPass ? 'text' : 'password'}
                        required
                        disabled={isLoading}
                        className="w-full p-5 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-600 outline-none transition-all font-mono text-lg text-center tracking-widest"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900"
                      >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                   </div>
                   {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-950 transition-all shadow-xl shadow-blue-900/20 mt-4"
                >
                  {isLoading ? (
                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                  ) : (
                     "تأكيد الدخول"
                  )}
                </button>
              </form>
            </div>
          )}
          
          <div className="mt-8 text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest border-t pt-6">
             EL OSTAA • ENTERPRISE MANAGEMENT SYSTEM • 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ShieldCheck, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="flex items-center leading-none">
                  <span className="text-2xl font-black text-blue-900 tracking-tighter">EL OSTAA</span>
                  <span className="text-2xl font-black text-orange-500 mr-2">الأسطى</span>
                </div>
              </Link>
              
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/" className="text-gray-500 hover:text-blue-900 font-bold transition-colors text-sm">الرئيسية</Link>
                <Link to="/request-service" className="text-gray-500 hover:text-blue-900 font-bold transition-colors text-sm">اطلب خدمة</Link>
                <Link to="/technician-signup" className="text-gray-500 hover:text-blue-900 font-bold transition-colors text-sm">انضم كفني</Link>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-6">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-700 font-bold">
                    <User size={18} className="text-blue-900" />
                    <span>{currentUser.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Link to="/login" className="text-blue-800 font-bold text-sm hover:underline decoration-2 underline-offset-4 transition-all">
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                    سجل الآن
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-gray-50 rounded-xl text-blue-900">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-6 space-y-4 animate-in slide-in-from-top-4">
            <Link to="/" className="block text-lg font-black text-blue-950" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
            <Link to="/request-service" className="block text-lg font-black text-blue-950" onClick={() => setIsMenuOpen(false)}>اطلب خدمة</Link>
            <Link to="/technician-signup" className="block text-lg font-black text-blue-950" onClick={() => setIsMenuOpen(false)}>انضم كفني</Link>
            <hr className="border-gray-100" />
            {currentUser ? (
              <>
                <Link to="/profile" className="block text-lg font-black text-blue-900" onClick={() => setIsMenuOpen(false)}>الملف الشخصي</Link>
                <button onClick={handleLogout} className="block w-full text-right text-lg font-black text-red-500">خروج</button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-blue-900 font-black text-center py-2" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
                <Link to="/register" className="bg-orange-500 text-white text-center py-4 rounded-xl font-black" onClick={() => setIsMenuOpen(false)}>سجل الآن</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">الأسطى</span>
              </div>
              <p className="text-blue-200 font-medium leading-relaxed">منصتك الأولى في مصر للحصول على أفضل الفنيين المعتمدين لصيانة منزلك بسهولة وأمان.</p>
            </div>
            <div>
              <h4 className="text-lg font-black mb-6 text-orange-500">روابط سريعة</h4>
              <ul className="space-y-4 text-blue-100 font-bold">
                <li><Link to="/" className="hover:text-white">الرئيسية</Link></li>
                <li><Link to="/request-service" className="hover:text-white">طلب خدمة</Link></li>
                <li><Link to="/technician-signup" className="hover:text-white">انضم كفني</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black mb-6 text-orange-500">الدعم</h4>
              <ul className="space-y-4 text-blue-100 font-bold">
                <li><Link to="#" className="hover:text-white">الأسئلة الشائعة</Link></li>
                <li><Link to="#" className="hover:text-white">سياسة الخصوصية</Link></li>
                <li><Link to="#" className="hover:text-white">شروط الاستخدام</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black mb-6 text-orange-500">تواصل</h4>
              <div className="flex gap-4 justify-end">
                <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-orange-500 transition-all">
                  <MessageCircle size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

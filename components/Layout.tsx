
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, MessageCircle } from 'lucide-react';

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
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                <span className="text-orange-500">الأسطى</span>
                <span className="hidden sm:inline">EL OSTAA</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-blue-800 font-medium">الرئيسية</Link>
                <Link to="/request-service" className="text-gray-600 hover:text-blue-800 font-medium">اطلب خدمة</Link>
                <Link to="/technician-signup" className="text-gray-600 hover:text-blue-800 font-medium">انضم كفني</Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  {currentUser.role === 'admin' && (
                    <Link to="/admin" className="p-2 text-blue-800 hover:bg-blue-50 rounded-full">
                      <LayoutDashboard size={20} />
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User size={18} />
                    <span className="text-sm font-semibold">{currentUser.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 p-2 rounded-full">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-blue-800 font-semibold">تسجيل الدخول</Link>
                  <Link to="/register" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                    سجل الآن
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
            <Link to="/" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
            <Link to="/request-service" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>اطلب خدمة</Link>
            <Link to="/technician-signup" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>انضم كفني</Link>
            <hr />
            {currentUser ? (
              <>
                <Link to="/profile" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>الملف الشخصي</Link>
                {currentUser.role === 'admin' && <Link to="/admin" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>لوحة التحكم</Link>}
                <button onClick={handleLogout} className="block text-lg font-medium text-red-600">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
                <Link to="/register" className="block text-lg font-medium text-orange-500" onClick={() => setIsMenuOpen(false)}>سجل الآن</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-500">الأسطى</h3>
              <p className="text-gray-400">منصتك الأولى في مصر للحصول على أفضل الفنيين المعتمدين لصيانة منزلك بسهولة وأمان.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/">الرئيسية</Link></li>
                <li><Link to="/request-service">طلب خدمة</Link></li>
                <li><Link to="/technician-signup">انضم كفني</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">الدعم والمساعدة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq">الأسئلة الشائعة</Link></li>
                <li><Link to="/privacy">سياسة الخصوصية</Link></li>
                <li><Link to="/terms">شروط الاستخدام</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">تواصل معنا</h4>
              <div className="flex gap-4">
                <a href="https://wa.me/20123456789" className="bg-green-600 p-2 rounded-full hover:bg-green-700 transition-all">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} الأسطى - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

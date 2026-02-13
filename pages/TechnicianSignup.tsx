
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { Briefcase, Camera, Phone, User as UserIcon, MapPin } from 'lucide-react';

interface TechnicianSignupProps {
  onRegister: (tech: any) => void;
}

const TechnicianSignup: React.FC<TechnicianSignupProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    profession: '',
    experience: 0,
    location: '',
    profileImage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'technician',
      status: 'pending'
    });
    alert('تم تقديم طلبك بنجاح! سيتم مراجعته من قبل الإدارة والموافقة عليك خلال 24 ساعة.');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/3 bg-blue-800 p-12 text-white flex flex-col justify-center text-center">
          <div className="bg-white/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Briefcase size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">انضم لفريقنا</h2>
          <p className="text-blue-200">كن جزءاً من أكبر شبكة فنيين محترفين في مصر وابدأ في زيادة دخلك اليوم.</p>
        </div>

        <form onSubmit={handleSubmit} className="md:w-2/3 p-12 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-2"><UserIcon size={18} className="text-orange-500" />الاسم بالكامل</label>
              <input required type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-2"><Phone size={18} className="text-orange-500" />رقم الهاتف</label>
              <input required type="tel" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-2"><Briefcase size={18} className="text-orange-500" />التخصص الرئيسي</label>
              <select required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})}>
                <option value="">اختر تخصصك...</option>
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-bold flex items-center gap-2"><Camera size={18} className="text-orange-500" />سنوات الخبرة</label>
              <input required type="number" min="0" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.experience} onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold flex items-center gap-2"><MapPin size={18} className="text-orange-500" />منطقة العمل (المدينة / الحي)</label>
            <input required type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-2xl text-xl font-bold hover:bg-orange-600 transition-all shadow-xl">
              إرسال طلب الانضمام
            </button>
            <p className="text-center text-gray-400 text-sm mt-4">بضغطك على إرسال، أنت توافق على شروط وأحكام منصة الأسطى.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicianSignup;

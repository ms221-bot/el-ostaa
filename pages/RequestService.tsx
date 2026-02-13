
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { Send, MapPin, ClipboardList } from 'lucide-react';
import TimeSlider from '../components/TimeSlider';

interface RequestServiceProps {
  currentUser: any;
  onSubmitRequest: (request: any) => void;
}

const RequestService: React.FC<RequestServiceProps> = ({ currentUser, onSubmitRequest }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCat = searchParams.get('cat') || '';

  const [formData, setFormData] = React.useState({
    category: initialCat,
    description: '',
    location: currentUser?.location || '',
    preferredTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('يرجى تسجيل الدخول أولاً لطلب الخدمة');
      navigate('/login');
      return;
    }

    if (!formData.preferredTime) {
      alert('يرجى تحديد الموعد المفضل');
      return;
    }
    
    onSubmitRequest({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      customerId: currentUser.id,
      customerName: currentUser.name,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    alert('تم إرسال طلبك بنجاح! سيتواصل معك أقرب أسطى متاح.');
    navigate('/profile');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-800 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <ClipboardList size={120} />
          </div>
          <h2 className="text-4xl font-bold">اطلب فني الآن</h2>
          <p className="text-blue-200 mt-2 text-lg">أخبرنا بما تحتاجه وسنقوم بالباقي</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          <div className="space-y-4">
            <label className="text-xl font-bold flex items-center gap-3 text-blue-900">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
              نوع الخدمة
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, category: cat.name})}
                  className={`p-4 rounded-2xl border-2 transition-all text-center font-bold ${
                    formData.category === cat.name 
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md' 
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-blue-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xl font-bold flex items-center gap-3 text-blue-900">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
              تفاصيل المشكلة
            </label>
            <textarea 
              required
              rows={4}
              placeholder="مثلاً: صنبور المطبخ يسرب ماء، أو عطل في لوحة الكهرباء..."
              className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-xl font-bold flex items-center gap-3 text-blue-900">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">3</span>
              الموقع والموعد
            </label>
            <div className="grid gap-6">
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  required
                  placeholder="الحي، الشارع، رقم الشقة..."
                  className="w-full p-5 pr-12 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <TimeSlider 
                value={formData.preferredTime}
                onChange={(val) => setFormData({...formData, preferredTime: val})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-500 text-white py-6 rounded-2xl text-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center gap-4 active:scale-[0.98]"
          >
            <Send size={24} />
            تأكيد الطلب
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestService;

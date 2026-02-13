
import React from 'react';
import { db } from '../services/firebase';
import { ref, push, onValue, set } from 'firebase/database';
import { Package, User, Hash, Send, Wifi, Clock, ShoppingCart, Loader2 } from 'lucide-react';

interface QuickOrder {
  id?: string;
  customerName: string;
  productName: string;
  quantity: string;
  timestamp: number;
}

const QuickOrders: React.FC = () => {
  const [orders, setOrders] = React.useState<QuickOrder[]>([]);
  const [formData, setFormData] = React.useState({
    customerName: '',
    productName: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // الاستماع للتغييرات في قاعدة البيانات لحظياً
  React.useEffect(() => {
    const ordersRef = ref(db, 'quick_orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([key, value]: [string, any]) => ({
          ...value,
          id: key
        })).sort((a, b) => b.timestamp - a.timestamp); // ترتيب الأحدث فوق
        setOrders(orderList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.productName || !formData.quantity) return;

    setIsSubmitting(true);
    try {
      const ordersRef = ref(db, 'quick_orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, {
        ...formData,
        timestamp: Date.now()
      });
      // تصفير الحقول بعد الإرسال
      setFormData({ customerName: '', productName: '', quantity: '' });
    } catch (error) {
      console.error("Firebase Submit Error:", error);
      alert("عذراً، حدث خطأ أثناء إرسال الأوردر.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="text-right">
          <h1 className="text-4xl font-black text-blue-900 flex items-center gap-4">
             شاشة الأوردرات المباشرة 
             <span className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-full animate-pulse">
                <Wifi size={20} />
             </span>
          </h1>
          <p className="text-gray-500 font-bold mt-2">نظام Firebase المتزامن - البيانات تظهر عند الجميع في نفس الثانية</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3">
           <ShoppingCart className="text-orange-500" />
           <span className="font-black text-blue-900">إجمالي الأوردرات: {orders.length}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        {/* نموذج الإضافة */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-orange-500 p-3 rounded-2xl text-white">
               <Send size={24} />
            </div>
            <h3 className="text-xl font-black text-blue-950">أضف أوردر جديد</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 mr-2">اسم العميل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="مثلاً: محمد السويفي"
                  className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-800 outline-none transition-all font-bold"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 mr-2">اسم المنتج</label>
              <div className="relative group">
                <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="مثلاً: سخان غاز 10 لتر"
                  className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-800 outline-none transition-all font-bold"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 mr-2">الكمية</label>
              <div className="relative group">
                <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  required
                  type="number" 
                  min="1"
                  placeholder="1"
                  className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-800 outline-none transition-all font-bold"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "إرسال الآن"}
            </button>
          </form>
        </div>

        {/* عرض الأوردرات */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-gray-400 gap-4 border border-dashed">
               <Loader2 className="animate-spin" size={48} />
               <p className="font-bold">جاري مزامنة البيانات من السيرفر...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="p-6">العميل</th>
                      <th className="p-6">المنتج والكمية</th>
                      <th className="p-6">وقت التسجيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-blue-50/30 transition-all animate-in slide-in-from-right-2">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">
                                {order.customerName.charAt(0)}
                             </div>
                             <span className="font-black text-blue-950">{order.customerName}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                             <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-black">
                               {order.productName}
                             </span>
                             <span className="text-gray-400 font-bold">× {order.quantity}</span>
                          </div>
                        </td>
                        <td className="p-6">
                           <div className="flex flex-col text-[10px] text-gray-400 font-black">
                             <span className="flex items-center gap-1"><Clock size={10} /> {new Date(order.timestamp).toLocaleTimeString('ar-EG')}</span>
                             <span>{new Date(order.timestamp).toLocaleDateString('ar-EG')}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-24 text-center">
                           <div className="flex flex-col items-center gap-4 text-gray-300">
                              <Package size={64} className="opacity-20" />
                              <p className="text-xl font-black italic">السجل فارغ حالياً، بانتظار أول أوردر...</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickOrders;

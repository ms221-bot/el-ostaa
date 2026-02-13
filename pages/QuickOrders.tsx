
import React from 'react';
import { rtdb } from '../services/firebase';
import { ref, push, onValue, set } from 'firebase/database';
import { Package, User, Hash, Send, Wifi, Clock, ShoppingCart, Loader2, ListChecks } from 'lucide-react';

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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // تصحيح: استخدام rtdb (الخاص بـ Realtime Database) بدلاً من firestore
    const ordersRef = ref(rtdb, 'quick_orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([key, value]: [string, any]) => ({
          ...value,
          id: key
        })).sort((a, b) => b.timestamp - a.timestamp);
        setOrders(orderList);
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.productName || !formData.quantity) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const ordersRef = ref(rtdb, 'quick_orders');
      const newOrderRef = push(ordersRef);
      
      await set(newOrderRef, {
        customerName: formData.customerName,
        productName: formData.productName,
        quantity: formData.quantity,
        timestamp: Date.now()
      });

      setFormData({ customerName: '', productName: '', quantity: '' });
    } catch (error) {
      console.error("Firebase RTDB Error:", error);
      alert("حدث خطأ أثناء الاتصال. يرجى التأكد من إعدادات الـ Database Rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="text-right">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-blue-900">سجل الأوردرات المباشر</h1>
            <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
              <Wifi size={12} /> متصل لحظياً
            </span>
          </div>
          <p className="text-gray-500 font-bold">نظام الربط السحابي Realtime Database مفعل</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
            <p className="text-[10px] font-black text-blue-400 uppercase">إجمالي الطلبات</p>
            <p className="text-2xl font-black text-blue-900">{orders.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-black text-blue-950">إضافة أوردر جديد</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest">اسم العميل</label>
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder="مثلاً: م/ إبراهيم خالد"
                    className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-800 outline-none transition-all font-bold text-blue-950"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest">اسم المنتج</label>
                <div className="relative group">
                  <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder="مثلاً: طقم صيانة تكييف"
                    className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-800 outline-none transition-all font-bold text-blue-950"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-2 uppercase tracking-widest">الكمية</label>
                <div className="relative group">
                  <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    required
                    type="number" 
                    min="1"
                    className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-800 outline-none transition-all font-bold text-blue-950"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-950 shadow-xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                <span>{isSubmitting ? "جاري الحفظ..." : "تسجيل الأوردر"}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="bg-white rounded-[3rem] p-32 flex flex-col items-center justify-center text-blue-200 border-2 border-dashed">
               <Loader2 className="animate-spin mb-4" size={48} />
               <p className="font-black text-blue-900">جاري مزامنة قاعدة البيانات...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gray-50/50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-black">
                  <ListChecks size={20} className="text-orange-500" />
                  قائمة الأوردرات المستلمة
                </div>
                <div className="text-[10px] font-bold text-gray-400">تحديث لحظي فعال</div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-100/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="p-6">العميل</th>
                      <th className="p-6">المنتج</th>
                      <th className="p-6">الكمية</th>
                      <th className="p-6">التوقيت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-blue-50/20 transition-all animate-in slide-in-from-left-4">
                        <td className="p-6">
                             <span className="font-black text-blue-950">{order.customerName}</span>
                        </td>
                        <td className="p-6">
                          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-sm font-black border border-blue-100">
                             {order.productName}
                          </span>
                        </td>
                        <td className="p-6">
                           <span className="text-xl font-black text-orange-600">{order.quantity}</span>
                        </td>
                        <td className="p-6">
                           <div className="flex flex-col text-[10px] text-gray-400 font-bold">
                             <span className="flex items-center gap-1 text-blue-600"><Clock size={10} /> {new Date(order.timestamp).toLocaleTimeString('ar-EG')}</span>
                             <span>{new Date(order.timestamp).toLocaleDateString('ar-EG')}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
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

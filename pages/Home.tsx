
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import * as LucideIcons from 'lucide-react';

interface HomeProps {
  settings: {
    heroHeadline: string;
    heroSubtext: string;
  }
}

const Home: React.FC<HomeProps> = ({ settings }) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.3]"
            alt="Hero Background"
          />
          <div className="absolute inset-0 blue-orange-gradient opacity-70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center md:text-right">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight drop-shadow-2xl">
              {settings.heroHeadline.split(' ').map((word, i) => 
                word === 'أسطى' ? <span key={i} className="text-orange-400"> {word} </span> : <span key={i}>{word} </span>
              )}
            </h1>
            <p className="text-xl md:text-3xl mb-12 text-blue-50 font-medium max-w-2xl opacity-90 leading-relaxed">
              {settings.heroSubtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <Link 
                to="/request-service" 
                className="bg-orange-500 text-white px-12 py-5 rounded-2xl text-2xl font-black hover:bg-orange-600 transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/40"
              >
                اطلب خدمة الآن
              </Link>
              <Link 
                to="/technician-signup" 
                className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-12 py-5 rounded-2xl text-2xl font-black hover:bg-white hover:text-blue-900 transition-all shadow-xl"
              >
                انضم كفني
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-blue-900 mb-6">ماذا تحتاج اليوم؟</h2>
          <p className="text-2xl text-gray-500 font-bold">نحن هنا لمساعدتك في كل ركن من أركان منزلك</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {CATEGORIES.map((cat) => {
            const IconComponent = (LucideIcons as any)[cat.icon];
            return (
              <Link 
                key={cat.id} 
                to={`/request-service?cat=${cat.id}`}
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-gray-50 text-center flex flex-col items-center gap-6 transform hover:-translate-y-2"
              >
                <div className="p-6 bg-blue-50 text-blue-600 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all rotate-3 group-hover:rotate-0">
                  {IconComponent && <IconComponent size={40} />}
                </div>
                <h3 className="font-black text-2xl text-blue-900">{cat.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="text-3xl font-black text-gray-400">ضمان سنة</div>
             <div className="text-3xl font-black text-gray-400">فنيون معتمدون</div>
             <div className="text-3xl font-black text-gray-400">دعم 24/7</div>
             <div className="text-3xl font-black text-gray-400">أرخص الأسعار</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-blue-900 text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-6">
              <div className="bg-orange-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-6 shadow-xl shadow-orange-500/20">
                <LucideIcons.ShieldCheck size={40} />
              </div>
              <h3 className="text-3xl font-black">أمان تام</h3>
              <p className="text-blue-100 text-lg leading-relaxed">نقوم بمراجعة كافة السجلات الجنائية والمهنية لكل فني قبل اعتماده في منصتنا.</p>
            </div>
            <div className="space-y-6">
              <div className="bg-orange-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 -rotate-6 shadow-xl shadow-orange-500/20">
                <LucideIcons.Clock size={40} />
              </div>
              <h3 className="text-3xl font-black">دقة في المواعيد</h3>
              <p className="text-blue-100 text-lg leading-relaxed">نظامنا الذكي يضمن وصول الفني إليك في الدقيقة المحددة، لا انتظار بعد اليوم.</p>
            </div>
            <div className="space-y-6">
              <div className="bg-orange-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-6 shadow-xl shadow-orange-500/20">
                <LucideIcons.Star size={40} />
              </div>
              <h3 className="text-3xl font-black">تقييمات حقيقية</h3>
              <p className="text-blue-100 text-lg leading-relaxed">يمكنك الاطلاع على آلاف التقييمات من جيرانك لاختيار الأسطى الأنسب لك.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-[3rem] p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-orange-500/30">
          <div className="text-center lg:text-right max-w-2xl">
            <h2 className="text-5xl font-black mb-6 leading-tight">هل تمتلك مهارة فنية؟</h2>
            <p className="text-2xl text-orange-100 font-medium">انضم الآن لآلاف الفنيين الناجحين وابدأ في استقبال الطلبات في منطقتك بضغطة زر واحدة.</p>
          </div>
          <Link to="/technician-signup" className="bg-white text-orange-600 px-16 py-6 rounded-2xl font-black text-3xl hover:bg-gray-100 shadow-2xl whitespace-nowrap transform transition-all hover:scale-105 active:scale-95">
            ابدأ الربح الآن
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

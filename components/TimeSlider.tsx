
import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

interface TimeSliderProps {
  value: string;
  onChange: (val: string) => void;
}

const PRESETS = [
  { id: 'now', label: 'الآن', sub: 'فوري', icon: '⚡' },
  { id: '1h', label: 'خلال ساعة', sub: 'مستعجل', icon: '🕐' },
  { id: 'today_pm', label: 'اليوم مساءً', sub: 'بعد 6م', icon: '🌙' },
  { id: 'tomorrow_am', label: 'غداً صباحاً', sub: '9ص - 12ظ', icon: '☀️' },
];

const SLOTS = [
  { label: 'صباحاً', range: '8ص - 11ص' },
  { label: 'ظهراً', range: '11ص - 2ظ' },
  { label: 'عصراً', range: '2ظ - 5ع' },
  { label: 'مساءً', range: '5ع - 9م' },
  { label: 'ليلاً', range: '9م - 12ص' },
];

const TimeSlider: React.FC<TimeSliderProps> = ({ value, onChange }) => {
  const [activePreset, setActivePreset] = React.useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = React.useState(2);

  const handlePreset = (id: string, label: string) => {
    setActivePreset(id);
    onChange(label);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    setSliderIndex(idx);
    setActivePreset(null);
    onChange(`${SLOTS[idx].label} (${SLOTS[idx].range})`);
  };

  return (
    <div className="space-y-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
      <div className="space-y-4">
        <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-orange-500" />
          اختيار سريع
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePreset(p.id, p.label)}
              className={`p-4 rounded-2xl border-2 transition-all text-right flex flex-col gap-1 ${
                activePreset === p.id 
                  ? 'border-orange-500 bg-orange-50 text-orange-900' 
                  : 'border-white bg-white hover:border-blue-200 text-gray-700'
              }`}
            >
              <span className="text-xl">{p.icon}</span>
              <span className="font-bold">{p.label}</span>
              <span className="text-xs opacity-60">{p.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-blue-900">تحديد موعد محدد</label>
          <span className="text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-full text-xs">
            {SLOTS[sliderIndex].range}
          </span>
        </div>
        
        <div className="relative pt-6 pb-2">
          <input 
            type="range"
            min="0"
            max={SLOTS.length - 1}
            step="1"
            value={sliderIndex}
            onChange={handleSlider}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-4 px-1">
            {SLOTS.map((slot, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-1 h-1 rounded-full ${sliderIndex === i ? 'bg-orange-500' : 'bg-gray-300'}`} />
                <span className={`text-[10px] font-bold ${sliderIndex === i ? 'text-orange-600' : 'text-gray-400'}`}>
                  {slot.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg"><Clock size={20} /></div>
          <div>
            <p className="text-[10px] opacity-70">الموعد المحدد</p>
            <p className="font-bold">{value || 'بانتظار الاختيار...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;

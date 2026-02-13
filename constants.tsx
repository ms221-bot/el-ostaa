
import React from 'react';
import { Hammer, Zap, Droplets, PenTool, Tv, ShieldCheck } from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'plumber', name: 'سباك', icon: 'Droplets', description: 'إصلاح التسريبات وتركيب الأدوات الصحية' },
  { id: 'electrician', name: 'كهربائي', icon: 'Zap', description: 'صيانة الكهرباء وتركيب الإنارة' },
  { id: 'carpenter', name: 'نجار', icon: 'Hammer', description: 'فك وتركيب الأثاث وإصلاح الأبواب' },
  { id: 'technician', name: 'فني أجهزة', icon: 'Tv', description: 'صيانة الغسالات، الثلاجات، والتكييف' },
  { id: 'painter', name: 'نقاش', icon: 'PenTool', description: 'أعمال الدهانات والديكور' },
  { id: 'security', name: 'فني كاميرات', icon: 'ShieldCheck', description: 'تركيب أنظمة المراقبة والإنذار' },
];

export const COLORS = {
  primary: '#1e40af', // Blue 800
  secondary: '#f97316', // Orange 500
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserHealthData } from '../types';
import { ChevronRight, FlaskConical, Activity, Microscope, User as UserIcon } from 'lucide-react';

interface PrognosisFormProps {
  onSubmit: (data: UserHealthData) => void;
}

export function PrognosisForm({ onSubmit }: PrognosisFormProps) {
  const [formData, setFormData] = useState<Partial<UserHealthData>>({
    cycleStatus: 'regular',
    isPregnant: false,
    weightGain: false,
    hairGrowth: false,
    skinDarkening: false,
    hairLoss: false,
    pimples: false,
    fastFood: false,
    regExercise: false,
    maternalPmosHistory: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as UserHealthData);
  };

  const updateField = (field: keyof UserHealthData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate BMI if height/weight change
      if (field === 'height' || field === 'weight') {
        const h = field === 'height' ? value : prev.height;
        const w = field === 'weight' ? value : prev.weight;
        if (h && w && h > 0) newData.bmi = Number((w / ((h/100) * (h/100))).toFixed(1));
      }
      return newData;
    });
  };

  const toggleField = (field: keyof UserHealthData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const inputClass = "w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-1 focus:ring-gray-900 outline-none transition-all shadow-sm text-sm font-bold placeholder:text-gray-300";
  const labelClass = "text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-20 pb-40 px-1">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-serif text-4xl font-black italic tracking-tighter text-gray-900 leading-none">ProgMOS</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Precision Metabolic Analysis</p>
        </div>
      </div>

      {/* 01: Biometrics */}
      <section>
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-2">
          <UserIcon size={14} className="text-gray-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">01 Biometrics & Core</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className={labelClass}>Age (yrs)</label>
            <input type="number" placeholder="28" value={formData.age || ''} onChange={e => updateField('age', Number(e.target.value))} className={inputClass} required />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Weight (kg)</label>
            <input type="number" placeholder="65" value={formData.weight || ''} onChange={e => updateField('weight', Number(e.target.value))} className={inputClass} required />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Height (cm)</label>
            <input type="number" placeholder="165" value={formData.height || ''} onChange={e => updateField('height', Number(e.target.value))} className={inputClass} required />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Hemoglobin (g/dL)</label>
            <input type="number" step="0.1" placeholder="12.5" value={formData.hemoglobin || ''} onChange={e => updateField('hemoglobin', Number(e.target.value))} className={inputClass} />
          </div>
        </div>
      </section>

      {/* 02: Endocrine Panel */}
      <section>
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-2">
          <FlaskConical size={14} className="text-gray-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">02 Clinical Lab Markers</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'AMH (ng/mL)', key: 'amh', placeholder: '2.5' },
            { label: 'FSH (mIU/mL)', key: 'fsh', placeholder: '5.0' },
            { label: 'LH (mIU/mL)', key: 'lh', placeholder: '6.0' },
            { label: 'Prolactin (ng/mL)', key: 'prolactin', placeholder: '15.0' },
            { label: 'Vitamin D3 (ng/mL)', key: 'vitD3', placeholder: '35.0' },
            { label: 'TSH (mIU/L)', key: 'tsh', placeholder: '2.0' },
          ].map(f => (
            <div key={f.key}>
              <label className={labelClass}>{f.label} [Opt]</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder={f.placeholder} 
                value={formData[f.key as keyof UserHealthData] as number || ''} 
                onChange={e => updateField(f.key as keyof UserHealthData, e.target.value === '' ? undefined : Number(e.target.value))} 
                className={inputClass} 
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-[8px] text-gray-400 uppercase font-bold tracking-wider leading-relaxed">
          * Empty lab values will be intelligently imputed using the KNN similarity engine based on your biometrics.
        </p>
      </section>

      {/* 03: Reproductive & Imaging */}
      <section>
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-2">
          <Microscope size={14} className="text-gray-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">03 Reproductive & Imaging</h3>
        </div>
        <div className="space-y-8">
          <div>
            <label className={labelClass}>Menstrual Cycle Status</label>
            <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
              {(['regular', 'irregular'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateField('cycleStatus', s)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.cycleStatus === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Cycle Length (days)</label>
              <input type="number" placeholder="28" value={formData.cycleLength || ''} onChange={e => updateField('cycleLength', Number(e.target.value))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Endometrium (mm)</label>
              <input type="number" step="0.1" placeholder="8.5" value={formData.endometriumThickness || ''} onChange={e => updateField('endometriumThickness', Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Left Follicle Count</label>
              <input type="number" placeholder="6" value={formData.follicleCountL || ''} onChange={e => updateField('follicleCountL', Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Right Follicle Count</label>
              <input type="number" placeholder="6" value={formData.follicleCountR || ''} onChange={e => updateField('follicleCountR', Number(e.target.value))} className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* 04: Physical Symptoms & Lifestyle */}
      <section>
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-2">
          <Activity size={14} className="text-gray-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">04 Symptom Phenotypes</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { key: 'weightGain', label: 'Unexplained Weight Gain' },
            { key: 'hairGrowth', label: 'Clinical Hirsutism (Hair Growth)' },
            { key: 'skinDarkening', label: 'Skin Darkening (Acanthosis)' },
            { key: 'hairLoss', label: 'Clinical Hair Loss' },
            { key: 'pimples', label: 'Persistent Adult Acne' },
            { key: 'fastFood', label: 'High Fast Food Frequency' },
            { key: 'regExercise', label: 'Regular Physical Exercise' },
            { key: 'maternalPmosHistory', label: 'Maternal Family History' },
          ].map(s => (
            <button
              key={s.key}
              type="button"
              onClick={() => toggleField(s.key as keyof UserHealthData)}
              className={`p-5 rounded-2xl flex items-center justify-between transition-all border ${
                formData[s.key as keyof UserHealthData] ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-900 border-gray-100'
              }`}
            >
              <span className="font-bold text-[11px] tracking-tight uppercase">{s.label}</span>
              <div className={`w-5 h-5 rounded-md border-2 ${formData[s.key as keyof UserHealthData] ? 'border-white bg-white/20' : 'border-gray-200'}`}>
                {formData[s.key as keyof UserHealthData] && <div className="w-full h-full flex items-center justify-center text-[10px]">✓</div>}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="fixed bottom-24 left-8 right-8 z-20">
        <button 
          type="submit"
          className="w-full bg-gray-900 text-white p-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform"
        >
          Compute Deep Analysis <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>
    </form>
  );
}

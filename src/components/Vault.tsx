/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserHealthData } from '../types';
import { Database, ShieldCheck, Clock, Activity, Fingerprint } from 'lucide-react';

interface VaultProps {
  data: UserHealthData | null;
}

export function Vault({ data }: VaultProps) {
  const metrics = data ? [
    { label: 'BMI Index', value: data.bmi || '0.0', icon: <Activity size={16} /> },
    { label: 'Hemoglobin', value: `${data.hemoglobin || '0.0'} g/dL`, icon: <Activity size={16} /> },
    { label: 'AMH Level', value: `${data.amh || '0.0'} ng/mL`, icon: <Fingerprint size={16} /> },
    { label: 'LH/FSH', value: ((data.lh || 0) / (data.fsh || 1) || 0).toFixed(1), icon: <Activity size={16} /> },
    { label: 'Beta-HCG I', value: data.betaHCG_I || '0.0', icon: <Activity size={16} /> },
    { label: 'Marriage Yrs', value: data.marriageStatusYears || '0', icon: <Fingerprint size={16} /> },
    { label: 'L. Follicles', value: data.follicleCountL || 0, icon: <Fingerprint size={16} /> },
    { label: 'R. Follicles', value: data.follicleCountR || 0, icon: <Fingerprint size={16} /> },
  ] : [];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="font-serif text-3xl font-black italic tracking-tighter text-gray-900 leading-none">Security Vault</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Encrypted on-device hardware</p>
        </div>
      </div>

      {!data ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Database size={32} className="text-gray-300" />
          </div>
          <h3 className="font-serif text-2xl italic font-black mb-2">Vault Empty</h3>
          <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest font-bold">
            Complete an assessment to store encrypted health data.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Secure Storage</p>
            <h2 className="font-serif text-3xl font-light italic leading-tight">Biometric<br/>Identity</h2>
          </div>
          <ShieldCheck className="text-green-400" size={32} />
        </div>
        <div className="mt-8 flex gap-2">
          <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">
            AES-256
          </div>
          <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">
            Local Only
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-1">Decrypted Metadata</h3>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div 
              key={m.label}
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm"
            >
              <div className="text-gray-300 mb-3">{m.icon}</div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{m.label}</p>
              <p className="text-xl font-black italic font-serif text-gray-900">{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-gray-50 pb-2">Full Diagnostic Insight</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
             <span>Cycle Stability</span>
             <span className={(data.cycleStatus || 'regular') !== 'regular' ? 'text-red-500' : 'text-green-500'}>
                {(data.cycleStatus || 'regular').toUpperCase()}
             </span>
          </div>
          <div className="w-full h-1 bg-gray-50 rounded-full">
            <div className={`h-full rounded-full ${data.cycleStatus === 'irregular' ? 'w-full bg-red-400' : 'w-full bg-green-400'}`} />
          </div>

          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
             <span>Family Risk Factor</span>
             <span className={data.maternalPmosHistory ? 'text-indigo-500' : 'text-green-500'}>
                {data.maternalPmosHistory ? 'ELEVATED' : 'LOW'}
             </span>
          </div>
        </div>
      </section>

        </>
      )}

      <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 leading-relaxed">
          Sensitive clinical data is never synchronized with the cloud. All analysis occurs on device hardware.
        </p>
      </div>
    </div>
  );
}

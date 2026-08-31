/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Trophy, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'prognosis' | 'wellness' | 'profile';
  setActiveTab: (tab: 'prognosis' | 'wellness' | 'profile') => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-gray-900 flex flex-col font-sans">
      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 pt-12 pb-32 overflow-y-auto scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 bg-white border border-gray-100 rounded-[2.5rem] px-10 flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-20">
        <button 
          onClick={() => setActiveTab('prognosis')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'prognosis' ? 'text-gray-900 scale-110' : 'text-gray-300'}`}
        >
          <Home size={18} strokeWidth={activeTab === 'prognosis' ? 3 : 2} className="mb-0.5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('wellness')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'wellness' ? 'text-gray-900 scale-110' : 'text-gray-300'}`}
        >
          <Trophy size={18} strokeWidth={activeTab === 'wellness' ? 3 : 2} className="mb-0.5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Goals</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-gray-900 scale-110' : 'text-gray-300'}`}
        >
          <Shield size={18} strokeWidth={activeTab === 'profile' ? 3 : 2} className="mb-0.5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Vault</span>
        </button>
      </nav>
      
      {/* Device Handle */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 bg-gray-200 rounded-full z-30" />
    </div>
  );
}

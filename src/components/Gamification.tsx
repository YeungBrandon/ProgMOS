/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GamificationStats, WellnessGoal } from '../types';
import { Flame, Star, Trophy, CircleCheck, Circle, Share2 } from 'lucide-react';

interface GamificationProps {
  stats: GamificationStats;
  goals: WellnessGoal[];
  onToggleGoal: (id: string) => void;
  onOpenChest: () => void;
  onShare: () => void;
}

export function Gamification({ stats, goals, onToggleGoal, onOpenChest, onShare }: GamificationProps) {
  const points = stats?.points || 0;
  const pointsToNextLevel = 100 - (points % 100);
  const progressPercent = points % 100;
  
  const communityGoal = 10000;
  const contributionXP = stats?.communityContributionXP || 0;
  const communityProgress = Math.min(100, (contributionXP / communityGoal) * 100);

  if (!stats || !goals) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Data...</p>
      </div>
    );
  }

  // Final defensive check for sub-arrays
  const mysteryRewards = stats.mysteryRewards || [];
  const achievements = stats.achievements || [];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="font-serif text-3xl font-black italic tracking-tighter text-gray-900 leading-none">Goals</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Reclaim your metabolic health</p>
        </div>
        <button 
          onClick={onShare}
          className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
          title="Share Rank"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Epic Meaning & Calling */}
      <section className="bg-gray-900 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] text-white overflow-hidden relative group">
        <div className="relative z-10">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2">The Global Collective</p>
          <h2 className="font-serif text-xl md:text-2xl font-light italic leading-tight mb-4">Empowering Clinical Research.</h2>
          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-indigo-200/60 uppercase">Community Milestone</span>
                <span className="text-lg font-black">{stats.communityContributionXP || 0} XP Contributed</span>
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${communityProgress}%` }}
                  className="h-full bg-indigo-400 transition-all duration-1000"
                />
             </div>
             <p className="text-[9px] font-bold text-indigo-200/40 uppercase tracking-widest text-center">
                Your data helps build a more accurate metabolic risk model for everyone.
             </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      </section>

      {/* Development & Accomplishment: Tier Progress */}
      <section className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl shadow-lg transition-transform">
              {(stats.level || 1) >= 5 ? '👑' : (stats.level || 1) >= 3 ? '⚔️' : '🛡️'}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Global Rank</p>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Level {stats.level || 1} Protector</h3>
            </div>
          </div>
        </div>
        
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-50 border border-gray-100 mb-6">
          <div 
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gray-900 transition-all duration-1000"
          />
        </div>
        
        <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic">
          {pointsToNextLevel} XP remaining. Gain points by logging wellness goals and clinical updates.
        </p>
      </section>

      {/* Loss & Avoidance: Streak Protection */}
      <div className="px-1 flex items-center justify-between gap-4">
          <div className="flex-1 bg-orange-50 border border-orange-100/50 p-4 rounded-2xl flex items-center gap-3">
             <Flame size={20} className="text-orange-500" />
             <div>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-tight">{stats.streak || 0} Day Hot Streak</p>
                <p className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter">Log a goal to keep it alive</p>
             </div>
          </div>
          <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${stats.streakProtectionActive ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
             <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stats.streakProtectionActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                🛡️
             </div>
             <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-tight ${stats.streakProtectionActive ? 'text-indigo-600' : 'text-gray-400'}`}>Protection</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{stats.streakProtectionActive ? 'Active Today' : 'Inactive'}</p>
             </div>
          </div>
      </div>

      {/* Unpredictability & Curiosity: Mystery Chest */}
      {!stats.dailyChestOpened && (
        <button
          onClick={onOpenChest}
          className="w-full bg-indigo-900 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex items-center justify-between group active:scale-[0.98] transition-transform"
        >
          <div className="relative z-10 text-left">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Mystery Opportunity</p>
            <h4 className="text-xl font-serif italic font-light">The Curious<br/>Wellness Vault</h4>
          </div>
          <div className="relative z-10">
             <span className="text-4xl block animate-bounce">
               🎁
             </span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </button>
      )}

      {/* Mystery Reward History */}
      {mysteryRewards.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Curiosity Unlocks</h3>
          <div className="space-y-3">
             {mysteryRewards.slice(-2).map((reward) => (
                <div key={reward.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">
                      {reward.type === 'recipe' ? '🥗' : reward.type === 'audio' ? '🎧' : '✨'}
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-gray-900 tracking-tight">{reward.title}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{reward.description}</p>
                   </div>
                </div>
             ))}
          </div>
        </section>
      )}

      {/* Development & Accomplishment: Achievements */}
      {achievements.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-1">Milestone Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div 
                key={ach.id}
                className={`p-4 rounded-[2rem] border flex flex-col items-center text-center transition-all ${
                  ach.unlocked 
                    ? 'bg-white border-gray-100 shadow-md scale-105' 
                    : 'bg-gray-50 border-transparent opacity-30 grayscale'
                }`}
              >
                <span className="text-2xl mb-2">{ach.icon}</span>
                <p className="text-[9px] font-black uppercase tracking-tight text-gray-900 leading-none mb-1">{ach.title}</p>
                {ach.unlocked && <span className="text-[7px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-1.5 rounded">Unlocked</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scarcity & Impatience */}
      <section>
        <div className="flex items-end justify-between mb-6 px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Daily Frontier Goals</h3>
          <div className="text-[8px] font-extrabold tracking-widest text-gray-400 uppercase">
             Expires at Midnight
          </div>
        </div>
        <div className="space-y-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => onToggleGoal(goal.id)}
              className={`w-full flex items-center justify-between rounded-[2rem] border transition-all p-6 shadow-sm active:scale-[0.98] ${
                goal.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <p className={`text-sm font-black tracking-tight transition-colors ${goal.completed ? 'text-gray-300' : 'text-gray-900'}`}>
                  {goal.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    +{goal.points} XP
                   </p>
                   {goal.type === 'limited' && <span className="text-[7px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-1.5 rounded">Expiring Soon</span>}
                </div>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all ${
                goal.completed ? 'bg-gray-900 border-gray-900 shadow-inner' : 'border-gray-100 bg-white'
              }`}>
                {goal.completed ? <span className="text-xs text-white font-bold">✓</span> : <Circle size={14} className="text-gray-200" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Social Influence */}
      <section className="bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem]">
         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 italic">Metabolic Peer Rank</h3>
         <div className="space-y-4">
            {[
              { name: 'You', points: points, active: true },
              { name: 'Pioneer-402', points: points + 450, active: false },
              { name: 'Pioneer-891', points: points + 120, active: false },
            ].sort((a, b) => b.points - a.points).map((user, i) => (
              <div key={user.name} className={`flex justify-between items-center ${user.active ? 'opacity-100' : 'opacity-40'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400">#0{i + 1}</span>
                  <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{user.name}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-900">{user.points} XP</span>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PrognosisForm } from './components/PrognosisForm';
import { ResultCard } from './components/ResultCard';
import { Gamification } from './components/Gamification';
import { Vault } from './components/Vault';
import { UserHealthData, RiskPrognosis, GamificationStats, WellnessGoal, Achievement, MysteryReward } from './types';
import { calculatePMOSRisk } from './utils/prognosis';

const INITIAL_GOALS: WellnessGoal[] = [
  { id: '1', title: '30 min brisk walk', completed: false, points: 20, type: 'daily' },
  { id: '2', title: 'Low-GI breakfast', completed: false, points: 15, type: 'daily' },
  { id: '3', title: 'Cycle check-in', completed: false, points: 10, type: 'limited' },
  { id: '4', title: 'Hydration (2L)', completed: false, points: 10, type: 'daily' },
  { id: '5', title: 'Resistance Training (15 min)', completed: false, points: 25, type: 'daily' },
  { id: '6', title: 'Mindfulness / Deep Breathing', completed: false, points: 15, type: 'daily' },
  { id: '7', title: 'High Fiber Dinner', completed: false, points: 15, type: 'daily' },
  { id: '8', title: 'Zero Processed Sugar Day', completed: false, points: 30, type: 'daily' },
  { id: '9', title: 'Sleep Hygiene (7-8h)', completed: false, points: 20, type: 'daily' },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'streak-3', title: 'Consistency King', description: 'Maintain a 3-day wellness streak', icon: '🔥', requirementValue: 3, requirementType: 'streak', unlocked: false },
  { id: 'points-500', title: 'Metric Master', description: 'Reach 500 XP in health tracking', icon: '🔬', requirementValue: 500, requirementType: 'points', unlocked: false },
  { id: 'goals-10', title: 'Goal Crusher', description: 'Complete 10 total wellness goals', icon: '🎯', requirementValue: 10, requirementType: 'goals', unlocked: false },
];

const INITIAL_STATS: GamificationStats = {
  streak: 0,
  points: 0,
  lastCheckIn: new Date().toISOString(),
  completedGoals: [],
  level: 1,
  inventory: ['🌱'],
  unlockedTiers: ['Bronze'],
  dailyChestOpened: false,
  streakProtectionActive: false,
  communityContributionXP: 0,
  mysteryRewards: [],
  achievements: INITIAL_ACHIEVEMENTS,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'prognosis' | 'wellness' | 'profile'>('prognosis');
  const [healthData, setHealthData] = useState<UserHealthData | null>(null);
  const [result, setResult] = useState<RiskPrognosis | null>(null);
  const [stats, setStats] = useState<GamificationStats>(INITIAL_STATS);
  const [goals, setGoals] = useState<WellnessGoal[]>(INITIAL_GOALS);

  // Load from Local Storage
  useEffect(() => {
    const savedStats = localStorage.getItem('pmos_stats');
    const savedGoals = localStorage.getItem('pmos_goals');
    const savedHealth = localStorage.getItem('pmos_health');

    if (savedStats) {
      try {
        const parsedStats: GamificationStats = JSON.parse(savedStats);
        
        // Extremely defensive merge
        const mergedStats: GamificationStats = {
          ...INITIAL_STATS,
          ...parsedStats,
          // Ensure arrays are never null/undefined
          completedGoals: Array.isArray(parsedStats.completedGoals) ? parsedStats.completedGoals : INITIAL_STATS.completedGoals,
          inventory: Array.isArray(parsedStats.inventory) ? parsedStats.inventory : INITIAL_STATS.inventory,
          mysteryRewards: Array.isArray(parsedStats.mysteryRewards) ? parsedStats.mysteryRewards : INITIAL_STATS.mysteryRewards,
          achievements: Array.isArray(parsedStats.achievements) ? parsedStats.achievements : INITIAL_STATS.achievements,
          unlockedTiers: Array.isArray(parsedStats.unlockedTiers) ? parsedStats.unlockedTiers : INITIAL_STATS.unlockedTiers,
        };
        
        const today = new Date().toDateString();
        const lastCheckInValue = mergedStats.lastCheckIn || new Date().toISOString();
        const lastCheck = new Date(lastCheckInValue).toDateString();
        
        // Reset chest if new day
        if (lastCheck !== today) {
          mergedStats.dailyChestOpened = false;
          mergedStats.streakProtectionActive = (mergedStats.streak || 0) >= 5;
          setGoals(INITIAL_GOALS);
        }
        
        setStats(mergedStats);
      } catch (e) {
        console.error('Failed to parse saved stats', e);
      }
    }

    if (savedHealth) {
      const health = JSON.parse(savedHealth);
      setHealthData(health);
      // Not setting result to ensure app opens with a fresh assessment form
    }
  }, []);

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('pmos_stats', JSON.stringify(stats));
    localStorage.setItem('pmos_goals', JSON.stringify(goals));
  }, [stats, goals]);

  const handlePrognosisSubmit = (data: UserHealthData) => {
    const risk = calculatePMOSRisk(data);
    setHealthData(data);
    setResult(risk);
    localStorage.setItem('pmos_health', JSON.stringify(data));
    
    // Reward for completing prognosis
    if (!healthData) {
      updatePoints(100);
      setStats(prev => ({ ...prev, communityContributionXP: prev.communityContributionXP + 50 }));
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  const handleOpenChest = () => {
    const rewards: MysteryReward[] = [
      { id: 'r1', type: 'recipe', title: 'Avocado Quinoa Salad', description: 'Low-GI energy booster', unlockedAt: new Date().toISOString() },
      { id: 'a1', type: 'audio', title: 'Cortisol Release', description: '10-minute guided relaxation', unlockedAt: new Date().toISOString() },
      { id: 'c1', type: 'cosmetic', title: 'Golden Serum Aura', description: 'Exclusive profile glow', unlockedAt: new Date().toISOString() },
    ];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    const items = ['🛡️', '👑', '💎', '🔥', '🏆', '🧪'];
    const randomIcon = items[Math.floor(Math.random() * items.length)];
    
    setStats(prev => ({
      ...prev,
      dailyChestOpened: true,
      points: prev.points + 50,
      inventory: Array.from(new Set([...prev.inventory, randomIcon])),
      mysteryRewards: [...prev.mysteryRewards, randomReward],
      lastCheckIn: new Date().toISOString()
    }));
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const newCompleted = !goal.completed;
        if (newCompleted) {
          updatePoints(goal.points);
          checkStreak();
          setStats(prevStats => ({
            ...prevStats,
            completedGoals: [...prevStats.completedGoals, goal.id],
            communityContributionXP: prevStats.communityContributionXP + 5
          }));
        } else {
          updatePoints(-goal.points);
        }
        return { ...goal, completed: newCompleted };
      }
      return goal;
    }));
  };

  const updatePoints = (pts: number) => {
    setStats(prev => {
      const newPoints = Math.max(0, prev.points + pts);
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      // Check Achievements
      const newAchievements = prev.achievements.map(ach => {
        if (!ach.unlocked) {
          if (ach.requirementType === 'points' && newPoints >= ach.requirementValue) return { ...ach, unlocked: true };
          if (ach.requirementType === 'goals' && (prev.completedGoals.length + 1) >= ach.requirementValue) return { ...ach, unlocked: true };
        }
        return ach;
      });

      return { ...prev, points: newPoints, level: newLevel, achievements: newAchievements };
    });
  };

  const checkStreak = () => {
    const today = new Date().toDateString();
    setStats(prev => {
      const lastCheckInValue = prev.lastCheckIn || new Date().toISOString();
      const last = new Date(lastCheckInValue).toDateString();
      if (last === today) return prev;
      
      const lastDate = new Date(lastCheckInValue);
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let newStreak = prev.streak;
      if (diffDays <= 1) {
        newStreak = prev.streak + 1;
      } else if (!prev.streakProtectionActive) {
        newStreak = 1;
      }
      // Streak protection consumed if used? Let's say it just works once per day.
      
      // Check Streak Achievement
      const newAchievements = prev.achievements.map(ach => {
        if (!ach.unlocked && ach.requirementType === 'streak' && newStreak >= ach.requirementValue) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });

      return { 
        ...prev, 
        streak: newStreak, 
        lastCheckIn: new Date().toISOString(),
        streakProtectionActive: false,
        achievements: newAchievements
      };
    });
  };

  const handleShare = async () => {
    const unlockedCount = stats.achievements.filter(a => a.unlocked).length;
    const githubUrl = 'https://github.com/YeungBrandon/ProgMOS';
    const text = `🛡️ I've reached Level ${stats.level} in ProgMOS!\n🔥 Streak: ${stats.streak} Days\n🎯 Achievements: ${unlockedCount}/3\n\nJoin me in the Global Metabolic Frontier. Reclaim your health, protect your data, and contribute to a healthier future for everyone! 🧬✨\n\nAnalyze your risk today:\n${githubUrl}`;

    // Attempt native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ProgMOS',
          text: text
        });
        return;
      } catch (error) {
        // Only proceed to fallback if it wasn't a user cancellation
        if ((error as Error).name === 'AbortError') return;
        console.error('Native share failed:', error);
      }
    }

    // Fallback: Robust Copy to Clipboard
    try {
      // Try modern API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Legacy fallback for restricted WebViews/APKs
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error('Legacy copy failed');
      }
      
      alert('📊 Progress report copied to clipboard!\n\nYou can now paste it into WhatsApp, Telegram, or any other app to share.');
    } catch (err) {
      console.error('All share/copy methods failed:', err);
      // Last resort: standard prompt
      prompt('Native sharing is restricted in this APK. Please copy your progress manually:', text);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'prognosis' && (
        <>
          {!result ? (
            <PrognosisForm onSubmit={handlePrognosisSubmit} />
          ) : (
            <ResultCard result={result} onReset={handleReset} />
          )}
        </>
      )}

      {activeTab === 'wellness' && (
        <Gamification 
          stats={stats} 
          goals={goals} 
          onToggleGoal={toggleGoal}
          onOpenChest={handleOpenChest}
          onShare={handleShare}
        />
      )}

      {activeTab === 'profile' && (
        <Vault data={healthData} />
      )}
    </Layout>
  );
}


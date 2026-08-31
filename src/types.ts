/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserHealthData {
  // Clinical & Physical
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bloodGroup?: number;
  pulseRate?: number;
  respiratoryRate?: number;
  hemoglobin?: number;
  cycleStatus: 'regular' | 'irregular'; // R/I
  cycleLength: number;
  marriageStatusYears?: number;
  isPregnant: boolean;
  abortionsCount?: number;
  
  // Hormonal (Optional Labs)
  betaHCG_I?: number;
  betaHCG_II?: number;
  fsh?: number;
  lh?: number;
  waistInch?: number;
  hipInch?: number;
  waistToHipRatio?: number;
  tsh?: number;
  amh?: number;
  prolactin?: number;
  vitD3?: number;
  progesterone?: number;
  rbs?: number; // Random Blood Sugar

  // Symptoms (Y/N)
  weightGain: boolean;
  hairGrowth: boolean;
  skinDarkening: boolean;
  hairLoss: boolean;
  pimples: boolean;
  fastFood: boolean;
  regExercise: boolean;

  // Vital Signs
  bpSystolic?: number;
  bpDiastolic?: number;

  // Ultrasound Findings
  follicleCountL?: number;
  follicleCountR?: number;
  avgFollicleSizeL?: number;
  avgFollicleSizeR?: number;
  endometriumThickness?: number;

  // Genetic & Familial (Keeping for the existing UI)
  maternalPmosHistory: boolean;
}

export interface RiskFactor {
  name: string;
  value: number;
  severity: 'low' | 'moderate' | 'high';
}

export interface RiskPrognosis {
  score: number; // 0-100
  category: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
  factors: RiskFactor[];
  metadata?: {
    imputedFields: string[];
    modelAccuracy: string;
    stackingFeatures: number;
  };
}

export interface GamificationStats {
  streak: number;
  points: number;
  lastCheckIn: string; // ISO date
  completedGoals: string[];
  level: number;
  inventory: string[]; // For Ownership/Possession
  unlockedTiers: string[];
  dailyChestOpened: boolean; // For Unpredictability
  streakProtectionActive: boolean; // Loss & Avoidance
  communityContributionXP: number; // Epic Meaning
  mysteryRewards: MysteryReward[]; // Unpredictability
  achievements: Achievement[]; // Development & Accomplishment
}

export interface MysteryReward {
  id: string;
  type: 'recipe' | 'audio' | 'cosmetic';
  title: string;
  description: string;
  unlockedAt: string;
}

export interface WellnessGoal {
  id: string;
  title: string;
  completed: boolean;
  points: number;
  type: 'daily' | 'limited' | 'custom'; // For Scarcity & Empowerment
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirementValue: number;
  requirementType: 'streak' | 'points' | 'goals';
  unlocked: boolean;
}

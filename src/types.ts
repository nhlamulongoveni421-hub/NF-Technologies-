export interface Pillar {
  id: number;
  title: string;
  setupFee: number;
  monthlyFee: number;
  hasMonthly: boolean;
  angle: string;
  description: string;
  services: string[];
  imageUrl: string;
  ideas?: string[];
}

export interface ProposalForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  timeline: string;
  focus: string;
  goal: string;
  milestones: string[];
}

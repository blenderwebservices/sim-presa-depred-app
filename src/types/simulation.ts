export type SimulationModel = 'lotka-volterra' | 'linear';

export interface BiologicalParams {
  initP: number;   // Población inicial de presas
  initD: number;   // Población inicial de depredadores
  r1: number;      // Tasa intrínseca de natalidad/crecimiento de presas
  a1: number;      // Tasa de caza / depredación
  a2: number;      // Eficiencia de conversión de biomasa / reclutamiento
  r2: number;      // Tasa de mortalidad natural de depredadores
  time: number;    // Horizonte temporal (ciclos/años)
  dt?: number;     // Paso de integración RK4
}

export interface SocialParams {
  initX1: number;  // Población pasiva / moderada inicial
  initX2: number;  // Población radical / coercitiva inicial
  a11: number;     // Auto-regulación / plasticidad de la población pasiva
  a12: number;     // Coerción o acoso de radicales sobre pasivos
  a21: number;     // Asimilación o reclutamiento de radicales sobre pasivos
  a22: number;     // Dogmatismo o rigidez interna del grupo radical
  time: number;    // Horizonte temporal (ciclos/años)
  dt?: number;     // Paso de integración RK4
}

export interface Preset {
  id: string;
  name: string;
  category: 'Biológico' | 'Social';
  description: string;
  model: SimulationModel;
  bioParams?: BiologicalParams;
  socialParams?: SocialParams;
}

export interface PhasePoint {
  x: number;
  y: number;
  t: number;
}

export interface MathematicalStability {
  trace: number;
  det: number;
  discriminant: number;
  eigenvalues: string[];
  classification: string;
  badgeType: 'stable' | 'unstable' | 'saddle' | 'neutral' | 'degenerate';
  equilibriumPoint: { x: number; y: number } | null;
  matrixLatex?: string;
  charEqLatex?: string;
  theoremText: string;
}

export interface BioPhilosophicalDiagnosis {
  plasticityText: string;
  ideologyText: string;
  parasitoidismText: string;
  globalVerdict: string;
}

export interface SimulationResult {
  model: SimulationModel;
  timeArr: number[];
  preyArr: number[];
  predatorArr: number[];
  phasePoints: PhasePoint[];
  metrics: {
    initialPrey: number;
    initialPredator: number;
    finalPrey: number;
    finalPredator: number;
    maxPrey: number;
    maxPredator: number;
    minPrey: number;
    minPredator: number;
    deltaPreyPercent: number;
    deltaPredatorPercent: number;
    isPreyExtinct: boolean;
    isPredatorExtinct: boolean;
    isExploding: boolean;
  };
  stability: MathematicalStability;
  philosophy: BioPhilosophicalDiagnosis;
}

export type TimelineStep = 1 | 2 | 3 | 4 | 5;

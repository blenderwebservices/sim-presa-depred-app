import {
  BiologicalParams,
  BioPhilosophicalDiagnosis,
  MathematicalStability,
  PhasePoint,
  SimulationResult,
  SocialParams,
} from '../types/simulation';

export function formatNumber(val: number | null | undefined, precision = 2): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  if (!isFinite(val)) return '∞ (Crítico)';
  if (Math.abs(val) < 1e-4 && val !== 0) return val.toExponential(2);
  if (Math.abs(val) >= 1e5) return val.toExponential(2);
  return val.toLocaleString('es-ES', {
    minimumFractionDigits: 1,
    maximumFractionDigits: precision,
  });
}

// ==========================================
// Integración Runge-Kutta 4 (RK4) Biológica
// ==========================================
export function runBiologicalSimulation(params: BiologicalParams): SimulationResult {
  const { initP, initD, r1, a1, a2, r2, time } = params;
  const dt = params.dt ?? 0.05;
  const stepsPerCycle = Math.round(1 / dt);

  const timeArr: number[] = [0];
  const preyArr: number[] = [initP];
  const predatorArr: number[] = [initD];
  const phasePoints: PhasePoint[] = [{ x: initP, y: initD, t: 0 }];

  // dP/dt = r1*P - a1*P*D
  // dD/dt = a2*P*D - r2*D
  const f1 = (p: number, d: number) => r1 * p - a1 * p * d;
  const f2 = (p: number, d: number) => a2 * p * d - r2 * d;

  let P = initP;
  let D = initD;
  let isExploding = false;

  for (let t = 1; t <= time; t++) {
    for (let k = 0; k < stepsPerCycle; k++) {
      const k1_1 = f1(P, D);
      const k1_2 = f2(P, D);

      const k2_1 = f1(P + 0.5 * dt * k1_1, D + 0.5 * dt * k1_2);
      const k2_2 = f2(P + 0.5 * dt * k1_1, D + 0.5 * dt * k1_2);

      const k3_1 = f1(P + 0.5 * dt * k2_1, D + 0.5 * dt * k2_2);
      const k3_2 = f2(P + 0.5 * dt * k2_1, D + 0.5 * dt * k2_2);

      const k4_1 = f1(P + dt * k3_1, D + dt * k3_2);
      const k4_2 = f2(P + dt * k3_1, D + dt * k3_2);

      P += (dt / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
      D += (dt / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
    }

    // Umbral de extinción biológica
    if (P < 0.05) P = 0;
    if (D < 0.05) D = 0;

    if (Math.abs(P) > 1e12 || Math.abs(D) > 1e12) {
      isExploding = true;
      timeArr.push(t);
      preyArr.push(P);
      predatorArr.push(D);
      phasePoints.push({ x: P, y: D, t });
      break;
    }

    timeArr.push(t);
    preyArr.push(P);
    predatorArr.push(D);
    phasePoints.push({ x: P, y: D, t });
  }

  // Métricas
  const finalPrey = preyArr[preyArr.length - 1];
  const finalPredator = predatorArr[predatorArr.length - 1];
  const maxPrey = Math.max(...preyArr);
  const minPrey = Math.min(...preyArr);
  const maxPredator = Math.max(...predatorArr);
  const minPredator = Math.min(...predatorArr);
  const deltaPreyPercent = initP !== 0 ? ((finalPrey - initP) / initP) * 100 : 0;
  const deltaPredatorPercent = initD !== 0 ? ((finalPredator - initD) / initD) * 100 : 0;
  const isPreyExtinct = finalPrey < 0.05;
  const isPredatorExtinct = finalPredator < 0.05;

  // Punto fijo no trivial (P*, D*) = (r2/a2, r1/a1)
  const pStar = a2 > 0 ? r2 / a2 : 0;
  const dStar = a1 > 0 ? r1 / a1 : 0;
  const imagEigen = Math.sqrt(Math.max(0, r1 * r2));

  const stability: MathematicalStability = {
    trace: 0,
    det: r1 * r2,
    discriminant: -4 * r1 * r2,
    eigenvalues: [`+${imagEigen.toFixed(4)}i`, `-${imagEigen.toFixed(4)}i`],
    classification: 'Centro Neutro (Ciclo Límite Conservativo)',
    badgeType: 'neutral',
    equilibriumPoint: { x: pStar, y: dStar },
    theoremText: 'Teorema de Lyapunov: Las órbitas en torno al punto de equilibrio (P*, D*) son elípticas y cerradas. El sistema conserva una función invariante de energía poblacional.',
  };

  const philosophy = generateBiologicalPhilosophy(params, finalPrey, finalPredator, isPreyExtinct, isPredatorExtinct, isExploding);

  return {
    model: 'lotka-volterra',
    timeArr,
    preyArr,
    predatorArr,
    phasePoints,
    metrics: {
      initialPrey: initP,
      initialPredator: initD,
      finalPrey,
      finalPredator,
      maxPrey,
      maxPredator,
      minPrey,
      minPredator,
      deltaPreyPercent,
      deltaPredatorPercent,
      isPreyExtinct,
      isPredatorExtinct,
      isExploding,
    },
    stability,
    philosophy,
  };
}

// ==========================================
// Integración Runge-Kutta 4 (RK4) Social / Lineal
// ==========================================
export function runSocialSimulation(params: SocialParams): SimulationResult {
  const { initX1, initX2, a11, a12, a21, a22, time } = params;
  const dt = params.dt ?? 0.05;
  const stepsPerCycle = Math.round(1 / dt);

  const timeArr: number[] = [0];
  const preyArr: number[] = [initX1];
  const predatorArr: number[] = [initX2];
  const phasePoints: PhasePoint[] = [{ x: initX1, y: initX2, t: 0 }];

  // dX1/dt = a11*X1 + a12*X2
  // dX2/dt = a21*X1 + a22*X2
  const f1 = (x1: number, x2: number) => a11 * x1 + a12 * x2;
  const f2 = (x1: number, x2: number) => a21 * x1 + a22 * x2;

  let X1 = initX1;
  let X2 = initX2;
  let isExploding = false;

  for (let t = 1; t <= time; t++) {
    for (let k = 0; k < stepsPerCycle; k++) {
      const k1_1 = f1(X1, X2);
      const k1_2 = f2(X1, X2);

      const k2_1 = f1(X1 + 0.5 * dt * k1_1, X2 + 0.5 * dt * k1_2);
      const k2_2 = f2(X1 + 0.5 * dt * k1_1, X2 + 0.5 * dt * k1_2);

      const k3_1 = f1(X1 + 0.5 * dt * k2_1, X2 + 0.5 * dt * k2_2);
      const k3_2 = f2(X1 + 0.5 * dt * k2_1, X2 + 0.5 * dt * k2_2);

      const k4_1 = f1(X1 + dt * k3_1, X2 + dt * k3_2);
      const k4_2 = f2(X1 + dt * k3_1, X2 + dt * k3_2);

      X1 += (dt / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
      X2 += (dt / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
    }

    if (Math.abs(X1) > 1e12 || Math.abs(X2) > 1e12) {
      isExploding = true;
      timeArr.push(t);
      preyArr.push(X1);
      predatorArr.push(X2);
      phasePoints.push({ x: X1, y: X2, t });
      break;
    }

    timeArr.push(t);
    preyArr.push(X1);
    predatorArr.push(X2);
    phasePoints.push({ x: X1, y: X2, t });
  }

  // Métricas
  const finalPrey = preyArr[preyArr.length - 1];
  const finalPredator = predatorArr[predatorArr.length - 1];
  const maxPrey = Math.max(...preyArr);
  const minPrey = Math.min(...preyArr);
  const maxPredator = Math.max(...predatorArr);
  const minPredator = Math.min(...predatorArr);
  const deltaPreyPercent = initX1 !== 0 ? ((finalPrey - initX1) / initX1) * 100 : 0;
  const deltaPredatorPercent = initX2 !== 0 ? ((finalPredator - initX2) / initX2) * 100 : 0;
  const isPreyExtinct = Math.abs(finalPrey) < 0.01;
  const isPredatorExtinct = Math.abs(finalPredator) < 0.01;

  // Cálculo de Estabilidad Lineal
  const trace = a11 + a22;
  const det = a11 * a22 - a12 * a21;
  const discriminant = trace * trace - 4 * det;

  let classification = '';
  let badgeType: 'stable' | 'unstable' | 'saddle' | 'neutral' | 'degenerate' = 'stable';
  const eigenvalues: string[] = [];
  let theoremText = '';

  if (discriminant >= 0) {
    const l1 = (trace + Math.sqrt(discriminant)) / 2;
    const l2 = (trace - Math.sqrt(discriminant)) / 2;
    eigenvalues.push(l1.toFixed(4));
    eigenvalues.push(l2.toFixed(4));
  } else {
    const realPart = trace / 2;
    const imagPart = Math.sqrt(-discriminant) / 2;
    eigenvalues.push(`${realPart.toFixed(3)} + ${imagPart.toFixed(3)}i`);
    eigenvalues.push(`${realPart.toFixed(3)} - ${imagPart.toFixed(3)}i`);
  }

  if (det < 0) {
    classification = 'Punto de Silla (Inestable / Escape)';
    badgeType = 'saddle';
    theoremText = 'Teorema de Chetaev: Existe al menos un autovalor con parte real estrictamente positiva. El origen es inestable y las trayectorias escapan por la variedad inestable.';
  } else if (det > 0) {
    if (discriminant >= 0) {
      if (trace < 0) {
        classification = 'Nodo Asintóticamente Estable';
        badgeType = 'stable';
        theoremText = 'Teorema de Lyapunov: Todos los autovalores tienen parte real negativa (Tr < 0, Det > 0). El sistema converge asintóticamente al reposo pacífico.';
      } else if (trace > 0) {
        classification = 'Nodo Asintóticamente Inestable';
        badgeType = 'unstable';
        theoremText = 'Teorema de Lyapunov: Todos los autovalores tienen parte real positiva (Tr > 0). Ambas poblaciones explotan hacia el infinito.';
      } else {
        classification = 'Centro Neutro';
        badgeType = 'neutral';
        theoremText = 'Oscilación neutra conservativa en el plano.';
      }
    } else {
      if (trace < 0) {
        classification = 'Foco Espiral Estable';
        badgeType = 'stable';
        theoremText = 'Teorema de Lyapunov: Foco espiral con oscilaciones amortiguadas que decaen al equilibrio.';
      } else if (trace > 0) {
        classification = 'Foco Espiral Inestable';
        badgeType = 'unstable';
        theoremText = 'Oscilaciones amplificadas divergentes (inestabilidad espiral descontrolada).';
      } else {
        classification = 'Centro Neutro (Vórtice Periódico)';
        badgeType = 'neutral';
        theoremText = 'Centro armónico sin amortiguamiento.';
      }
    }
  } else {
    classification = 'Línea de Equilibrios Degenerada';
    badgeType = 'degenerate';
    theoremText = 'El determinante es nulo; existe una dimensión completa de puntos de equilibrio continuos.';
  }

  const stability: MathematicalStability = {
    trace,
    det,
    discriminant,
    eigenvalues,
    classification,
    badgeType,
    equilibriumPoint: { x: 0, y: 0 },
    theoremText,
  };

  const philosophy = generateSocialPhilosophy(params, finalPrey, finalPredator, isPreyExtinct, isPredatorExtinct, isExploding);

  return {
    model: 'linear',
    timeArr,
    preyArr,
    predatorArr,
    phasePoints,
    metrics: {
      initialPrey: initX1,
      initialPredator: initX2,
      finalPrey,
      finalPredator,
      maxPrey,
      maxPredator,
      minPrey,
      minPredator,
      deltaPreyPercent,
      deltaPredatorPercent,
      isPreyExtinct,
      isPredatorExtinct,
      isExploding,
    },
    stability,
    philosophy,
  };
}

// ==========================================
// Diagnósticos Biofilosóficos (Mario Bunge & Mahner)
// ==========================================
function generateBiologicalPhilosophy(
  params: BiologicalParams,
  finalPrey: number,
  finalPredator: number,
  isPreyExtinct: boolean,
  isPredatorExtinct: boolean,
  isExploding: boolean
): BioPhilosophicalDiagnosis {
  const { r1, a1, a2, r2 } = params;

  const plasticityText = `En el modelo Lotka-Volterra no lineal, las poblaciones se modelan sin auto-regulación de densidad en la diagonal matricial.
• Presas (r₁ = ${r1.toFixed(4)}): En ausencia de depredación, proliferan sin conciencia de capacidad de carga biofísica.
• Depredadores (r₂ = ${r2.toFixed(4)}): Dependen estrictamente del consumo de presas. Si el alimento disminuye, su mortalidad natural desencadena un colapso demográfico inmediato.`;

  const ideologyText = `La relación presa-depredador ilustra la dinámica de depredación de recursos y alimento:
• Eficiencia de Caza (a₁ = ${a1.toFixed(5)}): Mide la vulnerabilidad de las presas y la agresividad predatoria en el ecosistema.
• Conversión Trófica (a₂ = ${a2.toFixed(5)}): Representa el rédito ecológico transformado en reproducción y descendencia predadora.`;

  let parasitoidismText = '';
  let globalVerdict = '';

  if (isPreyExtinct && isPredatorExtinct) {
    parasitoidismText = '¡Colapso por Parasitoidismo Total! La presión de caza aniquiló a las presas. Al esfumarse el huésped trófico, la especie depredadora sucumbió inevitablemente a la inanición.';
    globalVerdict = 'Colapso Ecosistémico Total: Extinción mutua inducida por hiperdepredación insostenible.';
  } else if (isPreyExtinct) {
    parasitoidismText = 'Parasitoidismo Consumado: Las presas se extinguieron. Los depredadores restantes enfrentan una extinción demográfica inminente.';
    globalVerdict = 'Desequilibrio Trófico Crítico: Aniquilación del estrato base productor.';
  } else if (isPredatorExtinct) {
    parasitoidismText = 'Liberación Ecológica: Los depredadores no lograron subsistir y se extinguieron. Las presas ahora crecen exponencialmente sin restricción predatoria.';
    globalVerdict = 'Sobrepoblación de Presas: Crecimiento sin frenos de control biológico.';
  } else if (isExploding) {
    parasitoidismText = 'Divergencia Incontrolable: El balance numérico excedió la estabilidad biológica natural del nicho.';
    globalVerdict = 'Inestabilidad Crítica: Ruptura de homeostasis ecológica.';
  } else {
    parasitoidismText = 'Coexistencia Cíclica Armónica: Las dos poblaciones oscilan en órbitas acopladas permanentes. El aumento de presas alimenta al depredador, cuya presión reduce la presa, permitiendo que el ciclo recomience sin fin.';
    globalVerdict = 'Homeostasis Periódica: Órbita cerrada estable en equilibrio dinámico.';
  }

  return { plasticityText, ideologyText, parasitoidismText, globalVerdict };
}

function generateSocialPhilosophy(
  params: SocialParams,
  finalPrey: number,
  finalPredator: number,
  isPreyExtinct: boolean,
  isPredatorExtinct: boolean,
  isExploding: boolean
): BioPhilosophicalDiagnosis {
  const { a11, a12, a21, a22 } = params;

  const plasticityText = `De acuerdo con la ontología sistémica de Mahner y Bunge, los seres humanos poseen plasticidad neural y social, lo que les permite corregir errores mediante retroalimentación:
• Población Pasiva/Moderada (a₁₁ = ${a11.toFixed(3)}): ${
    a11 < 0
      ? 'Exhibe plasticidad y moderación auto-regulatoria. Su aprendizaje conductual evita la saturación desmedida del sistema.'
      : 'Carece de contención interna propia; su expansión desmesurada la torna frágil ante perturbaciones.'
  }
• Población Radical/Coercitiva (a₂₂ = ${a22.toFixed(3)}): ${
    a22 < 0
      ? 'Acepta contención interna, limitando la escalada de radicalización dentro de la esfera civil.'
      : 'Representa dogmatismo rígido y fanatismo ideológico que busca imponerse perpetuamente sin aprender del error.'
  }`;

  let ideologyText = 'Evaluación de las interacciones cruzadas en la matriz de convivencia: ';
  if (a12 < 0 && a21 > 0) {
    ideologyText += 'Depredación Ideológica Coercitiva (a₁₂ < 0, a₂₁ > 0). El grupo radical asedia y desgasta a los moderados, convirtiendo o intimidando a la población pasiva.';
  } else if (a12 < 0 && a21 < 0) {
    ideologyText += 'Guerra de Desgaste Excluyente (a₁₂ < 0, a₂₁ < 0). Hostilidad mutua y polarización destructiva donde ambas facciones sufren merma constante.';
  } else if (a12 > 0 && a21 > 0) {
    ideologyText += 'Sinergia Pluralista y Cooperación (a₁₂ > 0, a₂₁ > 0). Coexistencia dialéctica fructífera donde la diversidad de opiniones robustece al conjunto social.';
  } else {
    ideologyText += 'Desradicalización Moderada (a₁₂ ≥ 0, a₂₁ ≤ 0). La influencia hegemónica civil reduce el impacto de las posturas radicales sin violencia.';
  }

  let parasitoidismText = '';
  let globalVerdict = '';

  if (isPreyExtinct && isPredatorExtinct) {
    parasitoidismText = '¡Colapso por Parasitoidismo Ideológico Total! La coacción radical exterminó la base productiva pasiva, dejando al sistema sin sustento y extinguiendo a ambas facciones en el caos.';
    globalVerdict = 'Colapso Civilizatorio Total: El extremismo consumió los cimientos sociales.';
  } else if (isPreyExtinct) {
    parasitoidismText = 'Parasitoidismo Consumado: La población moderada fue completamente subyugada o expulsada. El monopolio radical resultante carece de legitimidad o base productiva.';
    globalVerdict = 'Monopolio Autoritario Estéril: Victoria pírrica sin viabilidad a mediano plazo.';
  } else if (isPredatorExtinct) {
    parasitoidismText = 'Pacificación y Extinción Radical: El dogmatismo violento se disolvió por falta de adeptos o alta deserción, restableciendo un orden civil pacífico.';
    globalVerdict = 'Paz Civil Restaurada: Predominio de la convivencia y el estado de derecho.';
  } else if (isExploding) {
    parasitoidismText = 'Crisis de Polarización Extrema: Las fuerzas sociales se polarizan sin control, desbordando las instituciones republicanas hacia una confrontación abierta.';
    globalVerdict = 'Desborde Institucional Crítico: Inestabilidad divergente de escala revolucionaria.';
  } else {
    parasitoidismText = 'Coexistencia Tensa en Equilibrio: Las fuerzas sociales se contraponen en un balance que preserva la continuidad del cuerpo social.';
    globalVerdict = 'Equilibrio Dinámico Social: Supervivencia sistémica bajo constante tensión civil.';
  }

  return { plasticityText, ideologyText, parasitoidismText, globalVerdict };
}

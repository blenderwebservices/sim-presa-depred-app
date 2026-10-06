import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRESETS } from '../data/presets';
import {
  BiologicalParams,
  SimulationModel,
  SimulationResult,
  SocialParams,
  TimelineStep,
} from '../types/simulation';
import {
  runBiologicalSimulation,
  runSocialSimulation,
} from '../utils/mathEngine';
import { ResultsExhibition } from './ResultsExhibition';

const TIMELINE_STEPS = [
  { step: 1, title: 'Modelo & Presets', subtitle: 'Biológico o Social' },
  { step: 2, title: 'Poblaciones', subtitle: 'Valores iniciales y tiempo' },
  { step: 3, title: 'Dinámica & Tasas', subtitle: 'Interacciones y matriz' },
  { step: 4, title: 'Ejecutar RK4', subtitle: 'Auditoría y cálculo' },
  { step: 5, title: 'Resultados', subtitle: 'Tablas, gráficos y análisis' },
];

export const TimelineSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TimelineStep>(1);
  const [model, setModel] = useState<SimulationModel>('lotka-volterra');

  // Parámetros Biológicos por defecto
  const [bioParams, setBioParams] = useState<BiologicalParams>({
    initP: 100,
    initD: 10,
    r1: 0.005,
    a1: 0.0001,
    a2: 0.0001,
    r2: 0.015,
    time: 100,
    dt: 0.05,
  });

  // Parámetros Sociales por defecto
  const [socialParams, setSocialParams] = useState<SocialParams>({
    initX1: 1.0,
    initX2: 1.0,
    a11: 0.500,
    a12: 0.100,
    a21: 0.100,
    a22: 0.150,
    time: 60,
    dt: 0.05,
  });

  const [activePresetId, setActivePresetId] = useState<string>('preset-lv-base');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Carga de Preset
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const selected = PRESETS.find((p) => p.id === presetId);
    if (!selected) return;

    setModel(selected.model);
    if (selected.bioParams) {
      setBioParams({ ...selected.bioParams });
    }
    if (selected.socialParams) {
      setSocialParams({ ...selected.socialParams });
    }
  };

  // Ejecución de la simulación
  const handleExecuteSimulation = () => {
    let result: SimulationResult;
    if (model === 'lotka-volterra') {
      result = runBiologicalSimulation(bioParams);
    } else {
      result = runSocialSimulation(socialParams);
    }
    setSimulationResult(result);
    setCurrentStep(5);
  };

  return (
    <View style={styles.container}>
      {/* Barra de Progreso del Timeline */}
      <View style={styles.timelineHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineTrack}>
          {TIMELINE_STEPS.map((s, index) => {
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;
            const isClickable = isCompleted || (s.step === 5 && simulationResult !== null);

            return (
              <React.Fragment key={s.step}>
                <TouchableOpacity
                  disabled={!isClickable && !isActive}
                  onPress={() => isClickable && setCurrentStep(s.step as TimelineStep)}
                  style={[
                    styles.timelineNode,
                    isActive && styles.timelineNodeActive,
                    isCompleted && styles.timelineNodeCompleted,
                  ]}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && styles.stepCircleActive,
                      isCompleted && styles.stepCircleCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepCircleText,
                        (isActive || isCompleted) && styles.stepCircleTextActive,
                      ]}
                    >
                      {isCompleted ? '✓' : s.step}
                    </Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isActive && styles.stepTitleActive,
                        isCompleted && styles.stepTitleCompleted,
                      ]}
                    >
                      {s.title}
                    </Text>
                    <Text style={styles.stepSubtitle}>{s.subtitle}</Text>
                  </View>
                </TouchableOpacity>

                {index < TIMELINE_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.timelineConnector,
                      currentStep > s.step && styles.timelineConnectorCompleted,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>

      {/* Contenido Principal según el paso activo */}
      <ScrollView style={styles.stepContent} contentContainerStyle={styles.stepContentInner}>
        {/* ============================================================== */}
        {/* PASO 1: SELECCIÓN DE MODELO & PRESETS                          */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Paso 1: Paradigma & Enfoque</Text>
            <Text style={styles.stepDescription}>
              Elige si deseas modelar un ecosistema natural de presas y depredadores, o un conflicto social de coerción
              y dominación ideológica.
            </Text>

            {/* Selector de Paradigma */}
            <View style={styles.modelToggleRow}>
              <TouchableOpacity
                onPress={() => {
                  setModel('lotka-volterra');
                  handleSelectPreset('preset-lv-base');
                }}
                style={[styles.modelToggleBtn, model === 'lotka-volterra' && styles.modelToggleBtnActive]}
              >
                <Text style={styles.modelToggleIcon}>🌿</Text>
                <Text style={[styles.modelToggleText, model === 'lotka-volterra' && styles.modelToggleTextActive]}>
                  Modelo Biológico (Lotka-Volterra)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModel('linear');
                  handleSelectPreset('preset-linear-saddle');
                }}
                style={[styles.modelToggleBtn, model === 'linear' && styles.modelToggleBtnActive]}
              >
                <Text style={styles.modelToggleIcon}>🏛️</Text>
                <Text style={[styles.modelToggleText, model === 'linear' && styles.modelToggleTextActive]}>
                  Modelo Social (Mario Bunge)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Biblioteca de Presets */}
            <Text style={styles.sectionLabel}>Cargar Preset Preconfigurado:</Text>
            <View style={styles.presetGrid}>
              {PRESETS.filter((p) => (model === 'lotka-volterra' ? p.category === 'Biológico' : p.category === 'Social')).map(
                (preset) => {
                  const isSelected = activePresetId === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      onPress={() => handleSelectPreset(preset.id)}
                      style={[styles.presetCard, isSelected && styles.presetCardSelected]}
                    >
                      <View style={styles.presetCardHeader}>
                        <Text style={[styles.presetCardName, isSelected && styles.presetCardNameSelected]}>
                          {preset.name}
                        </Text>
                        <View style={styles.presetCategoryBadge}>
                          <Text style={styles.presetCategoryBadgeText}>{preset.category}</Text>
                        </View>
                      </View>
                      <Text style={styles.presetCardDesc}>{preset.description}</Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Continuar a Poblaciones Iniciales →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* PASO 2: POBLACIONES INICIALES & TIEMPO                        */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Paso 2: Poblaciones Iniciales & Horizonte</Text>
            <Text style={styles.stepDescription}>
              Define el número de entidades que conviven al comienzo de la simulación y la cantidad de ciclos temporales.
            </Text>

            {model === 'lotka-volterra' ? (
              <>
                {/* Presas Iniciales */}
                <View style={styles.paramGroup}>
                  <View style={styles.paramLabelRow}>
                    <Text style={styles.paramLabel}>Presas Iniciales (P₀)</Text>
                    <Text style={styles.paramValDisplay}>{bioParams.initP}</Text>
                  </View>
                  <Text style={styles.paramHelper}>Población base reproductora de presas</Text>
                  <View style={styles.inputAdjustmentRow}>
                    {[-20, -5, +5, +20].map((delta) => (
                      <TouchableOpacity
                        key={delta}
                        onPress={() =>
                          setBioParams((prev) => ({
                            ...prev,
                            initP: Math.max(1, prev.initP + delta),
                          }))
                        }
                        style={styles.quickDeltaBtn}
                      >
                        <Text style={styles.quickDeltaBtnText}>{delta > 0 ? `+${delta}` : delta}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Depredadores Iniciales */}
                <View style={styles.paramGroup}>
                  <View style={styles.paramLabelRow}>
                    <Text style={styles.paramLabel}>Depredadores Iniciales (D₀)</Text>
                    <Text style={styles.paramValDisplay}>{bioParams.initD}</Text>
                  </View>
                  <Text style={styles.paramHelper}>Población inicial de cazadores en el ecosistema</Text>
                  <View style={styles.inputAdjustmentRow}>
                    {[-10, -2, +2, +10].map((delta) => (
                      <TouchableOpacity
                        key={delta}
                        onPress={() =>
                          setBioParams((prev) => ({
                            ...prev,
                            initD: Math.max(1, prev.initD + delta),
                          }))
                        }
                        style={styles.quickDeltaBtn}
                      >
                        <Text style={styles.quickDeltaBtnText}>{delta > 0 ? `+${delta}` : delta}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Población Pasiva */}
                <View style={styles.paramGroup}>
                  <View style={styles.paramLabelRow}>
                    <Text style={styles.paramLabel}>Población Pasiva / Moderada (X₁₀)</Text>
                    <Text style={styles.paramValDisplay}>{socialParams.initX1.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.paramHelper}>Magnitud inicial de la base civil o sector moderado</Text>
                  <View style={styles.inputAdjustmentRow}>
                    {[-1.0, -0.2, +0.2, +1.0].map((delta) => (
                      <TouchableOpacity
                        key={delta}
                        onPress={() =>
                          setSocialParams((prev) => ({
                            ...prev,
                            initX1: Math.max(0.1, Number((prev.initX1 + delta).toFixed(2))),
                          }))
                        }
                        style={styles.quickDeltaBtn}
                      >
                        <Text style={styles.quickDeltaBtnText}>{delta > 0 ? `+${delta}` : delta}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Población Radical */}
                <View style={styles.paramGroup}>
                  <View style={styles.paramLabelRow}>
                    <Text style={styles.paramLabel}>Población Radical / Coercitiva (X₂₀)</Text>
                    <Text style={styles.paramValDisplay}>{socialParams.initX2.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.paramHelper}>Fuerza inicial de la corriente extremista o facción coercitiva</Text>
                  <View style={styles.inputAdjustmentRow}>
                    {[-1.0, -0.2, +0.2, +1.0].map((delta) => (
                      <TouchableOpacity
                        key={delta}
                        onPress={() =>
                          setSocialParams((prev) => ({
                            ...prev,
                            initX2: Math.max(0.1, Number((prev.initX2 + delta).toFixed(2))),
                          }))
                        }
                        style={styles.quickDeltaBtn}
                      >
                        <Text style={styles.quickDeltaBtnText}>{delta > 0 ? `+${delta}` : delta}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Horizonte Temporal */}
            <View style={styles.paramGroup}>
              <View style={styles.paramLabelRow}>
                <Text style={styles.paramLabel}>Horizonte Temporal (Ciclos / Años)</Text>
                <Text style={styles.paramValDisplay}>
                  {model === 'lotka-volterra' ? bioParams.time : socialParams.time}
                </Text>
              </View>
              <Text style={styles.paramHelper}>Duración total de la integración numérica RK4</Text>
              <View style={styles.inputAdjustmentRow}>
                {[-20, -10, +10, +20].map((delta) => (
                  <TouchableOpacity
                    key={delta}
                    onPress={() => {
                      if (model === 'lotka-volterra') {
                        setBioParams((prev) => ({ ...prev, time: Math.max(10, Math.min(300, prev.time + delta)) }));
                      } else {
                        setSocialParams((prev) => ({ ...prev, time: Math.max(10, Math.min(300, prev.time + delta)) }));
                      }
                    }}
                    style={styles.quickDeltaBtn}
                  >
                    <Text style={styles.quickDeltaBtnText}>{delta > 0 ? `+${delta}` : delta}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>← Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentStep(3)} style={styles.primaryBtnFlex}>
                <Text style={styles.primaryBtnText}>Continuar a Dinámicas & Tasas →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* PASO 3: PARÁMETROS DE DINÁMICA & INTERACCIÓN                  */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Paso 3: Dinámica de Interacción & Matriz</Text>
            <Text style={styles.stepDescription}>
              Configura los coeficientes diferenciales que gobiernan la depredación, conversión biológica, plasticidad y
              coerción ideológica.
            </Text>

            {model === 'lotka-volterra' ? (
              <View style={styles.ratesContainer}>
                {/* r1 */}
                <View style={styles.rateCard}>
                  <Text style={styles.rateTitle}>r₁: Natalidad Natural de Presas</Text>
                  <Text style={styles.rateDesc}>Tasa de crecimiento exponencial intrínseco en ausencia de cazadores.</Text>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.numberInput}
                    value={String(bioParams.r1)}
                    onChangeText={(val) => setBioParams((prev) => ({ ...prev, r1: parseFloat(val) || 0 }))}
                  />
                </View>

                {/* a1 */}
                <View style={styles.rateCard}>
                  <Text style={styles.rateTitle}>a₁: Eficiencia de Depredación / Caza</Text>
                  <Text style={styles.rateDesc}>Probabilidad de captura por colisión entre presas y depredadores.</Text>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.numberInput}
                    value={String(bioParams.a1)}
                    onChangeText={(val) => setBioParams((prev) => ({ ...prev, a1: parseFloat(val) || 0 }))}
                  />
                </View>

                {/* a2 */}
                <View style={styles.rateCard}>
                  <Text style={styles.rateTitle}>a₂: Tasa de Conversión / Reproducción</Text>
                  <Text style={styles.rateDesc}>Rendimiento trófico que engendra nuevos depredadores tras alimentarse.</Text>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.numberInput}
                    value={String(bioParams.a2)}
                    onChangeText={(val) => setBioParams((prev) => ({ ...prev, a2: parseFloat(val) || 0 }))}
                  />
                </View>

                {/* r2 */}
                <View style={styles.rateCard}>
                  <Text style={styles.rateTitle}>r₂: Mortalidad Natural de Depredadores</Text>
                  <Text style={styles.rateDesc}>Decaimiento demográfico por senescencia y falta de alimento.</Text>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.numberInput}
                    value={String(bioParams.r2)}
                    onChangeText={(val) => setBioParams((prev) => ({ ...prev, r2: parseFloat(val) || 0 }))}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.matrixContainer}>
                <Text style={styles.matrixTitle}>Matriz de Interacción Social A (2x2):</Text>
                <View style={styles.matrixGrid}>
                  {/* a11 */}
                  <View style={styles.matrixCell}>
                    <Text style={styles.matrixCellLabel}>a₁₁: Plasticidad Pasiva</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.numberInput}
                      value={String(socialParams.a11)}
                      onChangeText={(val) => setSocialParams((prev) => ({ ...prev, a11: parseFloat(val) || 0 }))}
                    />
                    <Text style={styles.matrixCellNote}>&lt; 0: Auto-regula | &gt; 0: Rígido</Text>
                  </View>

                  {/* a12 */}
                  <View style={styles.matrixCell}>
                    <Text style={styles.matrixCellLabel}>a₁₂: Coerción Radical</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.numberInput}
                      value={String(socialParams.a12)}
                      onChangeText={(val) => setSocialParams((prev) => ({ ...prev, a12: parseFloat(val) || 0 }))}
                    />
                    <Text style={styles.matrixCellNote}>Impacto del extremismo en moderados</Text>
                  </View>

                  {/* a21 */}
                  <View style={styles.matrixCell}>
                    <Text style={styles.matrixCellLabel}>a₂₁: Reclutamiento Radical</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.numberInput}
                      value={String(socialParams.a21)}
                      onChangeText={(val) => setSocialParams((prev) => ({ ...prev, a21: parseFloat(val) || 0 }))}
                    />
                    <Text style={styles.matrixCellNote}>Asimilación militante</Text>
                  </View>

                  {/* a22 */}
                  <View style={styles.matrixCell}>
                    <Text style={styles.matrixCellLabel}>a₂₂: Dogmatismo Radical</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.numberInput}
                      value={String(socialParams.a22)}
                      onChangeText={(val) => setSocialParams((prev) => ({ ...prev, a22: parseFloat(val) || 0 }))}
                    />
                    <Text style={styles.matrixCellNote}>&gt; 0: Fanatismo sin límites</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>← Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentStep(4)} style={styles.primaryBtnFlex}>
                <Text style={styles.primaryBtnText}>Continuar a Auditoría & Ejecución →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* PASO 4: AUDITORÍA & EJECUCIÓN RK4                             */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepHeading}>Paso 4: Auditoría de Datos & Integración RK4</Text>
            <Text style={styles.stepDescription}>
              Revisa los parámetros recopilados a lo largo del Timeline antes de resolver numéricamente el sistema.
            </Text>

            {/* Ficha Resumen de Parámetros */}
            <View style={styles.auditCard}>
              <View style={styles.auditRow}>
                <Text style={styles.auditKey}>Paradigma Seleccionado:</Text>
                <Text style={styles.auditVal}>
                  {model === 'lotka-volterra' ? 'Biológico (Lotka-Volterra)' : 'Social / Ideológico (Lineal)'}
                </Text>
              </View>
              <View style={styles.auditRow}>
                <Text style={styles.auditKey}>Poblaciones Iniciales:</Text>
                <Text style={styles.auditVal}>
                  {model === 'lotka-volterra'
                    ? `Presas: ${bioParams.initP} | Depredadores: ${bioParams.initD}`
                    : `Pasivos: ${socialParams.initX1} | Radicales: ${socialParams.initX2}`}
                </Text>
              </View>
              <View style={styles.auditRow}>
                <Text style={styles.auditKey}>Horizonte de Simulación:</Text>
                <Text style={styles.auditVal}>
                  {model === 'lotka-volterra' ? `${bioParams.time} ciclos` : `${socialParams.time} ciclos`} (dt = 0.05)
                </Text>
              </View>
              <View style={styles.auditRow}>
                <Text style={styles.auditKey}>Parámetros de Interacción:</Text>
                <Text style={styles.auditVal}>
                  {model === 'lotka-volterra'
                    ? `r₁=${bioParams.r1}, a₁=${bioParams.a1}, a₂=${bioParams.a2}, r₂=${bioParams.r2}`
                    : `a₁₁=${socialParams.a11}, a₁₂=${socialParams.a12}, a₂₁=${socialParams.a21}, a₂₂=${socialParams.a22}`}
                </Text>
              </View>
            </View>

            {/* Aviso de Precisión RK4 */}
            <View style={styles.rk4Notice}>
              <Text style={styles.rk4NoticeTitle}>⚡ Solucionador Runge-Kutta 4 (RK4)</Text>
              <Text style={styles.rk4NoticeText}>
                Se calcularán las derivadas ponderadas k₁, k₂, k₃ y k₄ en cada subintervalo para garantizar convergencia
                exacta y análisis de estabilidad de Lyapunov.
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setCurrentStep(3)} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>← Modificar Parámetros</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExecuteSimulation} style={styles.executeBtn}>
                <Text style={styles.executeBtnText}>🚀 Ejecutar Simulación RK4</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* PASO 5: EXPOSICIÓN DE RESULTADOS                              */}
        {/* ============================================================== */}
        {currentStep === 5 && simulationResult && (
          <ResultsExhibition
            result={simulationResult}
            onModifyParams={() => setCurrentStep(3)}
            onRestart={() => setCurrentStep(1)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  timelineHeader: {
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 12,
  },
  timelineTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  timelineNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timelineNodeActive: {
    backgroundColor: '#0f172a',
  },
  timelineNodeCompleted: {},
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#6366f1',
  },
  stepCircleCompleted: {
    backgroundColor: '#10b981',
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
  },
  stepCircleTextActive: {
    color: '#ffffff',
  },
  stepInfo: {
    justifyContent: 'center',
  },
  stepTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  stepTitleActive: {
    color: '#f8fafc',
  },
  stepTitleCompleted: {
    color: '#10b981',
  },
  stepSubtitle: {
    color: '#64748b',
    fontSize: 10,
  },
  timelineConnector: {
    width: 20,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  timelineConnectorCompleted: {
    backgroundColor: '#10b981',
  },
  stepContent: {
    flex: 1,
  },
  stepContentInner: {
    padding: 18,
    paddingBottom: 40,
  },
  stepCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
  },
  stepHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  stepDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 19,
  },
  modelToggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modelToggleBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 6,
  },
  modelToggleBtnActive: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1b4b',
  },
  modelToggleIcon: {
    fontSize: 24,
  },
  modelToggleText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  modelToggleTextActive: {
    color: '#ffffff',
  },
  sectionLabel: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  presetGrid: {
    gap: 10,
  },
  presetCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1b4b',
  },
  presetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  presetCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  presetCardNameSelected: {
    color: '#a5b4fc',
  },
  presetCategoryBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  presetCategoryBadgeText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  presetCardDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  paramGroup: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  paramLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramLabel: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  paramValDisplay: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38bdf8',
    fontFamily: 'monospace',
  },
  paramHelper: {
    fontSize: 11,
    color: '#64748b',
  },
  inputAdjustmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  quickDeltaBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickDeltaBtnText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 12,
  },
  ratesContainer: {
    gap: 12,
  },
  rateCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rateTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  rateDesc: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 8,
  },
  numberInput: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#334155',
  },
  matrixContainer: {
    gap: 10,
  },
  matrixTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  matrixCell: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  matrixCellLabel: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  matrixCellNote: {
    color: '#64748b',
    fontSize: 10,
  },
  auditCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  auditRow: {
    gap: 2,
  },
  auditKey: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  auditVal: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '700',
  },
  rk4Notice: {
    backgroundColor: '#1e1b4b',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    gap: 4,
  },
  rk4NoticeTitle: {
    color: '#c7d2fe',
    fontSize: 13,
    fontWeight: '700',
  },
  rk4NoticeText: {
    color: '#a5b4fc',
    fontSize: 12,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnFlex: {
    flex: 2,
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  executeBtn: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  executeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});

import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SimulationResult } from '../types/simulation';
import { formatNumber } from '../utils/mathEngine';

interface ResultsExhibitionProps {
  result: SimulationResult;
  onModifyParams: () => void;
  onRestart: () => void;
}

type TabType = 'resumen' | 'graficos' | 'tabla' | 'matematica';

export const ResultsExhibition: React.FC<ResultsExhibitionProps> = ({
  result,
  onModifyParams,
  onRestart,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('resumen');
  const [tableInterval, setTableInterval] = useState<number>(5);
  const [chartMode, setChartMode] = useState<'temporal' | 'fases'>('temporal');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const { metrics, stability, philosophy, model, timeArr, preyArr, predatorArr, phasePoints } = result;

  const isBio = model === 'lotka-volterra';
  const labelPrey = isBio ? 'Presas (P)' : 'Población Pasiva (X₁)';
  const labelPred = isBio ? 'Depredadores (D)' : 'Población Radical (X₂)';

  // Datos filtrados para la tabla según el intervalo seleccionado
  const filteredTableData = useMemo(() => {
    const rows = [];
    for (let i = 0; i < timeArr.length; i++) {
      if (i % tableInterval === 0 || i === timeArr.length - 1) {
        const p = preyArr[i];
        const d = predatorArr[i];
        let status = 'Normal';
        if (p < 0.05 && d < 0.05) status = 'Extinción Mutua';
        else if (p < 0.05) status = 'Presa Extinta';
        else if (d < 0.05) status = 'Depredador Extinto';
        else if (p > metrics.initialPrey * 3) status = 'Explosión Demográfica';

        rows.push({
          t: timeArr[i],
          prey: p,
          pred: d,
          status,
        });
      }
    }
    return rows;
  }, [timeArr, preyArr, predatorArr, tableInterval, metrics.initialPrey]);

  // Manejo de exportación de datos en formato JSON legible
  const handleExportJSON = () => {
    const exportData = {
      modelo: model,
      fechaSimulacion: new Date().toISOString(),
      metricas: metrics,
      estabilidad: stability,
      diagnostico: philosophy,
      muestreo: filteredTableData,
    };
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)).catch(() => {});
    }
    // En web o móvil mostramos feedback visual
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Barra de Pestañas de Resultados */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('resumen')}
          style={[styles.tabButton, activeTab === 'resumen' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'resumen' && styles.tabButtonTextActive]}>
            📊 Resumen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('graficos')}
          style={[styles.tabButton, activeTab === 'graficos' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'graficos' && styles.tabButtonTextActive]}>
            📈 Gráficos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('tabla')}
          style={[styles.tabButton, activeTab === 'tabla' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'tabla' && styles.tabButtonTextActive]}>
            📋 Tablas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('matematica')}
          style={[styles.tabButton, activeTab === 'matematica' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'matematica' && styles.tabButtonTextActive]}>
            📐 Rigor Math
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* ============================================================== */}
        {/* PESTAÑA 1: RESUMEN Y DIAGNÓSTICO FILOSÓFICO                   */}
        {/* ============================================================== */}
        {activeTab === 'resumen' && (
          <View style={styles.section}>
            {/* Banner de Veredicto Global */}
            <View
              style={[
                styles.verdictCard,
                stability.badgeType === 'stable' && styles.verdictStable,
                stability.badgeType === 'unstable' && styles.verdictUnstable,
                stability.badgeType === 'saddle' && styles.verdictSaddle,
                stability.badgeType === 'neutral' && styles.verdictNeutral,
              ]}
            >
              <View style={styles.verdictHeader}>
                <Text style={styles.verdictTitle}>Diagnóstico del Sistema:</Text>
                <View style={styles.stabilityBadge}>
                  <Text style={styles.stabilityBadgeText}>{stability.classification}</Text>
                </View>
              </View>
              <Text style={styles.verdictBody}>{philosophy.globalVerdict}</Text>
            </View>

            {/* Cuadrícula de Métricas Clave */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { borderLeftColor: '#10b981' }]}>
                <Text style={styles.metricLabel}>{labelPrey} Final</Text>
                <Text style={[styles.metricValue, { color: '#10b981' }]}>
                  {formatNumber(metrics.finalPrey)}
                </Text>
                <Text style={styles.metricSub}>
                  Inicial: {formatNumber(metrics.initialPrey)} ({metrics.deltaPreyPercent >= 0 ? '+' : ''}
                  {metrics.deltaPreyPercent.toFixed(1)}%)
                </Text>
                <Text style={styles.metricMinMax}>
                  Min: {formatNumber(metrics.minPrey)} | Max: {formatNumber(metrics.maxPrey)}
                </Text>
              </View>

              <View style={[styles.metricCard, { borderLeftColor: '#f43f5e' }]}>
                <Text style={styles.metricLabel}>{labelPred} Final</Text>
                <Text style={[styles.metricValue, { color: '#f43f5e' }]}>
                  {formatNumber(metrics.finalPredator)}
                </Text>
                <Text style={styles.metricSub}>
                  Inicial: {formatNumber(metrics.initialPredator)} ({metrics.deltaPredatorPercent >= 0 ? '+' : ''}
                  {metrics.deltaPredatorPercent.toFixed(1)}%)
                </Text>
                <Text style={styles.metricMinMax}>
                  Min: {formatNumber(metrics.minPredator)} | Max: {formatNumber(metrics.maxPredator)}
                </Text>
              </View>
            </View>

            {/* Tarjetas de Diagnóstico Bio-Filosófico */}
            <Text style={styles.subSectionTitle}>Interpretación Conceptual (Mario Bunge & Mahner)</Text>

            <View style={styles.philoCard}>
              <View style={styles.philoCardHeader}>
                <View style={[styles.philoDot, { backgroundColor: '#38bdf8' }]} />
                <Text style={styles.philoCardTitle}>Plasticidad Conductual & Aprendizaje</Text>
              </View>
              <Text style={styles.philoCardText}>{philosophy.plasticityText}</Text>
            </View>

            <View style={styles.philoCard}>
              <View style={styles.philoCardHeader}>
                <View style={[styles.philoDot, { backgroundColor: '#ec4899' }]} />
                <Text style={styles.philoCardTitle}>Dinámica Ideológica & Coerción Social</Text>
              </View>
              <Text style={styles.philoCardText}>{philosophy.ideologyText}</Text>
            </View>

            <View style={styles.philoCard}>
              <View style={styles.philoCardHeader}>
                <View style={[styles.philoDot, { backgroundColor: '#eab308' }]} />
                <Text style={styles.philoCardTitle}>Riesgo de Parasitoidismo & Colapso</Text>
              </View>
              <Text style={styles.philoCardText}>{philosophy.parasitoidismText}</Text>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 2: GRÁFICOS DINÁMICOS VECTORIALES                     */}
        {/* ============================================================== */}
        {activeTab === 'graficos' && (
          <View style={styles.section}>
            {/* Selector de Modo de Gráfico */}
            <View style={styles.chartModeSelector}>
              <TouchableOpacity
                onPress={() => setChartMode('temporal')}
                style={[styles.chartModeBtn, chartMode === 'temporal' && styles.chartModeBtnActive]}
              >
                <Text style={[styles.chartModeBtnText, chartMode === 'temporal' && styles.chartModeBtnTextActive]}>
                  Serie Temporal (t vs Población)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setChartMode('fases')}
                style={[styles.chartModeBtn, chartMode === 'fases' && styles.chartModeBtnActive]}
              >
                <Text style={[styles.chartModeBtnText, chartMode === 'fases' && styles.chartModeBtnTextActive]}>
                  Espacio de Fases (P vs D)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Renderizado de Gráfico Vectorial */}
            <View style={styles.chartContainer}>
              {chartMode === 'temporal' ? (
                <RenderTemporalChart
                  timeArr={timeArr}
                  preyArr={preyArr}
                  predatorArr={predatorArr}
                  labelPrey={labelPrey}
                  labelPred={labelPred}
                />
              ) : (
                <RenderPhaseChart
                  phasePoints={phasePoints}
                  stability={stability}
                  labelPrey={labelPrey}
                  labelPred={labelPred}
                />
              )}
            </View>

            {/* Leyenda */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#10b981' }]} />
                <Text style={styles.legendText}>{labelPrey}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#f43f5e' }]} />
                <Text style={styles.legendText}>{labelPred}</Text>
              </View>
              {chartMode === 'fases' && stability.equilibriumPoint && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendIndicator, { backgroundColor: '#38bdf8' }]} />
                  <Text style={styles.legendText}>Punto Fijo (Equilibrio)</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 3: TABLA DE DATOS                                     */}
        {/* ============================================================== */}
        {activeTab === 'tabla' && (
          <View style={styles.section}>
            <View style={styles.tableControls}>
              <Text style={styles.tableControlsLabel}>Frecuencia de Muestreo:</Text>
              <View style={styles.intervalButtons}>
                {[1, 5, 10, 20].map((step) => (
                  <TouchableOpacity
                    key={step}
                    onPress={() => setTableInterval(step)}
                    style={[styles.intervalBtn, tableInterval === step && styles.intervalBtnActive]}
                  >
                    <Text style={[styles.intervalBtnText, tableInterval === step && styles.intervalBtnTextActive]}>
                      Cada {step}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tabla Estilizada */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, { width: 50 }]}>t</Text>
                <Text style={[styles.th, { flex: 1 }]}>{isBio ? 'Presas (P)' : 'Pasivos (X₁)'}</Text>
                <Text style={[styles.th, { flex: 1 }]}>{isBio ? 'Depred. (D)' : 'Radicales (X₂)'}</Text>
                <Text style={[styles.th, { width: 120, textAlign: 'right' }]}>Estado</Text>
              </View>

              {filteredTableData.map((row, idx) => (
                <View key={idx} style={[styles.tableDataRow, idx % 2 === 1 && styles.tableDataRowAlt]}>
                  <Text style={[styles.td, { width: 50, color: '#94a3b8', fontWeight: '700' }]}>{row.t}</Text>
                  <Text style={[styles.td, { flex: 1, color: '#10b981', fontWeight: '600' }]}>
                    {formatNumber(row.prey)}
                  </Text>
                  <Text style={[styles.td, { flex: 1, color: '#f43f5e', fontWeight: '600' }]}>
                    {formatNumber(row.pred)}
                  </Text>
                  <Text style={[styles.tdStatus, { width: 120 }]}>{row.status}</Text>
                </View>
              ))}
            </View>

            {/* Botón de Exportación */}
            <TouchableOpacity onPress={handleExportJSON} style={styles.exportBtn}>
              <Text style={styles.exportBtnText}>
                {copiedNotification ? '✓ ¡Datos Exportados Exitosamente!' : '📥 Exportar Conjunto de Datos (JSON)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 4: RIGOR MATEMÁTICO                                   */}
        {/* ============================================================== */}
        {activeTab === 'matematica' && (
          <View style={styles.section}>
            <View style={styles.mathCard}>
              <Text style={styles.mathCardTitle}>Ecuaciones Diferenciales del Sistema</Text>
              {isBio ? (
                <View style={styles.equationBox}>
                  <Text style={styles.equationText}>dP/dt = r₁ · P - a₁ · P · D</Text>
                  <Text style={styles.equationText}>dD/dt = a₂ · P · D - r₂ · D</Text>
                </View>
              ) : (
                <View style={styles.equationBox}>
                  <Text style={styles.equationText}>dX₁/dt = a₁₁ · X₁ + a₁₂ · X₂</Text>
                  <Text style={styles.equationText}>dX₂/dt = a₂₁ · X₁ + a₂₂ · X₂</Text>
                </View>
              )}

              <Text style={styles.mathCardSub}>Invariantes & Espectro de Autovalores</Text>
              <View style={styles.mathGrid}>
                <View style={styles.mathGridItem}>
                  <Text style={styles.mathGridLabel}>Traza Tr(A)</Text>
                  <Text style={styles.mathGridVal}>{stability.trace.toFixed(4)}</Text>
                </View>
                <View style={styles.mathGridItem}>
                  <Text style={styles.mathGridLabel}>Determinante Det(A)</Text>
                  <Text style={styles.mathGridVal}>{stability.det.toFixed(4)}</Text>
                </View>
                <View style={styles.mathGridItem}>
                  <Text style={styles.mathGridLabel}>Discriminante Δ</Text>
                  <Text style={styles.mathGridVal}>{stability.discriminant.toFixed(4)}</Text>
                </View>
                <View style={styles.mathGridItem}>
                  <Text style={styles.mathGridLabel}>Autovalores λ₁,₂</Text>
                  <Text style={styles.mathGridVal}>{stability.eigenvalues.join(', ')}</Text>
                </View>
              </View>

              {stability.equilibriumPoint && (
                <View style={styles.equilibriumBox}>
                  <Text style={styles.equilibriumLabel}>Punto de Equilibrio (X*, Y*):</Text>
                  <Text style={styles.equilibriumVal}>
                    ({formatNumber(stability.equilibriumPoint.x)}, {formatNumber(stability.equilibriumPoint.y)})
                  </Text>
                </View>
              )}

              <Text style={styles.mathCardSub}>Fundamentación de Estabilidad Dinámica</Text>
              <View style={styles.theoremBox}>
                <Text style={styles.theoremText}>{stability.theoremText}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botones de Pie para Continuar o Reajustar */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onModifyParams} style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>✏️ Modificar Parámetros</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRestart} style={styles.btnRestart}>
            <Text style={styles.btnRestartText}>🔄 Nueva Simulación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// ==========================================
// Componente de Gráfico de Serie Temporal
// ==========================================
function RenderTemporalChart({
  timeArr,
  preyArr,
  predatorArr,
  labelPrey,
  labelPred,
}: {
  timeArr: number[];
  preyArr: number[];
  predatorArr: number[];
  labelPrey: string;
  labelPred: string;
}) {
  const maxVal = Math.max(...preyArr, ...predatorArr, 1);
  const sampleSteps = Math.max(1, Math.floor(timeArr.length / 30));
  const points = [];

  for (let i = 0; i < timeArr.length; i += sampleSteps) {
    points.push({
      t: timeArr[i],
      prey: preyArr[i],
      pred: predatorArr[i],
      preyNorm: Math.min(100, Math.max(0, (preyArr[i] / maxVal) * 100)),
      predNorm: Math.min(100, Math.max(0, (predatorArr[i] / maxVal) * 100)),
    });
  }

  return (
    <View style={styles.chartWrapper}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>Evolución Temporal de Poblaciones</Text>
          <Text style={styles.chartMaxNote}>
            {labelPrey} vs {labelPred}
          </Text>
        </View>
        <Text style={styles.chartMaxNote}>Max: {formatNumber(maxVal)}</Text>
      </View>

      <View style={styles.chartCanvas}>
        {/* Ejes y líneas de cuadrícula */}
        <View style={[styles.gridLine, { top: '25%' }]} />
        <View style={[styles.gridLine, { top: '50%' }]} />
        <View style={[styles.gridLine, { top: '75%' }]} />

        {/* Barras de puntos distribuidos */}
        <View style={styles.temporalPlotArea}>
          {points.map((pt, idx) => (
            <View key={idx} style={styles.temporalColumn}>
              {/* Indicador de Presa */}
              <View
                style={[
                  styles.plotPoint,
                  {
                    backgroundColor: '#10b981',
                    bottom: `${pt.preyNorm}%`,
                  },
                ]}
              />
              {/* Indicador de Depredador */}
              <View
                style={[
                  styles.plotPoint,
                  {
                    backgroundColor: '#f43f5e',
                    bottom: `${pt.predNorm}%`,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.xAxis}>
        <Text style={styles.axisLabel}>t = 0</Text>
        <Text style={styles.axisLabel}>t = {Math.round(timeArr[timeArr.length - 1] / 2)}</Text>
        <Text style={styles.axisLabel}>t = {timeArr[timeArr.length - 1]}</Text>
      </View>
    </View>
  );
}

// ==========================================
// Componente de Gráfico de Plano de Fases
// ==========================================
function RenderPhaseChart({
  phasePoints,
  stability,
  labelPrey,
  labelPred,
}: {
  phasePoints: { x: number; y: number; t: number }[];
  stability: any;
  labelPrey: string;
  labelPred: string;
}) {
  const maxX = Math.max(...phasePoints.map((p) => p.x), 1);
  const maxY = Math.max(...phasePoints.map((p) => p.y), 1);
  const sampleSteps = Math.max(1, Math.floor(phasePoints.length / 40));

  const sampledPoints = [];
  for (let i = 0; i < phasePoints.length; i += sampleSteps) {
    const pt = phasePoints[i];
    sampledPoints.push({
      xNorm: Math.min(100, Math.max(0, (pt.x / maxX) * 100)),
      yNorm: Math.min(100, Math.max(0, (pt.y / maxY) * 100)),
      t: pt.t,
    });
  }

  const eqPoint = stability.equilibriumPoint;
  const eqXNorm = eqPoint && maxX > 0 ? Math.min(100, Math.max(0, (eqPoint.x / maxX) * 100)) : null;
  const eqYNorm = eqPoint && maxY > 0 ? Math.min(100, Math.max(0, (eqPoint.y / maxY) * 100)) : null;

  return (
    <View style={styles.chartWrapper}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Trayectoria en el Espacio de Fases</Text>
        <Text style={styles.chartMaxNote}>
          Eje X: {labelPrey} | Eje Y: {labelPred}
        </Text>
      </View>

      <View style={styles.chartCanvas}>
        {/* Cuadrícula */}
        <View style={[styles.gridLine, { top: '33%' }]} />
        <View style={[styles.gridLine, { top: '66%' }]} />
        <View style={[styles.gridLineVertical, { left: '33%' }]} />
        <View style={[styles.gridLineVertical, { left: '66%' }]} />

        {/* Puntos de Trayectoria de Fase */}
        {sampledPoints.map((pt, idx) => (
          <View
            key={idx}
            style={[
              styles.phaseOrbitPoint,
              {
                left: `${pt.xNorm}%`,
                bottom: `${pt.yNorm}%`,
                opacity: 0.4 + (idx / sampledPoints.length) * 0.6,
              },
            ]}
          />
        ))}

        {/* Punto de Equilibrio Teórico */}
        {eqXNorm !== null && eqYNorm !== null && (
          <View
            style={[
              styles.phaseEqPoint,
              {
                left: `${eqXNorm}%`,
                bottom: `${eqYNorm}%`,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.xAxis}>
        <Text style={styles.axisLabel}>0</Text>
        <Text style={styles.axisLabel}>{labelPrey} →</Text>
        <Text style={styles.axisLabel}>{formatNumber(maxX)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#6366f1',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  verdictCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    borderWidth: 1,
    borderColor: '#334155',
  },
  verdictStable: {
    borderLeftColor: '#10b981',
  },
  verdictUnstable: {
    borderLeftColor: '#f43f5e',
  },
  verdictSaddle: {
    borderLeftColor: '#f59e0b',
  },
  verdictNeutral: {
    borderLeftColor: '#38bdf8',
  },
  verdictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  verdictTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  stabilityBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stabilityBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  verdictBody: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricSub: {
    fontSize: 11,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  metricMinMax: {
    fontSize: 10,
    color: '#64748b',
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 6,
  },
  philoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  philoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  philoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  philoCardTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '700',
  },
  philoCardText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  chartModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartModeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  chartModeBtnActive: {
    backgroundColor: '#4f46e5',
  },
  chartModeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  chartModeBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  chartContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartWrapper: {
    width: '100%',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  chartMaxNote: {
    color: '#64748b',
    fontSize: 11,
  },
  chartCanvas: {
    height: 220,
    backgroundColor: '#090d16',
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#1e293b',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1e293b',
  },
  temporalPlotArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  temporalColumn: {
    width: 6,
    height: '100%',
    position: 'relative',
  },
  plotPoint: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  axisLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  phaseOrbitPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ec4899',
  },
  phaseEqPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38bdf8',
    borderWidth: 2,
    borderColor: '#ffffff',
    transform: [{ translateX: -6 }, { translateY: 6 }],
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  tableControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  tableControlsLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  intervalButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  intervalBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  intervalBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#4f46e5',
  },
  intervalBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  intervalBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tableCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  th: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    alignItems: 'center',
  },
  tableDataRowAlt: {
    backgroundColor: '#162032',
  },
  td: {
    fontSize: 12,
  },
  tdStatus: {
    fontSize: 10,
    color: '#a5b4fc',
    fontWeight: '600',
    textAlign: 'right',
  },
  exportBtn: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4f46e5',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  exportBtnText: {
    color: '#c7d2fe',
    fontSize: 13,
    fontWeight: '700',
  },
  mathCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  mathCardTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  mathCardSub: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  equationBox: {
    backgroundColor: '#090d16',
    padding: 14,
    borderRadius: 8,
    gap: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#38bdf8',
  },
  equationText: {
    fontFamily: 'monospace',
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
  },
  mathGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mathGridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mathGridLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
  },
  mathGridVal: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  equilibriumBox: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  equilibriumLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  equilibriumVal: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  theoremBox: {
    backgroundColor: '#090d16',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  theoremText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 13,
  },
  btnRestart: {
    flex: 1,
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnRestartText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});

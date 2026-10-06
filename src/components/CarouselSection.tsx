import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CarouselSlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  content: string[];
  formula?: string;
  tags: string[];
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'intro',
    badge: 'PARADIGMA UNIFICADO',
    badgeColor: '#6366f1',
    title: 'Simulador Presa - Depredador',
    subtitle: 'De la Biología Ecosistémica a la Dinámica Social y Política',
    content: [
      'Esta aplicación modela interacciones competitivas y de supervivencia donde una entidad depende de la existencia de otra.',
      'Descubre cómo las ecuaciones matemáticas desarrolladas para peces y linces en la naturaleza se aplican de forma idéntica a la dialéctica entre grupos sociales pasivos y radicales totalitarios.',
      'Compara predicciones biológicas y sociológicas con rigor analítico, gráficos de fase e interpretación filosófica.',
    ],
    tags: ['Lotka-Volterra', 'Mario Bunge', 'Runge-Kutta 4', 'Sistemas Complejos'],
  },
  {
    id: 'biological',
    badge: 'MODELO BIOLÓGICO',
    badgeColor: '#10b981',
    title: 'Ecosistemas Naturales (Lotka-Volterra)',
    subtitle: 'Oscilaciones periódicas y conservación de la biodiversidad',
    formula: 'dP/dt = r₁P - a₁PD  |  dD/dt = a₂PD - r₂D',
    content: [
      'Presas (P): Se reproducen de forma malthusiana con tasa natural r₁ en ausencia de cazadores.',
      'Depredadores (D): Dependen de las colisiones con presas para sobrevivir y engendrar crías (a₂), muriendo por senescencia a ritmo r₂.',
      'Comportamiento emergente: Órbitas periódicas cerradas sin amortiguación. El aumento de presas alimenta el auge de depredadores, cuyo exceso agota a las presas y provoca hambruna predatoria cíclica.',
    ],
    tags: ['Equilibrio Ecológico', 'Ciclo Periódico', 'Plano de Fases', 'Sinusoides'],
  },
  {
    id: 'social',
    badge: 'MODELO SOCIOLÓGICO',
    badgeColor: '#ec4899',
    title: 'Dialéctica Social e Ideología (Mario Bunge)',
    subtitle: 'Coerción institucional, plasticidad neural y dogmatismo',
    formula: 'dX₁/dt = a₁₁X₁ + a₁₂X₂  |  dX₂/dt = a₂₁X₁ + a₂₂X₂',
    content: [
      'Población Pasiva / Moderada (X₁): Representa la mayoría ciudadana civil y productiva.',
      'Población Radical / Coercitiva (X₂): Representa corrientes extremistas que buscan hegemonía.',
      'Matriz de Interacción: Los coeficientes a₁₁ y a₂₂ miden la plasticidad neuronal y auto-regulación de cada facción; los términos cruzados (a₁₂, a₂₁) modelan el acoso coercitivo y el reclutamiento militante.',
    ],
    tags: ['Plasticidad Neural', 'Coerción Social', 'Hegemonía', 'Fanatismo'],
  },
  {
    id: 'parasitoidism',
    badge: 'ALERTA DE SISTEMA',
    badgeColor: '#ef4444',
    title: 'El Fenómeno del Parasitoidismo Extremo',
    subtitle: 'Cuando el triunfo del depredador engendra su propia aniquilación',
    content: [
      'En parasitología, un parasitoide devora a su anfitrión hasta matarlo, a diferencia del parásito que procura mantenerlo vivo.',
      'En regímenes autoritarios o predación desmedida: si el grupo radical destruye por completo la base social que lo sustenta, se extingue a sí mismo en una implosión inmediata.',
      'La simulación alerta sobre este punto de inflexión donde la ambición desmedida extingue a la totalidad del sistema.',
    ],
    tags: ['Colapso Trófico', 'Extinción Mutua', 'Totalitarismo', 'Sostenibilidad'],
  },
  {
    id: 'mathematics',
    badge: 'RIGOR CIENTÍFICO',
    badgeColor: '#f59e0b',
    title: 'Análisis Matemático & Estabilidad de Lyapunov',
    subtitle: 'Autovalores, discriminantes y espacios de fase',
    formula: 'Det(A - λI) = λ² - Tr(A)λ + Det(A) = 0',
    content: [
      'Integrador Numérico RK4: Precisión de cuarto orden Runge-Kutta para capturar no-linealidades sin acumulación de error espurio.',
      'Clasificación Topológica: Identificación automática de Puntos de Silla (inestabilidad de Chetaev), Focos Espirales estables/inestables, Nodos y Centros neutros.',
      'Espacio de Fases Cartesiano: Trazo de la órbita (P vs D) y coordenadas del atractor.',
    ],
    tags: ['Runge-Kutta 4', 'Lyapunov', 'Chetaev', 'Punto de Silla'],
  },
  {
    id: 'timeline-guide',
    badge: 'MODO DE USO',
    badgeColor: '#8b5cf6',
    title: 'Flujo Interactivo en Modo Timeline',
    subtitle: 'Un asistente cronológico guiado en 5 estaciones clave',
    content: [
      'Paso 1: Selección de Paradigma (Biológico vs Social) o carga de Presets históricos.',
      'Paso 2: Parámetros demográficos iniciales y horizonte temporal de simulación.',
      'Paso 3: Matriz de interacciones, tasas de depredación y auto-regulación.',
      'Paso 4: Auditoría de parámetros y ejecución del cálculo numérico RK4.',
      'Paso 5: Exploración multidimensional en Tablas, Gráficos vectoriales y Diagnóstico.',
    ],
    tags: ['Paso a Paso', 'Timeline Interactivo', 'Presets Listos', 'Reporte Total'],
  },
];

interface CarouselSectionProps {
  onStartSimulation: () => void;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({ onStartSimulation }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentSlide = SLIDES[activeIndex];

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      onStartSimulation();
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>SIMULADOR DINÁMICO</Text>
        </View>
        <Text style={styles.mainTitle}>Exploración & Teoría</Text>
        <Text style={styles.mainSubtitle}>
          Recorre las secciones del carrusel para comprender las bases científicas y filosóficas de la app
        </Text>
      </View>

      {/* Indicadores de Paginación */}
      <View style={styles.paginationTrack}>
        {SLIDES.map((slide, idx) => (
          <TouchableOpacity
            key={slide.id}
            onPress={() => setActiveIndex(idx)}
            style={[
              styles.dot,
              idx === activeIndex && [styles.dotActive, { backgroundColor: slide.badgeColor }],
            ]}
          />
        ))}
      </View>

      {/* Tarjeta Principal del Slide Activo */}
      <View style={[styles.card, { borderTopColor: currentSlide.badgeColor }]}>
        <View style={styles.slideHeader}>
          <View style={[styles.badgeContainer, { backgroundColor: `${currentSlide.badgeColor}22` }]}>
            <Text style={[styles.badgeText, { color: currentSlide.badgeColor }]}>
              {currentSlide.badge}
            </Text>
          </View>
          <Text style={styles.slideCounter}>
            Sección {activeIndex + 1} de {SLIDES.length}
          </Text>
        </View>

        <Text style={styles.slideTitle}>{currentSlide.title}</Text>
        <Text style={styles.slideSubtitle}>{currentSlide.subtitle}</Text>

        {currentSlide.formula && (
          <View style={styles.formulaBox}>
            <Text style={styles.formulaLabel}>Ecuación Gobernante:</Text>
            <Text style={styles.formulaText}>{currentSlide.formula}</Text>
          </View>
        )}

        <View style={styles.contentList}>
          {currentSlide.content.map((paragraph, index) => (
            <View key={index} style={styles.contentItem}>
              <View style={[styles.bullet, { backgroundColor: currentSlide.badgeColor }]} />
              <Text style={styles.contentText}>{paragraph}</Text>
            </View>
          ))}
        </View>

        {/* Etiquetas / Tags */}
        <View style={styles.tagRow}>
          {currentSlide.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Controles de Navegación del Carrusel */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={activeIndex === 0}
          style={[styles.navButton, activeIndex === 0 && styles.navButtonDisabled]}
        >
          <Text style={[styles.navButtonText, activeIndex === 0 && styles.navButtonTextDisabled]}>
            ← Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={[styles.navButton, styles.navButtonPrimary]}>
          <Text style={styles.navButtonPrimaryText}>
            {activeIndex === SLIDES.length - 1 ? 'Iniciar Simulación 🚀' : 'Siguiente →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Acceso Rápido Directo al Simulador */}
      <TouchableOpacity onPress={onStartSimulation} style={styles.launchBanner}>
        <View style={styles.launchBannerContent}>
          <Text style={styles.launchBannerTitle}>¿Listo para simular?</Text>
          <Text style={styles.launchBannerSub}>
            Accede al Simulador en Modo Timeline con 5 pasos y análisis completo
          </Text>
        </View>
        <View style={styles.launchBannerAction}>
          <Text style={styles.launchBannerActionText}>Ir al Timeline →</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  logoBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 500,
  },
  paginationTrack: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#334155',
  },
  dotActive: {
    width: 28,
    height: 10,
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#334155',
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    marginBottom: 20,
  },
  slideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  slideCounter: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 28,
  },
  slideSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#38bdf8',
    marginBottom: 18,
    lineHeight: 20,
  },
  formulaBox: {
    backgroundColor: '#090d16',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#38bdf8',
    marginBottom: 18,
  },
  formulaLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  formulaText: {
    fontFamily: 'monospace',
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
  },
  contentList: {
    gap: 14,
    marginBottom: 20,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  contentText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  tag: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  tagText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 22,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 14,
  },
  navButtonTextDisabled: {
    color: '#64748b',
  },
  navButtonPrimary: {
    backgroundColor: '#6366f1',
    borderColor: '#4f46e5',
  },
  navButtonPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  launchBanner: {
    backgroundColor: '#1e1b4b',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#4338ca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  launchBannerContent: {
    flex: 1,
    marginRight: 10,
  },
  launchBannerTitle: {
    color: '#e0e7ff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  launchBannerSub: {
    color: '#a5b4fc',
    fontSize: 12,
    lineHeight: 16,
  },
  launchBannerAction: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  launchBannerActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});

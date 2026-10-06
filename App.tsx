import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CarouselSection } from './src/components/CarouselSection';
import { TimelineSimulator } from './src/components/TimelineSimulator';

export default function App() {
  const [currentView, setCurrentView] = useState<'carousel' | 'timeline'>('carousel');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Barra de Navegación Superior */}
      <View style={styles.topNav}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>λ</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Simulador Presa-Depredador</Text>
            <Text style={styles.brandSubtitle}>Biología Ecosistémica & Dinámica Social</Text>
          </View>
        </View>

        {/* Interruptor de Vista Principal */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            onPress={() => setCurrentView('carousel')}
            style={[styles.segmentBtn, currentView === 'carousel' && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentBtnText, currentView === 'carousel' && styles.segmentBtnTextActive]}>
              🎠 Carrusel Informativo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCurrentView('timeline')}
            style={[styles.segmentBtn, currentView === 'timeline' && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentBtnText, currentView === 'timeline' && styles.segmentBtnTextActive]}>
              ⏱️ Simulación Timeline
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenedor de la Vista Activa */}
      <View style={styles.mainContent}>
        {currentView === 'carousel' ? (
          <CarouselSection onStartSimulation={() => setCurrentView('timeline')} />
        ) : (
          <TimelineSimulator />
        )}
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  topNav: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  brandBadgeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  brandTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 7,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  segmentBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});

# Simulador Presa-Depredador (React Native Puro) 🌿🏛️

Aplicación desarrollada en **React Native Puro** (arquitectura de componentes nativos `View`, `Text`, `ScrollView`, `StyleSheet`, `TouchableOpacity`, etc.) con soporte universal tanto para plataformas móviles (**iOS** y **Android**) como para navegador (**Web** a través de `react-native-web` y Vite).

---

## 🚀 Características Principales

### 1. 🎠 Carrusel Informativo & Teórico
Sustituye la portada tradicional por un carrusel navegable con diapositivas detalladas que explican el funcionamiento y los fundamentos científicos:
- **Sección 1: Paradigma Unificado**: Introducción al análisis de dinámicas de supervivencia y competencia.
- **Sección 2: Modelo Biológico**: Ecuaciones no lineales de Lotka-Volterra, ciclos periódicos y plano de fases.
- **Sección 3: Modelo Sociológico (Mario Bunge & Martin Mahner)**: Dialéctica entre poblaciones pasivas (mayorías) y radicales (extremistas), matrices de coerción y aprendizaje conductual.
- **Sección 4: Alerta de Parasitoidismo**: Explicación del colapso de regímenes y ecosistemas cuando el depredador o grupo radical extermina a su huésped.
- **Sección 5: Rigor Matemático**: Integrador numérico Runge-Kutta 4 (RK4), autovalores, traza, determinante y teoremas de estabilidad de Lyapunov y Chetaev.
- **Sección 6: Guía del Simulador Timeline**: Explicación del flujo asistido paso a paso.

---

### 2. ⏱️ Simulador en Modo Timeline (Asistente Cronológico)
Estructura paso a paso guiada por una línea de tiempo para la recolección ordenada de datos:

1. **Paso 1: Paradigma & Modelo**:
   - Selección entre **Modelo Biológico (Lotka-Volterra)** o **Modelo Social / Ideológico (Sistema Lineal)**.
   - Selector de Presets predefinidos (*Lotka-Volterra Base*, *Parasitoidismo Extremo*, *Punto de Silla*, *Paz Social*, *Guerra Ideológica*, *Sinergia Pluralista*).
2. **Paso 2: Poblaciones Iniciales & Horizonte Temporal**:
   - Ajuste de Presas $P_0$ o Población Pasiva $X_1(0)$.
   - Ajuste de Depredadores $D_0$ o Población Radical $X_2(0)$.
   - Horizonte temporal $T$ (ciclos / años).
   - Botones táctiles de ajuste rápido (+/-).
3. **Paso 3: Dinámica de Interacción & Matriz**:
   - Biológico: Natalidad $r_1$, Eficiencia de caza $a_1$, Conversión/reproducción $a_2$, Mortalidad $r_2$.
   - Social: Matriz $A$ de 2x2 ($a_{11}$ plasticidad pasiva, $a_{12}$ coerción radical, $a_{21}$ reclutamiento, $a_{22}$ dogmatismo).
4. **Paso 4: Auditoría & Ejecución RK4**:
   - Ficha técnica resumen de los parámetros configurados.
   - Botón de disparo del integrador Runge-Kutta de 4º orden.
5. **Paso 5: Exposición Multidimensional de Resultados**:
   - **📊 Resúmenes & Diagnósticos**: Métricas iniciales vs finales, variaciones porcentuales, picos, mínimos, diagnóstico de plasticidad neural, coerción ideológica y parasitoidismo.
   - **📈 Gráficos Dinámicos**:
     - *Serie Temporal*: Curvas de evolución de ambas poblaciones a lo largo de $t$.
     - *Espacio de Fases*: Órbitas en el plano cartesiano $X$ vs $Y$ con punto de equilibrio teórico.
   - **📋 Tablas de Datos**: Muestreo con frecuencia configurable (cada 1, 5, 10 o 20 pasos), indicadores de estado y botón de exportación en JSON.
   - **📐 Rigor Matemático**: Ecuaciones gobernantes, traza, determinante, discriminante, autovalores $\lambda_{1,2}$ y teorema de Lyapunov/Chetaev.

---

## 🛠️ Comandos de Ejecución

### En la Web (Vista Rápida en Navegador):
```bash
# Iniciar servidor local Vite en el puerto 3000
npm run web

# Compilar para producción web
npm run build:web
```

### En Dispositivos Móviles (React Native CLI):
```bash
# Iniciar el empaquetador Metro
npm start

# Ejecutar en Android (con emulador o dispositivo conectado)
npm run android

# Ejecutar en iOS (macOS con Xcode y simulador)
cd ios && pod install && cd ..
npm run ios
```

---

## 📁 Estructura del Proyecto

```
sim-presa-depred-app/
├── App.tsx                      # Componente principal con barra de navegación superior
├── index.js                     # Punto de entrada para iOS / Android
├── index.web.tsx                # Punto de entrada web (AppRegistry)
├── index.html                   # Shell HTML para Vite
├── vite.config.ts               # Configuración de alias react-native -> react-native-web
├── package.json                 # Scripts y dependencias
├── src/
│   ├── types/
│   │   └── simulation.ts        # Tipos e interfaces TypeScript
│   ├── data/
│   │   └── presets.ts           # Presets biológicos y sociales
│   ├── utils/
│   │   └── mathEngine.ts        # Integrador numérico RK4 y diagnósticos
│   └── components/
│       ├── CarouselSection.tsx  # Carrusel con secciones explicativas
│       ├── TimelineSimulator.tsx # Asistente interactivo en modo timeline
│       └── ResultsExhibition.tsx # Tablas, gráficos vectoriales y resúmenes
```

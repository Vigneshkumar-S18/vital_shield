# VitalShield 🛡️ — Personalized Physiological & Emergency Safety Platform

> **"Normal is not the same for everyone."**
> 
> People safer. Days healthier. A brighter tomorrow.

VitalShield is a wearable-connected mobile safety and health platform designed to continuously monitor physiological vitals (heart rate, SpO₂, temperature, activity, and ambient environment), establish personalized adaptive baselines, and provide life-critical emergency SOS communication with real-time location tracking and safety mesh network fallback.

---

## 📱 Complete 9-Screen Frontend Implementation

The frontend is faithfully designed and built from the complete design mockups:

1. **Welcome Screen**: Scenic brand entry (*"Stronger. Safer. Brighter."*), brand ethos, and *"Let's Begin →"* transition.
2. **Home Dashboard**: Daily at-a-glance status, user profile & greeting, notification bell, organic breathing watercolor health aura (*"You're doing well - Vitals within normal range"*), 4 real-time metric cards, and mountain landscape illustration.
3. **Live Monitoring**: Real-time physiological workspace featuring animated waveform sparkline charts (Heart Rate 60–120 bpm, SpO₂ 85–100%, Body Temperature 35–40°C, Activity histogram) and Live Stress Index based on personal baseline. Includes an **Environment** tab with ambient temperature, humidity, and hardware sensor diagnostics.
4. **Safety Center**: Emergency control hub featuring a 3-second hold-to-activate circular progress SOS button with ripple animations, quick actions (*Share Live Location*, *Send Vitals Snapshot*, *Notify Contacts*), and direct-call emergency contact cards.
5. **Insights**: Intelligence layer with Health Score (86/100, +12%), Today/Week/Month toggles, explainable insight breakdowns (*What changed? What contributed? What remained stable? Suggested actions*), and inspirational reflection cards.
6. **Live Location Tracking**: Activated during an SOS emergency; displays a city street grid map with pulsing concentric radar rings, GPS beacon, coordinates (`12.9716° N, 77.5946° E`), temporary shareable tracking link generation, and contact notification delivery confirmation.
7. **Health Report**: Historical trends across Day, Week, and Month with date switching, circular progress score gauge, detailed average metrics, and full report export (PDF/CSV).
8. **Emergency Contacts**: Contact management with Primary/Secondary priorities, direct calling, Add Contact modal, and granular toggles for emergency data sharing (Location, Health Snapshot, Device Status).
9. **Settings**: Device management (*VitalShield VS-001 connected • 82%*), sensor calibration check, app preferences, privacy architecture, support, and handwritten signature (*"You Matter. Stay Safe ♡"*).

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Pure Vanilla CSS Design System with custom HSL tokens, micro-animations, and responsive viewport
- **Icons**: Hand-crafted pixel-perfect SVG icon set matching design specs
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Caveat*, *Playfair Display*)
- **Platform**: Multi-mode viewer supporting realistic mobile device frame (iPhone 15 Pro form factor) and full-screen responsive view

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20+)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Vigneshkumar-S18/vital_shield.git
cd vital_shield

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5174/` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

MIT License. Designed & Developed for VitalShield.

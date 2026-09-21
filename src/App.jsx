import React from 'react';
import { useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MonitorScreen } from './screens/MonitorScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { LiveLocationScreen } from './screens/LiveLocationScreen';
import { HealthReportScreen } from './screens/HealthReportScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export function App() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'home':
        return <HomeScreen />;
      case 'monitor':
        return <MonitorScreen />;
      case 'safety':
        return <SafetyScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'live_location':
        return <LiveLocationScreen />;
      case 'reports':
        return <HealthReportScreen />;
      case 'contacts':
        return <ContactsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return <MobileFrame>{renderScreen()}</MobileFrame>;
}

export default App;

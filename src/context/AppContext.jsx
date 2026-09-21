import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUserProfile,
  initialContacts,
  initialVitals,
  initialNotifications,
  healthReportsData,
  keyInsightsData,
  sensorDiagnostics,
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState('welcome'); // 'welcome', 'home', 'monitor', 'safety', 'insights', 'live_location', 'reports', 'contacts', 'settings'
  const [activeBottomTab, setActiveBottomTab] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Sub-tabs
  const [homeSubTab, setHomeSubTab] = useState('live'); // 'live', 'today', 'insights'
  const [monitorSubTab, setMonitorSubTab] = useState('vitals'); // 'vitals', 'environment'
  const [safetySubTab, setSafetySubTab] = useState('sos'); // 'sos', 'network'
  const [insightsSubTab, setInsightsSubTab] = useState('today'); // 'today', 'week', 'month'
  const [reportsSubTab, setReportsSubTab] = useState('day'); // 'day', 'week', 'month'

  // User & Device
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [contacts, setContacts] = useState(initialContacts);
  const [notifications, setNotifications] = useState(initialNotifications);

  // SOS & Emergency
  const [isSosActive, setIsSosActive] = useState(false);
  const [sosActiveTime, setSosActiveTime] = useState(null);
  const [sharingSettings, setSharingSettings] = useState({
    location: true,
    healthSnapshot: true,
    deviceStatus: true,
  });

  // Vitals State & Live Simulation
  const [vitals, setVitals] = useState(initialVitals);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Modals
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // View frame mode: 'phone' (default iPhone frame) or 'full'
  const [viewMode, setViewMode] = useState('phone');

  // Navigate with stack tracking
  const navigateTo = (screen, tab = null) => {
    setNavigationHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    if (tab) {
      setActiveBottomTab(tab);
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prev = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((h) => h.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
      setActiveBottomTab('home');
    }
  };

  // Switch Bottom Tab
  const selectBottomTab = (tab) => {
    setActiveBottomTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'monitor') setCurrentScreen('monitor');
    else if (tab === 'safety') {
      if (isSosActive) setCurrentScreen('live_location');
      else setCurrentScreen('safety');
    } else if (tab === 'reports') setCurrentScreen('reports');
    else if (tab === 'more') setCurrentScreen('settings');
  };

  // Toast helper
  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  // Realistic subtle vitals micro-drift
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setVitals((prev) => {
        // Micro-jitter: HR 76 - 81 bpm, SpO2 97 - 99%
        const deltaHr = Math.random() > 0.5 ? 1 : -1;
        const newHr = Math.min(84, Math.max(74, prev.heartRate + (Math.random() > 0.6 ? deltaHr : 0)));
        const newSpo2 = Math.min(99, Math.max(97, prev.spo2 + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
        return {
          ...prev,
          heartRate: newHr,
          spo2: newSpo2,
        };
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // SOS activation triggers
  const triggerSos = () => {
    setIsSosActive(true);
    setSosActiveTime(new Date());
    setCurrentScreen('live_location');
    setActiveBottomTab('safety');
    showToast('🚨 SOS Activated! Emergency data dispatched to contacts.');
  };

  const cancelSos = () => {
    setIsSosActive(false);
    setSosActiveTime(null);
    showToast('✓ SOS deactivated. Returned to normal monitoring.');
    setCurrentScreen('safety');
  };

  const addContact = (newContact) => {
    setContacts((prev) => [
      ...prev,
      {
        ...newContact,
        id: `c-${Date.now()}`,
        lastNotified: 'Not yet',
      },
    ]);
    setIsAddContactModalOpen(false);
    showToast(`Added ${newContact.name} to Emergency Contacts.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeBottomTab,
        selectBottomTab,
        navigateTo,
        goBack,
        homeSubTab,
        setHomeSubTab,
        monitorSubTab,
        setMonitorSubTab,
        safetySubTab,
        setSafetySubTab,
        insightsSubTab,
        setInsightsSubTab,
        reportsSubTab,
        setReportsSubTab,
        userProfile,
        setUserProfile,
        contacts,
        addContact,
        sharingSettings,
        setSharingSettings,
        vitals,
        setVitals,
        isSosActive,
        triggerSos,
        cancelSos,
        sosActiveTime,
        notifications,
        setNotifications,
        isDeviceModalOpen,
        setIsDeviceModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAddContactModalOpen,
        setIsAddContactModalOpen,
        toastMessage,
        showToast,
        viewMode,
        setViewMode,
        healthReportsData,
        keyInsightsData,
        sensorDiagnostics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

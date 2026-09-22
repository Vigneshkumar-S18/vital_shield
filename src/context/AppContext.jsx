import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUserProfile,
  initialContacts,
  initialVitals,
  initialNotifications,
  healthReportsData,
  keyInsightsData,
  insightsDataByPeriod,
  sensorDiagnostics,
  nearbyPoliceStations,
} from '../data/initialData';
import { getESP32Data } from '../services/esp32Api';

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

  // ESP32 Integration State
  const [esp32Status, setEsp32Status] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'
  const [gpsData, setGpsData] = useState({
    fix: false,
    latitude: null,
    longitude: null,
    altitude: null,
    speed: null,
    satellites: 0,
  });
  const [esp32Wifi, setEsp32Wifi] = useState({
    connected: false,
    ip: '10.99.16.90',
    rssi: null,
  });
  const [vitalsHistory, setVitalsHistory] = useState([]);

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

  // Real-time ESP32 HTTP Polling every 1000 ms
  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const fetchTelemetry = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const result = await getESP32Data(3000);
        if (!isMounted) return;

        if (result.isConnected && result.data) {
          const d = result.data;
          setEsp32Status('connected');

          setVitals((prev) => {
            // Heart Rate & SpO2: use validated live reading from ESP32
            // If ESP32 reports null (e.g. no finger), pass null so UI shows '--'
            const hr = d.heartRate !== undefined ? d.heartRate : prev.heartRate;
            const spo2 = d.spo2 !== undefined ? d.spo2 : prev.spo2;
            const bodyTemp = d.temperature !== null && d.temperature !== undefined ? d.temperature : prev.bodyTemp;
            const ambientTemp =
              d.dhtTemperature !== null && d.dhtTemperature !== undefined
                ? d.dhtTemperature
                : d.temperature !== null && d.temperature !== undefined
                ? d.temperature
                : prev.ambientTemp;
            const humidity = d.humidity !== null && d.humidity !== undefined ? d.humidity : prev.humidity;
            const pressure = d.pressure !== null && d.pressure !== undefined ? d.pressure : prev.pressure;
            const altitude = d.altitude !== null && d.altitude !== undefined ? d.altitude : prev.altitude;
            const rawAltitude = d.rawAltitude !== null && d.rawAltitude !== undefined ? d.rawAltitude : prev.rawAltitude;
            const acceleration = d.acceleration !== null && d.acceleration !== undefined ? d.acceleration : prev.acceleration;
            const activity = d.activity || prev.activity || 'RESTING';

            let activityLevel = 'Resting';
            if (activity === 'RUNNING') activityLevel = 'Elevated';
            else if (activity === 'WALKING') activityLevel = 'Moderate';

            let stressIndex = 'Low';
            if (hr && hr > 100) stressIndex = 'Elevated';
            else if (hr && hr > 85) stressIndex = 'Moderate';

            return {
              ...prev,
              heartRate: hr,
              spo2: spo2,
              bodyTemp: bodyTemp,
              ambientTemp: ambientTemp,
              humidity: humidity,
              pressure: pressure,
              altitude: altitude,
              rawAltitude: rawAltitude,
              acceleration: acceleration,
              activity: activity,
              activityLevel: activityLevel,
              stressIndex: stressIndex,
            };
          });

          if (d.gps) {
            setGpsData(d.gps);
          }

          if (d.wifi) {
            setEsp32Wifi(d.wifi);
          }

          // Rolling history buffer for charts (last 60 points)
          setVitalsHistory((prevHistory) => {
            const now = new Date();
            const timeLabel = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
            const newPoint = {
              time: timeLabel,
              timestamp: d.timestamp,
              heartRate: d.heartRate,
              spo2: d.spo2,
              bodyTemp: d.temperature,
              ambientTemp: d.dhtTemperature || d.temperature,
              humidity: d.humidity,
              pressure: d.pressure,
              altitude: d.altitude,
              acceleration: d.acceleration,
            };
            const updated = [...prevHistory, newPoint];
            return updated.length > 60 ? updated.slice(-60) : updated;
          });
        } else {
          // ESP32 unreachable: keep previous values, flag disconnected
          setEsp32Status('disconnected');
        }
      } catch {
        if (isMounted) {
          setEsp32Status('disconnected');
        }
      } finally {
        isFetching = false;
      }
    };

    // Initial immediate fetch
    fetchTelemetry();

    // 1000ms polling interval
    const interval = setInterval(fetchTelemetry, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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

  // Dynamic sensor diagnostics reflecting live ESP32 status
  const liveSensorDiagnostics = [
    {
      name: 'Heart Rate (MAX30102)',
      status: esp32Status !== 'connected' ? 'Offline' : vitals.heartRate !== null ? 'Good' : 'Searching (No finger)',
      icon: 'heart',
      samplingRate: '50 Hz',
    },
    {
      name: 'SpO₂ Sensor (MAX30102)',
      status: esp32Status !== 'connected' ? 'Offline' : vitals.spo2 !== null ? 'Good' : 'Searching (No finger)',
      icon: 'droplet',
      samplingRate: '25 Hz',
    },
    {
      name: 'Skin / Body Temp (BMP280)',
      status: esp32Status !== 'connected' ? 'Offline' : vitals.bodyTemp !== null ? 'Good' : 'Offline',
      icon: 'temp',
      samplingRate: '1 Hz',
    },
    {
      name: 'Motion & Activity (MPU6050)',
      status: esp32Status !== 'connected' ? 'Offline' : vitals.acceleration !== null ? 'Good' : 'Offline',
      icon: 'motion',
      samplingRate: '50 Hz',
    },
    {
      name: 'Environment & HW-611 (BMP/DHT)',
      status: esp32Status !== 'connected' ? 'Offline' : vitals.pressure !== null ? 'Good' : 'Calibrating...',
      icon: 'cloud',
      samplingRate: '1 Hz',
    },
    {
      name: 'GNSS Satellite Fix',
      status: esp32Status !== 'connected' ? 'Offline' : gpsData.fix ? 'Fix Acquired' : `Searching (${gpsData.satellites || 0} Sats)`,
      icon: 'gps',
      accuracy: gpsData.fix ? '±5 m' : 'No fix',
    },
  ];

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
        insightsDataByPeriod,
        nearbyPoliceStations,
        sensorDiagnostics: liveSensorDiagnostics,
        esp32Status,
        gpsData,
        esp32Wifi,
        vitalsHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

/**
 * ESP32 Body Monitor API Service
 * Communicates with the physical ESP32 HTTP WebServer at http://10.99.16.90/api/data
 */

export const ESP32_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ESP32_BASE_URL) ||
  'http://10.99.16.90';

/**
 * Validates heart rate in physiological range (30 - 220 BPM)
 */
function validateHeartRate(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return num >= 30 && num <= 220 ? Math.round(num) : null;
}

/**
 * Validates oxygen saturation in valid range (70 - 100 %)
 */
function validateSpO2(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return num >= 70 && num <= 100 ? Math.round(num) : null;
}

/**
 * Validates temperature (°C)
 */
function validateTemp(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return num >= 0 && num <= 60 ? parseFloat(num.toFixed(1)) : null;
}

/**
 * Validates relative humidity (%)
 */
function validateHumidity(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return num >= 0 && num <= 100 ? Math.round(num) : null;
}

/**
 * Validates atmospheric pressure (300 - 1100 hPa)
 */
function validatePressure(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return num >= 300 && num <= 1100 ? parseFloat(num.toFixed(2)) : null;
}

/**
 * Validates altitude in meters (allows negative values for relative altitude below startup level)
 */
function validateAltitude(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return isFinite(num) ? parseFloat(num.toFixed(2)) : null;
}

/**
 * Validates acceleration in g (MPU6050)
 */
function validateAcceleration(val) {
  if (val === null || val === undefined || isNaN(val)) return null;
  const num = Number(val);
  return isFinite(num) ? parseFloat(num.toFixed(2)) : null;
}

/**
 * Normalizes activity label
 */
function normalizeActivity(act) {
  if (!act || typeof act !== 'string') return 'RESTING';
  const upper = act.toUpperCase().trim();
  if (upper.includes('RUN')) return 'RUNNING';
  if (upper.includes('WALK')) return 'WALKING';
  return 'RESTING';
}

/**
 * Fetches real-time sensor data from ESP32 with strict timeout and validation
 * @param {number} timeoutMs - Timeout in milliseconds (default 3000ms)
 * @returns {Promise<{ isConnected: boolean, data?: object, error?: string }>}
 */
export async function getESP32Data(timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${ESP32_BASE_URL.replace(/\/+$/, '')}/api/data`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (!json || typeof json !== 'object') {
      throw new Error('Invalid JSON payload received from ESP32');
    }

    // Clean & validate all telemetry fields
    const validatedData = {
      // MAX30102
      heartRate: validateHeartRate(json.heartRate),
      spo2: validateSpO2(json.spo2),

      // Temperatures & Humidity
      temperature: validateTemp(json.temperature),
      dhtTemperature: validateTemp(json.dhtTemperature),
      humidity: validateHumidity(json.humidity),

      // BMP280 / HW-611 Barometric & Altitude
      pressure: validatePressure(json.pressure),
      altitude: validateAltitude(json.altitude), // Filtered relative altitude (HW-611)
      rawAltitude: validateAltitude(json.rawAltitude),
      barometricAltitude: validateAltitude(json.barometricAltitude),

      // MPU6050 IMU
      acceleration: validateAcceleration(json.acceleration),
      activity: normalizeActivity(json.activity),

      // GPS
      gps: {
        fix: Boolean(json.gps && json.gps.fix),
        latitude: json.gps && json.gps.fix ? json.gps.latitude : null,
        longitude: json.gps && json.gps.fix ? json.gps.longitude : null,
        altitude: json.gps && json.gps.fix ? validateAltitude(json.gps.altitude) : null,
        speed: json.gps && json.gps.fix ? json.gps.speed : null,
        satellites: json.gps && typeof json.gps.satellites === 'number' ? json.gps.satellites : 0,
      },

      // WiFi & Network
      wifi: {
        connected: Boolean(json.wifi && json.wifi.connected),
        ip: (json.wifi && json.wifi.ip) || '10.99.16.90',
        rssi: json.wifi && typeof json.wifi.rssi === 'number' ? json.wifi.rssi : null,
      },

      timestamp: Date.now(),
    };

    return {
      isConnected: true,
      data: validatedData,
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      isConnected: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message,
    };
  }
}

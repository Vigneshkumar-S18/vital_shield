import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import { HeartIcon, DropletIcon, TempIcon, ActivityWalkingIcon } from '../data/svgIcons';

export const HealthReportScreen = () => {
  const { goBack, reportsSubTab, setReportsSubTab, showToast } = useApp();

  // Navigation offsets (0 = current 23.09.2026, negative = past)
  // Day: up to 7 weeks back = 49 days (0 to -49)
  // Week: up to 7 weeks back (0 to -7)
  // Month: up to 2 months back (0 to -2)
  const [dayOffset, setDayOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [showFullModal, setShowFullModal] = useState(false);

  // Anchor Date: 23 September 2026
  const BASE_YEAR = 2026;
  const BASE_MONTH = 8; // 0-indexed (8 = September)
  const BASE_DAY = 23;

  // Compute active date string and bounds based on active subtab
  let activeDateString = '';
  let canGoPrev = true;
  let canGoNext = false;
  let currentOffset = 0;

  if (reportsSubTab === 'day') {
    currentOffset = dayOffset;
    canGoPrev = dayOffset > -49; // Max 7 weeks back (49 days)
    canGoNext = dayOffset < 0;

    const dateObj = new Date(BASE_YEAR, BASE_MONTH, BASE_DAY + dayOffset);
    const d = dateObj.getDate();
    const m = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const y = dateObj.getFullYear();
    activeDateString = `${d} ${m} ${y}`;
  } else if (reportsSubTab === 'week') {
    currentOffset = weekOffset;
    canGoPrev = weekOffset > -7; // Max 7 weeks back
    canGoNext = weekOffset < 0;

    const endWeek = new Date(BASE_YEAR, BASE_MONTH, BASE_DAY + weekOffset * 7);
    const startWeek = new Date(BASE_YEAR, BASE_MONTH, BASE_DAY + weekOffset * 7 - 6);
    const startD = startWeek.getDate().toString().padStart(2, '0');
    const startM = startWeek.toLocaleDateString('en-US', { month: 'short' });
    const endD = endWeek.getDate().toString().padStart(2, '0');
    const endM = endWeek.toLocaleDateString('en-US', { month: 'short' });
    const y = endWeek.getFullYear();
    activeDateString = `${startD} ${startM} – ${endD} ${endM} ${y}`;
  } else {
    currentOffset = monthOffset;
    canGoPrev = monthOffset > -2; // Up to 2 months back (covers 7+ weeks)
    canGoNext = monthOffset < 0;

    const targetDate = new Date(BASE_YEAR, BASE_MONTH + monthOffset, BASE_DAY);
    const m = targetDate.toLocaleDateString('en-US', { month: 'long' });
    const y = targetDate.getFullYear();
    activeDateString = `${m} ${y}`;
  }

  // Handle previous/next navigation
  const handlePrev = () => {
    if (reportsSubTab === 'day' && dayOffset > -49) {
      setDayOffset((prev) => prev - 1);
    } else if (reportsSubTab === 'week' && weekOffset > -7) {
      setWeekOffset((prev) => prev - 1);
    } else if (reportsSubTab === 'month' && monthOffset > -2) {
      setMonthOffset((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (reportsSubTab === 'day' && dayOffset < 0) {
      setDayOffset((prev) => prev + 1);
    } else if (reportsSubTab === 'week' && weekOffset < 0) {
      setWeekOffset((prev) => prev + 1);
    } else if (reportsSubTab === 'month' && monthOffset < 0) {
      setMonthOffset((prev) => prev + 1);
    }
  };

  const handleResetToToday = () => {
    if (reportsSubTab === 'day') setDayOffset(0);
    if (reportsSubTab === 'week') setWeekOffset(0);
    if (reportsSubTab === 'month') setMonthOffset(0);
    showToast('Reset to 23 September 2026');
  };

  // Generate deterministic, minimally fluctuating data based on active period & offset
  const getReportData = () => {
    const k = Math.abs(currentOffset);

    if (reportsSubTab === 'day') {
      const scoreDelta = Math.round(Math.sin(k * 0.72) * 3 + Math.cos(k * 1.34) * 2);
      const healthScore = Math.min(92, Math.max(83, 86 + scoreDelta));

      const hrDelta = Math.round(Math.sin(k * 0.85) * 3);
      const hr = 78 + hrDelta;

      const spo2List = [98, 98, 99, 98, 97, 98, 99];
      const spo2 = spo2List[k % spo2List.length];

      const tempList = [36.6, 36.5, 36.7, 36.6, 36.4, 36.6, 36.7];
      const temp = tempList[k % tempList.length].toFixed(1);

      const activeMins = 138 + Math.round(Math.sin(k * 0.6) * 16);
      const activeH = Math.floor(activeMins / 60);
      const activeM = activeMins % 60;
      const activeTime = `${activeH}h ${activeM}m`;

      const stepsCount = Math.round(8420 + Math.sin(k * 0.8) * 750);
      const calories = Math.round(420 + Math.sin(k * 0.55) * 40);

      let statusText = 'Good';
      let statusDesc = 'Your vitals were stable for most of the day.';
      if (healthScore >= 89) {
        statusText = 'Excellent';
        statusDesc = 'Optimal vitals stability with steady heart rate and fast recovery.';
      } else if (healthScore < 84) {
        statusText = 'Stable';
        statusDesc = 'Moderate exertion recorded during afternoon commute, baseline recovered.';
      }

      return {
        date: activeDateString,
        healthScore,
        statusText,
        statusDesc,
        metrics: [
          { label: 'Heart Rate', value: `Avg ${hr} bpm`, badge: 'Normal', icon: 'heart' },
          { label: 'SpO₂', value: `Avg ${spo2}%`, badge: 'Normal', icon: 'droplet' },
          { label: 'Body Temperature', value: `Avg ${temp}°C`, badge: 'Normal', icon: 'temp' },
          { label: 'Active Time', value: activeTime, badge: null, icon: 'walk' },
          { label: 'Steps', value: stepsCount.toLocaleString(), badge: null, icon: 'steps' },
          { label: 'Calories Burned', value: `${calories} kcal`, badge: null, icon: 'flame' },
        ],
        strain: 'Low-Moderate (peak at 14:00 with 33.2°C ambient)',
        recovery: 'Optimal (-22 BPM within 3 minutes of rest)',
        monitoringTime: '24h continuous',
      };
    }

    if (reportsSubTab === 'week') {
      const scoreDelta = Math.round(Math.sin(k * 1.1) * 3);
      const healthScore = Math.min(93, Math.max(86, 89 + scoreDelta));

      const hrDelta = Math.round(Math.sin(k * 0.65) * 2);
      const hr = 74 + hrDelta;

      const spo2 = (98.4 + ((k % 4) * 0.1)).toFixed(1);
      const temp = (36.5 + ((k % 3) * 0.1)).toFixed(1);

      const activeH = 14 + (k % 3);
      const activeM = 20 + ((k * 7) % 35);
      const activeTime = `${activeH}h ${activeM}m`;

      const stepsCount = Math.round(9150 + Math.sin(k * 0.9) * 450);
      const alerts = 1 + (k % 3);

      let statusText = 'Excellent';
      let statusDesc = 'Overall high stability with 94% time spent in low risk zone.';
      if (healthScore < 88) {
        statusText = 'Good';
        statusDesc = 'Steady multi-day cardiac rhythm with controlled heat exposure.';
      }

      return {
        date: activeDateString,
        healthScore,
        statusText,
        statusDesc,
        metrics: [
          { label: 'Avg Heart Rate', value: `${hr} bpm`, badge: 'Optimal', icon: 'heart' },
          { label: 'Avg SpO₂', value: `${spo2}%`, badge: 'Normal', icon: 'droplet' },
          { label: 'Avg Skin Temp', value: `${temp}°C`, badge: 'Normal', icon: 'temp' },
          { label: 'Total Active Time', value: activeTime, badge: null, icon: 'walk' },
          { label: 'Avg Daily Steps', value: stepsCount.toLocaleString(), badge: null, icon: 'steps' },
          { label: 'Heat Exposure Alerts', value: `${alerts} resolved`, badge: 'Managed', icon: 'flame' },
        ],
        strain: 'Well-Managed (Avg ambient heat index 31.8°C)',
        recovery: 'Consistent (-24 BPM 3-min recovery average)',
        monitoringTime: '168h (7 days)',
      };
    }

    // Month view
    const scoreDelta = Math.round(Math.sin(k * 1.4) * 2);
    const healthScore = Math.min(94, Math.max(88, 91 + scoreDelta));

    const baselineHr = 68 + (k % 3);
    const spo2Compliance = (99.1 - ((k % 3) * 0.1)).toFixed(1);
    const meanTemp = (36.6 - ((k % 2) * 0.1)).toFixed(1);
    const activeDays = 26 - (k % 2);
    const totalDistance = 184 + (k * 6);

    return {
      date: activeDateString,
      healthScore,
      statusText: 'Optimal',
      statusDesc: 'Personal baseline adapted smoothly to seasonal environmental conditions.',
      metrics: [
        { label: 'Resting Baseline HR', value: `${baselineHr} bpm`, badge: 'Stable', icon: 'heart' },
        { label: 'SpO₂ Compliance', value: `${spo2Compliance}%`, badge: 'High Quality', icon: 'droplet' },
        { label: 'Mean Skin Temp', value: `${meanTemp}°C`, badge: 'Regulated', icon: 'temp' },
        { label: 'Total Active Days', value: `${activeDays} of 30`, badge: null, icon: 'walk' },
        { label: 'Total Distance', value: `${totalDistance} km`, badge: null, icon: 'steps' },
        { label: 'SOS Events Triggered', value: '0', badge: 'Safe', icon: 'flame' },
      ],
      strain: 'Nominal physiological strain observed throughout month',
      recovery: 'Baseline resting HR preserved within healthy clinical range',
      monitoringTime: '720h (30 days)',
    };
  };

  const currentReport = getReportData();

  // Helper to render metric icon
  const renderMetricIcon = (type) => {
    switch (type) {
      case 'heart':
        return <HeartIcon size={18} />;
      case 'droplet':
        return <DropletIcon size={18} />;
      case 'temp':
        return <TempIcon size={18} />;
      case 'walk':
        return <ActivityWalkingIcon size={18} />;
      case 'steps':
        return <span style={{ fontSize: '16px' }}>👟</span>;
      case 'flame':
        return <span style={{ fontSize: '16px' }}>🔥</span>;
      default:
        return <span style={{ fontSize: '16px' }}>📊</span>;
    }
  };

  // Download CSV File
  const downloadCSVReport = () => {
    const safeDate = activeDateString.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `VitalShield_Report_${reportsSubTab}_${safeDate}.csv`;

    const rows = [
      ['VITALSHIELD PHYSIOLOGICAL HEALTH REPORT'],
      ['Report Category', `${reportsSubTab.toUpperCase()} REPORT`],
      ['Period / Date', activeDateString],
      ['Anchor Timestamp', '23 September 2026'],
      ['Subject Name', 'Ananya Sharma (Age 26)'],
      ['Device Model', 'VitalShield VS-001 (Firmware v2.4.1)'],
      ['Overall Health Score', `${currentReport.healthScore} / 100 (${currentReport.statusText})`],
      ['Status Summary', currentReport.statusDesc],
      ['Heat Strain Index', currentReport.strain],
      ['Cardiac Recovery Rate', currentReport.recovery],
      ['Sensor Monitoring Time', currentReport.monitoringTime],
      [],
      ['DETAILED METRICS BREAKDOWN'],
      ['Metric Parameter', 'Recorded Value', 'Clinical Status', 'Expected Baseline'],
      ...currentReport.metrics.map((m) => [
        m.label,
        m.value,
        m.badge || 'Normal',
        m.label.includes('Heart') ? '60-100 bpm' : m.label.includes('SpO') ? '95-100%' : 'Within Range',
      ]),
      [],
      ['TELEMETRY VERIFICATION'],
      ['System Integrity', 'Verified by VitalShield Telemetry Engine'],
      ['Status', 'Official Health Summary Export'],
    ];

    const csvContent =
      '\uFEFF' +
      rows.map((row) => row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`✓ Downloaded CSV: ${filename}`);
    setShowFullModal(false);
  };

  // Download / Print PDF Report
  const downloadPDFReport = () => {
    const printWindow = window.open('', '_blank', 'width=840,height=920');
    if (!printWindow) {
      showToast('⚠️ Pop-up blocked. Please allow pop-ups to export PDF.');
      return;
    }

    const metricsHtml = currentReport.metrics
      .map(
        (m) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px 14px; font-weight: 600; color: #1F2937;">${m.label}</td>
        <td style="padding: 12px 14px; font-weight: 700; color: #111827;">${m.value}</td>
        <td style="padding: 12px 14px;">
          <span style="display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #DCFCE7; color: #166534;">
            ${m.badge || 'Normal'}
          </span>
        </td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VitalShield Health Report - ${activeDateString}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
          body { padding: 40px; color: #1B2C1E; background: #FFFFFF; line-height: 1.5; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #243827; padding-bottom: 18px; margin-bottom: 22px; }
          .brand-title { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #243827; margin: 0; }
          .brand-subtitle { font-size: 11px; color: #4B5563; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }
          .badge-type { background: #E8F5E9; color: #1B5E20; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 12px; display: inline-block; }
          .meta-box { background: #F8F9FA; border-radius: 12px; padding: 14px 18px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px; border: 1px solid #E5E7EB; }
          .meta-label { font-size: 10.5px; color: #6B7280; font-weight: 600; text-transform: uppercase; }
          .meta-val { font-size: 13.5px; font-weight: 700; color: #111827; margin-top: 2px; }
          .score-card { display: flex; align-items: center; gap: 20px; background: #FAF9F5; border: 1.5px solid #E2DCC8; border-radius: 14px; padding: 18px; margin-bottom: 22px; }
          .score-badge { width: 76px; height: 76px; border-radius: 50%; background: #243827; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0; }
          .section-title { font-size: 14px; font-weight: 800; color: #243827; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { text-align: left; padding: 10px 14px; font-size: 11px; text-transform: uppercase; color: #4B5563; background: #F3F4F6; }
          .insights-card { background: #F0FDF4; border-left: 4px solid #16A34A; padding: 14px 16px; border-radius: 6px; margin-bottom: 26px; font-size: 12.5px; }
          .footer { border-top: 1px solid #E5E7EB; padding-top: 14px; display: flex; justify-content: space-between; font-size: 11px; color: #9CA3AF; }
          @media print {
            body { padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="brand-title">VITALSHIELD</h1>
            <div class="brand-subtitle">Physiological & Environmental Safety Report</div>
          </div>
          <div style="text-align: right;">
            <div class="badge-type">${reportsSubTab.toUpperCase()} HEALTH REPORT</div>
            <div style="font-size: 12px; color: #4B5563; margin-top: 5px;">Period: <strong>${activeDateString}</strong></div>
          </div>
        </div>

        <div class="meta-box">
          <div>
            <div class="meta-label">Subject Name</div>
            <div class="meta-val">Ananya Sharma</div>
          </div>
          <div>
            <div class="meta-label">Demographics</div>
            <div class="meta-val">26 yrs / Female</div>
          </div>
          <div>
            <div class="meta-label">Telemetry Device</div>
            <div class="meta-val">VS-001 (FW v2.4.1)</div>
          </div>
          <div>
            <div class="meta-label">Anchor Date</div>
            <div class="meta-val">23.09.2026</div>
          </div>
        </div>

        <div class="score-card">
          <div class="score-badge">
            <span style="font-size: 24px; line-height: 1;">${currentReport.healthScore}</span>
            <span style="font-size: 9.5px; opacity: 0.85;">of 100</span>
          </div>
          <div>
            <div style="font-size: 17px; font-weight: 800; color: #166534;">Overall Summary: ${currentReport.statusText}</div>
            <div style="font-size: 12.5px; color: #4B5563; margin-top: 4px;">${currentReport.statusDesc}</div>
          </div>
        </div>

        <div class="section-title">Physiological Parameters Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Biometric Metric</th>
              <th>Recorded Value</th>
              <th>Clinical Assessment</th>
            </tr>
          </thead>
          <tbody>
            ${metricsHtml}
          </tbody>
        </table>

        <div class="section-title">Environmental Strain & Recovery Analysis</div>
        <div class="insights-card">
          <div style="margin-bottom: 6px;"><strong>• Heat Strain Index:</strong> ${currentReport.strain}</div>
          <div style="margin-bottom: 6px;"><strong>• Cardiac Recovery Rate:</strong> ${currentReport.recovery}</div>
          <div><strong>• Telemetry Note:</strong> Real-time physiological biometrics remained stable. Normal autonomic regulation observed with continuous sensor telemetry.</div>
        </div>

        <div class="footer">
          <div>VitalShield Medical Wearable • Clinical Verification</div>
          <div>Confidential Patient Record • Generated automatically on ${activeDateString}</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
    showToast(`✓ PDF report opened for printing / saving: ${activeDateString}`);
    setShowFullModal(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F6F4ED',
        overflow: 'hidden',
      }}
    >
      <TopStatusBar />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 20px',
          position: 'relative',
        }}
      >
        <button
          onClick={goBack}
          style={{
            padding: '6px 10px',
            fontSize: '18px',
            color: '#1B2C1E',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          ‹
        </button>
        <h2
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '17px',
            fontWeight: '700',
            color: '#1B2C1E',
            pointerEvents: 'none',
          }}
        >
          Health Report
        </h2>
      </div>

      {/* Segmented Pill: Day | Week | Month */}
      <div style={{ padding: '0 20px 8px 20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
          }}
        >
          {[
            { id: 'day', label: 'Day' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
          ].map((tab) => {
            const isActive = reportsSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportsSubTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#FFFFFF' : '#687767',
                  backgroundColor: isActive ? '#243827' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(36, 56, 39, 0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Switcher with 7-week past navigation limit */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          padding: '4px 20px 10px 20px',
          fontSize: '13.5px',
          fontWeight: '700',
          color: '#1B2C1E',
        }}
      >
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          title={canGoPrev ? 'Previous date (up to 7 weeks)' : 'Reached 7-week limit'}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: canGoPrev ? '#ECE8DC' : '#F0ECE1',
            color: canGoPrev ? '#1B2C1E' : '#B0B8B0',
            fontSize: '17px',
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            border: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          ‹
        </button>

        <span style={{ minWidth: '150px', textAlign: 'center', userSelect: 'none' }}>
          {activeDateString}
        </span>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          title={canGoNext ? 'Next date' : 'Current date (23.09.2026)'}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: canGoNext ? '#ECE8DC' : '#F0ECE1',
            color: canGoNext ? '#1B2C1E' : '#B0B8B0',
            fontSize: '17px',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            border: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          ›
        </button>

        {currentOffset < 0 && (
          <button
            onClick={handleResetToToday}
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '999px',
              backgroundColor: '#E2DEC9',
              color: '#243827',
              fontWeight: '700',
              cursor: 'pointer',
              marginLeft: '-4px',
            }}
          >
            Today
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 88px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Overall Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#6A7869', fontWeight: '600', marginBottom: '12px' }}>
            Overall Summary
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Circular Progress Gauge */}
            <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="9"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - currentReport.healthScore / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#1B2C1E', lineHeight: '1' }}>
                  {currentReport.healthScore}
                </span>
                <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '600', marginTop: '2px' }}>
                  of 100
                </span>
              </div>
            </div>

            {/* Right Status */}
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#2E7D32' }}>
                {currentReport.statusText}
              </div>
              <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px', lineHeight: '1.4' }}>
                {currentReport.statusDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '13.5px', color: '#1B2C1E', fontWeight: '800', marginBottom: '14px' }}>
            Detailed Metrics
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentReport.metrics.map((metric, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {renderMetricIcon(metric.icon)}
                  <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                    {metric.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                    {metric.value}
                  </span>
                  {metric.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '999px',
                      }}
                    >
                      {metric.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: View Full Report */}
        <button
          onClick={() => setShowFullModal(true)}
          style={{
            width: '100%',
            backgroundColor: '#243827',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '999px',
            fontSize: '14.5px',
            fontWeight: '700',
            boxShadow: '0 4px 14px rgba(36, 56, 39, 0.2)',
            cursor: 'pointer',
          }}
        >
          View Full Report
        </button>

        {/* Quick Export Action Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={downloadPDFReport}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #243827',
              color: '#243827',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <span>📄</span> Download PDF
          </button>
          <button
            onClick={downloadCSVReport}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #243827',
              color: '#243827',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <span>📊</span> Download CSV
          </button>
        </div>
      </div>

      {/* Full Report & Export Modal */}
      {showFullModal && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(20, 32, 22, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setShowFullModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 20px 32px 20px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: '#D1D5DB',
                borderRadius: '2px',
                margin: '0 auto 16px auto',
              }}
            />

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>
              Full Physiological Health Summary
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', marginBottom: '16px' }}>
              Report period: <strong>{activeDateString}</strong> • Monitoring: {currentReport.monitoringTime}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', fontSize: '12.5px' }}>
                <span style={{ fontWeight: '700', color: '#1F2937' }}>Heat Strain Index: </span>
                <span style={{ color: '#4B5563' }}>{currentReport.strain}</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', fontSize: '12.5px' }}>
                <span style={{ fontWeight: '700', color: '#1F2937' }}>Cardiac Recovery Rate: </span>
                <span style={{ color: '#15803D' }}>{currentReport.recovery}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={downloadPDFReport}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: '#243827',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                📄 Export PDF
              </button>
              <button
                onClick={downloadCSVReport}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: '#F3EFE6',
                  color: '#1B2C1E',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  border: '1px solid #D5CEBD',
                }}
              >
                📊 Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

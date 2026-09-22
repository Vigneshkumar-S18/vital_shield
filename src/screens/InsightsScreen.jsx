import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';

export const InsightsScreen = () => {
  const { goBack, insightsSubTab, setInsightsSubTab, insightsDataByPeriod, keyInsightsData } = useApp();

  // Active period data
  const currentPeriodData =
    (insightsDataByPeriod && insightsDataByPeriod[insightsSubTab]) || {
      score: 86,
      trend: '↑ 12%',
      trendPositive: true,
      summary: 'Your vitals are stable. Keep up the good work!',
      quote: {
        line1: '“Small steps every day',
        line2: 'lead to big changes.”',
      },
      insights: keyInsightsData || [],
    };

  const insightsList = currentPeriodData.insights || [];

  // Default expanded item to the first item when period changes
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (insightsList.length > 0) {
      setExpandedId(insightsList[0].id);
    } else {
      setExpandedId(null);
    }
  }, [insightsSubTab]);

  // Map icon type to emoji and background color
  const getIconConfig = (iconType) => {
    switch (iconType) {
      case 'sun':
        return { bg: '#FEF3C7', emoji: '☀️' };
      case 'drop':
        return { bg: '#EFF6FF', emoji: '💧' };
      case 'moon':
        return { bg: '#EDE9FE', emoji: '🌙' };
      case 'activity':
        return { bg: '#DCFCE7', emoji: '👟' };
      case 'shield':
        return { bg: '#E0F2FE', emoji: '🛡️' };
      case 'heart':
        return { bg: '#FEE2E2', emoji: '❤️' };
      case 'check':
        return { bg: '#ECFDF5', emoji: '✅' };
      default:
        return { bg: '#FEF3C7', emoji: '☀️' };
    }
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
          Insights
        </h2>
      </div>

      {/* Segmented Pill: Today | Week | Month */}
      <div style={{ padding: '0 20px 14px 20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
          }}
        >
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
          ].map((tab) => {
            const isActive = insightsSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setInsightsSubTab(tab.id)}
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

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 88px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Health Score Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ fontSize: '13px', color: '#6A7869', fontWeight: '600' }}>
            {insightsSubTab === 'today'
              ? 'Your Health Score'
              : insightsSubTab === 'week'
              ? 'Weekly Average Health Score'
              : 'Monthly Overall Health Score'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: '#1B2C1E' }}>
                {currentPeriodData.score}
              </span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#9CA3AF' }}>/ 100</span>
            </div>

            <div
              style={{
                backgroundColor: currentPeriodData.trendPositive !== false ? '#DCFCE7' : '#FEE2E2',
                color: currentPeriodData.trendPositive !== false ? '#166534' : '#991B1B',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <span>{currentPeriodData.trend}</span>
            </div>
          </div>

          <p style={{ fontSize: '12.5px', color: '#6A7869', marginTop: '8px', lineHeight: '1.45' }}>
            {currentPeriodData.summary}
          </p>
        </div>

        {/* Key Insights List */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1B2C1E', marginBottom: '12px' }}>
            {insightsSubTab === 'today'
              ? 'Today’s Key Insights'
              : insightsSubTab === 'week'
              ? 'Weekly Trend Insights'
              : 'Monthly Milestone Insights'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {insightsList.map((item) => {
              const isExpanded = expandedId === item.id;
              const { bg: iconBg, emoji: iconEmoji } = getIconConfig(item.icon);

              return (
                <div
                  key={item.id}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {iconEmoji}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1B2C1E' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                        {item.subtitle}
                      </div>
                    </div>

                    <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{isExpanded ? '▴' : '▾'}</span>
                  </div>

                  {/* PRD Explainability Dropdown */}
                  {isExpanded && item.details && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #F3F4F6',
                        fontSize: '11.5px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '700', color: '#B45309' }}>• What Changed: </span>
                        <span style={{ color: '#4B5563' }}>{item.details.changed}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '700', color: '#1F2937' }}>• Contributing: </span>
                        <span style={{ color: '#4B5563' }}>{item.details.contributed}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '700', color: '#15803D' }}>• Maintained: </span>
                        <span style={{ color: '#4B5563' }}>{item.details.stable}</span>
                      </div>
                      <div
                        style={{
                          backgroundColor: '#F0EDE3',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          marginTop: '4px',
                        }}
                      >
                        <span style={{ fontWeight: '700', color: '#243827' }}>Action: </span>
                        <span style={{ color: '#374151' }}>{item.details.action}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspirational Quote Card */}
        <div
          style={{
            backgroundColor: '#EAE5D9',
            borderRadius: '18px',
            padding: '24px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            marginTop: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '17px',
              lineHeight: '1.45',
              color: '#344535',
            }}
          >
            {currentPeriodData.quote.line1}
            <br />
            {currentPeriodData.quote.line2}
          </div>
        </div>
      </div>
    </div>
  );
};

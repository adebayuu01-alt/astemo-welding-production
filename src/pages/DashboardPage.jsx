import React, { useState, useRef, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Settings,
  X,
  Timer,
  Package,
  CheckCircle2,
  Play,
  Pause,
  Radio
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import CustomDropdown from '../components/CustomDropdown';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import Toast from '../components/Toast';
import {
  SHIFT_OPTIONS,
  AREA_OPTIONS,
  WELDING_DASHBOARD_CONFIG,
  REALTIME_CYCLES_10
} from '../data/mockData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Function to generate dynamic dashboard data strictly synchronized with the selected Date Range and 10 Realtime Cycles
function generateDashboardData(dateRange, shift, area, customThresholds, activeCycleIndex = 0) {
  const shiftConfig = WELDING_DASHBOARD_CONFIG[shift] || WELDING_DASHBOARD_CONFIG['Shift 1'];
  const liveCycle = REALTIME_CYCLES_10[activeCycleIndex % REALTIME_CYCLES_10.length];

  // Default to today if null
  let start = dateRange && dateRange[0] ? dayjs(dateRange[0]) : dayjs();
  let end = dateRange && dateRange[1] ? dayjs(dateRange[1]) : dayjs();

  if (end.isBefore(start)) {
    const temp = start;
    start = end;
    end = temp;
  }

  const diffDays = Math.max(0, Math.min(30, end.diff(start, 'day')));
  const daysCount = diffDays + 1;

  const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Seed for subtle variations between areas
  const areaSeeds = {
    'Projection Weld': 1,
    'Projection STP Weld': 2,
    'Seam Weld': 3,
    'Reinforcement Weld': 4,
    'Rotary Weld': 5
  };
  const areaSeed = areaSeeds[area] || 1;

  // 1. Production Graph (Actual vs Plan strictly mapped to date range)
  let prodLabels = [];
  let prodActual = [];
  let prodPlan = [];

  if (daysCount === 1) {
    // Single day: hourly production slices matching the shift
    const baseHours = shift === 'Shift 1'
      ? ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
      : shift === 'Shift 2'
      ? ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
      : ['23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00'];

    prodLabels = baseHours;
    const seed = start.date() + areaSeed * 3 + (shift === 'Shift 2' ? 5 : shift === 'Shift 3' ? 10 : 0);

    // Hourly plan set to 20.000 so Y-axis can scale cleanly to 20.000 (with step 5.000)
    prodPlan = baseHours.map((_, i) => (i === baseHours.length - 1 ? 15000 : 20000));
    prodActual = baseHours.map((_, i) => {
      const target = i === baseHours.length - 1 ? 15000 : 20000;
      const variation = ((seed * 17 + i * 23) % 5) * 500;
      const cycleBoost = (i === Math.min(activeCycleIndex, baseHours.length - 1)) ? ((activeCycleIndex + 1) * 200) : 0;
      return Math.min(target, Math.max(14000, target - variation + cycleBoost));
    });
  } else {
    // Multi-day selection: each bar represents one day in the date range
    for (let i = 0; i < daysCount; i++) {
      const d = start.add(i, 'day');
      const dayName = DAY_NAMES[d.day()];
      const label = daysCount <= 7
        ? `${dayName} (${d.format('DD/MM')})`
        : d.format('DD/MM');
      prodLabels.push(label);

      const daySeed = d.date() + d.month() * 31 + areaSeed * 7 + (shift === 'Shift 2' ? 11 : shift === 'Shift 3' ? 22 : 0);
      const baseActualPatterns = [150000, 125000, 100000, 140000, 75000, 110000, 130000];
      const basePlanPatterns = [150000, 150000, 150000, 150000, 100000, 140000, 140000];

      const actVal = baseActualPatterns[i % baseActualPatterns.length] + ((daySeed * 9301 + 49297) % 20000) - 10000 + (i === daysCount - 1 ? activeCycleIndex * 350 : 0);
      const planVal = basePlanPatterns[i % basePlanPatterns.length];

      prodActual.push(Math.max(25000, Math.min(150000, Math.round(actVal / 5000) * 5000)));
      prodPlan.push(Math.max(50000, Math.min(150000, Math.round(planVal / 5000) * 5000)));
    }
  }

  // 2. Parameter Trends (Exactly 10 data points shifting in real-time)
  let paramTimeLabels = [];
  let ampereActual = [];
  let weldingTimeActual = [];

  if (daysCount === 1) {
    paramTimeLabels = liveCycle.timeLabelsLive;
    ampereActual = liveCycle.ampereLive;
    weldingTimeActual = liveCycle.weldingTimeLive;
  } else if (daysCount <= 7) {
    const samplePoints = 10;
    for (let i = 0; i < samplePoints; i++) {
      const dayOffset = Math.floor((i / (samplePoints - 1)) * (daysCount - 1));
      const currentDay = start.add(dayOffset, 'day');
      const hour = 8 + i;
      paramTimeLabels.push(`${currentDay.format('DD/MM')} ${hour.toString().padStart(2, '0')}:00`);
      ampereActual.push(liveCycle.ampereLive[i] || 65);
      weldingTimeActual.push(liveCycle.weldingTimeLive[i] || 950);
    }
  } else {
    const sampleCount = 10;
    for (let i = 0; i < sampleCount; i++) {
      const dayOffset = Math.round((i / (sampleCount - 1)) * (daysCount - 1));
      const currentDay = start.add(dayOffset, 'day');
      paramTimeLabels.push(currentDay.format('DD/MM/YY'));
      ampereActual.push(liveCycle.ampereLive[i] || 65);
      weldingTimeActual.push(liveCycle.weldingTimeLive[i] || 950);
    }
  }

  // 3. Totals and KPI Metrics scaled to date range with live alternating cycle
  const baseDailyCounting = liveCycle.countingProduct;
  const totalCounting = daysCount === 1 ? baseDailyCounting : Math.round(baseDailyCounting * (1 + (daysCount - 1) * 0.95));
  const totalTarget = daysCount === 1 ? liveCycle.productionTarget : Math.round(liveCycle.productionTarget * (1 + (daysCount - 1) * 0.95));

  const rasioOk = liveCycle.rasioProductOk;
  const okPcs = daysCount === 1 ? liveCycle.okCount : Math.round((totalCounting * rasioOk) / 100);
  const reworkPcs = totalCounting - okPcs;

  return {
    ...shiftConfig,
    currentOee: liveCycle.currentOee,
    availability: liveCycle.availability,
    performance: liveCycle.performance,
    quality: liveCycle.quality,
    countingProduct: totalCounting,
    productionTarget: totalTarget,
    rasioProductOk: rasioOk,
    okCount: okPcs,
    reworkCount: reworkPcs,
    productionGraph: {
      labels: prodLabels,
      actual: prodActual,
      plan: prodPlan
    },
    parameterTrends: {
      timeLabels: paramTimeLabels,
      Ampere: {
        unit: 'A',
        threshold: customThresholds?.Ampere ?? shiftConfig.parameterTrends.Ampere.threshold,
        actual: ampereActual
      },
      'Welding Time': {
        unit: 's',
        threshold: customThresholds?.['Welding Time'] ?? shiftConfig.parameterTrends['Welding Time'].threshold,
        actual: weldingTimeActual
      }
    }
  };
}

export default function DashboardPage({
  areas = [],
  thresholds = [],
  onUpdateThresholds
}) {
  const [selectedShift, setSelectedShift] = useState('Shift 1');
  const [dateRange, setDateRange] = useState([
    dayjs(),
    dayjs()
  ]);

  // Floating tooltip refs matching ASTEMO - QUALITY DEVELOPMENT
  const paramTooltipRef = useRef(null);
  const prodTooltipRef = useRef(null);

  // Area Options from prop or mockData
  const areaOptions = areas.length > 0
    ? areas.map((a) => (typeof a === 'object' ? a.area : a))
    : AREA_OPTIONS;
  const [selectedArea, setSelectedArea] = useState(areaOptions[0] || 'Projection Weld');

  // Tabs: ONLY Ampere & Welding Time
  const [activeParameterTab, setActiveParameterTab] = useState('Ampere');

  // Synchronized thresholds map from global database setting
  const currentThresholdsMap = useMemo(() => {
    const map = { Ampere: 20, 'Welding Time': 1000 };
    if (Array.isArray(thresholds)) {
      thresholds.forEach((t) => {
        if (t.parameter && t.maxValue !== undefined) {
          map[t.parameter] = Number(t.maxValue);
        }
      });
    }
    return map;
  }, [thresholds]);

  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(20);

  // OEE Target Modal states
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetOee, setTargetOee] = useState(100);
  const [tempTargetOee, setTempTargetOee] = useState(100);

  const [toast, setToast] = useState(null);

  // Realtime live cycling (10 alternating data states every 2.5 seconds)
  const [activeCycle, setActiveCycle] = useState(0);
  const [isLiveActive, setIsLiveActive] = useState(true);

  useEffect(() => {
    if (!isLiveActive) return;
    const timer = setInterval(() => {
      setActiveCycle((prev) => (prev + 1) % 10);
    }, 2500);
    return () => clearInterval(timer);
  }, [isLiveActive]);

  // Dynamic Dashboard Data synchronized with Date Range, Shift, Area, Database Thresholds, and Realtime Cycle
  const shiftData = useMemo(() => {
    return generateDashboardData(dateRange, selectedShift, selectedArea, currentThresholdsMap, activeCycle);
  }, [dateRange, selectedShift, selectedArea, currentThresholdsMap, activeCycle]);

  // Dynamic Y-axis scale strictly matching the current Plan peak so it's never too far above
  const prodYScale = useMemo(() => {
    const plans = shiftData.productionGraph.plan || [];
    const actuals = shiftData.productionGraph.actual || [];
    const peak = Math.max(...plans, ...actuals, 1000);

    if (peak <= 25000) {
      // Single-day view: max matches the plan peak (20.000) with step 5.000
      const max = peak <= 20000 ? 20000 : 25000;
      return { min: 0, max, stepSize: 5000 };
    } else if (peak <= 50000) {
      return { min: 0, max: 50000, stepSize: 10000 };
    } else if (peak <= 100000) {
      return { min: 0, max: 100000, stepSize: 20000 };
    } else {
      // Multi-day view: peak up to 150.000 with step 25.000
      return { min: 0, max: 150000, stepSize: 25000 };
    }
  }, [shiftData.productionGraph]);

  const currentParam = shiftData.parameterTrends[activeParameterTab] || shiftData.parameterTrends['Ampere'];
  const currentThreshold = currentThresholdsMap[activeParameterTab] ?? currentParam.threshold;

  // 1. Parameter Trend Chart Data (Matching Figma & OEE style)
  const parameterChartData = {
    labels: shiftData.parameterTrends.timeLabels,
    datasets: [
      {
        label: 'Actual',
        data: currentParam.actual,
        borderColor: '#2F80ED',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(47, 128, 237, 0.28)');
          gradient.addColorStop(1, 'rgba(47, 128, 237, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: '#2F80ED',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Threshold',
        data: Array(shiftData.parameterTrends.timeLabels.length).fill(currentThreshold),
        borderColor: '#F04438',
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  // Custom Tooltip HTML matching ASTEMO - QUALITY DEVELOPMENT
  const customParamTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipEl = paramTooltipRef.current;
    if (!tooltipEl) return;

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    if (tooltip.body) {
      const timeLabel = tooltip.dataPoints[0]?.label ?? '';
      let innerHtml = `
        <div style="font-weight: 700; font-size: 11px; color: #101828; margin-bottom: 8px; text-align: center; border-bottom: 1px solid #F2F4F7; padding-bottom: 4px;">
          Time: ${timeLabel}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
      `;

      let hasValidPoints = false;
      tooltip.dataPoints.forEach((dp) => {
        if (dp.raw === null || dp.raw === undefined) return;
        if (!chart.isDatasetVisible(dp.datasetIndex)) return;

        hasValidPoints = true;
        const dataset = chart.data.datasets[dp.datasetIndex];
        const color = dataset.borderColor || dataset.backgroundColor;
        const label = dataset.label || '';
        const val = dp.raw;
        const formatted = typeof val === 'number' ? Number(val).toLocaleString('id-ID') : val;

        innerHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; white-space: nowrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; flex-shrink: 0;"></span>
              <span style="font-size: 11px; color: #475467; font-weight: 500;">${label}</span>
            </div>
            <span style="font-size: 11px; color: #101828; font-weight: 700; margin-left: 8px;">${formatted} ${currentParam.unit}</span>
          </div>
        `;
      });

      if (!hasValidPoints) {
        tooltipEl.style.opacity = '0';
        return;
      }

      innerHtml += `</div>`;
      tooltipEl.innerHTML = innerHtml;
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    const chartWidth = chart.width;
    const chartHeight = chart.height;

    tooltipEl.style.opacity = '1';

    if (tooltip.caretX > chartWidth * 0.6) {
      tooltipEl.style.left = (positionX + tooltip.caretX - 14) + 'px';
      const clampedY = Math.max(40, Math.min(tooltip.caretY, chartHeight - 50));
      tooltipEl.style.top = (positionY + clampedY) + 'px';
      tooltipEl.style.transform = 'translate(-100%, -50%)';
    } else if (tooltip.caretX < chartWidth * 0.25) {
      tooltipEl.style.left = (positionX + tooltip.caretX + 14) + 'px';
      const clampedY = Math.max(40, Math.min(tooltip.caretY, chartHeight - 50));
      tooltipEl.style.top = (positionY + clampedY) + 'px';
      tooltipEl.style.transform = 'translate(0%, -50%)';
    } else {
      tooltipEl.style.left = (positionX + tooltip.caretX) + 'px';
      const clampedY = Math.max(40, tooltip.caretY);
      tooltipEl.style.top = (positionY + clampedY) + 'px';
      tooltipEl.style.transform = 'translate(-50%, -115%)';
    }
  };

  // Custom Tooltip HTML for Production Graph matching ASTEMO - QUALITY DEVELOPMENT style in clean white theme
  const customProductionTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipEl = prodTooltipRef.current;
    if (!tooltipEl) return;

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    if (tooltip.body) {
      const hourLabel = tooltip.dataPoints[0]?.label ?? '';
      const labelPrefix = hourLabel.includes(':') && !hourLabel.includes('/') ? 'Pukul' : 'Periode';
      let innerHtml = `
        <div style="font-weight: 700; font-size: 11px; color: #101828; margin-bottom: 8px; text-align: center; border-bottom: 1px solid #F2F4F7; padding-bottom: 4px;">
          ${labelPrefix}: ${hourLabel}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
      `;

      let hasValidPoints = false;
      tooltip.dataPoints.forEach((dp) => {
        if (dp.raw === null || dp.raw === undefined) return;
        if (!chart.isDatasetVisible(dp.datasetIndex)) return;

        hasValidPoints = true;
        const dataset = chart.data.datasets[dp.datasetIndex];
        const color = dataset.backgroundColor || dataset.borderColor;
        const label = dataset.label || '';
        const val = dp.raw;
        const formatted = Number(val).toLocaleString('id-ID');

        innerHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; white-space: nowrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; flex-shrink: 0;"></span>
              <span style="font-size: 11px; color: #475467; font-weight: 500;">${label}</span>
            </div>
            <span style="font-size: 11px; color: #101828; font-weight: 700; margin-left: 8px;">${formatted} pcs</span>
          </div>
        `;
      });

      if (!hasValidPoints) {
        tooltipEl.style.opacity = '0';
        return;
      }

      innerHtml += `</div>`;
      tooltipEl.innerHTML = innerHtml;
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    const chartWidth = chart.width;
    const chartHeight = chart.height;

    tooltipEl.style.opacity = '1';

    if (tooltip.caretX > chartWidth * 0.7) {
      tooltipEl.style.left = (positionX + tooltip.caretX - 14) + 'px';
      const clampedY = Math.max(40, Math.min(tooltip.caretY, chartHeight - 50));
      tooltipEl.style.top = (positionY + clampedY) + 'px';
      tooltipEl.style.transform = 'translate(-100%, -50%)';
    } else if (tooltip.caretX < chartWidth * 0.2) {
      tooltipEl.style.left = (positionX + tooltip.caretX + 14) + 'px';
      const clampedY = Math.max(40, Math.min(tooltip.caretY, chartHeight - 50));
      tooltipEl.style.top = (positionY + clampedY) + 'px';
      tooltipEl.style.transform = 'translate(0%, -50%)';
    } else {
      tooltipEl.style.left = (positionX + tooltip.caretX) + 'px';
      const clampedY = Math.max(40, tooltip.caretY);
      tooltipEl.style.top = (positionY + clampedY) + 'px';
      tooltipEl.style.transform = 'translate(-50%, -115%)';
    }
  };

  // Vertical guideline plugin (Crosshair line on hover matching ASTEMO - QUALITY DEVELOPMENT)
  const verticalGuidelinePlugin = {
    id: 'verticalGuideline',
    afterDraw: (chart) => {
      if (chart.tooltip?._active?.length) {
        const activePoint = chart.tooltip._active[0];
        const ctx = chart.ctx;
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#2F80ED60';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const parameterChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12, family: 'Inter, sans-serif' },
          color: '#1E232F',
          padding: 16
        }
      },
      tooltip: {
        enabled: false,
        external: customParamTooltipHandler
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F2F4F7', drawBorder: false },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#667085',
          callback: (value) => `${value}`
        }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#667085'
        }
      }
    }
  };

  // Plugin to draw vertical text labels positioned at the bottom of EVERY bar
  // Only draws for visible datasets to prevent overlapping ("ketimpuk") when toggling in legend
  const verticalBarTextPlugin = {
    id: 'verticalBarTextPlugin',
    afterDatasetDraw(chart, args) {
      const datasetIndex = args.index;
      if (!chart.isDatasetVisible(datasetIndex)) return;
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      const { ctx } = chart;
      const dataset = chart.data.datasets[datasetIndex];

      meta.data.forEach((bar, index) => {
        if (!bar || bar.skip || bar.hidden) return;
        const val = dataset.data[index];
        if (val !== undefined && val !== null) {
          ctx.save();
          // Position at bottom of the bar (base is bottom line, start drawing upwards)
          ctx.translate(bar.x, bar.base - 14);
          ctx.rotate(-Math.PI / 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          const formatted = Number(val).toLocaleString('id-ID');
          ctx.fillText(formatted, 0, 0);
          ctx.restore();
        }
      });
    }
  };

  // 2. Production Graph Data (Grouped Bar Actual vs Plan matching Figma)
  const productionChartData = {
    labels: shiftData.productionGraph.labels,
    datasets: [
      {
        label: 'Actual',
        data: shiftData.productionGraph.actual,
        backgroundColor: '#2F80ED',
        hoverBackgroundColor: '#1E6AD1',
        borderRadius: 4,
        barPercentage: 0.75,
        categoryPercentage: 0.65
      },
      {
        label: 'Plan',
        data: shiftData.productionGraph.plan,
        backgroundColor: '#00A854',
        hoverBackgroundColor: '#008C45',
        borderRadius: 4,
        barPercentage: 0.75,
        categoryPercentage: 0.65
      }
    ]
  };

  const productionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12, family: 'Inter, sans-serif' },
          color: '#1E232F',
          padding: 16
        }
      },
      tooltip: {
        enabled: false,
        external: customProductionTooltipHandler
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#475467',
          font: { size: 12, family: 'Inter, sans-serif' }
        }
      },
      y: {
        min: prodYScale.min,
        max: prodYScale.max,
        grid: {
          color: '#F2F4F7',
          drawBorder: false
        },
        ticks: {
          color: '#475467',
          font: { size: 11, family: 'Inter, sans-serif' },
          stepSize: prodYScale.stepSize,
          callback: (val) => Number(val).toLocaleString('id-ID')
        }
      }
    }
  };

  // 3. Product Realtime Status (Doughnut Chart)
  const donutChartData = {
    labels: ['OK', 'Rework'],
    datasets: [
      {
        data: [shiftData.okCount, shiftData.reworkCount],
        backgroundColor: ['#00A854', '#F04438'],
        borderWidth: 0,
        borderRadius: 10,
        spacing: 4,
        hoverOffset: 0
      }
    ]
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '74%',
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E232F',
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} pcs (${Math.round((ctx.raw / (shiftData.countingProduct || 1)) * 100)}%)`
        }
      }
    }
  };

  // Save Threshold Handler (Synchronized across Dashboard & Setting Threshold page)
  const handleSaveThreshold = (e) => {
    e.preventDefault();
    const val = Number(tempThreshold);
    if (isNaN(val) || val <= 0) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Masukkan nilai threshold yang valid.'
      });
      return;
    }

    if (onUpdateThresholds && Array.isArray(thresholds)) {
      const existingIndex = thresholds.findIndex((t) => t.parameter === activeParameterTab);
      if (existingIndex >= 0) {
        onUpdateThresholds(
          thresholds.map((t, idx) =>
            idx === existingIndex
              ? { ...t, maxValue: val, datetime: dayjs().format('DD/MM/YYYY HH:mm') }
              : t
          )
        );
      } else {
        onUpdateThresholds([
          {
            id: Date.now(),
            parameter: activeParameterTab,
            maxValue: val,
            datetime: dayjs().format('DD/MM/YYYY HH:mm')
          },
          ...thresholds
        ]);
      }
    }

    setShowThresholdModal(false);
    setToast({
      type: 'success',
      title: 'Threshold Diperbarui',
      message: `Threshold ${activeParameterTab} (${selectedArea}) berhasil diset ke ${val} ${currentParam.unit}.`
    });
  };

  // Save Target OEE Handler
  const handleSaveTarget = (e) => {
    e.preventDefault();
    setTargetOee(Number(tempTargetOee));
    setShowTargetModal(false);
    setToast({
      type: 'success',
      title: 'Target OEE Diperbarui',
      message: `Target OEE berhasil diset ke ${tempTargetOee}%.`
    });
  };

  return (
    <>
      <div className="space-y-5">
        {/* Top Header Card matching OEE reference - height alignment, Shift dropdown & DateRangePicker */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Visualize actual oil volume
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Realtime Live Cycling Badge (10 Data States) */}
            <div className="flex items-center gap-2 h-[38px] px-3.5 rounded-lg bg-[#EAF8F1] border border-[#A6E1C4] text-[#00A854] text-xs font-semibold shadow-xs select-none">
              <span className="relative flex h-2.5 w-2.5">
                {isLiveActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A854] opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveActive ? 'bg-[#00A854]' : 'bg-gray-400'}`}></span>
              </span>
              <span>LIVE • Data {activeCycle + 1}/10</span>
              <button
                type="button"
                onClick={() => setIsLiveActive(!isLiveActive)}
                className="ml-1 p-1 hover:bg-emerald-100/60 rounded text-[#00A854] transition-colors cursor-pointer"
                title={isLiveActive ? 'Pause Realtime Stream' : 'Resume Realtime Stream'}
              >
                {isLiveActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Shift Select - Height 38px */}
            <div className="w-28 sm:w-32">
              <CustomDropdown
                value={selectedShift}
                onChange={setSelectedShift}
                options={SHIFT_OPTIONS}
                placeholder="Shift 1"
              />
            </div>

            {/* Ant Design Date Range Picker - Height 38px */}
            <AntDateRangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
        </div>

        {/* 4 Top KPI Metric Cards matching Figma & OEE reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1: Current OEE */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Current OEE
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {shiftData.currentOee}%
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Timer className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          {/* Card 2: Production Target */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Production Target
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {shiftData.productionTarget.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Package className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          {/* Card 3: Counting Product */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Counting Product
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {shiftData.countingProduct.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Package className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>

          {/* Card 4: Rasio Product OK */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Rasio Product OK
              </p>
              <h2 className="text-4xl font-extrabold text-[#1E232F] tracking-tight mt-1.5 transition-all duration-300">
                {shiftData.rasioProductOk}%
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#00A854] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.3} />
            </div>
          </div>
        </div>

        {/* Mid Section: 2 Charts Grid (Parameter Trend & Production Graph) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Parameter Trend */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-[#1E232F]">Parameter Trend</h3>
                <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
              </div>

              {/* Area Dropdown, Tabview (Ampere & Welding Time), and Setting Threshold button */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Area Dropdown - Height 38px */}
                <div className="w-44 sm:w-48">
                  <CustomDropdown
                    value={selectedArea}
                    onChange={setSelectedArea}
                    options={areaOptions}
                    placeholder="Select Area"
                  />
                </div>

                {/* Tabs switcher: ONLY Ampere & Welding Time - Height 38px filling components */}
                <div className="h-[38px] p-1 bg-[#F2F4F7] rounded-xl flex items-center box-border">
                  {['Ampere', 'Welding Time'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveParameterTab(tab)}
                      className={`h-full px-3.5 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                        activeParameterTab === tab
                          ? 'bg-[#00A854] text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Setting Threshold Button (Matching OEE Breakdown gear button) */}
                <button
                  type="button"
                  onClick={() => {
                    setTempThreshold(currentThreshold);
                    setShowThresholdModal(true);
                  }}
                  className="h-[38px] w-[38px] flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  title="Setting Threshold"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-64 w-full relative">
              <Line
                data={parameterChartData}
                options={parameterChartOptions}
                plugins={[verticalGuidelinePlugin]}
              />
              {/* Floating Custom Tooltip Container matching ASTEMO - QUALITY DEVELOPMENT */}
              <div
                ref={paramTooltipRef}
                className="pointer-events-none absolute z-20 bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 shadow-lg transition-all duration-75 opacity-0 min-w-[140px] whitespace-nowrap"
                style={{
                  boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)'
                }}
              />
            </div>
          </div>

          {/* Chart 2: Production Graph */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm flex flex-col justify-between">
            <div className="mb-3">
              <h3 className="text-base font-bold text-[#1E232F]">Production Graph</h3>
              <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
            </div>

            <div className="h-64 w-full relative">
              <Bar
                data={productionChartData}
                options={productionChartOptions}
                plugins={[verticalBarTextPlugin]}
              />
              {/* Floating Custom Tooltip Container matching ASTEMO - QUALITY DEVELOPMENT (white theme) */}
              <div
                ref={prodTooltipRef}
                className="pointer-events-none absolute z-20 bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 shadow-lg transition-all duration-75 opacity-0 min-w-[140px] whitespace-nowrap"
                style={{
                  boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: OEE Breakdown & Product Realtime Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card: OEE Breakdown */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E232F]">OEE Breakdown</h3>
                <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTempTargetOee(targetOee);
                  setShowTargetModal(true);
                }}
                className="h-[38px] w-[38px] flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Setting Target OEE"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* 5 OEE Components with progress bars matching Figma */}
            <div className="space-y-3.5">
              {/* Actual OEE */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Actual OEE</span>
                  <span className="font-bold text-gray-900">{shiftData.currentOee}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00A854] rounded-full transition-all duration-500"
                    style={{ width: `${shiftData.currentOee}%` }}
                  />
                </div>
              </div>

              {/* Target OEE */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Target OEE</span>
                  <span className="font-bold text-gray-900">{targetOee}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2F80ED] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(targetOee, 100)}%` }}
                  />
                </div>
              </div>

              {/* Avaibility */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Avaibility</span>
                  <span className="font-bold text-gray-900">{shiftData.availability}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F79009] rounded-full transition-all duration-500"
                    style={{ width: `${shiftData.availability}%` }}
                  />
                </div>
              </div>

              {/* Performance */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Performance</span>
                  <span className="font-bold text-gray-900">{shiftData.performance}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7F56D9] rounded-full transition-all duration-500"
                    style={{ width: `${shiftData.performance}%` }}
                  />
                </div>
              </div>

              {/* Quality */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Quality</span>
                  <span className="font-bold text-gray-900">{shiftData.quality}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F04438] rounded-full transition-all duration-500"
                    style={{ width: `${shiftData.quality}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Product Realtime Status - exactly 24px (gap-6) between chart and legend */}
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-sm flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="text-base font-bold text-[#1E232F]">Product Realtime Status</h3>
              <p className="text-xs text-gray-400 mt-0.5">This is a long chart description</p>
            </div>

            <div className="flex-1 flex items-center justify-center py-4 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Doughnut with center text */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex-shrink-0 flex items-center justify-center">
                  <Doughnut data={donutChartData} options={donutChartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-400 font-medium">Total</span>
                    <span className="text-2xl font-extrabold text-[#1E232F] mt-0.5">
                      {shiftData.countingProduct.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Legend matching Figma exactly 24px (gap-6) from doughnut */}
                <div className="space-y-4 min-w-[180px] sm:min-w-[200px]">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-[#00A854]" />
                      <span className="text-sm font-semibold text-[#1E232F]">OK</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#1E232F]">
                        {shiftData.rasioProductOk}%
                      </span>
                      <p className="text-xs text-gray-400 font-medium">
                        ({shiftData.okCount.toLocaleString('id-ID')} pcs)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-[#F04438]" />
                      <span className="text-sm font-semibold text-[#1E232F]">Rework</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#1E232F]">
                        {100 - shiftData.rasioProductOk}%
                      </span>
                      <p className="text-xs text-gray-400 font-medium">
                        ({shiftData.reworkCount.toLocaleString('id-ID')} pcs)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Threshold Parameter Modal (Requested in Item 3) */}
      <ModalPortal isOpen={showThresholdModal} onClose={() => setShowThresholdModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Edit Threshold {activeParameterTab}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure safety threshold for {activeParameterTab} ({selectedArea})
              </p>
            </div>
            <button
              onClick={() => setShowThresholdModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveThreshold} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Threshold Value ({currentParam.unit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(e.target.value)}
                  placeholder="e.g. 70"
                  className="w-full h-11 px-3.5 pr-10 bg-white border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  {currentParam.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowThresholdModal(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Edit Target OEE Modal matching Setting Target OEE.png */}
      <ModalPortal isOpen={showTargetModal} onClose={() => setShowTargetModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Edit Target OEE
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                This field is for desc terms of service
              </p>
            </div>
            <button
              onClick={() => setShowTargetModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveTarget} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempTargetOee}
                  onChange={(e) => setTempTargetOee(e.target.value)}
                  placeholder="100"
                  className="w-full h-11 px-3.5 pr-8 bg-white border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Toast Alert */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

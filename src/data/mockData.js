// ==========================================
// ASTEMO - WELDING PRODUCTION MOCK DATA
// ==========================================

export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Suep Astemo',
    username: 'suep_astemo',
    role: 'SPV',
    password: 'suep12345',
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_ROLES = [
  {
    id: 1,
    role: 'SPV',
    menus: [
      'Dashboard',
      'Planning Production',
      'Notification',
      'Master Data',
      'Register'
    ],
    permissions: [
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete',
      'Create, Read, Update, Delete'
    ],
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_AREAS = [
  { id: 1, area: 'Projection Weld', datetime: '06/09/2026 12:00' },
  { id: 2, area: 'Projection STP Weld', datetime: '06/09/2026 12:00' },
  { id: 3, area: 'Seam Weld', datetime: '06/09/2026 12:00' },
  { id: 4, area: 'Reinforcement Weld', datetime: '06/09/2026 12:00' },
  { id: 5, area: 'Rotary Weld', datetime: '06/09/2026 12:00' }
];

export const AREA_OPTIONS = [
  'Projection Weld',
  'Projection STP Weld',
  'Seam Weld',
  'Reinforcement Weld',
  'Rotary Weld'
];

export const INITIAL_PARAMETERS = [
  { id: 1, parameter: 'Ampere', unit: 'A', defaultThreshold: 70, datetime: '06/09/2026 12:00' },
  { id: 2, parameter: 'Welding Time', unit: 's', defaultThreshold: 1000, datetime: '06/09/2026 12:00' }
];

export const INITIAL_THRESHOLDS = [
  { id: 1, parameter: 'Ampere', maxValue: 20, datetime: '06/09/2026 12:00' },
  { id: 2, parameter: 'Welding Time', maxValue: 1000, datetime: '06/09/2026 12:00' }
];

export const INITIAL_MODELS = [
  { id: 1, model: 'HK1A1-001-002', datetime: '06/09/2026 12:00' },
  { id: 2, model: 'HK1A1-002-002', datetime: '06/09/2026 12:00' },
  { id: 3, model: 'HK1A1-003-002', datetime: '06/09/2026 12:00' },
  { id: 4, model: 'HK1A1-004-002', datetime: '06/09/2026 12:00' }
];

export const INITIAL_REGISTER_MODELS = [
  {
    id: 1,
    model: 'HK1A1-001-002',
    parameters: ['Ampere', 'Welding Time'],
    thresholds: ['70 A', '1000 s'],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    model: 'HK1A1-002-002',
    parameters: ['Ampere', 'Welding Time'],
    thresholds: ['70 A', '1000 s'],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 3,
    model: 'HK1A1-003-002',
    parameters: ['Ampere', 'Welding Time'],
    thresholds: ['70 A', '1000 s'],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 4,
    model: 'HK1A1-004-002',
    parameters: ['Ampere', 'Welding Time'],
    thresholds: ['70 A', '1000 s'],
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_PLANNING = [
  {
    id: 1,
    period: '07 September - 11 September 2026',
    shift1Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift2Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift3Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 2,
    period: '14 September - 18 September 2026',
    shift1Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift2Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift3Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    datetime: '06/09/2026 12:00'
  },
  {
    id: 3,
    period: '21 September - 25 September 2026',
    shift1Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift2Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    shift3Items: [
      { part: 'HK1A1-011-01-01', qty: '100pcs' },
      { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
      { part: 'S4271-011-01-IN', qty: '500pcs' }
    ],
    datetime: '06/09/2026 12:00'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Ampere value over the limit',
    description: 'The ampere has reached 70 A. Please check the Machine!',
    time: '1h Ago',
    severity: 'Critical',
    read: false
  },
  {
    id: 2,
    title: 'Ampere value over the limit',
    description: 'The ampere has reached 70 A. Please check the Machine!',
    time: '1h Ago',
    severity: 'Critical',
    read: false
  },
  {
    id: 3,
    title: 'Welding cycle time delayed',
    description: 'Welding cycle time took 14.8 s (target 12 s) on station W-01.',
    time: '3h Ago',
    severity: 'Warning',
    read: true
  },
  {
    id: 4,
    title: 'Welding gas pressure normal',
    description: 'Shielding gas mixture restored to optimal 20 L/min.',
    time: '4h Ago',
    severity: 'Info',
    read: true
  }
];

export const SHIFT_OPTIONS = ['Shift 1', 'Shift 2', 'Shift 3'];

export const WELDING_DASHBOARD_CONFIG = {
  'Shift 1': {
    targetOee: 100,
    currentOee: 50,
    productionTarget: 1284,
    countingProduct: 1284,
    rasioProductOk: 90,
    okCount: 1156,
    reworkCount: 128,
    availability: 50,
    performance: 80,
    quality: 20,
    productionGraph: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
      actual: [150000, 125000, 50000, 100000, 75000],
      plan: [150000, 150000, 150000, 150000, 100000]
    },
    parameterTrends: {
      timeLabels: ['01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00', '08:00:00'],
      Ampere: {
        unit: 'A',
        threshold: 70,
        actual: [25, 45, 68, 72, 70, 75, 88, 52]
      },
      'Welding Time': {
        unit: 's',
        threshold: 1000,
        actual: [880, 930, 990, 1010, 980, 920, 895, 940]
      }
    }
  },
  'Shift 2': {
    targetOee: 100,
    currentOee: 62,
    productionTarget: 1150,
    countingProduct: 1120,
    rasioProductOk: 92,
    okCount: 1030,
    reworkCount: 90,
    availability: 65,
    performance: 84,
    quality: 30,
    productionGraph: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
      actual: [130000, 140000, 110000, 125000, 115000],
      plan: [140000, 140000, 140000, 140000, 120000]
    },
    parameterTrends: {
      timeLabels: ['09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'],
      Ampere: {
        unit: 'A',
        threshold: 70,
        actual: [30, 52, 71, 68, 70, 69, 74, 58]
      },
      'Welding Time': {
        unit: 's',
        threshold: 1000,
        actual: [910, 940, 970, 960, 985, 930, 920, 945]
      }
    }
  },
  'Shift 3': {
    targetOee: 100,
    currentOee: 45,
    productionTarget: 980,
    countingProduct: 940,
    rasioProductOk: 88,
    okCount: 827,
    reworkCount: 113,
    availability: 48,
    performance: 75,
    quality: 18,
    productionGraph: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
      actual: [95000, 105000, 85000, 90000, 88000],
      plan: [110000, 110000, 110000, 110000, 95000]
    },
    parameterTrends: {
      timeLabels: ['17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00', '24:00:00'],
      Ampere: {
        unit: 'A',
        threshold: 70,
        actual: [28, 48, 73, 71, 69, 68, 82, 60]
      },
      'Welding Time': {
        unit: 's',
        threshold: 1000,
        actual: [890, 950, 1020, 970, 990, 940, 915, 935]
      }
    }
  }
};

export const REALTIME_CYCLES_10 = [
  {
    cycle: 1,
    countingProduct: 1280,
    productionTarget: 1300,
    okCount: 1152,
    reworkCount: 128,
    rasioProductOk: 90.0,
    currentOee: 50,
    availability: 50,
    performance: 80,
    quality: 20,
    ampereLive: [25, 45, 68, 72, 70, 75, 88, 52, 65, 71],
    weldingTimeLive: [880, 930, 990, 1010, 980, 920, 895, 940, 960, 985],
    timeLabelsLive: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
  },
  {
    cycle: 2,
    countingProduct: 1284,
    productionTarget: 1300,
    okCount: 1156,
    reworkCount: 128,
    rasioProductOk: 90.1,
    currentOee: 51,
    availability: 52,
    performance: 81,
    quality: 21,
    ampereLive: [45, 68, 72, 70, 75, 88, 52, 65, 71, 74],
    weldingTimeLive: [930, 990, 1010, 980, 920, 895, 940, 960, 985, 975],
    timeLabelsLive: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00']
  },
  {
    cycle: 3,
    countingProduct: 1289,
    productionTarget: 1300,
    okCount: 1161,
    reworkCount: 128,
    rasioProductOk: 90.1,
    currentOee: 53,
    availability: 54,
    performance: 82,
    quality: 22,
    ampereLive: [68, 72, 70, 75, 88, 52, 65, 71, 74, 69],
    weldingTimeLive: [990, 1010, 980, 920, 895, 940, 960, 985, 975, 940],
    timeLabelsLive: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
  },
  {
    cycle: 4,
    countingProduct: 1294,
    productionTarget: 1300,
    okCount: 1165,
    reworkCount: 129,
    rasioProductOk: 90.0,
    currentOee: 52,
    availability: 53,
    performance: 81,
    quality: 21,
    ampereLive: [72, 70, 75, 88, 52, 65, 71, 74, 69, 78],
    weldingTimeLive: [1010, 980, 920, 895, 940, 960, 985, 975, 940, 1005],
    timeLabelsLive: ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']
  },
  {
    cycle: 5,
    countingProduct: 1300,
    productionTarget: 1300,
    okCount: 1171,
    reworkCount: 129,
    rasioProductOk: 90.1,
    currentOee: 55,
    availability: 56,
    performance: 83,
    quality: 23,
    ampereLive: [70, 75, 88, 52, 65, 71, 74, 69, 78, 62],
    weldingTimeLive: [980, 920, 895, 940, 960, 985, 975, 940, 1005, 910],
    timeLabelsLive: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
  },
  {
    cycle: 6,
    countingProduct: 1305,
    productionTarget: 1300,
    okCount: 1175,
    reworkCount: 130,
    rasioProductOk: 90.0,
    currentOee: 54,
    availability: 55,
    performance: 82,
    quality: 22,
    ampereLive: [75, 88, 52, 65, 71, 74, 69, 78, 62, 58],
    weldingTimeLive: [920, 895, 940, 960, 985, 975, 940, 1005, 910, 890],
    timeLabelsLive: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00']
  },
  {
    cycle: 7,
    countingProduct: 1311,
    productionTarget: 1300,
    okCount: 1181,
    reworkCount: 130,
    rasioProductOk: 90.1,
    currentOee: 56,
    availability: 57,
    performance: 84,
    quality: 24,
    ampereLive: [88, 52, 65, 71, 74, 69, 78, 62, 58, 83],
    weldingTimeLive: [895, 940, 960, 985, 975, 940, 1005, 910, 890, 995],
    timeLabelsLive: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
  },
  {
    cycle: 8,
    countingProduct: 1316,
    productionTarget: 1300,
    okCount: 1185,
    reworkCount: 131,
    rasioProductOk: 90.0,
    currentOee: 53,
    availability: 54,
    performance: 82,
    quality: 22,
    ampereLive: [52, 65, 71, 74, 69, 78, 62, 58, 83, 67],
    weldingTimeLive: [940, 960, 985, 975, 940, 1005, 910, 890, 995, 935],
    timeLabelsLive: ['10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00']
  },
  {
    cycle: 9,
    countingProduct: 1322,
    productionTarget: 1300,
    okCount: 1191,
    reworkCount: 131,
    rasioProductOk: 90.1,
    currentOee: 57,
    availability: 58,
    performance: 85,
    quality: 25,
    ampereLive: [65, 71, 74, 69, 78, 62, 58, 83, 67, 76],
    weldingTimeLive: [960, 985, 975, 940, 1005, 910, 890, 995, 935, 980],
    timeLabelsLive: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']
  },
  {
    cycle: 10,
    countingProduct: 1328,
    productionTarget: 1300,
    okCount: 1196,
    reworkCount: 132,
    rasioProductOk: 90.1,
    currentOee: 58,
    availability: 59,
    performance: 86,
    quality: 25,
    ampereLive: [71, 74, 69, 78, 62, 58, 83, 67, 76, 70],
    weldingTimeLive: [985, 975, 940, 1005, 910, 890, 995, 935, 980, 950],
    timeLabelsLive: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
  }
];

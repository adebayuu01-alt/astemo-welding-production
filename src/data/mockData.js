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

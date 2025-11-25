export const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'India', code: 'IN' },
];

export const states: { [countryCode: string]: { name: string; code: string }[] } = {
  US: [
    { name: 'California', code: 'CA' },
    { name: 'New York', code: 'NY' },
    { name: 'Texas', code: 'TX' },
  ],
  CA: [
    { name: 'Ontario', code: 'ON' },
    { name: 'Quebec', code: 'QC' },
    { name: 'British Columbia', code: 'BC' },
  ],
  GB: [
    { name: 'England', code: 'ENG' },
    { name: 'Scotland', code: 'SCT' },
    { name: 'Wales', code: 'WLS' },
  ],
  IN: [
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Karnataka', code: 'KA' },
  ],
};

export const cities: { [stateCode: string]: { name: string }[] } = {
  CA: [
    { name: 'San Francisco' },
    { name: 'Los Angeles' },
    { name: 'San Diego' },
  ],
  NY: [{ name: 'New York City' }, { name: 'Buffalo' }, { name: 'Rochester' }],
  TX: [{ name: 'Houston' }, { name: 'Dallas' }, { name: 'Austin' }],
  ON: [{ name: 'Toronto' }, { name: 'Ottawa' }, { name: 'Mississauga' }],
  QC: [{ name: 'Montreal' }, { name: 'Quebec City' }, { name: 'Gatineau' }],
  BC: [{ name: 'Vancouver' }, { name: 'Victoria' }, { name: 'Surrey' }],
  ENG: [{ name: 'London' }, { name: 'Manchester' }, { name: 'Birmingham' }],
  SCT: [{ name: 'Glasgow' }, { name: 'Edinburgh' }, { name: 'Aberdeen' }],
  WLS: [{ name: 'Cardiff' }, { name: 'Swansea' }, { name: 'Newport' }],
  MH: [{ name: 'Mumbai' }, { name: 'Pune' }, { name: 'Nagpur' }],
  DL: [{ name: 'New Delhi' }],
  KA: [{ name: 'Bengaluru' }, { name: 'Mysuru' }, { name: 'Hubli' }],
};

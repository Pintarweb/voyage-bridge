export const COUNTRY_DATA: Record<string, { name: string; currency: string; phoneCode: string; timezone: string }> = {
    US: { name: 'United States', currency: 'USD', phoneCode: '+1', timezone: 'America/New_York' },
    MY: { name: 'Malaysia', currency: 'MYR', phoneCode: '+60', timezone: 'Asia/Kuala_Lumpur' },
    SG: { name: 'Singapore', currency: 'SGD', phoneCode: '+65', timezone: 'Asia/Singapore' },
    GB: { name: 'United Kingdom', currency: 'GBP', phoneCode: '+44', timezone: 'Europe/London' },
    AU: { name: 'Australia', currency: 'AUD', phoneCode: '+61', timezone: 'Australia/Sydney' },
    CN: { name: 'China', currency: 'CNY', phoneCode: '+86', timezone: 'Asia/Shanghai' },
    JP: { name: 'Japan', currency: 'JPY', phoneCode: '+81', timezone: 'Asia/Tokyo' },
    TH: { name: 'Thailand', currency: 'THB', phoneCode: '+66', timezone: 'Asia/Bangkok' },
    ID: { name: 'Indonesia', currency: 'IDR', phoneCode: '+62', timezone: 'Asia/Jakarta' },
    VN: { name: 'Vietnam', currency: 'VND', phoneCode: '+84', timezone: 'Asia/Ho_Chi_Minh' },
}

export const CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'VND', name: 'Vietnamese Dong' },
]

export const SUPPLIER_TYPES = [
    'Hotel',
    'Tour Operator',
    'Transport Provider',
    'Attraction',
    'Restaurant',
    'DMC',
    'Other',
]

export const LANGUAGES = [
    'English',
    'Mandarin',
    'Malay',
    'Tamil',
    'Japanese',
    'Korean',
    'Arabic',
    'French',
    'Spanish',
    'German',
]

export const CONTINENTS = [
    'Asia',
    'Europe',
    'North America',
    'South America',
    'Africa',
    'Oceania',
    'Antarctica',
]

export const REGIONS = [
    'South East Asia',
    'East Asia',
    'South Asia',
    'Middle East',
    'Western Europe',
    'Eastern Europe',
    'Northern Europe',
    'Southern Europe',
    'North America',
    'Central America',
    'Caribbean',
    'South America',
    'North Africa',
    'Sub-Saharan Africa',
    'Oceania',
]

export const REGION_TO_CONTINENT_MAP: Record<string, string> = {
    'South East Asia': 'Asia',
    'East Asia': 'Asia',
    'South Asia': 'Asia',
    'Middle East': 'Asia',
    'Western Europe': 'Europe',
    'Eastern Europe': 'Europe',
    'Northern Europe': 'Europe',
    'Southern Europe': 'Europe',
    'North America': 'North America',
    'Central America': 'North America',
    'Caribbean': 'North America',
    'South America': 'South America',
    'North Africa': 'Africa',
    'Sub-Saharan Africa': 'Africa',
    'Oceania': 'Oceania',
}

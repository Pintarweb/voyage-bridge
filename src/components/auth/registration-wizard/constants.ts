export const COUNTRY_DATA: Record<string, { name: string; currency: string; phoneCode: string; timezone: string }> = {
    // Asia
    MY: { name: 'Malaysia', currency: 'MYR', phoneCode: '+60', timezone: 'Asia/Kuala_Lumpur' },
    SG: { name: 'Singapore', currency: 'SGD', phoneCode: '+65', timezone: 'Asia/Singapore' },
    CN: { name: 'China', currency: 'CNY', phoneCode: '+86', timezone: 'Asia/Shanghai' },
    JP: { name: 'Japan', currency: 'JPY', phoneCode: '+81', timezone: 'Asia/Tokyo' },
    TH: { name: 'Thailand', currency: 'THB', phoneCode: '+66', timezone: 'Asia/Bangkok' },
    ID: { name: 'Indonesia', currency: 'IDR', phoneCode: '+62', timezone: 'Asia/Jakarta' },
    VN: { name: 'Vietnam', currency: 'VND', phoneCode: '+84', timezone: 'Asia/Ho_Chi_Minh' },
    KR: { name: 'South Korea', currency: 'KRW', phoneCode: '+82', timezone: 'Asia/Seoul' },
    IN: { name: 'India', currency: 'INR', phoneCode: '+91', timezone: 'Asia/Kolkata' },
    AE: { name: 'United Arab Emirates', currency: 'AED', phoneCode: '+971', timezone: 'Asia/Dubai' },
    SA: { name: 'Saudi Arabia', currency: 'SAR', phoneCode: '+966', timezone: 'Asia/Riyadh' },

    // Europe
    GB: { name: 'United Kingdom', currency: 'GBP', phoneCode: '+44', timezone: 'Europe/London' },
    FR: { name: 'France', currency: 'EUR', phoneCode: '+33', timezone: 'Europe/Paris' },
    DE: { name: 'Germany', currency: 'EUR', phoneCode: '+49', timezone: 'Europe/Berlin' },
    IT: { name: 'Italy', currency: 'EUR', phoneCode: '+39', timezone: 'Europe/Rome' },
    ES: { name: 'Spain', currency: 'EUR', phoneCode: '+34', timezone: 'Europe/Madrid' },
    NL: { name: 'Netherlands', currency: 'EUR', phoneCode: '+31', timezone: 'Europe/Amsterdam' },
    CH: { name: 'Switzerland', currency: 'CHF', phoneCode: '+41', timezone: 'Europe/Zurich' },

    // North America
    US: { name: 'United States', currency: 'USD', phoneCode: '+1', timezone: 'America/New_York' },
    CA: { name: 'Canada', currency: 'CAD', phoneCode: '+1', timezone: 'America/Toronto' },
    MX: { name: 'Mexico', currency: 'MXN', phoneCode: '+52', timezone: 'America/Mexico_City' },

    // South America
    BR: { name: 'Brazil', currency: 'BRL', phoneCode: '+55', timezone: 'America/Sao_Paulo' },
    AR: { name: 'Argentina', currency: 'ARS', phoneCode: '+54', timezone: 'America/Argentina/Buenos_Aires' },

    // Oceania
    AU: { name: 'Australia', currency: 'AUD', phoneCode: '+61', timezone: 'Australia/Sydney' },
    NZ: { name: 'New Zealand', currency: 'NZD', phoneCode: '+64', timezone: 'Pacific/Auckland' },

    // Africa
    ZA: { name: 'South Africa', currency: 'ZAR', phoneCode: '+27', timezone: 'Africa/Johannesburg' },
    EG: { name: 'Egypt', currency: 'EGP', phoneCode: '+20', timezone: 'Africa/Cairo' },
}

export const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', flagCode: 'us' },
    { code: 'MYR', name: 'Malaysian Ringgit', flagCode: 'my' },
    { code: 'SGD', name: 'Singapore Dollar', flagCode: 'sg' },
    { code: 'GBP', name: 'British Pound', flagCode: 'gb' },
    { code: 'EUR', name: 'Euro', flagCode: 'eu' },
    { code: 'AUD', name: 'Australian Dollar', flagCode: 'au' },
    { code: 'CNY', name: 'Chinese Yuan', flagCode: 'cn' },
    { code: 'JPY', name: 'Japanese Yen', flagCode: 'jp' },
    { code: 'THB', name: 'Thai Baht', flagCode: 'th' },
    { code: 'IDR', name: 'Indonesian Rupiah', flagCode: 'id' },
    { code: 'VND', name: 'Vietnamese Dong', flagCode: 'vn' },
]

export const SUPPLIER_TYPES = [
    'Land Operator',
    'Transport',
    'Hotel',
    'Airline',
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

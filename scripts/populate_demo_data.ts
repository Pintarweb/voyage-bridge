
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// --- Data Generators ---

const CITIES = [
    { city: 'Kuala Lumpur', country: 'MY', currency: 'MYR' },
    { city: 'Singapore', country: 'SG', currency: 'SGD' },
    { city: 'Bangkok', country: 'TH', currency: 'THB' },
    { city: 'Jakarta', country: 'ID', currency: 'IDR' },
    { city: 'Tokyo', country: 'JP', currency: 'JPY' },
    { city: 'Seoul', country: 'KR', currency: 'KRW' },
    { city: 'Paris', country: 'FR', currency: 'EUR' },
    { city: 'London', country: 'GB', currency: 'GBP' },
    { city: 'New York', country: 'US', currency: 'USD' },
    { city: 'Dubai', country: 'AE', currency: 'AED' }
]

const COMPANY_PREFIXES = ['Royal', 'Grand', 'Elite', 'Premier', 'Global', 'Voyage', 'Luxury', 'Travel', 'Star', 'Golden']
const COMPANY_SUFFIXES = ['Hotels', 'Resorts', 'Tours', 'Travels', 'Holidays', 'Adventures', 'Getaways', 'Groups', 'Partners', 'Systems']

const ADJECTIVES = ['Amazing', 'Exclusive', 'Budget', 'Luxury', 'Private', 'Guided', 'Sunset', 'City', 'Heritage', 'Nature']
const NOUNS = ['Tour', 'Experience', 'Stay', 'Package', 'Adventure', 'Walk', 'Cruise', 'Safari', 'Trip', 'Journey']

const PRODUCT_CATEGORIES = ['Hotel', 'Transport', 'Tour', 'Attraction']

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

const UNSPLASH_IMAGES = {
    Hotel: [
        'photo-1566073771259-6a8506099945',
        'photo-1520250497591-112f2f40a3f4',
        'photo-1551882547-ff40c63fe5fa',
        'photo-1582719478250-c89cae4dc85b',
        'photo-1564501049412-61c2a3083791'
    ],
    Transport: [
        'photo-1502877338535-766e1452684a', // Car
        'photo-1532939163844-547f958e91b4', // Plane
        'photo-1544620347-c4fd4a3d5957', // Bus
        'photo-1478860409698-8707f313ee8b', // Train
        'photo-1497935586351-b67a49e012bf' // Coffee/Travel
    ],
    Tour: [
        'photo-1476514525535-07fb3b4ae5f1', // Switzerland nature
        'photo-1504150558240-0b4fd8946624', // Road trip
        'photo-1469854523086-cc02fe5d8800', // Traveler
        'photo-1488646953014-85cb44e25828', // Travel map
        'photo-1501785888041-af3ef285b470'  // Landscape
    ],
    Attraction: [
        'photo-1533105079780-92b9be482077',
        'photo-1568605114967-8130f3a36994',
        'photo-1576053139778-7e32f2ae3cfd',
        'photo-1518391846015-55a9cc003b25',
        'photo-1499678329028-101435549a4e'
    ]
}

function getPhotoUrl(category: string): string {
    const key = (['Hotel', 'Transport', 'Tour', 'Attraction'].includes(category) ? category : 'Hotel') as keyof typeof UNSPLASH_IMAGES
    const imageId = getRandomItem(UNSPLASH_IMAGES[key])
    return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800&q=80`
}

function generateCompanyName() {
    return `${getRandomItem(COMPANY_PREFIXES)} ${getRandomItem(COMPANY_SUFFIXES)}`
}

function generateCompanyEmail(name: string): string {
    const slug = name.toLowerCase().replace(/[^a-z]/g, '')
    return `reservations@${slug}.com`
}

function generateProductName(city: string, category: string) {
    if (category === 'Hotel') return `${getRandomItem(COMPANY_PREFIXES)} ${city} Hotel`
    return `${city} ${getRandomItem(ADJECTIVES)} ${getRandomItem(NOUNS)}`
}

// --- Main Script ---

async function populateData() {
    console.log('Starting demo data population...')

    // 1. Create 100 Verified Global Travel Agents
    console.log('\n--- Generating 100 Agents ---')
    for (let i = 1; i <= 100; i++) {
        // Professional Agent Emails
        const email = `agent.partner.${i}@elite-travel-partners.com`
        const password = 'Password123!'
        const name = `Agent ${i}`
        const agencyName = `${generateCompanyName()} Agency`

        // Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'agent', full_name: name }
        })

        if (authError) {
            console.error(`Error creating agent user ${i}:`, authError.message)
            continue
        }

        const userId = authData.user.id

        // Create Profile
        const { error: profileError } = await supabase
            .from('agent_profiles')
            .upsert({
                id: userId,
                email: email,
                agency_name: agencyName,
                first_name: `Agent`,
                last_name: `${i}`,
                verification_status: 'approved',
                country_code: getRandomItem(CITIES).country
            })

        if (profileError) {
            console.error(`Error creating agent profile ${i}:`, profileError.message)
        } else {
            if (i % 10 === 0) process.stdout.write('.')
        }
    }
    console.log('\nAgents generation complete.')


    // 2. Create 20 Featured Suppliers
    console.log('\n--- Generating 20 Suppliers ---')
    for (let i = 1; i <= 20; i++) {
        const companyName = generateCompanyName()
        const email = generateCompanyEmail(companyName)
        const password = 'Password123!'
        const location = getRandomItem(CITIES)

        // Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'supplier' }
        })

        if (authError) {
            console.error(`Error creating supplier user ${i} for ${email}:`, authError.message)
            continue
        }

        const userId = authData.user.id

        // Create Supplier Profile
        const { error: supplierError } = await supabase
            .from('suppliers')
            .upsert({
                id: userId,
                company_name: companyName,
                contact_email: email,
                country_code: location.country,
                city: location.city,
                base_currency: location.currency,
                supplier_type: getRandomItem(['Hotel', 'Land Operator', 'Transport', 'Airline']),
                payment_status: 'succeeded',
                subscription_status: 'active',
                website_url: `https://www.${companyName.toLowerCase().replace(/ /g, '')}.com`,
                address_line_1: '123 Business Blvd'
            })

        if (supplierError) {
            console.error(`Error creating supplier profile ${i}:`, supplierError.message)
            continue
        }

        // 3. Create Products for Supplier
        const numProducts = 2 + Math.floor(Math.random() * 3) // 2 to 4 products
        for (let j = 0; j < numProducts; j++) {
            const category = getRandomItem(PRODUCT_CATEGORIES)
            const productName = generateProductName(location.city, category)

            const { error: productError } = await supabase
                .from('products')
                .insert({
                    supplier_id: userId,
                    product_name: productName,
                    product_description: `Experience the best of ${location.city} with our premium ${category.toLowerCase()} service. Enjoy world-class amenities and service.`,
                    product_category: category,
                    status: 'active',
                    city: location.city,
                    country_code: location.country,
                    photo_urls: [
                        getPhotoUrl(category),
                        getPhotoUrl(category)
                    ],
                    product_url: 'https://example.com'
                })

            if (productError) {
                console.error(`  Error creating product for supplier ${i}:`, productError.message)
            }
        }

        process.stdout.write('*')
    }
    console.log('\nSuppliers and Products generation complete.')
    console.log('Done.')
}

populateData()

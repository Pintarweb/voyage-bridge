
// import { handleCheckoutSessionCompleted } from '../src/lib/stripe'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function runSubscriptionTest() {
    const userIdToTest = process.argv[2] // Get userId from command line arg

    if (!userIdToTest) {
        console.error('Please provide a userId as an argument.')
        console.log('Usage: npx tsx scripts/test-webhook.ts <userId>')
        process.exit(1)
    }

    console.log(`Testing subscription update for User ID: ${userIdToTest}`)

    // Mock Session Object
    const mockSession = {
        id: 'cs_test_mock_session',
        object: 'checkout.session',
        metadata: {
            userId: userIdToTest
        },
        customer_details: {
            email: 'test@example.com',
            name: 'Test User'
        },
        payment_status: 'paid',
    } as unknown as Stripe.Checkout.Session // Cast to satisfy type, we mostly need metadata

    try {
        const { handleCheckoutSessionCompleted } = await import('../src/lib/stripe')
        const result = await handleCheckoutSessionCompleted(mockSession)
        console.log('Test Result:', result)
    } catch (error) {
        console.error('Test Failed:', error)
    }
}

runSubscriptionTest()

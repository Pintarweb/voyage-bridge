
const { Client } = require('pg');

async function resetSupplier(companyName) {
    if (!companyName) {
        console.error('Please provide a company name. Example: node reset_test_supplier.js "Grand Plaza Hotel"');
        process.exit(1);
    }

    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log(`Connected. Resetting ${companyName}...`);

        const res = await client.query(`
            UPDATE suppliers 
            SET 
                is_approved = false, 
                role = 'pending_supplier',
                payment_status = 'pending_payment',
                subscription_status = 'pending_payment'
            WHERE company_name = $1
            RETURNING id, contact_email
        `, [companyName]);

        if (res.rowCount === 0) {
            console.log(`No supplier found with name "${companyName}"`);
        } else {
            console.log(`✅ Success! ${companyName} (${res.rows[0].contact_email}) is now "Pending" again.`);
            console.log(`You can now test the Payment and Admin Approval flows for this user.`);
        }

        await client.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

const target = process.argv[2];
resetSupplier(target);

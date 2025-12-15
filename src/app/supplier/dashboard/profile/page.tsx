import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import EditProfileForm from '@/components/supplier/EditProfileForm'


export default async function SupplierProfilePage() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
        redirect('/auth/login')
    }

    // Fetch Supplier Data
    const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', user.id)
        .single()

    if (supplierError) {
        console.error('Error fetching supplier:', supplierError)
        // Handle error gracefully or redirect
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <EditProfileForm supplier={supplier} userEmail={user.email} />
        </div>
    )
}

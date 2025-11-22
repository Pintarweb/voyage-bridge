import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/supplier/product-form'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    console.log('Dashboard Auth Check:', { user: user?.id, error })

    if (!user) {
        console.log('Redirecting to register from dashboard')
        return redirect('/auth/register')
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="mx-auto max-w-4xl">
                <header className="mb-8 border-b border-slate-700 pb-4">
                    <h1 className="text-3xl font-bold text-white">Supplier Dashboard</h1>
                    <p className="text-gray-400">Manage your products and profile</p>
                </header>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-white">Add New Product</h2>
                    <ProductForm />
                </section>
            </div>
        </div>
    )
}

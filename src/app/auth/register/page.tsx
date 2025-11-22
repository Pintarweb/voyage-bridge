import RegisterForm from '@/components/auth/register-form'

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Supplier Registration
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join VoyageBridge and grow your business
                    </p>
                </div>
                <RegisterForm />
            </div>
        </div>
    )
}

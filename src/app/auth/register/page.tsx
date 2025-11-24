import RegistrationWizard from '@/components/auth/registration-wizard/RegistrationWizard'

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center mb-8">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Supplier Registration
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Join VoyageBridge and connect with global travel agents.
                    </p>
                </div>

                <RegistrationWizard />
            </div>
        </div>
    )
}

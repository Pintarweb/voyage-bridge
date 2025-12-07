import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export const useRoleRedirect = () => {
    const supabase = createClient()
    const router = useRouter()

    const checkAndRedirect = async (userId: string) => {
        try {
            // Task 1: Priority Check - Admin Profile
            const { data: adminProfile, error: adminError } = await supabase
                .from('admin_profiles')
                .select('id')
                .eq('id', userId)
                .single()

            if (!adminError && adminProfile) {
                // User is confirmed admin
                router.push('/admin')
                return true // Redirecting
            }

            // If checking admin fails or returns nothing, we let the component determine next steps
            // or we could check other roles here if needed. 
            // For now, we return false to allow fallback to standard portal.
            return false

        } catch (error) {
            console.error('Redirection check failed:', error)
            return false
        }
    }

    return { checkAndRedirect }
}

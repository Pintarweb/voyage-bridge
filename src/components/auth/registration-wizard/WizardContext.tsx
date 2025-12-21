'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type SupplierFormData = {
    // Step 1: Identity & Location
    company_name: string
    trading_name: string
    country_code: string
    address_line_1: string
    city: string
    postcode: string
    timezone: string
    base_currency: string

    // Step 2: Legal & Verification
    company_reg_no: string
    license_no: string
    tax_id: string
    contact_email: string
    phone_number: string

    // Step 3: Business Profile
    supplier_type: string
    description: string
    website_url: string

    // Social Media (Separate Fields)
    social_instagram: string
    social_facebook: string
    social_tiktok: string
    social_linkedin: string
    social_tripadvisor: string
    whatsapp_business_url: string

    languages_spoken: string[]
    logo_url: string
    cover_image_url: string

    // Auth
    email: string
    password: string
}

const INITIAL_DATA: SupplierFormData = {
    company_name: '',
    trading_name: '',
    country_code: '',
    address_line_1: '',
    city: '',
    postcode: '',
    timezone: '',
    base_currency: '',
    company_reg_no: '',
    license_no: '',
    tax_id: '',
    contact_email: '',
    phone_number: '',
    supplier_type: '',
    description: '',
    website_url: '',

    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    social_linkedin: '',
    social_tripadvisor: '',
    whatsapp_business_url: '',

    languages_spoken: [],
    logo_url: '',
    cover_image_url: '',
    email: '',
    password: '',
}

type WizardContextType = {
    formData: SupplierFormData
    updateFormData: (data: Partial<SupplierFormData>) => void
    currentStep: number
    setStep: (step: number) => void
    totalSteps: number
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children, initialEmail = '' }: { children: ReactNode; initialEmail?: string }) {
    const [formData, setFormData] = useState<SupplierFormData>({ ...INITIAL_DATA, email: initialEmail })
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 4

    const updateFormData = (newData: Partial<SupplierFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }

    const setStep = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step)
        }
    }

    return (
        <WizardContext.Provider value={{ formData, updateFormData, currentStep, setStep, totalSteps }}>
            {children}
        </WizardContext.Provider>
    )
}

export function useWizard() {
    const context = useContext(WizardContext)
    if (!context) {
        throw new Error('useWizard must be used within a WizardProvider')
    }
    return context
}

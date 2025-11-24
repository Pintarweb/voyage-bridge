'use client'

import { WizardProvider, useWizard } from './WizardContext'
import Step1Identity from './Step1Identity'
import Step2Legal from './Step2Legal'
import Step3Profile from './Step3Profile'
import Step4Review from './Step4Review'

function WizardContent() {
    const { currentStep, totalSteps } = useWizard()

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Identity />
            case 2: return <Step2Legal />
            case 3: return <Step3Profile />
            case 4: return <Step4Review />
            default: return <Step1Identity />
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Stepper UI */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-teal-400">Step {currentStep} of {totalSteps}</span>
                    <span className="text-sm text-gray-400">
                        {currentStep === 1 && 'Identity'}
                        {currentStep === 2 && 'Legal'}
                        {currentStep === 3 && 'Profile'}
                        {currentStep === 4 && 'Review'}
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                        className="bg-teal-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
                {renderStep()}
            </div>
        </div>
    )
}

export default function RegistrationWizard() {
    return (
        <WizardProvider>
            <WizardContent />
        </WizardProvider>
    )
}

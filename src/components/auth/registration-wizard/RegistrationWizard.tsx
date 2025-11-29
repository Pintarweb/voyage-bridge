'use client'

import { WizardProvider, useWizard } from './WizardContext'
import Step1Identity from './Step1Identity'
import Step2Legal from './Step2Legal'
import Step3Profile from './Step3Profile'
import Step4Review from './Step4Review'
import { useLanguage } from '@/context/LanguageContext'

function WizardContent() {
    const { currentStep, totalSteps } = useWizard()
    const { language } = useLanguage()

    const t = {
        'en-US': {
            step1: 'Identity',
            step2: 'Legal',
            step3: 'Profile',
            step4: 'Review',
            stepOf: 'Step {current} of {total}'
        },
        'zh-CN': {
            step1: '身份',
            step2: '法律',
            step3: '资料',
            step4: '审查',
            stepOf: '第 {current} 步，共 {total} 步'
        },
        'ms-MY': {
            step1: 'Identiti',
            step2: 'Undang-undang',
            step3: 'Profil',
            step4: 'Semakan',
            stepOf: 'Langkah {current} dari {total}'
        },
        'es-ES': {
            step1: 'Identidad',
            step2: 'Legal',
            step3: 'Perfil',
            step4: 'Revisión',
            stepOf: 'Paso {current} de {total}'
        },
        'fr-FR': {
            step1: 'Identité',
            step2: 'Légal',
            step3: 'Profil',
            step4: 'Revue',
            stepOf: 'Étape {current} sur {total}'
        },
        'de-DE': {
            step1: 'Identität',
            step2: 'Rechtlich',
            step3: 'Profil',
            step4: 'Überprüfung',
            stepOf: 'Schritt {current} von {total}'
        },
        'ja-JP': {
            step1: '身元',
            step2: '法務',
            step3: 'プロフィール',
            step4: '確認',
            stepOf: 'ステップ {current} / {total}'
        },
        'ko-KR': {
            step1: '신원',
            step2: '법률',
            step3: '프로필',
            step4: '검토',
            stepOf: '{total}단계 중 {current}단계'
        },
        'ar-SA': {
            step1: 'الهوية',
            step2: 'قانوني',
            step3: 'الملف الشخصي',
            step4: 'مراجعة',
            stepOf: 'الخطوة {current} من {total}'
        },
        'th-TH': {
            step1: 'ตัวตน',
            step2: 'กฎหมาย',
            step3: 'โปรไฟล์',
            step4: 'ตรวจสอบ',
            stepOf: 'ขั้นตอนที่ {current} จาก {total}'
        },
        'vi-VN': {
            step1: 'Danh tính',
            step2: 'Pháp lý',
            step3: 'Hồ sơ',
            step4: 'Xem lại',
            stepOf: 'Bước {current} trên {total}'
        },
        'id-ID': {
            step1: 'Identitas',
            step2: 'Hukum',
            step3: 'Profil',
            step4: 'Tinjauan',
            stepOf: 'Langkah {current} dari {total}'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Identity />
            case 2: return <Step2Legal />
            case 3: return <Step3Profile />
            case 4: return <Step4Review />
            default: return <Step1Identity />
        }
    }

    const stepText = content.stepOf
        .replace('{current}', currentStep.toString())
        .replace('{total}', totalSteps.toString())

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Stepper UI */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{stepText}</span>
                    <span className="text-sm font-bold text-slate-800">
                        {currentStep === 1 && content.step1}
                        {currentStep === 2 && content.step2}
                        {currentStep === 3 && content.step3}
                        {currentStep === 4 && content.step4}
                    </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2.5 backdrop-blur-sm">
                    <div
                        className="bg-slate-900 h-2.5 rounded-full transition-all duration-300 ease-in-out shadow-sm"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Step Content */}
            <div className="">
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

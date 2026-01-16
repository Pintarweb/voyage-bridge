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
            {/* Early Bird Offer Banner (Step 1 Only) */}
            {currentStep === 1 && (
                <div className="relative mb-10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(251,191,36,0.2)] border border-amber-400/30 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 backdrop-blur-md"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 transform rotate-12">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>

                    <div className="relative p-6 z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-black italic text-white mb-2 drop-shadow-lg leading-tight">
                                <span className="text-amber-400">Founding Member Offer:</span> <br />
                                70% OFF Your First Year <br />
                                <span className="text-lg font-bold not-italic text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">+ 30-Day Free Trial!</span>
                            </h3>
                            <p className="text-sm text-slate-200 font-medium">
                                Join the elite network of suppliers who are already transforming their business. Secure your spot and lock in these lifetime benefits today!
                            </p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-white/10 backdrop-blur-sm min-w-[200px] flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                            <span className="text-xs text-amber-200 uppercase tracking-widest font-bold mb-1">Spots Remaining</span>
                            <div className="text-4xl font-black text-white flex items-center gap-2">
                                <span className="animate-pulse text-amber-400">12</span> <span className="text-lg text-white/50 font-normal">/ 50</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full w-[76%] shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
                            </div>
                            <span className="text-[10px] text-white/60 mt-2 uppercase tracking-wide">For this month</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stepper UI */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-white tracking-wide">{stepText}</span>
                    <span className="text-sm font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                        {currentStep === 1 && content.step1}
                        {currentStep === 2 && content.step2}
                        {currentStep === 3 && content.step3}
                        {currentStep === 4 && content.step4}
                    </span>
                </div>
                <div className="flex gap-2 w-full">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`h-2 rounded-full flex-1 transition-all duration-500 ${step < currentStep
                                ? 'bg-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.5)]' // Completed
                                : step === currentStep
                                    ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24]' // Current
                                    : 'bg-white/10 backdrop-blur-sm' // Future
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="">
                {renderStep()}
            </div>
        </div>
    )
}

export default function RegistrationWizard({ initialEmail, onSubmissionStart }: { initialEmail?: string, onSubmissionStart?: () => void }) {
    return (
        <WizardProvider initialEmail={initialEmail} onSubmissionStart={onSubmissionStart}>
            <WizardContent />
        </WizardProvider>
    )
}

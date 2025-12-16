import { motion } from 'framer-motion'
import { FaPlaneDeparture, FaEnvelope, FaPhone } from 'react-icons/fa'

interface AirlineProductPlaceholderProps {
    supplier: any
}

export default function AirlineProductPlaceholder({ supplier }: AirlineProductPlaceholderProps) {
    const contactName = supplier?.contact_name || supplier?.name || 'Valued Partner'
    const contactEmail = supplier?.contact_email || supplier?.email || 'N/A'

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden p-8 md:p-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto space-y-8"
            >
                {/* 1. Header & Status */}
                <div className="space-y-4">
                    <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                        <FaPlaneDeparture className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        Airline Product Upload
                    </h2>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                        Status: Work in Progress
                    </div>
                </div>

                {/* 2. Explanation */}
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        We are currently in the process of building a dedicated, robust product integration portal tailored specifically for our airline partners.
                    </p>
                    <p>
                        Integrating flight schedules, fare classes, and network data requires specialized tools to ensure accuracy and seamless connectivity for our platform users. We appreciate your patience as we finalize this essential feature.
                    </p>
                </div>

                {/* 3. Timeline */}
                <div className="bg-muted/50 rounded-lg p-6 border border-border">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Estimated Timeline and Next Steps</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-muted-foreground">Estimated Launch:</span>
                            <span className="font-bold text-primary">Q2 (Second Quarter) of 2026</span>
                        </div>
                        <div className="text-sm text-muted-foreground border-t border-border pt-4">
                            <p className="font-medium text-foreground mb-1">Action Needed:</p>
                            <p>
                                No action is required from you at this time. We will reach out directly to your registered contact (Contact Name: <span className="text-foreground font-medium">{contactName}</span>, Email: <span className="text-foreground font-medium">{contactEmail}</span>) with setup instructions and documentation once the portal is ready for testing.
                            </p>
                            <p className="mt-2 italic">
                                In the meantime, please ensure your contact information remains up to date.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. Backup Action */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground">Need to Submit Data or Promotions Immediately?</h3>
                    <p className="text-sm text-muted-foreground">
                        If you have urgent promotional materials or need to submit basic product information manually before the portal launches, please contact our Partner Integration Team directly:
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
                        <a href="mailto:partnerships@thearkalliance.com" className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                            <FaEnvelope />
                            partnerships@thearkalliance.com
                        </a>
                        <a href="tel:+15551234567" className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                            <FaPhone />
                            +1 (555) 123-4567
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

import { useRef, useEffect } from 'react'
import { FaTimes, FaGlobe, FaPhone, FaBuilding, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa'

type VerificationDetailsModalProps = {
    isOpen: boolean
    onClose: () => void
    data: any
    type: 'agent' | 'supplier'
}

export default function VerificationDetailsModal({ isOpen, onClose, data, type }: VerificationDetailsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose()
        }
    }

    if (!isOpen || !data) return null

    // Format keys for display (snake_case to Title Case)
    const formatLabel = (key: string) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    // Helper to render a field if it exists
    const Field = ({ label, value, icon: Icon, isLink = false, isEmail = false }: any) => {
        if (!value) return null
        return (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                </div>
                {isLink ? (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {value}
                    </a>
                ) : isEmail ? (
                    <a href={`mailto:${value}`} className="text-blue-600 hover:underline break-all">
                        {value}
                    </a>
                ) : (
                    <div className="text-gray-900 break-words font-medium">{value}</div>
                )}
            </div>
        )
    }

    // Specific Agent Fields
    const AgentDetails = () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Agency Name" value={data.agency_name} icon={FaBuilding} />
                    <Field label="License Number" value={data.license_number} icon={FaCheckCircle} />
                    <Field label="Website" value={data.website} icon={FaGlobe} isLink />
                    <Field label="Description" value={data.description} className="col-span-full" />
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact & Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Contact Email" value={data.email} icon={FaEnvelope} isEmail />
                    <Field label="Phone" value={data.phone_number || data.phone} icon={FaPhone} />
                    <Field label="Address" value={data.address} icon={FaBuilding} />
                    <Field label="City" value={data.city} icon={FaBuilding} />
                    <Field label="Country" value={data.country} icon={FaGlobe} />
                </div>
            </div>
        </div>
    )

    // Specific Supplier Fields
    const SupplierDetails = () => (
        <div className="space-y-8">
            {/* Main Info */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Company Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Company Name" value={data.company_name} icon={FaBuilding} />
                    <Field label="Trading Name" value={data.trading_name} icon={FaBuilding} />
                    <Field label="Category" value={data.category || data.supplier_type} icon={FaCheckCircle} />
                    <Field label="Website" value={data.website_url || data.website} icon={FaGlobe} isLink />
                    <Field label="License/Reg No" value={data.company_reg_no || data.license_no} icon={FaCheckCircle} />
                    <Field label="Tax ID" value={data.tax_id} icon={FaCheckCircle} />
                </div>
                {data.description && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</div>
                        <p className="text-sm text-gray-800">{data.description}</p>
                    </div>
                )}
            </div>

            {/* Location & Contact */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Location & Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Contact Email" value={data.contact_email || data.email} icon={FaEnvelope} isEmail />
                    <Field label="Phone" value={data.phone_number || data.phone} icon={FaPhone} />
                    <div className="md:col-span-1"></div> {/* Spacer */}

                    <Field label="Address" value={data.address_line_1} icon={FaBuilding} />
                    <Field label="City" value={data.city} icon={FaBuilding} />
                    <Field label="Postcode" value={data.postcode} icon={FaBuilding} />
                    <Field label="Country" value={data.country_code || data.country} icon={FaGlobe} />
                    <Field label="Timezone" value={data.timezone} icon={FaClock} />
                    <Field label="Currency" value={data.base_currency} icon={FaCheckCircle} />
                </div>
            </div>

            {/* Socials (if any) */}
            {(data.social_facebook || data.social_instagram || data.social_linkedin) && (
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Facebook" value={data.social_facebook} isLink />
                        <Field label="Instagram" value={data.social_instagram} isLink />
                        <Field label="LinkedIn" value={data.social_linkedin} isLink />
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 text-left" onMouseDown={handleBackdropClick}>
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                                {type === 'agent' ? 'Agent Application' : 'Supplier Application'}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${data.profile_type === 'agent' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                                }`}>
                                {type.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">ID: {data.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${data.is_approved || data.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                                (data.verification_status === 'rejected' || data.payment_status === 'refunded') ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}>
                            {(data.is_approved || data.verification_status === 'approved') ? <FaCheckCircle /> :
                                (data.verification_status === 'rejected' || data.payment_status === 'refunded') ? <FaTimesCircle /> :
                                    <FaClock />}
                            {data.verification_status || (data.is_approved ? 'Approved' : 'Pending')}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    {/* Rejection Reason (if any) */}
                    {data.rejection_reason && (
                        <div className="mb-8 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                            <FaTimesCircle className="text-red-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800 mb-1">Rejection Reason</h4>
                                <p className="text-red-700 text-sm">{data.rejection_reason}</p>
                            </div>
                        </div>
                    )}

                    {type === 'agent' ? <AgentDetails /> : <SupplierDetails />}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm shadow-sm transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

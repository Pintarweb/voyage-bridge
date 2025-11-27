'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTrash, FaPlus, FaTimes, FaHotel, FaMapMarkerAlt, FaTag, FaBuilding } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/context/LanguageContext'

interface ProductFormProps {
    onSuccess: () => void
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const supabase = createClient()
    const { language } = useLanguage()

    // Supplier Details
    const [supplierCountry, setSupplierCountry] = useState('')
    const [supplierCity, setSupplierCity] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [supplierType, setSupplierType] = useState('')

    const [formData, setFormData] = useState({
        product_name: '',
        product_description: '',
        product_category: '',
        city: '',
        country_code: '',
        // Hotel specific fields
        hotel_address: '',
        hotel_stars: '4',

        // Hidden/Defaulted fields
        validity_start_date: new Date().toISOString().split('T')[0],
        validity_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        agent_price: '0',
        currency: 'USD',
        min_pax: 1,
        max_pax: 100,
        cancellation_policy: 'Standard',
        inclusions: [''],
        exclusions: [''],
        terms_conditions: 'Standard'
    })

    useEffect(() => {
        const fetchSupplierProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('suppliers')
                    .select('country_code, city, company_name, supplier_type')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setSupplierCountry(data.country_code)
                    setSupplierCity(data.city)
                    setCompanyName(data.company_name)
                    setSupplierType(data.supplier_type)

                    // Map supplier type to product category
                    let category = ''
                    if (data.supplier_type === 'Hotel') category = 'Accommodation'
                    else if (data.supplier_type === 'Transport Provider') category = 'Transportation'
                    else if (data.supplier_type === 'Tour Operator') category = 'Tours & Activities'
                    else category = 'Tours & Activities' // Default

                    setFormData(prev => ({
                        ...prev,
                        country_code: data.country_code,
                        city: data.city,
                        product_category: category
                    }))
                }
            }
        }
        fetchSupplierProfile()
    }, [supabase])

    const t = {
        'en-US': {
            hotelDetails: 'Hotel Details',
            hotelName: 'Hotel Name',
            hotelAddress: 'Address',
            hotelStars: 'Star Rating',
            productDescription: 'Product Description',
            descriptionPlaceholder: 'Describe your product...',
            media: 'Media',
            dragDrop: 'Drag & drop images here, or click to select',
            maxImages: '(Max 5 images, 5MB each)',
            createProduct: 'Create Product',
            creating: 'Creating...',
            errorMissingFields: 'Please fill in all required fields and upload at least one image.',
            errorUpload: 'Error uploading images',
            errorCreate: 'Error creating product'
        },
        'zh-CN': {
            hotelDetails: '酒店详情',
            hotelName: '酒店名称',
            hotelAddress: '地址',
            hotelStars: '星级',
            productDescription: '产品描述',
            descriptionPlaceholder: '描述您的产品...',
            media: '媒体',
            dragDrop: '拖放图片到此处，或点击选择',
            maxImages: '（最多 5 张图片，每张 5MB）',
            createProduct: '创建产品',
            creating: '创建中...',
            errorMissingFields: '请填写所有必填字段并上传至少一张图片。',
            errorUpload: '上传图片时出错',
            errorCreate: '创建产品时出错'
        },
        'ms-MY': {
            hotelDetails: 'Butiran Hotel',
            hotelName: 'Nama Hotel',
            hotelAddress: 'Alamat',
            hotelStars: 'Penarafan Bintang',
            productDescription: 'Penerangan Produk',
            descriptionPlaceholder: 'Terangkan produk anda...',
            media: 'Media',
            dragDrop: 'Seret & lepas imej di sini, atau klik untuk memilih',
            maxImages: '(Maks 5 imej, 5MB setiap satu)',
            createProduct: 'Cipta Produk',
            creating: 'Mencipta...',
            errorMissingFields: 'Sila isi semua medan yang diperlukan dan muat naik sekurang-kurangnya satu imej.',
            errorUpload: 'Ralat memuat naik imej',
            errorCreate: 'Ralat mencipta produk'
        },
        'es-ES': {
            hotelDetails: 'Detalles del Hotel',
            hotelName: 'Nombre del Hotel',
            hotelAddress: 'Dirección',
            hotelStars: 'Clasificación de Estrellas',
            productDescription: 'Descripción del Producto',
            descriptionPlaceholder: 'Describa su producto...',
            media: 'Medios',
            dragDrop: 'Arrastre y suelte imágenes aquí, o haga clic para seleccionar',
            maxImages: '(Máx 5 imágenes, 5MB cada una)',
            createProduct: 'Crear Producto',
            creating: 'Creando...',
            errorMissingFields: 'Por favor complete todos los campos requeridos y suba al menos una imagen.',
            errorUpload: 'Error al subir imágenes',
            errorCreate: 'Error al crear el producto'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (files.length + acceptedFiles.length > 5) {
            alert('Max 5 images allowed')
            return
        }
        const newFiles = [...files, ...acceptedFiles]
        setFiles(newFiles)

        // Create previews
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
    }, [files])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 5242880 // 5MB
    })

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)

        const newPreviews = [...previews]
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setPreviews(newPreviews)
    }

    const isHotel = formData.product_category === 'Accommodation' || formData.product_category === 'Hotel'
    const isTransport = formData.product_category === 'Transportation'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Basic validation
        if (!formData.product_category || !formData.city || files.length === 0) {
            alert(content.errorMissingFields)
            setLoading(false)
            return
        }

        if (isHotel && !formData.product_name) {
            alert(content.errorMissingFields)
            setLoading(false)
            return
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Upload images
            const imageUrls: string[] = []
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                imageUrls.push(publicUrl)
            }

            // Construct description
            let finalDescription = formData.product_description
            if (isHotel) {
                finalDescription = `Address: ${formData.hotel_address}\nStars: ${formData.hotel_stars}\n\n${formData.product_description}`
            }

            // Create product record
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    supplier_id: user.id,
                    product_name: formData.product_name || `${formData.product_category} in ${formData.city}`,
                    product_description: finalDescription,
                    product_category: formData.product_category,
                    city: formData.city,
                    country_code: formData.country_code,
                    validity_start_date: formData.validity_start_date,
                    validity_end_date: formData.validity_end_date,
                    agent_price: parseFloat(formData.agent_price),
                    currency: formData.currency,
                    min_pax: formData.min_pax,
                    max_pax: formData.max_pax,
                    cancellation_policy: formData.cancellation_policy,
                    inclusions: formData.inclusions.filter(i => i),
                    exclusions: formData.exclusions.filter(e => e),
                    terms_conditions: formData.terms_conditions,
                    photo_url_1: imageUrls[0] || null,
                    photo_url_2: imageUrls[1] || null,
                    photo_url_3: imageUrls[2] || null,
                    status: 'active'
                })

            if (insertError) throw insertError

            onSuccess()
        } catch (error) {
            console.error('Error:', error)
            alert(content.errorCreate)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Context Header */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FaBuilding className="text-teal-500" />
                            {companyName || 'Your Company'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <FaTag className="text-teal-400" />
                                <span>{formData.product_category || 'Category'}</span>
                            </div>
                            <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                            <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-teal-400" />
                                <span>
                                    {formData.city ? `${formData.city}, ` : ''}
                                    {supplierCountry || 'Location'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotel Specific Fields */}
            {isHotel && (
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm space-y-6 animate-fade-in-up">
                    <h3 className="text-lg font-medium text-teal-400 flex items-center gap-2">
                        <FaHotel /> {content.hotelDetails}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{content.hotelName}</label>
                        <input
                            type="text"
                            value={formData.product_name}
                            onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground p-2"
                            placeholder="e.g. Grand Hyatt Kuala Lumpur"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">{content.hotelAddress}</label>
                            <input
                                type="text"
                                value={formData.hotel_address}
                                onChange={e => setFormData({ ...formData, hotel_address: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">{content.hotelStars}</label>
                            <select
                                value={formData.hotel_stars}
                                onChange={e => setFormData({ ...formData, hotel_stars: e.target.value })}
                                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground p-2.5"
                            >
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Description for Non-Hotel/Airline */}
            {!isHotel && !isTransport && (
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm animate-fade-in-up">
                    <label className="block text-sm font-medium text-foreground mb-2">{content.productDescription}</label>
                    <textarea
                        rows={4}
                        value={formData.product_description}
                        onChange={e => setFormData({ ...formData, product_description: e.target.value })}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-input rounded-md bg-background text-foreground p-2"
                        placeholder={content.descriptionPlaceholder}
                    />
                </div>
            )}

            {/* Media Upload */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <h3 className="text-lg font-medium text-foreground mb-4">{content.media}</h3>
                <div
                    {...getRootProps()}
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-gray-500'
                        }`}
                >
                    <div className="space-y-1 text-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Upload a file</span>
                                <input {...getInputProps()} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                        </p>
                        <p className="text-xs text-gray-500">
                            {content.maxImages}
                        </p>
                    </div>
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? content.creating : content.createProduct}
                </button>
            </div>
        </form>
    )
}

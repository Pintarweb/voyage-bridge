'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes, FaHotel, FaMapMarkerAlt, FaTag, FaBuilding, FaDownload } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/context/LanguageContext'

interface ProductFormProps {
    onSuccess: () => void
    productId?: string
    mode?: 'create' | 'edit'
}

export default function ProductForm({ onSuccess, productId, mode = 'create' }: ProductFormProps) {
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
        hotel_address: '',
        hotel_stars: '5',
        city: '',
        photo_url_1: '',
        description: '',
        status: 'draft'
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

                    // Map supplier type to product category (Case-insensitive)
                    let category = ''
                    const type = data.supplier_type?.toLowerCase() || ''

                    if (type.includes('hotel')) category = 'Accommodation'
                    else if (type.includes('transport') || type.includes('airline')) category = 'Transportation'
                    else if (type.includes('tour') || type.includes('land operator')) category = 'Tours & Activities'
                    else category = 'Tours & Activities' // Default

                    setFormData(prev => ({
                        ...prev,
                        product_category: category,
                        city: data.city // Auto-populate city
                    }))
                }
            }
        }
        fetchSupplierProfile()
    }, [supabase])

    // Load existing product data if editing
    useEffect(() => {
        const loadProductData = async () => {
            if (mode === 'edit' && productId) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .eq('supplier_id', user.id) // Enforce ownership
                    .single()

                if (error || !product) {
                    console.error('Error loading product:', error)
                    alert('Product not found or access denied')
                    onSuccess() // Redirect back
                    return
                }

                if (product) {
                    setFormData({
                        product_name: product.product_name || '',
                        product_description: product.product_description || '',
                        product_category: product.product_category || '',
                        hotel_address: product.address || product.hotel_address || '',
                        hotel_stars: product.star_rating ? String(product.star_rating) : (product.hotel_stars || '5'),
                        city: product.city || '',
                        photo_url_1: '',
                        description: '',
                        status: product.status || 'draft'
                    })

                    // Load existing images as previews
                    if (product.photo_urls && product.photo_urls.length > 0) {
                        setPreviews(product.photo_urls)
                    }
                }
            }
        }
        loadProductData()
    }, [mode, productId, supabase, onSuccess])

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
            updateProduct: 'Update Product',
            creating: 'Creating...',
            errorMissingFields: 'Please fill in all required fields and upload at least one image.',
            errorUpload: 'Error uploading images',
            errorCreate: 'Error creating product',
            yourCompany: 'Your Company',
            category: 'Category',
            location: 'Location',
            city: 'City',
            uploadImage: 'Upload Image',
            createWinningProduct: 'Create Your Winning Product Now',
            placeholderHotelName: 'e.g. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Full street address',
            remove: 'Remove',
            download: 'Download'
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
            updateProduct: '更新产品',
            creating: '创建中...',
            errorMissingFields: '请填写所有必填字段并上传至少一张图片。',
            errorUpload: '上传图片时出错',
            errorCreate: '创建产品时出错',
            yourCompany: '您的公司',
            category: '类别',
            location: '位置',
            city: '城市',
            uploadImage: '上传图片',
            createWinningProduct: '立即创建您的致胜产品',
            placeholderHotelName: '例如：吉隆坡君悦酒店',
            placeholderAddress: '完整街道地址',
            remove: '移除',
            download: '下载'
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
            updateProduct: 'Kemas Kini Produk',
            creating: 'Mencipta...',
            errorMissingFields: 'Sila isi semua medan yang diperlukan dan muat naik sekurang-kurangnya satu imej.',
            errorUpload: 'Ralat memuat naik imej',
            errorCreate: 'Ralat mencipta produk',
            yourCompany: 'Syarikat Anda',
            category: 'Kategori',
            location: 'Lokasi',
            city: 'Bandar',
            uploadImage: 'Muat Naik Imej',
            createWinningProduct: 'Cipta Produk Menang Anda Sekarang',
            placeholderHotelName: 'cth. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Alamat penuh',
            remove: 'Buang',
            download: 'Muat Turun'
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
            updateProduct: 'Actualizar Producto',
            creating: 'Creando...',
            errorMissingFields: 'Por favor complete todos los campos requeridos y suba al menos una imagen.',
            errorUpload: 'Error al subir imágenes',
            errorCreate: 'Error al crear el producto',
            yourCompany: 'Su Empresa',
            category: 'Categoría',
            location: 'Ubicación',
            city: 'Ciudad',
            uploadImage: 'Subir Imagen',
            createWinningProduct: 'Cree Su Producto Ganador Ahora',
            placeholderHotelName: 'ej. Grand Hyatt Kuala Lumpur',
            placeholderAddress: 'Dirección completa',
            remove: 'Eliminar',
            download: 'Descargar'
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

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 5242880, // 5MB
        noClick: false
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

    const getFlagUrl = (countryCode: string) => {
        if (!countryCode) return ''
        return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
    }

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

            const productData = {
                product_name: formData.product_name || `${formData.product_category} in ${supplierCity}`,
                product_description: finalDescription,
                product_category: formData.product_category,
                photo_urls: imageUrls.length > 0 ? imageUrls : previews,
                status: 'active',
                city: formData.city,
                country_code: supplierCountry,
                star_rating: isHotel ? parseInt(formData.hotel_stars) : null,
                address: isHotel ? formData.hotel_address : null
            }

            // Create or Update product record
            if (mode === 'edit' && productId) {
                // UPDATE existing product
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId)

                if (updateError) throw updateError
            } else {
                // INSERT new product
                const { error: insertError } = await supabase
                    .from('products')
                    .insert({
                        ...productData,
                        supplier_id: user.id
                    })

                if (insertError) throw insertError
            }

            onSuccess()
        } catch (error: unknown) {
            console.error('Error submitting product:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            alert(content.errorCreate + (errorMessage ? `: ${errorMessage}` : ''))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Context Header - Vibrant Gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10">
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <FaBuilding className="text-yellow-300" />
                            </div>
                            {companyName || content.yourCompany}
                        </h2>
                        <div className="flex flex-wrap items-center gap-6 mt-4 text-white">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <FaTag className="text-cyan-300" />
                                <span className="font-medium">{supplierType || content.category}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                {supplierCountry && (
                                    <img
                                        src={getFlagUrl(supplierCountry)}
                                        alt={supplierCountry}
                                        className="w-6 h-4 object-cover rounded-sm"
                                    />
                                )}
                                <FaMapMarkerAlt className="text-pink-300" />
                                <span>
                                    {formData.city ? `${formData.city}, ` : ''}
                                    {supplierCountry || content.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotel Specific Fields */}
            {isHotel && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10 space-y-6">
                    <div className="absolute left-0 bottom-0 h-64 w-64 translate-x-[-50%] translate-y-[50%] rounded-full bg-white/5 blur-3xl"></div>
                    <div className="relative">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <FaHotel className="text-yellow-300" />
                            </div>
                            {content.hotelDetails}
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium !text-white mb-2">{content.hotelName}</label>
                                <input
                                    type="text"
                                    value={formData.product_name}
                                    onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                                    className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                    placeholder={content.placeholderHotelName}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium !text-white mb-2">{content.hotelAddress}</label>
                                    <input
                                        type="text"
                                        value={formData.hotel_address}
                                        onChange={e => setFormData({ ...formData, hotel_address: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                        placeholder={content.placeholderAddress}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">{content.city}</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium !text-white mb-2">{content.hotelStars}</label>
                                    <select
                                        value={formData.hotel_stars}
                                        onChange={e => setFormData({ ...formData, hotel_stars: e.target.value })}
                                        className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all [&>option]:text-black"
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                        <option value="3">⭐⭐⭐ 3 Stars</option>
                                        <option value="2">⭐⭐ 2 Stars</option>
                                        <option value="1">⭐ 1 Star</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Description for Non-Hotel/Airline */}
            {!isHotel && !isTransport && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10">
                    <div className="relative">
                        <label className="block text-lg font-bold text-white mb-4">{content.productDescription}</label>
                        <textarea
                            rows={6}
                            value={formData.product_description}
                            onChange={e => setFormData({ ...formData, product_description: e.target.value })}
                            className="block w-full rounded-xl border-white/20 bg-white/10 p-4 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                            placeholder={content.descriptionPlaceholder}
                        />
                    </div>
                </div>
            )}

            {/* Media Upload */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-8 shadow-xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <FaCloudUploadAlt className="text-cyan-300" />
                    </div>
                    {content.media}
                </h3>
                <div
                    {...getRootProps()}
                    className={`mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-xl transition-all duration-200 ${isDragActive ? 'border-white bg-white/20' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="space-y-2 text-center">
                        <FaCloudUploadAlt className="mx-auto h-16 w-16 text-blue-200" />
                        <div className="text-lg text-white font-medium">
                            {content.dragDrop}
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                open();
                            }}
                            className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                        >
                            {content.uploadImage}
                        </button>
                        <p className="text-sm text-blue-200">
                            {content.maxImages}
                        </p>
                    </div>
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-black/20 border border-white/10 shadow-lg">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 flex gap-2 transition-all">
                                    <a
                                        href={preview}
                                        download={`image-${index + 1}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-full backdrop-blur-sm"
                                        title={content.download}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FaDownload size={14} />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm"
                                        title={content.remove}
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-400 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 animate-heartbeat border-2 border-white/20"
                >
                    {loading ? content.creating : content.createWinningProduct}
                </button>
            </div>
        </form>
    )
}

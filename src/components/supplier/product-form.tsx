'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTrash, FaPlus, FaTimes, FaHotel, FaMapMarkerAlt, FaTag, FaBuilding } from 'react-icons/fa'
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
                const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single()

                if (product && !error) {
                    setFormData({
                        product_name: product.product_name || '',
                        product_description: product.product_description || '',
                        product_category: product.product_category || '',
                        hotel_address: product.hotel_address || '',
                        hotel_stars: product.hotel_stars || '5',
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
    }, [mode, productId, supabase])

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
            updateProduct: '更新产品',
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
            updateProduct: 'Kemas Kini Produk',
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
            updateProduct: 'Actualizar Producto',
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

            // Create or Update product record
            if (mode === 'edit' && productId) {
                // UPDATE existing product
                const { error: updateError } = await supabase
                    .from('products')
                    .update({
                        product_name: formData.product_name || `${formData.product_category} in ${supplierCity}`,
                        product_description: finalDescription,
                        product_category: formData.product_category,
                        photo_urls: imageUrls.length > 0 ? imageUrls : previews, // Use new images or keep existing
                        status: 'active'
                    })
                    .eq('id', productId)

                if (updateError) throw updateError
            } else {
                // INSERT new product
                const { error: insertError } = await supabase
                    .from('products')
                    .insert({
                        supplier_id: user.id,
                        product_name: formData.product_name || `${formData.product_category} in ${supplierCity}`,
                        product_description: finalDescription,
                        product_category: formData.product_category,
                        photo_urls: imageUrls, // Save all uploaded image URLs as array
                        status: 'active'
                    })

                if (insertError) throw insertError
            }

            onSuccess()
        } catch (error: any) {
            console.error('Error submitting product:', error)
            console.error('Error type:', typeof error)
            if (typeof error === 'object') {
                console.error('Error keys:', Object.keys(error))
                console.error('Error stringified:', JSON.stringify(error, null, 2))
                if (error.message) console.error('Error message:', error.message)
                if (error.details) console.error('Error details:', error.details)
                if (error.hint) console.error('Error hint:', error.hint)
            }
            alert(content.errorCreate + (error.message ? `: ${error.message}` : ''))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Context Header - Vibrant Gradient */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50/50 border-2 border-primary/20 p-6 shadow-lg backdrop-blur-sm animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FaBuilding className="text-primary" />
                            {companyName || 'Your Company'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <FaTag className="text-primary" />
                                <span className="font-medium">{supplierType || 'Category'}</span>
                            </div>
                            <div className="hidden md:block w-px h-4 bg-border"></div>
                            <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-primary" />
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
                <div className="bg-gradient-to-br from-white to-blue-50/50 border-2 border-primary/20 rounded-xl p-6 shadow-lg backdrop-blur-sm space-y-6 animate-fade-in-up">
                    <h3 className="text-lg font-medium text-primary flex items-center gap-2">
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
                        <input {...getInputProps()} />
                        <div className="text-sm text-gray-400">
                            <span className="font-medium text-primary">Upload a file</span>
                            <span className="pl-1">or drag and drop</span>
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
                    className="btn-primary btn-lg"
                >
                    {loading ? content.creating : (mode === 'edit' ? content.updateProduct : content.createProduct)}
                </button>
            </div>
        </form>
    )
}

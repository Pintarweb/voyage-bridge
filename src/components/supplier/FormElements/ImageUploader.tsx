'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'

interface ImageUploaderProps {
    files: File[]
    previews: string[]
    onFilesChange: (files: File[]) => void
    onPreviewsChange: (previews: string[]) => void
    maxFiles?: number
    maxSize?: number // in bytes
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    files,
    previews,
    onFilesChange,
    onPreviewsChange,
    maxFiles = 5,
    maxSize = 5242880 // 5MB
}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (files.length + acceptedFiles.length > maxFiles) {
            alert(`Max ${maxFiles} images allowed`)
            return
        }

        const newFiles = [...files, ...acceptedFiles]
        onFilesChange(newFiles)

        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
        onPreviewsChange([...previews, ...newPreviews])
    }, [files, previews, maxFiles, onFilesChange, onPreviewsChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize,
    })

    const removeFile = (index: number) => {
        const newFiles = [...files]
        const newPreviews = [...previews]

        // If it's a new upload (blob), revoke the object URL
        if (newPreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(newPreviews[index])
            // Also remove from files array if it was a new upload
            // Note: This logic assumes previews and files are synced for NEW uploads
            // For existing URLs, they might not be in the files array.
            // We need to find which file in the files array corresponds to this preview.
            // Simplified approach: find by index? No, files and previews might not be same length if some are existing URLs.

            // Let's refine this: 
            // Files only contains NEW uploads. 
            // Previews contains EXISTING + NEW.

            // Find how many existing previews (non-blob) are before this one
            const existingCount = previews.slice(0, index).filter(p => !p.startsWith('blob:')).length
            const newFileIndex = index - (previews.slice(0, index).length - previews.slice(0, index).filter(p => p.startsWith('blob:')).length)

            // Actually, simpler:
            // Just find the index in the blob-only subset
            const previewSubset = previews.slice(0, index).filter(p => p.startsWith('blob:'))
            const fileToRemoveIndex = previewSubset.length

            newFiles.splice(fileToRemoveIndex, 1)
            onFilesChange(newFiles)
        }

        newPreviews.splice(index, 1)
        onPreviewsChange(newPreviews)
    }

    return (
        <div className="space-y-3">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <FaCloudUploadAlt className="text-4xl text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Drag & drop images here</h3>
                <p className="text-white/50">or click to select files (Max {maxFiles})</p>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {previews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-lg border border-white/10">
                            <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                    className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImageUploader

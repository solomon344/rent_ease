'use client'
import React from 'react'
import { Button } from '@heroui/button'
import { Input, Textarea } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'
import { ArrowLeft, Save, Upload, Star, Users, Bed, Bath, Plus, X, Play } from 'lucide-react'
import { locationCategories } from '@/data/listings'
import Link from 'next/link'
import Api from '@/lib/api'
import { useEdgeStore } from '@/lib/edgestore'
import { Form } from '@heroui/form'
import { Select, SelectItem } from '@heroui/select'
import { addToast } from '@heroui/toast'
import { useSession } from 'next-auth/react'
import { isAxiosError } from 'axios'

interface MediaItem {
  file?: File
  preview: string
  type: 'image' | 'video'
  existingUrl?: string
}

const MAX_MEDIA = 5

const UpdateProperty = ({ amenities, property }: { amenities: any[]; property: any }) => {
  const [formData, setFormData] = React.useState({
    name: property.name,
    price: property.price,
    location: property.location,
    description: property.description,
    guests: property.guests,
    bedrooms: property.beds,
    baths: property.baths,
    selectedAmenities: property?.amenities?.map((a: any) => String(a.name)) as string[],
    tags: property.tags || '',
  })

  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>(property.image)
  const [mediaItems, setMediaItems] = React.useState<MediaItem[]>(
    (property.media || []).map((m: any) => ({ preview: m.url, type: m.type, existingUrl: m.url }))
  )
  const { edgestore } = useEdgeStore()
  const [loading, setLoading] = React.useState(false)
  const [coverProgress, setCoverProgress] = React.useState<number>(0)
  const [mediaProgress, setMediaProgress] = React.useState<Record<number, number>>({})

  const { data: session } = useSession()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenityKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: checked
        ? [...prev.selectedAmenities, amenityKey]
        : prev.selectedAmenities.filter((key: any) => key !== amenityKey),
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (mediaItems.length >= MAX_MEDIA) return
    const type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'
    const preview = URL.createObjectURL(file)
    setMediaItems(prev => [...prev, { file, preview, type }])
    e.target.value = ''
  }

  const handleMediaRemove = (index: number) => {
    setMediaItems(prev => {
      const item = prev[index]
      if (!item.existingUrl) URL.revokeObjectURL(item.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCoverProgress(0)
    setMediaProgress({})
    setLoading(true)

    const amenities_list = formData.selectedAmenities.map(
      (key: any) => amenities.find(a => a.name === key)?.id
    )

    try {
      let finalImageUrl = imagePreview
      if (imageFile) {
        const result = await edgestore.rentEaseImages.upload({
          file: imageFile,
          options: { replaceTargetUrl: property.image },
          onProgressChange: (p) => setCoverProgress(p),
        })
        finalImageUrl = result.url
      }

      const uploadedMedia = await Promise.all(
        mediaItems.map(async (item, i) => {
          if (item.existingUrl) {
            setMediaProgress(prev => ({ ...prev, [i]: 100 }))
            return { url: item.existingUrl, type: item.type, order: i }
          }
          const result = await edgestore.propertyMedia.upload({
            file: item.file!,
            onProgressChange: (p) => setMediaProgress(prev => ({ ...prev, [i]: p })),
          })
          return { url: result.url, type: item.type, order: i }
        })
      )

      // @ts-ignore
      await Api.post(`/properties/update/${property.id}/`, {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: formData.price,
        guests: formData.guests,
        beds: formData.bedrooms,
        baths: formData.baths,
        amenities: amenities_list,
        tags: formData.tags,
        image: finalImageUrl,
        media: uploadedMedia,
      }, {
        // @ts-ignore
        headers: { Authorization: `Token ${session?.user?.access}` },
      })

      addToast({ title: 'Success', color: 'success', description: 'Property updated successfully.' })
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ title: 'Error', color: 'danger', description: e.response?.data?.message || 'Failed to update property' })
      } else {
        addToast({ title: 'Error', color: 'danger', description: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <Link href="/dashboard/properties">
              <Button isIconOnly variant="flat" className="bg-white shadow-sm border border-gray-100">
                <ArrowLeft size={20} className="text-gray-600" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  Edit Residence
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Update Property</h1>
              <p className="text-gray-500 mt-1">Make changes to your property listing details.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Button
              form="update-form"
              type="submit"
              isLoading={loading}
              className="font-bold px-8"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
              startContent={!loading && <Save size={18} />}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Form id="update-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">

              {/* Media Section */}
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Upload size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Property Media</h3>
                    <p className="text-sm text-gray-400 font-medium">Update the cover photo and additional media (up to {MAX_MEDIA}).</p>
                  </div>
                </div>

                {/* Cover image */}
                <div
                  className="relative group border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden min-h-[280px] flex items-center justify-center transition-all duration-300 hover:border-indigo-400 cursor-pointer mb-6"
                  onClick={() => !loading && document.getElementById('cover-upload')?.click()}
                >
                  {imagePreview && (
                    <img src={imagePreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {!loading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-gray-900 font-bold text-sm">
                        <Upload size={16} /> Change Cover
                      </div>
                    </div>
                  )}
                  {loading && imageFile && coverProgress > 0 && coverProgress < 100 && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                      <span className="text-white font-bold text-lg">{coverProgress}%</span>
                      <div className="w-2/3 h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-200"
                          style={{ width: `${coverProgress}%` }}
                        />
                      </div>
                      <span className="text-white/80 text-xs font-medium">Uploading cover…</span>
                    </div>
                  )}
                  <input id="cover-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={loading} />
                </div>

                {/* Additional media grid */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-3">
                    Additional Media <span className="text-gray-400 font-normal">({mediaItems.length}/{MAX_MEDIA})</span>
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {mediaItems.map((item, i) => {
                      const prog = mediaProgress[i]
                      const isUploading = loading && !item.existingUrl && prog !== undefined && prog < 100
                      return (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                          {item.type === 'video' ? (
                            <>
                              <video src={item.preview} muted preload="metadata" className="w-full h-full object-cover" />
                              {!isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Play size={20} className="text-white drop-shadow" />
                                </div>
                              )}
                            </>
                          ) : (
                            <img src={item.preview} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                          )}

                          {/* Per-item progress overlay */}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5 px-2">
                              <span className="text-white font-bold text-sm">{prog}%</span>
                              <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-400 rounded-full transition-all duration-200"
                                  style={{ width: `${prog}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Done checkmark for newly uploaded items */}
                          {loading && !item.existingUrl && prog === 100 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                                <svg viewBox="0 0 12 12" className="w-4 h-4 text-white fill-none stroke-white stroke-2">
                                  <polyline points="2,6 5,9 10,3" />
                                </svg>
                              </div>
                            </div>
                          )}

                          {!loading && (
                            <button
                              type="button"
                              onClick={() => handleMediaRemove(i)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} className="text-white" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                    {mediaItems.length < MAX_MEDIA && (
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                        <Plus size={20} className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-400 font-medium">Add</span>
                        <input type="file" accept="image/*,video/*" onChange={handleMediaAdd} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Star size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Property Details</h3>
                    <p className="text-sm text-gray-400 font-medium">Core information about your residence.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 md:col-span-2">
                    <Input
                      label="Property Name"
                      placeholder="e.g., Luxury Beachfront Villa"
                      labelPlacement="outside"
                      radius="lg"
                      size="lg"
                      value={formData.name}
                      onValueChange={v => handleInputChange('name', v)}
                      isRequired
                      classNames={{ label: 'font-bold text-gray-700 mb-2', inputWrapper: 'bg-gray-50' }}
                    />
                  </div>

                  <Input
                    label="Price per Night (GMD)"
                    type="number"
                    labelPlacement="outside"
                    radius="lg"
                    size="lg"
                    value={formData.price.toString()}
                    onValueChange={v => handleInputChange('price', v)}
                    isRequired
                    startContent={<span className="text-gray-400">D</span>}
                    classNames={{ label: 'font-bold text-gray-700 mb-2', inputWrapper: 'bg-gray-50' }}
                  />

                  <Select
                    label="Location"
                    labelPlacement="outside"
                    radius="lg"
                    size="lg"
                    selectedKeys={formData.location ? [formData.location.toLowerCase()] : []}
                    onSelectionChange={(keys: any) => handleInputChange('location', Array.from(keys)[0] as string)}
                    isRequired
                    classNames={{ label: 'font-bold text-gray-700 mb-2', trigger: 'bg-gray-50' }}
                  >
                    {locationCategories.map(loc => (
                      <SelectItem key={loc.id} textValue={loc.name}>{loc.name}</SelectItem>
                    ))}
                  </Select>

                  <div className="md:col-span-2">
                    <Textarea
                      label="Full Description"
                      labelPlacement="outside"
                      radius="lg"
                      size="lg"
                      minRows={4}
                      value={formData.description}
                      onValueChange={v => handleInputChange('description', v)}
                      isRequired
                      classNames={{ label: 'font-bold text-gray-700 mb-2', inputWrapper: 'bg-gray-50' }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-6 md:col-span-2">
                    <Input label="Guests" type="number" labelPlacement="inside" radius="lg" value={formData.guests.toString()} onValueChange={v => handleInputChange('guests', v)} startContent={<Users size={16} className="text-slate-400" />} className="flex-1 min-w-[120px]" />
                    <Input label="Bedrooms" type="number" labelPlacement="inside" radius="lg" value={formData.bedrooms.toString()} onValueChange={v => handleInputChange('bedrooms', v)} startContent={<Bed size={16} className="text-slate-400" />} className="flex-1 min-w-[120px]" />
                    <Input label="Bathrooms" type="number" labelPlacement="inside" radius="lg" value={formData.baths.toString()} onValueChange={v => handleInputChange('baths', v)} startContent={<Bath size={16} className="text-slate-400" />} className="flex-1 min-w-[120px]" />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Plus size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Amenities & Features</h3>
                    <p className="text-sm text-gray-400 font-medium">Select all that apply to your property.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8">
                  {amenities.map(amenity => (
                    <Checkbox
                      key={amenity?.name}
                      isSelected={formData.selectedAmenities.includes(amenity.name)}
                      onValueChange={checked => handleAmenityChange(amenity.name, checked)}
                      classNames={{ label: 'text-sm font-medium text-gray-700' }}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: formData.selectedAmenities.includes(amenity.name) ? '#6366f1' : undefined }}>{amenity?.icon}</span>
                        {amenity.name}
                      </div>
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Plus size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Tags</h3>
                    <p className="text-sm text-gray-400 font-medium">Categorize your property with keywords.</p>
                  </div>
                </div>
                <Textarea
                  placeholder="e.g., beach, luxury, quiet, family-friendly"
                  value={formData.tags}
                  onValueChange={v => handleInputChange('tags', v)}
                  radius="lg"
                  classNames={{ inputWrapper: 'bg-gray-50' }}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  form="update-form"
                  isLoading={loading}
                  size="lg"
                  className="font-bold px-12 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 8px 25px rgba(99,102,241,0.3)' }}
                  startContent={!loading && <Save size={20} />}
                >
                  Update Residence
                </Button>
              </div>

            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default UpdateProperty

'use client'
import React from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
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
  file: File
  preview: string
  type: 'image' | 'video'
}

const MAX_MEDIA = 5

const CreateProperty = ({ amenities }: { amenities: any[] }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    price: '',
    location: '',
    description: '',
    guests: '',
    bedrooms: '',
    baths: '',
    selectedAmenities: [] as string[],
    tags: '',
  })

  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>('')
  const [mediaItems, setMediaItems] = React.useState<MediaItem[]>([])
  const { edgestore } = useEdgeStore()
  const [loading, setLoading] = React.useState(false)
  const [coverProgress, setCoverProgress] = React.useState<number>(0)
  const [mediaProgress, setMediaProgress] = React.useState<Record<number, number>>({})

  const { data: session } = useSession()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const clearFormData = () => {
    setFormData({ name: '', price: '', location: '', description: '', guests: '', bedrooms: '', baths: '', selectedAmenities: [], tags: '' })
    setImageFile(null)
    setImagePreview('')
    mediaItems.forEach(m => URL.revokeObjectURL(m.preview))
    setMediaItems([])
    setCoverProgress(0)
    setMediaProgress({})
  }

  const handleAmenityChange = (amenityKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: checked
        ? [...prev.selectedAmenities, amenityKey]
        : prev.selectedAmenities.filter(key => key !== amenityKey),
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
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      addToast({ title: 'Image Required', color: 'danger', description: 'Please upload a main property image.' })
      return
    }
    setLoading(true)

    const amenities_list = formData.selectedAmenities.map(
      key => amenities.find(a => a.name === key)?.id
    )

    setCoverProgress(0)
    setMediaProgress({})

    try {
      const mainImage = await edgestore.rentEaseImages.upload({
        file: imageFile,
        onProgressChange: (p) => setCoverProgress(p),
      })

      const uploadedMedia = await Promise.all(
        mediaItems.map(async (item, i) => {
          const result = await edgestore.propertyMedia.upload({
            file: item.file,
            onProgressChange: (p) => setMediaProgress(prev => ({ ...prev, [i]: p })),
          })
          return { url: result.url, type: item.type, order: i }
        })
      )

      // @ts-ignore
      await Api.post('/properties/create/', {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: formData.price,
        guests: formData.guests,
        beds: formData.bedrooms,
        baths: formData.baths,
        amenities: amenities_list,
        tags: formData.tags,
        image: mainImage.url,
        media: uploadedMedia,
      }, {
        // @ts-ignore
        headers: { Authorization: `Token ${session?.user?.access}` },
      })

      addToast({ title: 'Success', color: 'success', description: 'Property created successfully.' })
      clearFormData()
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ title: 'Error', color: 'danger', description: e.response?.data?.message || 'Failed to create property' })
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
            <Link href="/dashboard">
              <Button isIconOnly variant="flat" className="bg-white shadow-sm border border-gray-100">
                <ArrowLeft size={20} className="text-gray-600" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  Add Residence
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
              <p className="text-gray-500 mt-1">List your amazing property and start reaching millions of travelers.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="flat" onPress={clearFormData} className="text-gray-600 font-semibold">Cancel</Button>
            <Button
              form="property-form"
              type="submit"
              isLoading={loading}
              className="font-bold px-8"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
              startContent={!loading && <Save size={18} />}
            >
              Post Listing
            </Button>
          </div>
        </div>

        <Form id="property-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">

              {/* Main Image */}
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Upload size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Property Media</h3>
                    <p className="text-sm text-gray-400 font-medium">Add a main cover image, then up to {MAX_MEDIA} additional images or videos.</p>
                  </div>
                </div>

                {/* Cover image picker */}
                <div
                  className="relative group border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden min-h-[280px] flex items-center justify-center transition-all duration-300 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer mb-6"
                  onClick={() => !loading && document.getElementById('cover-upload')?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                      {!loading && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-gray-900 font-bold text-sm">
                            <Upload size={16} /> Replace Cover
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-10">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-indigo-500" />
                      </div>
                      <p className="font-bold text-gray-800 text-lg mb-1">Click to upload cover image</p>
                      <p className="text-gray-400 text-sm italic">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                  {/* Cover upload progress */}
                  {loading && coverProgress > 0 && coverProgress < 100 && (
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
                  <p className="text-sm font-semibold text-gray-600 mb-3">Additional Media <span className="text-gray-400 font-normal">({mediaItems.length}/{MAX_MEDIA})</span></p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {mediaItems.map((item, i) => {
                      const prog = mediaProgress[i]
                      const isUploading = loading && prog !== undefined && prog < 100
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

                          {/* Done checkmark */}
                          {loading && prog === 100 && (
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
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Star size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Property Details</h3>
                    <p className="text-sm text-gray-400 font-medium">The most important info guests need to know.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 md:col-span-2">
                    <Input
                      label="Property Name"
                      placeholder="e.g., Oceanfront Penthouse in Serekunda"
                      labelPlacement="outside"
                      radius="lg"
                      size="lg"
                      value={formData.name}
                      onValueChange={v => handleInputChange('name', v)}
                      isRequired
                      classNames={{ label: 'font-bold text-gray-700 mb-2', inputWrapper: 'bg-gray-50 border-gray-200' }}
                    />
                  </div>

                  <Input
                    label="Price per Night (GMD)"
                    type="number"
                    placeholder="99"
                    labelPlacement="outside"
                    radius="lg"
                    size="lg"
                    value={formData.price}
                    onValueChange={v => handleInputChange('price', v)}
                    isRequired
                    startContent={<span className="text-gray-400">D</span>}
                    classNames={{ label: 'font-bold text-gray-700 mb-2', inputWrapper: 'bg-gray-50 border-gray-200' }}
                  />

                  <Select
                    label="Location"
                    placeholder="Select a destination"
                    labelPlacement="outside"
                    radius="lg"
                    size="lg"
                    selectedKeys={formData.location ? [formData.location] : []}
                    onSelectionChange={(keys: any) => handleInputChange('location', Array.from(keys)[0] as string)}
                    isRequired
                    classNames={{ label: 'font-bold text-gray-700 mb-2', trigger: 'bg-gray-50 border-gray-200' }}
                  >
                    {locationCategories.map(loc => (
                      <SelectItem key={loc.id} textValue={loc.name}>{loc.name}</SelectItem>
                    ))}
                  </Select>

                  <div className="md:col-span-2">
                    <Textarea
                      label="Full Description"
                      placeholder="Tell guests what makes your place special..."
                      labelPlacement="outside"
                      radius="lg"
                      size="lg"
                      minRows={4}
                      value={formData.description}
                      onValueChange={v => handleInputChange('description', v)}
                      isRequired
                      classNames={{ label: 'font-bold text-gray-700 mb-2', inputWrapper: 'bg-gray-50 border-gray-200' }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-6 md:col-span-2">
                    <Input label="Guests" type="number" labelPlacement="inside" radius="lg" value={formData.guests} onValueChange={v => handleInputChange('guests', v)} startContent={<Users size={16} className="text-slate-400" />} className="flex-1 min-w-[120px]" />
                    <Input label="Bedrooms" type="number" labelPlacement="inside" radius="lg" value={formData.bedrooms} onValueChange={v => handleInputChange('bedrooms', v)} startContent={<Bed size={16} className="text-slate-400" />} className="flex-1 min-w-[120px]" />
                    <Input label="Bathrooms" type="number" labelPlacement="inside" radius="lg" value={formData.baths} onValueChange={v => handleInputChange('baths', v)} startContent={<Bath size={16} className="text-slate-400" />} className="flex-1 min-w-[120px]" />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Plus size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Amenities & Features</h3>
                    <p className="text-sm text-gray-400 font-medium">Highlight your property's best features.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8">
                  {amenities.map(amenity => (
                    <Checkbox
                      key={amenity?.name}
                      isSelected={formData.selectedAmenities.includes(amenity.name)}
                      onValueChange={checked => handleAmenityChange(amenity.name, checked)}
                      classNames={{ label: 'text-sm font-medium text-gray-700', wrapper: 'rounded-md' }}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: formData.selectedAmenities.includes(amenity.name) ? '#6366f1' : undefined }}>{amenity.icon}</span>
                        {amenity.name}
                      </div>
                    </Checkbox>
                  ))}
                </div>
              </div>

              <Card className="rounded-3xl border-none shadow-none bg-indigo-50/50 p-2">
                <CardBody className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-indigo-900">Almost there!</p>
                    <p className="text-indigo-600/70 text-sm">Review your listing info before publishing.</p>
                  </div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="font-bold px-8"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
                    startContent={!loading && <Save size={18} />}
                  >
                    Publish Listing
                  </Button>
                </CardBody>
              </Card>

            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default CreateProperty

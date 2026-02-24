'use client'
import React from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input, Textarea } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'
import { ArrowLeft, Save, Upload, Star, Users, Bed, Bath, MapPin, Heart, Share } from 'lucide-react'
import { Amenity, Listing, locationCategories } from '@/data/listings'
import { Badge } from '@heroui/badge'
import { Divider } from '@heroui/divider'
import Link from 'next/link'
import Api from '@/lib/api'
import { useEdgeStore } from '@/lib/edgestore'
import { Form } from '@heroui/form'
import { Select, SelectItem } from '@heroui/select'
import { addToast } from '@heroui/toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { isAxiosError } from 'axios'

const CreateProperty = ({amenities}: {amenities: any[]}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    price: '',
    location: '',
    description: '',
    guests: '',
    bedrooms: '',
    baths: '',
    selectedAmenities: [] as string[],
    tags:"",
  })

  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>('')
  const { edgestore } = useEdgeStore();
  const [loading, setLoading] = React.useState(false);
  // const [error, setError] = React.useState<string | null>(null);

  const {data:session} = useSession()

  const router = useRouter();
  
  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const cleartFormData = () => {
    setFormData({
      name: '',
      price: '',
      location: '',
      description: '',
      guests: '',
      bedrooms: '',
      baths: '',
      selectedAmenities: [] as string[],
      tags:""
    })
  }

  const handleAmenityChange = (amenityKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: checked
        ? [...prev.selectedAmenities, amenityKey]
        : prev.selectedAmenities.filter(key => key !== amenityKey)
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const amenities_list = formData.selectedAmenities.map((amenityKey) => {
      return amenities.find((amenity) => amenity.name === amenityKey).id
    })

    try{
      const result = await edgestore.rentEaseImages.upload({file:imageFile as File});
      const response = await Api.post('/properties/create/', {
        name:formData.name,
        description:formData.description,
        location:formData.location,
        price:formData.price,
        guests:formData.guests,
        beds:formData.bedrooms,
        baths:formData.baths,
        amenities:amenities_list,
        tags:formData.tags,
        image: result.url
      },
      {
        headers: {
          // @ts-ignore
          Authorization: `Token ${session?.user?.access}`
        }
      })
    
      addToast({title:"Success",color:"success",description:"Property created successfully."})
      // router.push('/dashboard/properties')
      cleartFormData()
    }catch(e){
      if (isAxiosError(e)){
        addToast({title:"Error",color:"danger",description:e.response?.data?.message})
      }else{
        addToast({title: 'Error', color:'danger',description:"Something went wrong. Please try again."})
      }
    }finally{
      setLoading(false)
    }
    // Here you would typically send the data to your backend
    console.log('Form data:', formData)
    console.log('Image file:', imageFile)
    // For now, just show an alert
    // alert('Property created successfully! (This is a demo)')
  }

  // const amenityOptions = Object.entries(amenities).map(([key, amenity]) => ({
  //   key,
  //   label: amenity.name,
  //   icon: amenity.icon
  // }))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="light"
            isIconOnly
            as={Link}
            href="/dashboard"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
            <p className="text-gray-600 mt-2">Add a new rental property to your listings</p>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Inputs */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Property Name"
                    placeholder="e.g., Luxury Beachfront Villa"
                    labelPlacement='outside'
                    radius='sm'
                    size='lg'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    isRequired
                  />

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Price per night ($)"
                      type="number"
                      placeholder="250"
                      radius='sm'
                      size='lg'
                      labelPlacement='outside'
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      isRequired
                    />

                    <div className="space-y-2">
                      {/* <label className="text-sm font-medium text-gray-700">Location</label> */}
                      <Select
                        fullWidth
                        label="Location"
                        labelPlacement='outside'
                        placeholder='Select Location of property'
                        size='lg'
                        radius='sm'
                        className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        isRequired
                      >
                        {locationCategories.map((location) => (
                          <SelectItem key={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* <label className="text-sm font-medium text-gray-700">Description</label> */}
                    <Textarea
                      className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Describe your property..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      label="Description"
                      labelPlacement='outside'
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Guests"
                      type="number"
                      placeholder="4"
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', e.target.value)}
                      isRequired
                    />

                    <Input
                      label="Bedrooms"
                      type="number"
                      placeholder="2"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      isRequired
                    />

                    <Input
                      label="Bathrooms"
                      type="number"
                      placeholder="2"
                      value={formData.baths}
                      onChange={(e) => handleInputChange('baths', e.target.value)}
                      isRequired
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Amenities */}
              <Card className="bg-white shadow-sm">
                <CardHeader className='flex flex-col gap-1 items-start'>
                  <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
                  <p className="text-sm text-gray-600">Select all amenities available at this property</p>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 gap-3">
                    {amenities.map((amenity) => (
                      <Checkbox
                        key={amenity?.name}
                        isSelected={formData.selectedAmenities.includes(amenity.name)}
                        onValueChange={(checked) => handleAmenityChange(amenity.name, checked)}
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2">
                          {amenity.icon}
                          <span className="text-sm">{amenity.name}</span>
                        </div>
                      </Checkbox>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Image Upload */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Property Image</h2>
                </CardHeader>
                <CardBody>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Property preview"
                          className="max-w-full h-32 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          variant="bordered"
                          size="sm"
                          onPress={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload size={16} className="mr-2" />
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload size={32} className="mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Upload property image</p>
                          <p className="text-xs text-gray-600">PNG, JPG up to 10MB</p>
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload size={16} className="mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Additional Settings */}
              {/* <Card className="bg-white shadow-sm">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Additional Settings</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Cleaning Fee ($)"
                    type="number"
                    placeholder="50"
                  />

                  <Input
                    label="Service Fee ($)"
                    type="number"
                    placeholder="180"
                  />

                  <Input
                    label="Host Name"
                    placeholder="John Doe"
                  />

                  <Checkbox>
                    Mark as Superhost
                  </Checkbox>
                </CardBody>
              </Card> */}

              {/* Tags */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
                </CardHeader>
                <CardBody>
                  <Textarea
                    label="Tags"
                    placeholder="Enter tags separated by commas"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  >

                  </Textarea>
                </CardBody>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={loading}
                  startContent={<Save size={20} />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Property
                </Button>
              </div>
            </div>

            {/* Right Column - Preview Panel */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm sticky top-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
                  <p className="text-sm text-gray-600">See how your property will appear to guests</p>
                </CardHeader>
                <CardBody className="p-0">
                  {/* Property Preview */}
                  <div className="border-t border-gray-200">
                    {/* Image */}
                    <div className="relative h-64 bg-gray-200">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Property preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <Upload size={48} className="mx-auto mb-2" />
                            <p>Upload an image to see preview</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="sm" variant="solid" className="bg-white/80 text-gray-700">
                          <Share size={16} />
                        </Button>
                        <Button size="sm" variant="solid" className="bg-white/80 text-gray-700">
                          <Heart size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title and Rating */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            {formData.name || 'Property Name'}
                          </h1>
                          <div className="flex items-center gap-2 mt-1">
                            <Star size={16} className="text-yellow-500 fill-current" />
                            <span className="font-semibold">4.8</span>
                            <span className="text-gray-500">(128 reviews)</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500 capitalize">
                              {locationCategories.find(loc => loc.id === formData.location)?.name || 'Location'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${formData.price || '0'}
                          </p>
                          <p className="text-sm text-gray-500">per night</p>
                        </div>
                      </div>

                      {/* Host Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          Hosted by John Doe
                          <Badge color="primary" className="ml-2">Superhost</Badge>
                          <span className="ml-2">• 5 years hosting</span>
                        </p>
                      </div>

                      <Divider className="my-4" />

                      {/* Property Details */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Users size={20} />
                          <span>{formData.guests || '0'} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed size={20} />
                          <span>{formData.bedrooms || '0'} bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath size={20} />
                          <span>{formData.baths || '0'} baths</span>
                        </div>
                      </div>

                      <Divider className="my-4" />

                      {/* Description */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">About this place</h3>
                        <p className="text-gray-700">
                          {formData.description || 'Describe your amazing property here...'}
                        </p>
                      </div>

                      <Divider className="my-4" />

                      {/* Amenities */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-3">What this place offers</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {formData.selectedAmenities.length > 0 ? (
                            formData.selectedAmenities.slice(0, 6).map((amenityKey:any) => {
                              const amenity = amenities.find(a=>a.name === amenityKey)
                              return (
                                <div key={amenityKey} className="flex items-center gap-2">
                                  {amenity.icon}
                                  <span className="text-sm">{amenity.name}</span>
                                </div>
                              )
                            })
                          ) : (
                            <p className="text-gray-500 text-sm col-span-2">Select amenities to see them here</p>
                          )}
                          {formData.selectedAmenities.length > 6 && (
                            <p className="text-gray-500 text-sm">+{formData.selectedAmenities.length - 6} more</p>
                          )}
                        </div>
                      </div>

                      <Divider className="my-4" />

                      {/* Map Placeholder */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Where you'll be</h3>
                        <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <MapPin size={32} className="mx-auto mb-2" />
                            <p>Interactive map will appear here</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
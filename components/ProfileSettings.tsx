'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Api from '@/lib/api'
import { addToast } from '@heroui/toast'
import {
  User,
  Settings,
  Camera,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Save
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Avatar } from '@heroui/avatar'
import { Input } from '@heroui/input'
import type { CustomSession } from '@/types'
import { useEdgeStore } from '@/lib/edgestore'

export default function ProfileSettings() {
  const { data: session, update }: { data: CustomSession | null, update: any } = useSession()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { edgestore } = useEdgeStore()

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
    if (session?.user?.image) {
      setProfileImage(session.user.image)
    }
  }, [session])

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (!file.type.match('image.*')) {
      addToast({ title: 'Invalid file type', description: 'Please upload an image file', variant: 'solid', color: 'danger' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({ title: 'File too large', description: 'Image must be less than 5MB', variant: 'solid', color: 'danger' })
      return
    }

    setIsUploading(true)
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          temporary: false,
        },
      })

      setProfileImage(res.url)
      addToast({ title: 'Profile image updated', description: 'Your profile picture has been updated successfully', variant: 'solid', color: 'success' })
    } catch (error) {
      addToast({ title: 'Upload failed', description: 'Failed to upload profile image', variant: 'solid', color: 'danger' })
    } finally {
      setIsUploading(false)
    }
  }

const handleSaveChanges = async () => {
    if (!session?.user?.djangoAccess) return

    setIsSaving(true)
    try {
      const response = await Api.post('/users/me/', {
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' '),
        image: profileImage
      }, {
        headers: {
          Authorization: `Token ${session.user.djangoAccess}`
        }
      })

      // Update session with new data
      await update({
        ...session,
        user: {
          ...session.user,
          name: name,
          image: profileImage,
          djangoAccess: session.user.djangoAccess // Preserve the access token
        }
      })

      addToast({ title: 'Profile updated', description: 'Your profile information has been updated successfully', variant: 'solid', color: 'success' })
    } catch (error) {
      console.error('Profile update error:', error)
      addToast({ title: 'Update failed', description: 'Failed to update profile information', variant: 'solid', color: 'danger' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Profile Image Section */}
          <div className="relative group">
            <Avatar
              src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`}
              size="lg"
              className="w-32 h-32 border-4 border-white shadow-lg"
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Camera size={18} className="text-gray-600" />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="text-center">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center font-semibold text-2xl text-gray-800"
              variant="bordered"
              size="lg"
            />
            <p className="text-gray-500 mt-2">{session?.user?.email}</p>
          </div>

          {/* Save Button */}
          <Button
            onPress={handleSaveChanges}
            isLoading={isSaving}
            className="w-full max-w-xs flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-semibold"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
            }}
          >
            <Save size={20} />
            Save Changes
          </Button>
        </div>

        {/* Profile Actions */}
        <div className="mt-12 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import { Button } from '@heroui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button 
              variant="flat" 
              startContent={<ArrowLeft size={16} />}
              className="font-medium"
            >
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">About RentEase</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Simplifying property rentals in The Gambia with secure, transparent, and efficient solutions
            </p>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  RentEase is dedicated to revolutionizing the property rental landscape in The Gambia. We believe that everyone deserves access to safe, reliable, and affordable housing solutions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By connecting property owners with tenants seamlessly and securely, we're making the rental process more accessible for everyone involved.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To become the leading digital platform for property rental in The Gambia, recognized for innovation, trustworthiness, and exceptional user experience.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We envision a future where property rentals are effortless, transparent, and beneficial for all stakeholders in the ecosystem.
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose RentEase?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-indigo-600">🔒</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Secure Transactions</h3>
                  <p className="text-gray-600">All payments are processed securely through our integrated payment system</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-indigo-600">📋</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Transparent Process</h3>
                  <p className="text-gray-600">Clear terms, fair pricing, and straightforward communication</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-indigo-600">⚡</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Efficient Service</h3>
                  <p className="text-gray-600">Streamlined booking and payment processes save you time</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-indigo-600">👨‍💻</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Meet Our Founders</h3>
                <p className="text-gray-600 max-w-2xl mb-4">
                  RentEase was founded by a team of passionate developers and property experts committed to solving real problems in the Gambian rental market.
                </p>
                <p className="text-gray-600">
                  We understand the challenges faced by both property owners and tenants, and we're building solutions that address these needs directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
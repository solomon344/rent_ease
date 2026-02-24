import "./style.css"
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { Button } from "@heroui/button"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"
import { SearchIcon, ArrowRight, Shield, Clock, Users, MapPin, Star, CheckCircle, Key, Heart, Award, HomeIcon } from 'lucide-react'
import Navbar from "@/components/navbar"

import { siteConfig } from "@/config/site";


export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="image-bg">
        <div className="bg-black/45 w-full h-full py-[8rem] flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col gap-2 text-center max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Find Your Perfect <span className="text-blue-400">Rental</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl">
              Browse thousands of verified listings and connect with trusted landlords easily. Your dream home is just a search away.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="py-3 rounded-full bg-white/95 backdrop-blur-md flex items-center px-6 shadow-lg">
              <input
                type="text"
                placeholder="Search for apartments, houses, or rooms... (Coming Soon)"
                className="flex-1 px-4 py-3 border-none outline-none text-gray-700 placeholder-gray-500"
              />
              <Button isDisabled size="lg" color="primary" radius="full" isIconOnly className="ml-2">
                <SearchIcon size={20} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-white">
            <p className="text-lg">Have a place to rent?</p>
            <Button
              className="px-8 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
              radius="full"
              href="/login"
              as={'a'}
              endContent={<ArrowRight size={18} />}
              size="lg"
            >
              List Your Property
            </Button>
          </div>
        </div>
      </div>

      {/* Why Book With Us Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RentEase?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover a new way to find rental properties with our curated selection and exceptional support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardBody className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Properties</h3>
                <p className="text-gray-600">All listings are thoroughly verified for authenticity and quality</p>
              </CardBody>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardBody className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quick Response</h3>
                <p className="text-gray-600">Get responses from landlords within 24 hours of your inquiry</p>
              </CardBody>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardBody className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trusted Community</h3>
                <p className="text-gray-600">Join thousands of satisfied renters and reliable landlords</p>
              </CardBody>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardBody className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Best Price Guarantee</h3>
                <p className="text-gray-600">Find the best deals with our price matching guarantee</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Finding your perfect rental has never been easier</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 -mt-12">
                <SearchIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Search & Discover</h3>
              <p className="text-gray-600 text-lg">
                Browse through our extensive collection of verified rental properties using our advanced search filters
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 -mt-12">
                <Key className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Connect & Book</h3>
              <p className="text-gray-600 text-lg">
                Contact landlords directly and book your preferred property with our secure booking system
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 -mt-12">
                <HomeIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Move In</h3>
              <p className="text-gray-600 text-lg">
                Complete your move-in process smoothly with our comprehensive support and documentation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Locations Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Locations</h2>
            <p className="text-xl text-gray-600">Explore rentals in the most sought-after neighborhoods</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { city: "Banjul", properties: "2,340", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop" },
              { city: "Brikama", properties: "1,890", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop" },
              { city: "Kartong", properties: "1,456", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop" },
              { city: "Serekunda", properties: "987", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop" },
              { city: "Kerewan", properties: "756", image: "https://images.unsplash.com/photo-1531218150217-11f600ee55a3?w=400&h=300&fit=crop" },
              { city: "Brufut", properties: "623", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop" }
            ].map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                <div className="relative h-48">
                  <img
                    src={location.image}
                    alt={location.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{location.city}</h3>
                    <p className="text-sm opacity-90">{location.properties} properties</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Real experiences from real renters</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg">
              <CardBody>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "RentEase made finding my apartment so much easier. The verification process gave me peace of mind, and I found the perfect place within a week!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Mitchell</p>
                    <p className="text-sm text-gray-500">New York, NY</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <CardBody>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "As a landlord, RentEase helped me find reliable tenants quickly. The platform is user-friendly and the support team is excellent."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">MJ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Michael Johnson</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <CardBody>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The response time from landlords was incredible. I got multiple offers within 24 hours and chose the best one for my needs."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold">Alex Lee</p>
                    <p className="text-sm text-gray-500">San Francisco, CA</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Rental?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users who have found their dream homes through RentEase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              radius="full"
              endContent={<SearchIcon size={20} />}
            >
              Start Searching
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
              radius="full"
              endContent={<HomeIcon size={20} />}
            >
              List Your Property
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">RentEase</h3>
              <p className="text-gray-400 mb-4">
                Making property rental simple, secure, and stress-free for everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/listings" className="text-gray-400 hover:text-white transition-colors">Browse Listings</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* For Renters */}
            <div>
              <h4 className="text-lg font-semibold mb-4">For Renters</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How to Search</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Booking Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tenant Rights</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* For Landlords */}
            <div>
              <h4 className="text-lg font-semibold mb-4">For Landlords</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">List Your Property</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Verification Process</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">Get the latest rental tips and property listings delivered to your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <Button size="sm" color="primary" className="px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 RentEase. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

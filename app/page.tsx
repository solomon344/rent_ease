'use client'
import "./style.css"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { 
  SearchIcon, 
  ArrowRight, 
  Shield, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  HomeIcon, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Heart,
  Key
} from 'lucide-react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Image } from "@heroui/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700 tracking-wide uppercase">Your journey starts here</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Find Your Next <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Dream Home</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
              Explore thousands of hand-picked rental properties in The Gambia. From coastal villas to urban apartments, we find the perfect match for your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/listings">
                <Button 
                  size="lg" 
                  className="px-10 h-14 font-bold text-lg rounded-2xl group transition-all duration-300"
                  style={{ 
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(99,102,241,0.4)'
                  }}
                  endContent={<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                >
                  Explore Listings
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                   variant="bordered"
                   size="lg" 
                   className="px-10 h-14 font-bold text-lg rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all font-semibold"
                >
                  List Property
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-extrabold text-slate-900 mb-0.5">2.5k+</p>
                <p className="text-sm text-slate-400 font-medium">Active Listings</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-3xl font-extrabold text-slate-900 mb-0.5">10k+</p>
                <p className="text-sm text-slate-400 font-medium">Happy Renters</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-3xl font-extrabold text-slate-900 mb-0.5">99%</p>
                <p className="text-sm text-slate-400 font-medium">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" 
                alt="Modern Architecture"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Floating Card */}
              <div 
                className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.85)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Emerald Coastal Villa</h4>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> Brufut Heights, Gambia
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-indigo-600 text-xl">D12,500</p>
                    <p className="text-slate-400 text-xs">per night</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500 rounded-3xl -z-10 group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500 rounded-3xl -z-10 group-hover:-rotate-12 transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 px-6 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-indigo-600 bg-indigo-50 mb-3 uppercase tracking-widest">
              Our Value
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Why Book With Us?</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              We've redesigned the rental experience to be transparent, fast, and secure for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every property goes through a rigorous 3-step verification process.", color: "indigo" },
              { icon: TrendingUp, title: "Best Value", desc: "Transparent pricing with zero hidden fees and direct landlord negotiations.", color: "indigo" },
              { icon: Clock, title: "Quick Move-in", desc: "Our streamlined digital documentation lets you move in within 24 hours.", color: "indigo" },
              { icon: Heart, title: "Secure Support", desc: "24/7 dedicated local assistance for both tenants and owners.", color: "indigo" }
            ].map((benefit, i) => (
              <div key={i} className="group rounded-[2.5rem] p-8 border border-white transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white shadow-sm">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-indigo-50`}>
                  <benefit.icon className={`w-7 h-7 text-indigo-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Locations */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Explore Locations</h2>
              <p className="text-lg text-slate-500 max-w-xl font-medium">
                Explore the most sought-after neighborhoods across the coast and city.
              </p>
            </div>
            <Link href="/listings" className="group flex items-center gap-2 font-bold text-indigo-600">
              View All Areas <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { city: "Kololi", properties: 48, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80", span: "md:col-span-2" },
              { city: "Banjul", properties: 32, image: "https://images.unsplash.com/photo-1549463591-14ca5a4100e7?w=800&q=80", span: "" },
              { city: "Fajara", properties: 25, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", span: "" },
              { city: "Brufut", properties: 19, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80", span: "" },
              { city: "Kotu", properties: 15, image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80", span: "md:col-span-2" },
              { city: "Bakau", properties: 12, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", span: "" }
            ].map((loc, i) => (
              <Link key={i} href={`/listings?location=${loc.city.toLowerCase()}`} className={`${loc.span} relative group h-80 rounded-[2.5rem] overflow-hidden shadow-lg`}>
                <Image 
                  src={loc.image} 
                  alt={loc.city} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  removeWrapper
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-indigo-900/40 transition-colors duration-500" />
                <div className="absolute bottom-6 left-8 text-white translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{loc.city}</h3>
                  <p className="text-white/80 text-sm font-semibold">{loc.properties} properties available</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">RentEase makes finding your home as easy as 1-2-3</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 relative">
            {[
              { step: "01", title: "Search Property", desc: "Browse through our verified listings with powerful filters for location, price and more.", icon: SearchIcon },
              { step: "02", title: "Instant Booking", desc: "Select your dates and book directly. Our secure system handles the paperwork for you.", icon: Key },
              { step: "03", title: "Collect Keys", desc: "Meet your host and get settled in. Our support team is always here if you need anything.", icon: HomeIcon }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex items-center justify-center mb-8 relative group-hover:-translate-y-2 transition-all duration-500">
                   <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                     {item.step}
                   </div>
                   <item.icon size={44} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed max-w-xs font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-24 bg-white">
        <div 
          className="max-w-7xl mx-auto rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
        >
          {/* Animated Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px] -ml-64 -mb-64" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">Ready to Find Your <br /> Perfect Rental?</h2>
            <p className="text-xl text-indigo-100 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
              Join thousands of happy families and professionals who found their homes through RentEase. 
              Start your journey today with the most trusted platform in The Gambia.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/listings">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-slate-50 px-12 h-16 font-extrabold text-xl rounded-2xl transition-all shadow-xl shadow-black/10"
                  endContent={<SearchIcon size={22} />}
                >
                  Start Searching
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="bordered"
                  className="border-white/30 text-white hover:bg-white/10 px-12 h-16 font-extrabold text-xl rounded-2xl transition-all"
                  endContent={<HomeIcon size={22} />}
                >
                  List Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

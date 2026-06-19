'use client'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import Link from 'next/link'
import React from 'react'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Heart
} from 'lucide-react'
import Logo from './Logo'
import { addToast } from '@heroui/toast'

const Footer = () => {
  const handleSubscribe = () => {
    addToast({
      title: "Successfully Subscribed!",
      color: "success",
      description: "You'll now receive our latest updates.",
      shouldShowTimeoutProgress: false
    })
  }

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Elevating the rental experience in The Gambia. We connect premium properties with verified guests through seamless technology.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Groups */}
          {[
            {
              title: "Discover",
              links: [
                { label: "Find a Home", href: "/listings" },
                { label: "Popular Areas", href: "/listings" },
                { label: "Luxury Collection", href: "/listings?tag=luxury" },
                { label: "New Listings", href: "/listings?sort=newest" }
              ]
            },
            {
              title: "Solutions",
              links: [
                { label: "List Property", href: "/dashboard/create" },
                { label: "Verified Hosts", href: "#" },
                { label: "Owner Dashboard", href: "/dashboard" },
                { label: "Pricing Plans", href: "#" }
              ]
            },
            {
              title: "Company",
              links: [
                { label: "Our Story", href: "#" },
                { label: "Help Center", href: "#" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Privacy Policy", href: "/privacy-policy" }
              ]
            }
          ].map((group, i) => (
            <div key={i}>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-widest mb-6">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="text-slate-400 font-medium hover:text-indigo-400 transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div 
          className="rounded-[2.5rem] p-8 md:p-12 mb-20 border border-white/10 backdrop-blur-xl relative overflow-hidden" 
          style={{ background: 'rgba(30, 41, 59, 0.4)' }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-extrabold mb-4">Stay in the luxury loop</h3>
              <p className="text-slate-400 font-medium text-lg">
                Exclusive news, property drops and coastal insights delivered weekly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your email"
                className="flex-1"
                classNames={{
                  inputWrapper: "bg-slate-950/50 border-slate-800 focus-within:!border-indigo-600 h-14",
                  input: "text-white placeholder:text-slate-500"
                }}
              />
              <Button 
                className="h-14 px-8 font-extrabold text-white shadow-lg shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                onPress={handleSubscribe}
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-medium text-sm">
            © 2026 RentEase. Designed for excellence in The Gambia.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-widest">
              <ShieldCheck size={16} className="text-indigo-500" />
              Secure System
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-widest">
              <Heart size={16} className="text-rose-500" />
              Built locally
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

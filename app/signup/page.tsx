import SignupForm from '@/components/SignupForm';
import Logo from '@/components/Logo';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left side - Visual Content */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110" 
          style={{backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/90 via-indigo-900/70 to-transparent" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={180} height={80} />
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-5xl font-extrabold leading-tight mb-8">
              Start your journey <br />
              <span className="text-purple-300">with us today.</span>
            </h2>
            
            <div className="space-y-6">
              {[
                "Verified listings and secure payments",
                "Instant booking with 24/7 support",
                "Connect with premium property owners"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 transition-colors">
                    <CheckCircle2 size={14} className="text-emerald-400 group-hover:text-white" />
                  </div>
                  <span className="text-lg font-medium text-white/90">{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
            <span>© 2026 RentEase Inc.</span>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center p-8 md:p-16 bg-slate-50/50 overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
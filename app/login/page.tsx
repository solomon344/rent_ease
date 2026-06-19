import LoginForm from '../../components/LoginForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Logo from '../../components/Logo';
import Link from "next/link";

const Page = async() => {
  const session = await auth()
  if (session?.user){
    redirect('/listings')
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left side - Visual Content */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110" 
          style={{backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-transparent" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-2">
            <Logo width={180} height={80} />
          </div>
          
          <div className="max-w-md">
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Welcome back to your <br />
              <span className="text-indigo-300">perfect home.</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Join thousands of travelers and homeowners finding excellence in every stay.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
            <span>© 2026 RentEase Inc.</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <Link href={'privacy-policy'}>Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <Link href={'terms-of-service'}>Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 md:p-16 bg-slate-50/50">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
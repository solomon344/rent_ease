'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import Api from '@/lib/api';
import Logo from '@/components/Logo';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await Api.post('/auth/password-reset/', { email });
      addToast({
        title: 'Reset Link Sent',
        color: 'success',
        description: response.data.message,
        shouldShowTimeoutProgress: false
      });
      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: err.response?.data?.message || 'Failed to send reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              Reset your <br />
              <span className="text-indigo-300">password.</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Enter your email address and we'll send you a link to reset your password and regain access to your account.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
            <span>© 2026 RentEase Inc.</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Privacy Policy</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 md:p-16 bg-slate-50/50">
        <div className="w-full max-w-md">
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <Logo width={120} height={50} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {isSuccess ? 'Check your email' : 'Reset password'}
              </h2>
              <p className="text-slate-500 font-medium">
                {isSuccess 
                  ? "We've sent a password reset link to your email address."
                  : 'Enter your email address and we will send you a reset link.'}
              </p>
            </div>

            {isSuccess ? (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 border border-green-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Email sent successfully!</h3>
                      <p className="mt-2 text-sm text-green-700">
                        Please check your inbox and spam folder. The reset link will expire in 1 hour.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    as={Link}
                    href="/login"
                    fullWidth
                    size="lg"
                    radius="lg"
                    className="font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                  >
                    Back to login
                  </Button>
                  <Button
                    variant="bordered"
                    fullWidth
                    size="lg"
                    radius="lg"
                    onPress={() => setIsSuccess(false)}
                    className="font-bold"
                  >
                    Try another email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Input
                  label="Email Address"
                  labelPlacement='outside'
                  placeholder="name@company.com"
                  typeof='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  radius="sm"
                  // size="lg"
                  isRequired
                  classNames={{
                    label: "font-bold text-slate-700 mb-1",
                    inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 transition-all shadow-sm"
                  }}
                />

                <Button 
                  isLoading={isLoading} 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  radius="sm"
                  className="font-extrabold text-white shadow-lg shadow-indigo-200"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            )}

            <div className="text-center">
              <Link href="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
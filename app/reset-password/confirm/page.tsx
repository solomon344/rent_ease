'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import Api from '@/lib/api';
import Logo from '@/components/Logo';

export default function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsCheckingToken(false);
      setIsTokenValid(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await Api.post('/auth/password-reset/validate-token/', { token });
        if (response.data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (err: any) {
        setIsTokenValid(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      addToast({
        title: 'Passwords do not match',
        color: 'danger',
        description: 'Please make sure both passwords match.',
      });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      addToast({
        title: 'Password too short',
        color: 'danger',
        description: 'Password must be at least 8 characters long.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await Api.post('/auth/password-reset/confirm/', {
        token,
        password,
      });
      addToast({
        title: 'Password Reset Successful',
        color: 'success',
        description: response.data.message,
        shouldShowTimeoutProgress: false
      });
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      addToast({
        title: 'Error',
        color: 'danger',
        description: err.response?.data?.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state - verifying token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex bg-white overflow-hidden">
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
                Secure <br />
                <span className="text-indigo-300">verification.</span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                We're verifying your password reset link to ensure your account security.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
              <span>© 2026 RentEase Inc.</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 md:p-16 bg-slate-50/50">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <svg
                className="animate-spin h-12 w-12 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying reset link...</h2>
            <p className="text-slate-500">Please wait while we verify your token.</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex bg-white overflow-hidden">
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
                Invalid <br />
                <span className="text-red-300">link.</span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
              <span>© 2026 RentEase Inc.</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 md:p-16 bg-slate-50/50">
          <div className="w-full max-w-md">
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-2">
                <div className="lg:hidden flex items-center gap-2 mb-6">
                  <Logo width={120} height={50} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invalid Reset Link</h2>
                <p className="text-slate-500 font-medium">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>

              <div className="rounded-lg bg-red-50 border border-red-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Link expired or invalid</h3>
                    <p className="mt-2 text-sm text-red-700">
                      Password reset links expire after 1 hour for security purposes. Please request a new one.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  as={Link}
                  href="/reset-password"
                  fullWidth
                  size="lg"
                  radius="lg"
                  className="font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  Request new reset link
                </Button>
                <Button
                  as={Link}
                  href="/login"
                  variant="bordered"
                  fullWidth
                  size="lg"
                  radius="lg"
                  className="font-bold"
                >
                  Back to login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-white overflow-hidden">
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
                Password <br />
                <span className="text-green-300">updated!</span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
              <span>© 2026 RentEase Inc.</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 md:p-16 bg-slate-50/50">
          <div className="w-full max-w-md text-center">
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="rounded-lg bg-green-50 border border-green-200 p-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Password Reset Successful!</h2>
                <p className="text-green-700">
                  Your password has been updated. Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
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
              Create new <br />
              <span className="text-indigo-300">password.</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Enter your new password below. Make sure it's strong and memorable.
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
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create new password</h2>
              <p className="text-slate-500 font-medium">
                Your new password must be different from previously used passwords.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                label="New Password"
                placeholder="Enter your new password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
                radius="lg"
                size="lg"
                isRequired
                endContent={
                  <button
                    type="button"
                    className="focus:outline-none text-slate-400 hover:text-indigo-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                }
                classNames={{
                  label: "font-bold text-slate-700 mb-1",
                  inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 transition-all shadow-sm"
                }}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your new password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="bordered"
                radius="lg"
                size="lg"
                isRequired
                endContent={
                  <button
                    type="button"
                    className="focus:outline-none text-slate-400 hover:text-indigo-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                }
                classNames={{
                  label: "font-bold text-slate-700 mb-1",
                  inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 transition-all shadow-sm"
                }}
              />

              <div className="text-sm text-slate-500">
                <p>Password must be at least <span className="font-semibold text-slate-700">8 characters</span> long.</p>
              </div>

              <Button 
                isLoading={isLoading} 
                type="submit" 
                fullWidth 
                size="lg"
                radius="lg"
                className="font-extrabold text-white shadow-lg shadow-indigo-200"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                {isLoading ? 'Resetting...' : 'Reset password'}
              </Button>
            </form>

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
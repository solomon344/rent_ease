"use client";
import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { Checkbox } from "@heroui/checkbox";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { EyeIcon, EyeOffIcon, LogIn, Sparkles } from "lucide-react";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import Logo from "./Logo";

const LoginForm = () => {
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { ...formData, redirect: false });
      if (res?.error) {
        addToast({ 
          title: 'Authentication Failed', 
          color: 'danger', 
          description: "Please check your email and password.", 
          shouldShowTimeoutProgress: false 
        });
      } else {
        addToast({ 
          title: "Welcome Back!", 
          color: "success", 
          description: "Successfully logged into RentEase.", 
          shouldShowTimeoutProgress: false 
        });
        router.push("/listings");
      }
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ 
          title: 'Login Error', 
          color: 'danger', 
          description: e.response?.data?.message || 'An unexpected error occurred.' 
        });
      } else {
        addToast({ title: 'Error', color: 'danger', description: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to NextAuth Google sign-in. Django verification happens in the jwt callback.
    signIn("google", { callbackUrl: '/listings' });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <Logo width={120} height={50} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login to account</h2>
        <p className="text-slate-500 font-medium">Welcome back! Please enter your details.</p>
      </div>

      {/* <Tabs
        selectedKey={userType}
        fullWidth
        onSelectionChange={(key) => setUserType(key as string)}
        className="w-full"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-indigo-600",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-indigo-600 font-bold"
        }}
      >
        <Tab key="user" title="User Access" />
        <Tab key="owner" title="Owner Access" />
      </Tabs> */}

      <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          label="Email Address"
          placeholder="name@company.com"
          type="email"
          name="email"
          labelPlacement="outside"
          value={formData.email}
          onChange={handleInputChange}
          variant="bordered"
          radius="lg"
          size="lg"
          isRequired
          classNames={{
            label: "font-bold text-slate-700 mb-1",
            inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 transition-all shadow-sm"
          }}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            name="password"
            labelPlacement="outside"
            value={formData.password}
            onChange={handleInputChange}
            variant="bordered"
            radius="lg"
            size="lg"
            isRequired
            classNames={{
              label: "font-bold text-slate-700 mb-1",
              inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 transition-all shadow-sm"
            }}
            endContent={
              <button
                type="button"
                className="focus:outline-none text-slate-400 hover:text-indigo-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon size={20} />
                ) : (
                  <EyeOffIcon size={20} />
                )}
              </button>
            }
          />
          <div className="flex justify-end">
            <Link href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Checkbox 
            size="sm" 
            radius="sm"
            color="primary"
            classNames={{
              label: "text-slate-600 font-medium"
            }}
          >
            Remember for 30 days
          </Checkbox>
        </div>

        <Button 
          isLoading={loading} 
          type="submit" 
          fullWidth 
          size="lg"
          radius="lg"
          className="font-extrabold text-white shadow-lg shadow-indigo-200"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          startContent={!loading && <LogIn size={18} />}
        >
          {userType === 'user' ? 'Login as User' : 'Login as Property Owner'}
        </Button>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Divider />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50/50 px-2 text-slate-400 font-bold tracking-wider">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="flat"
          fullWidth
          onPress={handleGoogleAuth}
          className="bg-white border border-slate-200 font-bold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
          size="lg"
          radius="lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google Account
        </Button>
      </div>

      <p className="text-center text-slate-500 font-medium text-sm">
        New to RentEase?{" "}
        <Link href="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;

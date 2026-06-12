"use client";
import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { Checkbox } from '@heroui/checkbox';
import Link from 'next/link';
import Api from '@/lib/api';
import { Form } from '@heroui/form';
import zod from 'zod';
import { addToast } from '@heroui/toast';
import { EyeIcon, EyeOffIcon, UserPlus } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

export const formatError = (error: { [key: string]: { errors: string[] } | undefined }) => {
  const errors: { [key: string]: string | undefined } = {};
  for (const key in error) {
    errors[key] = error[key]?.errors?.at(0);
  }
  return errors;
};

const SignupForm = () => {
  const [userType, setUserType] = useState('buyer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validationSchema = zod.object({
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Must include uppercase, lowercase, number, and special character."),
    confirmPassword: zod.string().min(6),
    firstName: zod.string().min(2, "First name is required"),
    lastName: zod.string().min(2, "Last name is required"),
    phone: zod.string().min(7, "Phone must be 7 digits").max(7, "Phone must be 7 digits"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError({});

    try {
      const result = validationSchema.safeParse(formData);
      if (!result.success) {
        // @ts-ignore
        const formatted = zod.treeifyError(result.error);
        setFormError(formatError(formatted.properties));
        return;
      }

      await Api.post("/users/", { ...formData, role: userType, confirmPassword: null });
      addToast({ title: "Account Created!", color: "success", description: "You can now log in to your account.", shouldShowTimeoutProgress: false });
      router.push("/login");
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ title: "Registration Failed", color: "danger", description: e.response?.data?.message || "Form validation failed." });
      } else {
        addToast({ title: 'Error', color: 'danger', description: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <Logo width={120} height={50} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
        <p className="text-slate-500 font-medium">Join our community and find your next home.</p>
      </div>

      <Tabs
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
        <Tab key="buyer" title="Join as User" />
        <Tab key="seller" title="Join as Owner" />
      </Tabs>

      <Form onSubmit={handleSubmit} validationErrors={formError} validationBehavior="native" className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            name="firstName"
            labelPlacement="outside"
            value={formData.firstName}
            onChange={handleInputChange}
            variant="bordered"
            radius="lg"
            size="lg"
            isRequired
            classNames={{
              label: "font-bold text-slate-700 mb-1",
              inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
            }}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            name="lastName"
            labelPlacement="outside"
            value={formData.lastName}
            onChange={handleInputChange}
            variant="bordered"
            radius="lg"
            size="lg"
            isRequired
            classNames={{
              label: "font-bold text-slate-700 mb-1",
              inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
            }}
          />
        </div>

        <Input
          label="Email Address"
          placeholder="john@example.com"
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
            inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
          }}
        />

        <Input
          label="Phone Number"
          placeholder="7654321"
          type="tel"
          name="phone"
          labelPlacement="outside"
          value={formData.phone}
          onChange={handleInputChange}
          variant="bordered"
          radius="lg"
          size="lg"
          startContent={<span className="text-slate-400 font-bold">+220</span>}
          classNames={{
            label: "font-bold text-slate-700 mb-1",
            inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
            }}
            endContent={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeIcon size={20} className="text-slate-400" /> : <EyeOffIcon size={20} className="text-slate-400" />}
              </button>
            }
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            labelPlacement="outside"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            variant="bordered"
            radius="lg"
            size="lg"
            isRequired
            classNames={{
              label: "font-bold text-slate-700 mb-1",
              inputWrapper: "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
            }}
            endContent={
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeIcon size={20} className="text-slate-400" /> : <EyeOffIcon size={20} className="text-slate-400" />}
              </button>
            }
          />
        </div>

        <Checkbox 
          size="sm" 
          radius="sm" 
          color="primary"
          classNames={{ label: "text-slate-600 font-medium" }}
          isRequired
        >
          I agree to the Terms of Service and Privacy Policy
        </Checkbox>

        <Button 
          isLoading={loading} 
          type="submit" 
          fullWidth 
          size="lg"
          radius="lg"
          className="font-extrabold text-white mt-2 shadow-lg shadow-indigo-200"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          startContent={!loading && <UserPlus size={18} />}
        >
          Create My Account
        </Button>
      </Form>


      <p className="text-center text-slate-500 font-medium text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
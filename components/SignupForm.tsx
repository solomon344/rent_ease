'use client'
import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { Divider } from '@heroui/divider';
import { Checkbox } from '@heroui/checkbox';
import Link from 'next/link';
import Api from '@/lib/api';
import { Form } from '@heroui/form';
import zod from 'zod';
import { addToast } from '@heroui/toast';
import { EyeClosedIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { isAxiosError } from 'axios';


 export const formatError = (error:{[key:string]:{errors:string[]}|undefined})=>{
      const errors:{[key:string]:string|undefined} = {}

      for (const key in error) {
        errors[key] = error[key]?.errors?.at(0)
      }

      return errors

}

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

  const validationSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."),
    confirmPassword: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string(),
    phone: zod.string().min(7).max(7),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    // e.stopPropagation();
    // alert('Form submitted')

    
   
    
    // Handle signup logic here
    try{
      const {error, success} = validationSchema.safeParse(formData)
      if (!success) {
          const formatted = zod.treeifyError(error)
          // @ts-ignore
          // @ts-nocheck
          setFormError(formatError(formatted.properties));
          return;
      }
      const response = await Api.post("/users/",{...formData,role:userType,confirmPassword:null})
      const data = response.data

      addToast({title:"Success",color:"success",description:"Account created successfully."})
    }catch(e){
        if (isAxiosError(e)){
          addToast({title:"Error",color:"danger",description:e.response?.data?.message})
        }else{
          addToast({title: 'Error', color:'danger',description:"Something went wrong. Please try again."})
        }
    }finally{
      setLoading(false)
    }
    // console.log('Signup data:', { ...formData, userType });
  };

  const handleGoogleAuth = () => {
    // Handle Google authentication
    console.log('Google auth for', userType);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{backgroundImage: 'url(https://files.edgestore.dev/li1g6vchhfjyhtr3/rentEaseImages/_public/584ed2eb-cfa4-4a08-b008-c33fab09ea0e.jpg)'}}>
        <div className="flex items-center justify-center w-full bg-black/30">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to RentEase</h1>
            <p className="text-xl">Find your perfect stay or list your property</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-gray-600">Join RentEase today</p>
          </div>

          <Tabs
            selectedKey={userType}
            fullWidth
            onSelectionChange={(key) => setUserType(key as string)}
            className="w-full"
          >
            <Tab key="buyer" title="User">
              <Form validationErrors={formError} validationBehavior='native' onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    variant="bordered"
                    size="sm"
                    fullWidth
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    variant="bordered"
                    size="sm"
                    fullWidth
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="bordered"
                  size="sm"
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="bordered"
                  size="sm"
                />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  endContent={
                    <Button
                      isIconOnly
                      size='sm'
                      variant={undefined}
                      className='bg-transparent'
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon className="text-gray-500" />
                      ) : (
                        <EyeOffIcon className="text-gray-500" />
                      )}
                    </Button>
                  }
                  variant="bordered"
                  size="sm"
                  required
                />
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  variant="bordered"
                   endContent={
                    <Button
                      isIconOnly
                      size='sm'
                      variant={undefined}
                      className='bg-transparent'
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="text-gray-500" />
                      ) : (
                        <EyeOffIcon className="text-gray-500" />
                      )}
                    </Button>
                  }
                  size="sm"
                  required
                />
                <Checkbox size="sm">
                  I agree to the Terms of Service and Privacy Policy
                </Checkbox>
                <Button isLoading={loading}  type="submit" color="primary" fullWidth size="sm">
                  Sign Up as User
                </Button>
              </Form>
            </Tab>

            <Tab  key="seller" title="Property Owner">
              <Form validationErrors={formError} validationBehavior='native' onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    variant="bordered"
                    size="sm"
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    variant="bordered"
                    size="sm"
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="bordered"
                  size="sm"
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="bordered"
                  size="sm"
                  required
                />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  variant="bordered"
                  size="sm"
                   endContent={
                    <Button
                      isIconOnly
                      size='sm'
                      className='bg-transparent'
                      variant={undefined}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon className="text-gray-500" />
                      ) : (
                        <EyeOffIcon className="text-gray-500" />
                      )}
                    </Button>
                  }
                  required
                />
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  variant="bordered"
                   endContent={
                    <Button
                      isIconOnly
                      size='sm'
                      variant={undefined}
                      className='bg-transparent'
                      onPress={() => setShowConfirmPassword(!showPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="text-gray-500" />
                      ) : (
                        <EyeOffIcon className="text-gray-500" />
                      )}
                    </Button>
                  }
                  size="sm"
                  required
                />
                <Checkbox size="sm">
                  I agree to the Terms of Service and Privacy Policy
                </Checkbox>
                <Button isLoading={loading} isDisabled={loading} type="submit" color="primary" fullWidth size="sm">
                  Sign Up as Property Owner
                </Button>
              </Form>
            </Tab>
          </Tabs>

          <Divider />

          <Button
            variant="bordered"
            fullWidth
            onPress={handleGoogleAuth}
            isDisabled
            className="flex items-center justify-center gap-2"
            size="sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google (Coming Soon)
          </Button>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
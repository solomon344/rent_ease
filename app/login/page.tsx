import LoginForm from '../../components/LoginForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const Page = async() => {
  const session = await auth()
  if (session?.user){
    console.log(session)
    redirect('/')
  }

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
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
'use client'
import { Button } from '@heroui/button'
import Link from 'next/link'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { HomeIcon, MenuIcon, XIcon } from 'lucide-react'

const Navbar = () => {
    const { data: session } = useSession()
    const [mobileToggled,setMobileToggled]= React.useState(false)
  return (
<div className='z-30 shadow-slate-400/30 sticky top-0 bg-white'>
    <div className='flex items-center gap-4 justify-between shadow-sm  py-4 px-6 lg:px-[6rem]'>
        <div>
            <h1 className='text-xl font-bold text-slate-700'>RentEase</h1>
        </div>

        <div className='hidden lg:flex items-cente gap-8'>
            {
                nav_items.map((item) => (<Link className='text-slate-700' key={item.name} href={item.href}>{item.name}</Link>))
            }
        </div>

        <div className='hidden lg:flex itmes-center gap-3'>
            {
            session?.user ? (
                <Button size='sm' onPress={()=>signOut()} color='primary' radius='sm' variant={'flat'}>Logout</Button>
           ): (
             <div className='flex items-center gap-2'>
            <Button size='sm' href='/login' as={'a'} color='primary' radius='sm' variant={'flat'}>Login</Button>
            <Button size='sm' href='/signup' as={'a'} color='primary' radius='sm' >Sign Up</Button>
            </div>
        )
        }
        {  
        // @ts-ignore
            session?.user?.role === 'seller' && (
                <Button startContent={<HomeIcon size={'1.2rem'}/>} size='sm' href='/dashboard' as={'a'} color='primary' radius='sm' >Dashboard</Button>
            )
        }
        </div>

        <div className='lg:hidden'>
            {
                mobileToggled?<XIcon size={'1.2rem'} onClick={() => setMobileToggled(!mobileToggled)}/>:<MenuIcon size={'1.2rem'} onClick={() => setMobileToggled(!mobileToggled)}/>
            }
        </div>

       {/* <p>{session?.user?.role}</p> */}
    </div>

    {mobileToggled && <MobileNav session={session}/>}
</div>
  )
}

export default Navbar

const nav_items = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Listings",
        href: "/listings",
    },
    {
        name: "About",
        href: "/about",
    },
]


const MobileNav = ({session}:{session:any}) => {
    return (
        <div className="flex flex-col py-4 sm:hidden px-8">
            <div className="flex flex-col ">
                {nav_items.map((item, index) => (
                    <Link key={index} href={item.href} className='p-2 hover:text-slate-600'>
                        {item.name}
                    </Link>
                ))}
                <div className='flex flex-col gap-3'>
            {
            session?.user ? (
                <Button size='sm' onPress={()=>signOut()} color='primary' radius='sm' variant={'flat'}>Logout</Button>
           ): (
             <div className='flex flex-col  gap-2'>
            <Button size='sm' href='/login' as={'a'} color='primary' radius='sm' variant={'flat'}>Login</Button>
            <Button size='sm' href='/signup' as={'a'} color='primary' radius='sm' >Sign Up</Button>
            </div>
        )
        }
        {  
        // @ts-ignore
            session?.user?.role === 'seller' && (
                <Button startContent={<HomeIcon size={'1.2rem'}/>} size='sm' href='/dashboard' as={'a'} color='primary' radius='sm' >Dashboard</Button>
            )
        }
        </div>
            </div>
        </div>
    );
};


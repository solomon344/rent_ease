import React from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation';



const layout = async({children}: {children: React.ReactNode}) => {
    const session = await auth();

    // @ts-ignore
    if (session?.user?.role !== 'seller') {
        redirect('/listings');
    }
  return (
    <div>
        {children}
    </div>
  )
}

export default layout
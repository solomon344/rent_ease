import React from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  // @ts-ignore
  if (session?.user?.role !== 'seller') {
    redirect('/listings')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#f1f5f9' }}>
      {/* Sidebar — always open, full height */}
      <aside className="flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <DashboardSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
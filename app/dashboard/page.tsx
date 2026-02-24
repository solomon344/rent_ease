'use client'
import React from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Badge } from '@heroui/badge'
import { Avatar } from '@heroui/avatar'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BarChart3,
  Home,
  Users,
  DollarSign,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
// import { listings } from '@/data/listings'
import { Image } from '@heroui/image'
import Link from 'next/link'
import Api from '@/lib/api'
import { useSession } from 'next-auth/react'

// Mock reservation data
const mockReservations = [
  {
    id: '1',
    propertyName: 'Luxury Beachfront Villa',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah.j@email.com',
    checkIn: '2025-01-15',
    checkOut: '2025-01-20',
    guests: 4,
    totalAmount: 1250,
    status: 'pending',
    createdAt: '2025-12-20',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9b466afb86d2?w=100'
  },
  {
    id: '2',
    propertyName: 'Cozy Apartment Banjul',
    guestName: 'Michael Chen',
    guestEmail: 'm.chen@email.com',
    checkIn: '2025-01-10',
    checkOut: '2025-01-12',
    guests: 2,
    totalAmount: 1600,
    status: 'confirmed',
    createdAt: '2025-12-18',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100'
  },
  {
    id: '3',
    propertyName: 'Serekunda Family Home',
    guestName: 'Emma Wilson',
    guestEmail: 'emma.w@email.com',
    checkIn: '2025-02-01',
    checkOut: '2025-02-05',
    guests: 6,
    totalAmount: 2400,
    status: 'pending',
    createdAt: '2025-12-19',
    propertyImage: 'https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=100'
  },
  {
    id: '4',
    propertyName: 'Kololi Beach Resort',
    guestName: 'David Brown',
    guestEmail: 'd.brown@email.com',
    checkIn: '2025-01-25',
    checkOut: '2025-01-30',
    guests: 8,
    totalAmount: 15000,
    status: 'declined',
    createdAt: '2025-12-15',
    propertyImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100'
  }
]

const Dashboard = () => {
  const [activeSection, setActiveSection] = React.useState('overview')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [listings,setListings] = React.useState<any[]>([])
  const [filteredListings, setFilteredListings] = React.useState(listings)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)


  const { data: session } = useSession()


  React.useEffect(()=>{
    // @ts-ignore
    Api.get(`/properties/?owner__user__email=${session?.user?.email}`,{headers:{'Authorization': `Token ${session?.user?.access}`}}).then(res=>setListings(res.data))
  },[session])

  React.useEffect(() => {
    const filtered = listings.filter((listing:any) =>
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredListings(filtered)
  }, [searchTerm])

  const totalProperties = listings.length
  const totalRevenue = listings.reduce((sum, listing) => sum + listing.price, 0)
  const averageRating = listings.reduce((sum, listing) => sum + (listing.rating || 0), 0) / listings.length
  const pendingReservations = mockReservations.filter(r => r.status === 'pending').length

  const handleReservationAction = (reservationId: string, action: 'accept' | 'decline') => {
    // In a real app, this would make an API call
    console.log(`${action} reservation ${reservationId}`)
    // For demo purposes, we'll just show an alert
    alert(`Reservation ${action}ed successfully!`)
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'properties', label: 'Properties', icon: Home, badge: null },
    { id: 'reservations', label: 'Reservations', icon: Calendar, badge: pendingReservations },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    // { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ]

  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">RentEase</h2>
        <Button
          variant="light"
          isIconOnly
          className="lg:hidden"
          onPress={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </Button>
      </div>

      <nav className="mt-8 px-4 h-fit">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <Badge color="danger" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )

  const renderOverview = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Home className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">(Coming Soon)</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">(Coming Soon)</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Reservations</p>
              <p className="text-2xl font-bold text-gray-900">(Coming Soon)</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
          </CardHeader>
          <CardBody>
            {/* <div className="space-y-4">
              {mockReservations.slice(0, 3).map((reservation) => (
                <div key={reservation.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Avatar src={reservation.propertyImage} size="sm" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{reservation.guestName}</p>
                    <p className="text-sm text-gray-600">{reservation.propertyName}</p>
                  </div>
                  <Badge
                    color={
                      reservation.status === 'confirmed' ? 'success' :
                      reservation.status === 'pending' ? 'warning' : 'danger'
                    }
                    variant="flat"
                  >
                    {reservation.status}
                  </Badge>
                </div>
              ))}
            </div> */}
            <h3 className="text-lg font-semibold text-gray-900 w-full text-center">(Coming Soon)</h3>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <Button
                color="primary"
                startContent={<Plus size={20} />}
                className="w-full justify-start"
                as={Link}
                href="/dashboard/create"
              >
                Add New Property
              </Button>
              <Button
                variant="bordered"
                startContent={<Calendar size={20} />}
                className="w-full justify-start"
                isDisabled
                onPress={() => setActiveSection('reservations')}
              >
                Manage Reservations (Coming Soon)
              </Button>
              <Button
                variant="bordered"
                startContent={<BarChart3 size={20} />}
                className="w-full justify-start"
                isDisabled
                onPress={() => setActiveSection('analytics')}
              >
                View Analytics (Coming Soon)
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  )

  const renderProperties = () => (
    <>
      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search properties by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search size={20} className="text-gray-400" />}
            className="max-w-md"
          />
        </div>
        <Button variant="bordered" className="border-gray-300">
          Filter by Location
        </Button>
        <Button variant="bordered" className="border-gray-300">
          Filter by Price
        </Button>
      </div>

      {/* Properties Table */}
      <Card className="bg-white shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Properties table">
            <TableHeader>
              <TableColumn>PROPERTY</TableColumn>
              <TableColumn>LOCATION</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>RATING</TableColumn>
              <TableColumn>GUESTS</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={listing.image}
                        alt={listing.name}
                        width={60}
                        height={40}
                        className="object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{listing.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{listing.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{listing.location}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-600">${listing.price}</span>
                  </TableCell>
                  <TableCell>
                    {listing.rating ? (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{listing.rating}</span>
                        {listing.reviewCount && (
                          <span className="text-gray-500">({listing?.reviewCount})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No rating</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {listing.guests ? `${listing.guests} guests` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        className="text-blue-600"
                        as={Link}
                        href={`/listings/property/${listing.id}`}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button className='bg-transparent' isIconOnly size='sm' as={Link} href={`/dashboard/update/${listing.id}`}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  )

  const renderReservations = () => (
    <>
      {/* Reservations Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reservations Management</h2>
          <p className="text-gray-600">Review and manage booking requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="bordered" startContent={<Search size={16} />}>
            Search
          </Button>
          <Button variant="bordered" startContent={<BarChart3 size={16} />}>
            Filter
          </Button>
        </div>
      </div>

      {/* Reservations Table */}
      <Card className="bg-white shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Reservations table">
            <TableHeader>
              <TableColumn>GUEST</TableColumn>
              <TableColumn>PROPERTY</TableColumn>
              <TableColumn>DATES</TableColumn>
              <TableColumn>GUESTS</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {mockReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.guestName}`}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{reservation.guestName}</p>
                        <p className="text-sm text-gray-500">{reservation.guestEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={reservation.propertyImage}
                        alt={reservation.propertyName}
                        width={50}
                        height={35}
                        className="object-cover rounded"
                      />
                      <span className="font-medium">{reservation.propertyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{reservation.checkIn}</p>
                      <p className="text-sm text-gray-500">to {reservation.checkOut}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{reservation.guests} guests</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">${reservation.totalAmount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        reservation.status === 'confirmed' ? 'success' :
                        reservation.status === 'pending' ? 'warning' : 'danger'
                      }
                      variant="flat"
                    >
                      {reservation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<CheckCircle size={16} />}
                            onClick={() => handleReservationAction(reservation.id, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<XCircle size={16} />}
                            onClick={() => handleReservationAction(reservation.id, 'decline')}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="light"
                          className="text-blue-600"
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  )

  const renderAnalytics = () => (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Coming soon - detailed analytics and reporting</p>
      </CardHeader>
      <CardBody>
        <div className="text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600">We're working on comprehensive analytics features.</p>
        </div>
      </CardBody>
    </Card>
  )

  const renderSettings = () => (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </CardHeader>
      <CardBody>
        <div className="text-center py-12">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
          <p className="text-gray-600">Account management and preferences will be available here.</p>
        </div>
      </CardBody>
    </Card>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'properties':
        return renderProperties()
      case 'reservations':
        return renderReservations()
      case 'analytics':
        return renderAnalytics()
      case 'settings':
        return renderSettings()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
            <Button
              variant="light"
              isIconOnly
              onPress={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">RentEase</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Page Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
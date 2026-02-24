import { MapPin, Wifi, UtensilsCrossed, Dumbbell, Waves, Shield, Car, Trees, TvIcon, CctvIcon, AirVentIcon } from 'lucide-react';
import Api from '@/lib/api';
export interface Amenity {
    name: string;
    icon: React.ReactNode;
}

export interface Listing {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    images?: string[]; // Array of image URLs for gallery
    location: string;
    description: string;
    amenities: Amenity[];
    host?: string;
    isSuperhost?: boolean;
    hostExperience?: number; // years
    guests?: number;
    bedrooms?: number;
    baths?: number;
    rating?: number;
    reviewCount?: number;
    cleaningFee?: number;
    serviceFee?: number;
}

export interface LocationCategory {
    id: string;
    name: string;
    imageUrl: string;
}

export const amenities: Record<string, Amenity> = {
    wifi: { name: 'WiFi', icon: <Wifi size={20} /> },
    kitchen: { name: 'Kitchen', icon: <UtensilsCrossed size={20} /> },
    gym: { name: 'Gym', icon: <Dumbbell size={20} /> },
    pool: { name: 'Pool', icon: <Waves size={20} /> },
    security: { name: 'Security', icon: <Shield size={20} /> },
    parking: { name: 'Parking', icon: <Car size={20} /> },
    garden: { name: 'Garden', icon: <Trees size={20} /> },
    tv: { name: 'TV', icon: <TvIcon size={20} /> },
    cctv: {name:"CCTV", icon: <CctvIcon size={20} />},
    ac: {name:"Air Conditioner", icon: <AirVentIcon size={20} />}
};

export const locationCategories: LocationCategory[] = [
    { id: 'banjul', name: 'Banjul', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500' },
    { id: 'kololi', name: 'Kololi', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500' },
    { id: 'kotu', name: 'Kotu', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
    { id: 'fajara', name: 'Fajara', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500' },
    { id: 'brufut', name: 'Brufut', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500' },
    { id: 'serekunda', name: 'Serekunda', imageUrl: 'https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=500' },
    { id: 'bakau', name: 'Bakau', imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=500' },
];

export const listings: Listing[] = [
    { id: '1', name: 'Luxury Beachfront Villa', price: 250, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9b466afb86d2?w=800', images: ['https://images.unsplash.com/photo-1512917774080-9b466afb86d2?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500', 'https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=500', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500'], location: 'bakau', description: 'Stunning beachfront property with ocean views', amenities: [amenities.wifi, amenities.pool, amenities.security, amenities.parking], host: 'Jane Doe', isSuperhost: true, hostExperience: 5, guests: 4, bedrooms: 2, baths: 2, rating: 4.92, reviewCount: 125, cleaningFee: 50, serviceFee: 180 },
    { id: '2', name: 'Cozy Apartment Banjul', price: 800, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1512917774080-9b466afb86d2?w=500', 'https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=500'], location: 'banjul', description: 'Modern apartment in the heart of Banjul', amenities: [amenities.wifi, amenities.kitchen, amenities.parking], host: 'John Smith', isSuperhost: false, hostExperience: 3, guests: 2, bedrooms: 1, baths: 1, rating: 4.5, reviewCount: 80, cleaningFee: 30, serviceFee: 100 },
    { id: '3', name: 'Serekunda Family Home', price: 1200, imageUrl: 'https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=800', images: ['https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=800', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'], location: 'serekunda', description: 'Spacious family home with garden', amenities: [amenities.garden, amenities.kitchen, amenities.security], host: 'Alice Johnson', isSuperhost: true, hostExperience: 7, guests: 6, bedrooms: 3, baths: 2, rating: 4.8, reviewCount: 200, cleaningFee: 60, serviceFee: 150 },
    { id: '4', name: 'Kololi Beach Resort', price: 3000, imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500', 'https://images.unsplash.com/photo-1516156537038-3effa189fdf3?w=500'], location: 'kololi', description: 'Resort-style living with beach access', amenities: [amenities.pool, amenities.gym, amenities.wifi, amenities.parking], host: 'Bob Wilson', isSuperhost: true, hostExperience: 10, guests: 8, bedrooms: 4, baths: 3, rating: 4.9, reviewCount: 300, cleaningFee: 100, serviceFee: 250 },
    { id: '5', name: 'Kotu Modern Studio', price: 600, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'https://images.unsplash.com/photo-1512917774080-9b466afb86d2?w=500'], location: 'kotu', description: 'Trendy studio apartment near the beach', amenities: [amenities.wifi, amenities.kitchen], host: 'Emma Davis', isSuperhost: false, hostExperience: 2, guests: 2, bedrooms: 1, baths: 1, rating: 4.3, reviewCount: 50, cleaningFee: 25, serviceFee: 75 },
    { id: '6', name: 'Fajara Executive Residence', price: 2200, imageUrl: 'https://images.unsplash.com/photo-1498694712202-58b0bae26fc3?w=500', location: 'fajara', description: 'Premium residential property', amenities: [amenities.security, amenities.parking, amenities.pool, amenities.garden] },
    { id: '7', name: 'Brufut Cottage', price: 950, imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=500', location: 'brufut', description: 'Charming cottage with nature views', amenities: [amenities.garden, amenities.kitchen, amenities.wifi] },
    { id: '8', name: 'Bakau Penthouse', price: 2800, imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500', location: 'bakau', description: 'Luxury penthouse with city views', amenities: [amenities.wifi, amenities.pool, amenities.parking, amenities.gym] },
    { id: '9', name: 'Banjul Downtown Flat', price: 700, imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500', location: 'banjul', description: 'Central location, walking distance to shops', amenities: [amenities.wifi, amenities.security] },
    { id: '10', name: 'Serekunda Townhouse', price: 1400, imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500', location: 'serekunda', description: 'Contemporary townhouse', amenities: [amenities.kitchen, amenities.parking, amenities.garden] },
    { id: '11', name: 'Kololi Luxury Apartment', price: 2100, imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', location: 'kololi', description: 'High-end apartment with sea view', amenities: [amenities.wifi, amenities.gym, amenities.pool, amenities.security] },
    { id: '12', name: 'Kotu Beach House', price: 1600, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', location: 'kotu', description: 'Perfect beachside getaway', amenities: [amenities.wifi, amenities.kitchen, amenities.parking] },
    { id: '13', name: 'Fajara Garden Villa', price: 2400, imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500', location: 'fajara', description: 'Spacious villa with manicured gardens', amenities: [amenities.garden, amenities.pool, amenities.security, amenities.parking] },
    { id: '14', name: 'Brufut Nature Retreat', price: 1100, imageUrl: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=500', location: 'brufut', description: 'Peaceful retreat surrounded by nature', amenities: [amenities.garden, amenities.wifi, amenities.kitchen] },
    { id: '15', name: 'Bakau Oceanview Suite', price: 1800, imageUrl: 'https://images.unsplash.com/photo-1445991842772-097fea258e7d?w=500', location: 'bakau', description: 'Elegant suite with ocean panorama', amenities: [amenities.wifi, amenities.pool, amenities.parking] },
    { id: '16', name: 'Banjul Historic Building', price: 650, imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500', location: 'banjul', description: 'Charming period property in historic district', amenities: [amenities.wifi, amenities.kitchen] },
    { id: '17', name: 'Serekunda Market Area Property', price: 900, imageUrl: 'https://images.unsplash.com/photo-1501183007986-e0ae4e55f869?w=500', location: 'serekunda', description: 'Convenient commercial area property', amenities: [amenities.security, amenities.parking] },
    { id: '18', name: 'Kololi Resort Cottage', price: 1900, imageUrl: 'https://images.unsplash.com/photo-1469022563148-aa0dde2a6c1e?w=500', location: 'kololi', description: 'Vacation-style cottage', amenities: [amenities.pool, amenities.wifi, amenities.gym] },
    { id: '19', name: 'Kotu Sunset Apartment', price: 1300, imageUrl: 'https://images.unsplash.com/photo-1494145904049-0dca7b0589b0?w=500', location: 'kotu', description: 'Perfect sunset views from balcony', amenities: [amenities.wifi, amenities.kitchen, amenities.parking] },
    { id: '20', name: 'Fajara Prime Location', price: 2600, imageUrl: 'https://images.unsplash.com/photo-1600607687920-ce2a2ad0992b?w=500', location: 'fajara', description: 'Prime residential address', amenities: [amenities.security, amenities.pool, amenities.parking, amenities.garden] },
    { id: '21', name: 'Brufut Village Home', price: 1050, imageUrl: 'https://images.unsplash.com/photo-1505932794796-20b2e67b4f10?w=500', location: 'brufut', description: 'Traditional village-style living', amenities: [amenities.garden, amenities.kitchen] },
    { id: '22', name: 'Bakau Cliff House', price: 3200, imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500', location: 'bakau', description: 'Spectacular clifftop property', amenities: [amenities.pool, amenities.wifi, amenities.gym, amenities.security] },
    { id: '23', name: 'Banjul Port Area', price: 550, imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500', location: 'banjul', description: 'Investment opportunity near port', amenities: [amenities.security, amenities.parking] },
    { id: '24', name: 'Serekunda Shopping District', price: 1100, imageUrl: 'https://images.unsplash.com/photo-1496380190283-c5ae1566a5e2?w=500', location: 'serekunda', description: 'Commercial property in bustling area', amenities: [amenities.parking, amenities.security] },
    { id: '25', name: 'Kololi Water Sports', price: 2700, imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500', location: 'kololi', description: 'Property with water sports facilities', amenities: [amenities.pool, amenities.wifi, amenities.gym, amenities.parking] },
    { id: '26', name: 'Kotu Riverside', price: 1450, imageUrl: 'https://images.unsplash.com/photo-1505932794796-20b2e67b4f10?w=500', location: 'kotu', description: 'Serene riverside location', amenities: [amenities.garden, amenities.wifi, amenities.kitchen] },
    { id: '27', name: 'Fajara Sports Community', price: 2300, imageUrl: 'https://images.unsplash.com/photo-1576314787267-41623a16e4a6?w=500', location: 'fajara', description: 'Community with sports facilities', amenities: [amenities.gym, amenities.pool, amenities.parking, amenities.security] },
    { id: '28', name: 'Brufut Adventure Lodge', price: 1250, imageUrl: 'https://images.unsplash.com/photo-1509142551153-382950a52aca?w=500', location: 'brufut', description: 'Adventure-focused accommodation', amenities: [amenities.wifi, amenities.garden, amenities.kitchen] },
    { id: '29', name: 'Bakau Diplomat Area', price: 2900, imageUrl: 'https://images.unsplash.com/photo-1502301103665-fcf4d16470e4?w=500', location: 'bakau', description: 'Exclusive diplomat residential area', amenities: [amenities.security, amenities.pool, amenities.parking, amenities.gym] },
    { id: '30', name: 'Banjul Waterfront', price: 1050, imageUrl: 'https://images.unsplash.com/photo-1496376028528-afb2dc565406?w=500', location: 'banjul', description: 'Waterfront property with character', amenities: [amenities.wifi, amenities.parking] },
    { id: '31', name: 'Serekunda East', price: 850, imageUrl: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=500', location: 'serekunda', description: 'Residential area in east Serekunda', amenities: [amenities.kitchen, amenities.garden] },
    { id: '32', name: 'Kololi North Beach', price: 2200, imageUrl: 'https://images.unsplash.com/photo-1466890920769-ec53f35b3371?w=500', location: 'kololi', description: 'North beach premium location', amenities: [amenities.wifi, amenities.pool, amenities.security] },
    { id: '33', name: 'Kotu Gardens', price: 1550, imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500', location: 'kotu', description: 'Property in exclusive gardens area', amenities: [amenities.garden, amenities.pool, amenities.wifi] },
    { id: '34', name: 'Fajara Development', price: 2100, imageUrl: 'https://images.unsplash.com/photo-1504581753585-e4a2ad82c9d3?w=500', location: 'fajara', description: 'Modern development property', amenities: [amenities.security, amenities.parking, amenities.wifi] },
    { id: '35', name: 'Brufut West Estate', price: 1350, imageUrl: 'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=500', location: 'brufut', description: 'Estate living opportunity', amenities: [amenities.garden, amenities.security, amenities.parking] },
    { id: '36', name: 'Bakau South Bay', price: 2750, imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500', location: 'bakau', description: 'South bay luxury living', amenities: [amenities.pool, amenities.gym, amenities.wifi, amenities.parking] },
    { id: '37', name: 'Banjul South', price: 725, imageUrl: 'https://images.unsplash.com/photo-1491145849519-75cda59b63e9?w=500', location: 'banjul', description: 'South Banjul residential', amenities: [amenities.kitchen, amenities.wifi] },
    { id: '38', name: 'Serekunda West', price: 950, imageUrl: 'https://images.unsplash.com/photo-1475725846525-817606f82d08?w=500', location: 'serekunda', description: 'West side community property', amenities: [amenities.parking, amenities.security] },
    { id: '39', name: 'Kololi Central', price: 1850, imageUrl: 'https://images.unsplash.com/photo-1502301103665-fcf4d16470e4?w=500', location: 'kololi', description: 'Central Kololi location', amenities: [amenities.wifi, amenities.pool, amenities.parking] },
    { id: '40', name: 'Kotu West Point', price: 1700, imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500', location: 'kotu', description: 'West point beachfront', amenities: [amenities.pool, amenities.kitchen, amenities.wifi] },
    { id: '41', name: 'Fajara Heights', price: 2500, imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500', location: 'fajara', description: 'Elevated location with views', amenities: [amenities.security, amenities.pool, amenities.gym] },
    { id: '42', name: 'Brufut East', price: 1150, imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500', location: 'brufut', description: 'East side family property', amenities: [amenities.garden, amenities.kitchen, amenities.wifi] },
//     { id: '43', name: 'Bakau Marina', price: 3100, imageUrl: 'https://images.unsplash.com/photo-1470165301906-8f7d0d4e6f89?w=500', location: 'bakau', description: 'Marina access property', amenities: [amenities.wifi, amenities.security, amenities.parking, amenities.pool] },
//     { id: '44', name: 'Banjul North', price: 600, imageUrl: 'https://images.unsplash.com/photo-1502301103665-fcf4d16470e4?w=500', location: 'banjul', description: 'North Banjul location', amenities: [amenities.wifi, amenities.kitchen] },
//     { id: '45', name: 'Serekunda North', price: 1050, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9b466afb86d2?w=500', location: 'serekunda', description: 'North Serekunda residential', amenities: [amenities.parking, amenities.kitchen] },
//     { id: '46', name: 'Kololi South', price: 2050, imageUrl: 'https://images.unsplash.com/photo-1491450971868-88aa1486179a?w=500', location: 'kololi', description: 'South Kololi premium area', amenities: [amenities.pool, amenities.wifi, amenities.gym] },
//     { id: '47', name: 'Kotu East', price: 1400, imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500', location: 'kotu', description: 'East Kotu neighborhood', amenities: [amenities.wifi, amenities.kitchen, amenities.parking] },
//     { id: '48', name: 'Fajara West', price: 2350, imageUrl: 'https://images.unsplash.com/photo-1494941480721-04e9470ca6d2?w=500', location: 'fajara', description: 'West Fajara development', amenities: [amenities.security, amenities.parking, amenities.garden] },
//     { id: '49', name: 'Brufut South', price: 1200, imageUrl: 'https://images.unsplash.com/photo-1495336492740-4e919a902926?w=500', location: 'brufut', description: 'South Brufut village', amenities: [amenities.garden, amenities.wifi] },
//     { id: '50', name: 'Bakau East Bay', price: 2600, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', location: 'bakau', description: 'East bay luxury estate', amenities: [amenities.pool, amenities.security, amenities.parking, amenities.gym] },
//     { id: '51', name: 'Banjul East', price: 680, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', location: 'banjul', description: 'East Banjul residence', amenities: [amenities.kitchen, amenities.wifi] },
//     { id: '52', name: 'Serekunda South', price: 1100, imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500', location: 'serekunda', description: 'South Serekunda district', amenities: [amenities.parking, amenities.security] },
//     { id: '53', name: 'Kololi East', price: 1950, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500', location: 'kololi', description: 'East Kololi apartment', amenities: [amenities.wifi, amenities.pool, amenities.parking] },
//     { id: '54', name: 'Kotu North', price: 1650, imageUrl: 'https://images.unsplash.com/photo-1479627346242-540078abb8d0?w=500', location: 'kotu', description: 'North Kotu beachfront', amenities: [amenities.pool, amenities.wifi, amenities.kitchen] },
//     { id: '55', name: 'Fajara East', price: 2450, imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500', location: 'fajara', description: 'East Fajara prime location', amenities: [amenities.security, amenities.parking, amenities.garden] },
//     { id: '56', name: 'Brufut North', price: 1300, imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb42a5a29f?w=500', location: 'brufut', description: 'North Brufut estate', amenities: [amenities.garden, amenities.wifi, amenities.kitchen] },
//     { id: '57', name: 'Bakau West', price: 2400, imageUrl: 'https://images.unsplash.com/photo-1494145904049-0dca7b0589b0?w=500', location: 'bakau', description: 'West Bakau residential', amenities: [amenities.pool, amenities.security, amenities.parking] },
//     { id: '58', name: 'Banjul West', price: 620, imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500', location: 'banjul', description: 'West Banjul accommodation', amenities: [amenities.wifi, amenities.kitchen] },
//     { id: '59', name: 'Serekunda Central', price: 1200, imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500', location: 'serekunda', description: 'Central Serekunda hub', amenities: [amenities.parking, amenities.security] },
//     { id: '60', name: 'Kololi West', price: 2150, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500', location: 'kololi', description: 'West Kololi resort area', amenities: [amenities.pool, amenities.gym, amenities.wifi] },
//     { id: '61', name: 'Kotu South', price: 1500, imageUrl: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=500', location: 'kotu', description: 'South Kotu village', amenities: [amenities.wifi, amenities.kitchen, amenities.parking] },
//     { id: '62', name: 'Fajara North', price: 2550, imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500', location: 'fajara', description: 'North Fajara luxury community', amenities: [amenities.security, amenities.pool, amenities.parking] },
//     { id: '63', name: 'Brufut Central', price: 1100, imageUrl: 'https://images.unsplash.com/photo-1495643811223-4d98c6e9c869?w=500', location: 'brufut', description: 'Central Brufut location', amenities: [amenities.garden, amenities.kitchen, amenities.wifi] },
//     { id: '64', name: 'Bakau North', price: 2800, imageUrl: 'https://images.unsplash.com/photo-1506795778202-cad84cf45f1d?w=500', location: 'bakau', description: 'North Bakau beachfront', amenities: [amenities.pool, amenities.security, amenities.gym] },
//     { id: '65', name: 'Banjul Central', price: 750, imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500', location: 'banjul', description: 'Central business district', amenities: [amenities.wifi, amenities.parking] },
//     { id: '66', name: 'Serekunda East', price: 950, imageUrl: 'https://images.unsplash.com/photo-1496381789815-9f0d95294f4a?w=500', location: 'serekunda', description: 'East Serekunda neighborhood', amenities: [amenities.kitchen, amenities.parking] },
//     { id: '67', name: 'Kololi North', price: 2300, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500', location: 'kololi', description: 'North Kololi premium resort', amenities: [amenities.pool, amenities.wifi, amenities.gym] },
//     { id: '68', name: 'Kotu West', price: 1600, imageUrl: 'https://images.unsplash.com/photo-1479627346242-540078abb8d0?w=500', location: 'kotu', description: 'West Kotu area', amenities: [amenities.wifi, amenities.kitchen, amenities.pool] },
//     { id: '69', name: 'Fajara South', price: 2200, imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500', location: 'fajara', description: 'South Fajara residential', amenities: [amenities.security, amenities.parking, amenities.garden] },
//     { id: '70', name: 'Brufut West', price: 1250, imageUrl: 'https://images.unsplash.com/photo-1507305248933-483ad74fdf66?w=500', location: 'brufut', description: 'West Brufut cottage', amenities: [amenities.garden, amenities.wifi, amenities.kitchen] },
//     { id: '71', name: 'Bakau Center', price: 2350, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', location: 'bakau', description: 'Bakau city center apartment', amenities: [amenities.pool, amenities.parking, amenities.security] },
//     { id: '72', name: 'Banjul Harbor', price: 680, imageUrl: 'https://images.unsplash.com/photo-1496376028528-afb2dc565406?w=500', location: 'banjul', description: 'Harbor view property', amenities: [amenities.wifi, amenities.kitchen] },
//     { id: '73', name: 'Serekunda Premium', price: 1350, imageUrl: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=500', location: 'serekunda', description: 'Premium Serekunda property', amenities: [amenities.parking, amenities.security] },
//     { id: '74', name: 'Kololi Exclusive', price: 2650, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500', location: 'kololi', description: 'Exclusive Kololi estate', amenities: [amenities.pool, amenities.wifi, amenities.gym, amenities.security] },
//     { id: '75', name: 'Kotu Paradise', price: 1750, imageUrl: 'https://images.unsplash.com/photo-1506378087529-37173fdabe84?w=500', location: 'kotu', description: 'Paradise living in Kotu', amenities: [amenities.pool, amenities.kitchen, amenities.wifi, amenities.parking] },
]

export class DataLoader {
    async getListings(access_token: string, queries: string[] | Record<string, any> = []): Promise<Listing[]> {
       try {
        // Convert queries array to object if needed
        const params = Array.isArray(queries) ? {} : queries
        const response = await Api.get('/properties/', {
          params,
          headers: { Authorization: `Token ${access_token}` }
        })
        return response.data as Listing[]
       } catch (e) {
           console.error('Error fetching listings:', e)
           return [] as Listing[]
       }
    }

      

    getLocationCategories(limit=10): LocationCategory[] {
        return locationCategories.slice(0, limit);
    }
    async getAmenities(access_token: string): Promise<Amenity[]> {
        try{
            const response = await Api.get('/amenities/',{headers: {'Authorization': `Token ${access_token}`}})
            console.log('response of amenities',response)
            const amn = response.data as {id: number, name: string, description: string}[]
            const amn_list = []

            for(let i=0;i < amn.length;i++){
                amn_list.push({...amenities[amn[i].name],id:amn[i].id.toString()})
            }

            return amn_list

        }catch(e){
            console.log(e)
            return [] as Amenity[]
           
        }

        // return amenities;
    }

    async getListingById(id: string,access_token: string) {
        const response = await Api.get(`/properties/?id=${id}`,{headers: {'Authorization': `Token ${access_token}`}})
        console.log('single property')
        return response.data[0]
    }

    getLocationCategoryById(id: string): LocationCategory | undefined {
        return locationCategories.find(category => category.id === id);
    }

    getAmenityById(id: string): Amenity | undefined {
        return amenities[id];
    }

    getListingsByLocation(location: string,limit=10): Listing[] {
        return listings.filter(listing => listing.location === location).slice(0,limit);
    }

    getListingsByAmenity(amenity: string): Listing[] {
        return listings.filter(listing => listing.amenities.includes(amenities[amenity]));
    }
}
import { Image } from '@heroui/image'
import Link from 'next/link'
import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

const Logo = ({ width = 150, height = 70, className = "" }: LogoProps) => {
  return (
    <Link href={'/'} className={className}>
      <Image
        src={'/rent_ease.png'}
        width={width}
        height={height}
        alt={'RentEase Logo'}
        className='object-contain'
      />
    </Link>
  )
}

export const LogoIcon = ({ size = 50, className = "" }: { size?: number, className?: string }) => {
  return (
    <Link href={'/'} className={className}>
      <Image
        src={'/rent_ease_icon.png'}
        width={size}
        height={size}
        alt={'RentEase Icon'}
        className='object-contain'
      />
    </Link>
  )
}

export default Logo
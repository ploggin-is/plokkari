'use client'
import Image from 'next/image'
import Link from 'next/link'

import { Statistics } from '../(Statistics)/Statistics'

import './style.css'

type Props = {
  menuOpen: boolean
  toggleMenu: () => void
}

type ImageType = {
  src: string
  alt: string
}

export const MenuToolbar = ({ menuOpen, toggleMenu }: Props) => {
  const imageWidth = 30
  const imageHeight = 30

  const navItems: Array<{
    href: string
    label: string
    image: ImageType
    externalLink?: boolean
    modifier?: string
    // TODO: remove hideNavItem when ready
    hideNavItem?: boolean
  }> = [
    {
      href: 'https://www.ploggin.is',
      externalLink: true,
      label: 'About us',
      image: {
        src: 'about',
        alt: 'home icon',
      },
    },
    {
      href: '/',
      label: 'Home',
      image: {
        src: 'home',
        alt: 'home icon',
      },
      hideNavItem: true,
    },
    {
      href: '/events',
      label: 'Events',
      image: {
        src: 'events',
        alt: 'events icon',
      },
      hideNavItem: true,
    },
    {
      href: '/statistics',
      label: 'Statistics',
      image: {
        src: 'statistics',
        alt: 'statistics icon',
      },
      hideNavItem: true,
    },
    {
      href: '/settings',
      label: 'Settings',
      image: {
        src: 'settings',
        alt: 'settings icon',
      },
      modifier: 'settings',
      hideNavItem: true,
    },
  ]

  return (
    <div className={`menutoolbar ${menuOpen ? 'open' : ''}`}>
      <h1>Menu</h1>
      <button className="close-button" onClick={toggleMenu}>
        x
      </button>
      <ul>
        {navItems.map((item) => (
          <li
            key={item.href}
            className={item.modifier ? 'settings-button' : ''}
          >
            <Link
              href={item.href}
              target={item.externalLink ? '_blank' : '_self'}
              rel="noopener noreferrer"
              passHref
              style={{ display: item.hideNavItem ? 'none' : 'block' }}
            >
              <Image
                src={`/(icons)/${item.image.src}.svg`}
                alt={item.image.alt}
                width={imageWidth}
                height={imageHeight}
              />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Statistics />
      <div style={{ position: 'absolute', bottom: '65px', left: '50px' }}>
        <Image
          alt="logo"
          src="/RU_logo.png"
          width={200}
          height={200}
          priority
        />
      </div>
      <div className="contact-card">
        <h2>
          Contact:{' '}
          <span style={{ color: 'green', fontStyle: 'italic' }}>
            {' '}
            hello@ploggin.is
          </span>
        </h2>
      </div>
    </div>
  )
}

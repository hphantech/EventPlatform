'use client'

import Image from 'next/image'
import Link from "next/link";
import posthog from "posthog-js";

const NavBar = () => {
  const handleNavClick = (linkName: string) => {
    posthog.capture(`${linkName}_navigation_clicked`, {
      nav_item: linkName,
      location: 'header',
    });
  };

  const handleLogoClick = () => {
    posthog.capture('logo_clicked', {
      location: 'header',
    });
  };

  return (
    <header>
        <nav>
            <Link href='/' className='logo' onClick={handleLogoClick}>
            <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
            <p>DevEvent</p>
            </Link>

            <ul>
                <Link href='/' onClick={() => handleNavClick('home')}>Home</Link>
                <Link href='/events' onClick={() => handleNavClick('events')}>Explore Events</Link>
            </ul>
        </nav>
    </header>
  )
}

export default NavBar
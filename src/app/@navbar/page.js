'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import './nav.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state - for styling
      if (currentScrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // Scrolling down & past navbar height
        setVisible(false);
      } else {
        // Scrolling up or at the top
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${!visible ? ' hidden' : ''}`}>
      <div className="navbar-container">
        <Link href="/" className="logo">JEE</Link>
        <ul className="nav-menu">
          <li><Link href="/possiblebranform" className="nav-link">IIT Branch Finder</Link></li>
          <li><Link href="/contactus" className="nav-link">Contact Us</Link></li>
        </ul>
      </div>
    </nav>
  );
}
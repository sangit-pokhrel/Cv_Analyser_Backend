import React from 'react';
import type { Metadata } from 'next';
import Homepage_component from '@/components/Homepage_component';
export const metadata:Metadata = {
  
    title: "Home | Career Sync",
  description: "Welcome to Career Sync, your ultimate companion for crafting the perfect CV and landing your dream job. Explore our tools and services designed to enhance your career journey.",
  icons:"/globe.svg",
  
}
const Homepage = () => {
  return (
    <Homepage_component />
 
  );
}

export default Homepage;
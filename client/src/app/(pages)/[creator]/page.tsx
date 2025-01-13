"use client"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Creator = () => {
  const { creator } = useParams(); // Destructures the 'creator' param from the route
  const router = useRouter(); // Access the Next.js router

  useEffect(() => {
    // Automatically navigate to 'creator/book' when the component mounts
    router.push(`/${creator}/book`);
  }, [router]);

  return (
    <div></div>
  );
};

export default Creator;

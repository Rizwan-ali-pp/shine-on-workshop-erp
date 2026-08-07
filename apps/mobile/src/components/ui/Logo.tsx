import React from "react";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`} style={{ width: '220px', height: '180px' }}>
      <Image 
        src="/logo.jpg" 
        alt="Shine On Car Wash Logo"
        fill
        className="object-contain mix-blend-screen"
        priority
      />
    </div>
  );
}

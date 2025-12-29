"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on the CreateAgent page
  if (pathname && pathname.toLowerCase().startsWith("/createagent")) {
    return null;
  }

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center fixed top-0 bg-white shadow z-50">
      <div className="text-xl font-bold text-indigo-600">YourLogo</div>
      <div className="space-x-6">
        <a href="#features" className="text-gray-700 hover:text-indigo-600">
          Features
        </a>
        <a href="#" className="text-gray-700 hover:text-indigo-600">
          Pricing
        </a>
        <Link href="/" className="text-gray-700 hover:text-indigo-600">
          Login
        </Link>
      </div>
    </nav>
  );
}

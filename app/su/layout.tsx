import Link from "next/link";
import { ReactNode } from "react";

export default function SULayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/su" className="flex items-center cursor-pointer">
              <span className="text-white text-xl font-bold">Staff Party Dashboard</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-8">
              <Link
                href="/su/users"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Users
              </Link>
              <Link
                href="/su/agendas"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Agendas
              </Link>
              <Link
                href="/su/events"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Events
              </Link>
              <Link
                href="/su/gift-exchange"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Gift Exchange
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

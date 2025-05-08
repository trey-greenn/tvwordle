import React, { useState } from 'react'
import Link from 'next/link'

const websites = ["mlbwordle.com", "historywordle.com", "businesswordle.com", "tvwordle.com", "ufcwordle.com", "celebwordle.com"]

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-md w-full">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-xl">
              TVWordle
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="text-white hover:bg-white/10 px-3 py-2 rounded-md">
                Home
              </Link>
              
              <div className="relative group">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md inline-flex items-center transition-colors duration-200"
                >
                  <span className="font-medium">Play</span>
                  <svg 
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl bg-gradient-to-b from-white to-gray-50 ring-1 ring-purple-100 z-10 overflow-hidden transform origin-top scale-100 transition-all duration-200">
                    <div className="py-2" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 text-xs font-semibold text-purple-600 uppercase tracking-wider border-b border-gray-100">
                        Our Wordle Games
                      </div>
                      {websites.map((site, index) => (
                        <a
                          key={site}
                          href={`https://${site}`}
                          className={`flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-colors duration-150 ${index !== websites.length - 1 ? 'border-b border-gray-100' : ''}`}
                          role="menuitem"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="w-8 h-8 flex items-center justify-center mr-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-bold">
                            {site.replace('wordle.com', '').charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium">{site.replace('wordle.com', '')}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/leaderboard" className="text-white hover:bg-white/10 px-3 py-2 rounded-md">
                Leaderboard
              </Link>
              
              <Link href="/about" className="text-white hover:bg-white/10 px-3 py-2 rounded-md">
                About
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white p-2"
              title='button'
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-16 right-0 left-0 bg-white shadow-md z-10">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    Home
                  </Link>
                  
                  <div className="block px-3 py-2 text-base font-medium text-gray-700">
                    <div className="font-medium mb-1">Play</div>
                    <div className="pl-4 space-y-1">
                      {websites.map((site) => (
                        <a
                          key={site}
                          href={`https://${site}`}
                          className="block py-1 text-sm text-gray-600 hover:text-gray-800"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {site.replace('wordle.com', '')}
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <Link href="/leaderboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    Leaderboard
                  </Link>
                  
                  <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    About
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

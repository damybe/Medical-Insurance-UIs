"use client";

import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WEfwfLcIgs5EzDBYL9dFfdyy9hawpL.png" 
          alt="Forte" 
          className="h-8 w-auto"
        />
        <span className="text-gray-400">|</span>
        <span className="text-gray-600 text-sm">Medical Insurance · Quick Quote</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
          Start over
        </button>
        <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">
          Need help?
        </button>
      </div>
    </header>
  );
}

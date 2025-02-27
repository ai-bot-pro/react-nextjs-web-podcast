"use client";

import { Mic, Rss, Search, Github, Apple } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Mic className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              AI Podcast
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search Podcasts..."
                className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div> */}
            <div className="relative">
              <a
                href="https://github.com/ai-bot-pro/react-nextjs-web-podcast"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
            <div className="relative">
              <a
                href="https://podcasts.apple.com/us/podcast/ai-podcast/id1798858172"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Apple className="h-5 w-5" />
                <span>Apple Podcast</span>
              </a>
            </div>
            <div className="relative">
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Rss className="h-5 w-5" />
                <span>Subscribe</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

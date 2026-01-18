'use client'

import { useState } from 'react'
import VideoGenerator from './components/VideoGenerator'
import VideoHistory from './components/VideoHistory'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleVideoGenerated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Faceless Video Generator
          </h1>
          <p className="text-xl text-gray-300">
            Create viral YouTube videos automatically with AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <VideoGenerator onVideoGenerated={handleVideoGenerated} />
          <VideoHistory key={refreshKey} />
        </div>

        <div className="mt-12 card">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Choose Topic</h3>
              <p className="text-gray-400 text-sm">Select a niche and provide a topic for your video</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">AI Generation</h3>
              <p className="text-gray-400 text-sm">AI creates script, voiceover, and visual scenes</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Download & Upload</h3>
              <p className="text-gray-400 text-sm">Get your video ready for YouTube upload</p>
            </div>
          </div>
        </div>

        <div className="mt-8 card">
          <h2 className="text-2xl font-bold mb-4">Popular Niches</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Mystery & Facts', 'Life Hacks', 'Motivational', 'Tech Reviews', 'History Stories', 'Science Facts', 'Top 10 Lists', 'True Crime'].map((niche) => (
              <div key={niche} className="bg-gray-700/50 rounded-lg px-4 py-3 text-center hover:bg-gray-700 transition-colors cursor-pointer">
                {niche}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

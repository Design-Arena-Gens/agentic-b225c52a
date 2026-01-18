'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Video {
  id: string
  topic: string
  niche: string
  timestamp: string
  script: string
  images: string[]
  audioUrl?: string
}

export default function VideoHistory() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Generated Videos</h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Generated Videos</h2>

      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p>No videos generated yet</p>
          <p className="text-sm mt-2">Start by creating your first video!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{video.topic}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span className="bg-purple-600/30 px-2 py-1 rounded">{video.niche}</span>
                    <span>{format(new Date(video.timestamp), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(video.id)}
                  className="text-purple-400 hover:text-purple-300 ml-2"
                >
                  {expandedId === video.id ? '▼' : '▶'}
                </button>
              </div>

              {expandedId === video.id && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-gray-300">Script:</h4>
                    <p className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded">{video.script}</p>
                  </div>

                  {video.images && video.images.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-300">Generated Images:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {video.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Scene ${idx + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {video.audioUrl && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-300">Audio:</h4>
                      <audio controls className="w-full">
                        <source src={video.audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

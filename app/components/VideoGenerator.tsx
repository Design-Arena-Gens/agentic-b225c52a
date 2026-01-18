'use client'

import { useState } from 'react'

interface VideoGeneratorProps {
  onVideoGenerated: () => void
}

export default function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('mystery')
  const [duration, setDuration] = useState('60')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic')
      return
    }

    setIsGenerating(true)
    setError('')
    setProgress('Initializing video generation...')

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, niche, duration }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setProgress('Video generated successfully!')
                onVideoGenerated()
                setTimeout(() => {
                  setProgress('')
                  setTopic('')
                }, 2000)
              } else {
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.progress) {
                    setProgress(parsed.progress)
                  }
                  if (parsed.error) {
                    setError(parsed.error)
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate video')
      setProgress('')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Generate New Video</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Niche</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="input-field"
            disabled={isGenerating}
          >
            <option value="mystery">Mystery & Facts</option>
            <option value="lifehacks">Life Hacks</option>
            <option value="motivational">Motivational</option>
            <option value="tech">Tech Reviews</option>
            <option value="history">History Stories</option>
            <option value="science">Science Facts</option>
            <option value="top10">Top 10 Lists</option>
            <option value="truecrime">True Crime</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video Topic</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 10 Mysterious Places That Scientists Can't Explain"
            className="input-field min-h-[100px]"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-field"
            disabled={isGenerating}
          >
            <option value="30">30 seconds (Short)</option>
            <option value="60">60 seconds (Standard)</option>
            <option value="90">90 seconds (Extended)</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {progress && (
          <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
              <span>{progress}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="btn-primary w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>
    </div>
  )
}

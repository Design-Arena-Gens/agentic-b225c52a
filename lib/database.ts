interface VideoData {
  id: string
  topic: string
  niche: string
  timestamp: string
  script: string
  images: string[]
  audioUrl?: string
}

export let videoDatabase: VideoData[] = []

export function addVideo(video: VideoData) {
  videoDatabase.unshift(video)
  if (videoDatabase.length > 50) {
    videoDatabase = videoDatabase.slice(0, 50)
  }
}

export function getVideos(): VideoData[] {
  return videoDatabase
}

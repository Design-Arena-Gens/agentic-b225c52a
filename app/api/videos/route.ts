import { NextResponse } from 'next/server'
import { getVideos } from '@/lib/database'

export async function GET() {
  return NextResponse.json({ videos: getVideos() })
}

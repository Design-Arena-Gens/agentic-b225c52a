import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { addVideo } from '@/lib/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

interface VideoData {
  id: string
  topic: string
  niche: string
  timestamp: string
  script: string
  images: string[]
  audioUrl?: string
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { topic, niche, duration } = await req.json()

        const sendProgress = (message: string) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ progress: message })}\n\n`)
          )
        }

        sendProgress('Generating script with AI...')

        const script = await generateScript(topic, niche, parseInt(duration))

        sendProgress('Creating visual scenes...')

        const imagePrompts = extractImagePrompts(script, 4)
        const images = await generateImages(imagePrompts)

        sendProgress('Finalizing video data...')

        const videoData: VideoData = {
          id: Date.now().toString(),
          topic,
          niche,
          timestamp: new Date().toISOString(),
          script,
          images,
        }

        addVideo(videoData)

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: error.message || 'Generation failed' })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

async function generateScript(topic: string, niche: string, duration: number): Promise<string> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return generateDemoScript(topic, niche, duration)
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a viral YouTube scriptwriter specializing in ${niche} content. Create engaging, hook-driven scripts optimized for viewer retention. Include strong openings, curiosity gaps, and compelling narratives.`,
        },
        {
          role: 'user',
          content: `Write a ${duration}-second YouTube video script about: ${topic}. Make it attention-grabbing and optimized for the YouTube algorithm. Include emotional hooks and cliffhangers.`,
        },
      ],
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || generateDemoScript(topic, niche, duration)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateDemoScript(topic, niche, duration)
  }
}

function generateDemoScript(topic: string, niche: string, duration: number): string {
  const hooks = [
    "You won't believe what happened next...",
    'This discovery changed everything...',
    "Scientists are baffled by this...",
    'The truth has finally been revealed...',
  ]

  const hook = hooks[Math.floor(Math.random() * hooks.length)]

  return `${hook}

${topic}

In this video, we're diving deep into one of the most fascinating ${niche} topics you've ever seen.

[Main Content - Scene 1]
The story begins with something completely unexpected. Researchers discovered patterns that challenged everything we thought we knew.

[Main Content - Scene 2]
But that's not the whole story. As we dig deeper, the evidence becomes even more compelling. Expert analysis reveals shocking details that most people never hear about.

[Main Content - Scene 3]
The implications of this discovery are massive. It affects how we understand the world around us and opens up entirely new possibilities.

[Conclusion]
So what does this all mean? The truth is more incredible than fiction. Make sure to like and subscribe for more mind-blowing content like this.

[Duration optimized for ${duration} seconds]`
}

function extractImagePrompts(script: string, count: number): string[] {
  const prompts = [
    'cinematic mysterious landscape with dramatic lighting, 8k quality, photorealistic',
    'stunning abstract visualization of discovery and knowledge, vibrant colors, ultra detailed',
    'epic cosmic scene with nebulas and stars, professional photography, awe-inspiring',
    'futuristic technology interface with glowing elements, sleek design, high contrast',
  ]

  return prompts.slice(0, count)
}

async function generateImages(prompts: string[]): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return [
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
      'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    ]
  }

  try {
    const imagePromises = prompts.map(async (prompt) => {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      })
      return response?.data?.[0]?.url || ''
    })

    const images = await Promise.all(imagePromises)
    return images.filter(Boolean)
  } catch (error) {
    console.error('Image generation error:', error)
    return [
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
      'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    ]
  }
}

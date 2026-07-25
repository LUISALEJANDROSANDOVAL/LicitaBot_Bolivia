import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, text, channel } = body

    if (!to || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const zavuUrl = process.env.NEXT_PUBLIC_ZAVU_API_URL || 'https://api.zavu.dev/v1'
    const apiKey = process.env.ZAVU_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Zavu API Key is not configured on server' }, { status: 500 })
    }

    const res = await fetch(`${zavuUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        to,
        text,
        channel: channel || 'telegram'
      })
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Zavu API error' }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Zavu API route error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

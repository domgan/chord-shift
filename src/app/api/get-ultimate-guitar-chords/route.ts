import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { extractChords } from '@/services/ultimate-guitar-service'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const chords = await extractChords(decodeURI(url))
    return NextResponse.json({ chords })
  } catch (error) {
    console.error('Failed to extract chords:', error)
    return NextResponse.json(
      { error: 'Failed to extract chords' },
      { status: 500 }
    )
  }
}

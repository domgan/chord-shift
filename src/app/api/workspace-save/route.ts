import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import FirebaseService from '@/services/firebase-service'

export async function POST(request: NextRequest) {
  try {
    const { id, workspace } = await request.json()

    if (!id || !workspace) {
      return NextResponse.json(
        { error: 'ID and workspace are required' },
        { status: 400 }
      )
    }

    const firebaseService = FirebaseService.getInstance()
    await firebaseService.setWorkspace(id, workspace)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Failed to save workspace:', error)
    return NextResponse.json(
      { error: 'Failed to save workspace' },
      { status: 500 }
    )
  }
}

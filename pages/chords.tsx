import { useEffect, useState } from "react"
import { Chord } from "../components/chord-card"
import Link from "next/link"
import generateUUID from "../features/generate-uuid"
import FirebaseService from "../services/firebase-service"
import { useRouter } from "next/router"
import Spinner from "../components/spinner"
import Notification, { triggerNotification } from "../components/notification"
import ChordsWorkshop from "../components/chords-workshop"
import { BaseContext } from 'next/dist/shared/lib/utils'


export type WorkspaceElement = {
  id: number
  element: WorkshopElement
}

type WorkshopElement = {
  id: number,
  chords: Chord[]
}

type ChordsPageProps = {
  workspace: WorkspaceElement[]
  uniqueId: string | null
}

export default function Chords(props: ChordsPageProps) {
  const [workspace, setWorkspace] = useState<WorkspaceElement[]>([])
  const [uniqueId, setUniqueId] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  useEffect(() => {
    setWorkspace(props.workspace)
    setUniqueId(props.uniqueId)
    setLoading(false)
  }, [props.workspace, props.uniqueId])

  const handleAddChordBuilder = () => {
    const ws = [...workspace]
    const id = Date.now()
    ws.push({ id, element: { id, chords: [] } })
    setWorkspace(ws)
  }

  const getWorkspaceElement = (id: number, element: WorkshopElement) => {
    return <ChordsWorkshop id={id} chords={element.chords} workspace={workspace} setWorkspace={setWorkspace} />
  }

  const handleNew = () => {
    setWorkspace([])
    router.push({ pathname: `/chords` },
      undefined,
      { shallow: true }
    )
    setUniqueId(null)
  }

  const handleReload = () => {
    router.reload()
  }

  const handleSave = async () => {
    if (workspace.length === 0) {
      triggerNotification('You cannot save empty workspace')
      return
    } else {
      const uniqueIdToSave = uniqueId ?? generateUUID()
      const response = await fetch('/api/workspace-save', {
        method: 'POST',
        body: JSON.stringify({ id: uniqueIdToSave, workspace }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      router.push({
          pathname: `/chords`,
          query: { id: uniqueIdToSave }
        },
        `/chords?id=${uniqueIdToSave}`,
        { shallow: true }
      )
      await navigator.clipboard.writeText(uniqueIdToSave)
      setUniqueId(uniqueIdToSave)
    }
  }

  return (
    <main className='main'>
      <div className="absolute grid">
        <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border border-blue-700 rounded text-center" href='/'>Home</Link>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-red-700 rounded" onClick={handleNew}>New</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-yellow-700 rounded" onClick={handleReload}>Reload</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-green-700 rounded" onClick={handleSave}>Save</button>
      </div>
      <div className="max-w-screen-lg p-10 mx-auto">
        {loading ? <Spinner /> :
          <>{workspace.map(ws => getWorkspaceElement(ws.id, ws.element))}
            <button className="btn" onClick={handleAddChordBuilder}>New Builder</button></>
        }
      </div>
      <Notification />
    </main>
  )
}

// This gets called on every request
export async function getServerSideProps(context: BaseContext): Promise<{props: ChordsPageProps}> {
  const firebaseService = FirebaseService.getInstance()
  firebaseService.initializeFirebaseApp()
  const uniqueId = context.query.id
  if (uniqueId) {
    const workspace = await firebaseService.getWorkspace(uniqueId)
    return {
      props: { workspace, uniqueId }
    }
  }
  return { props: { workspace: [], uniqueId: null} }
}

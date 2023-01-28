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
import Head from "next/head"
import getWorkspaceFromUltimateGuitar from "../features/contruct-workspace"
import UltimateInputModal from "../components/ultimate-input-modal"


export type WorkspaceElement = {
  id: number
  element: WorkshopElement
}

export type WorkshopElement = {
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
  const [showUltimateInput, setShowUltimateInput] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    // props.uniqueId && triggerNotification('Workspace loaded successfully')  // todo show not-twice
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
    return <ChordsWorkshop key={id} id={id} chords={element.chords} workspace={workspace} setWorkspace={setWorkspace} />
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
      await navigator.clipboard.writeText(`https://chord-shift.vercel.app/chords?id=${uniqueIdToSave}`)
      triggerNotification('Link to the workspace was saved to your clipboard')
      setUniqueId(uniqueIdToSave)
    }
  }

  const loadFromUltimateGuitar = async (ultimateUrl: string) => {
    handleNew()
    try {
      const response = await fetch(`/api/get-ultimate-guitar-chords?url=${encodeURI(ultimateUrl!)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const ultimateChords = (await response.json()).chords;
      setWorkspace(getWorkspaceFromUltimateGuitar(ultimateChords));
    } catch (error) {
      triggerNotification('An error occurred while loading chords from Ultimate Guitar.')
    }
  };


  return (
    <main className='main overflow-auto'>
      <Head><title>| chord-shift |</title></Head>
      <div className="absolute grid ">
        <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border border-blue-700 rounded text-center" href='/'>Home</Link>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-red-700 rounded" onClick={handleNew}>New</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-yellow-700 rounded" onClick={() => setShowUltimateInput(true)}>Load</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-yellow-700 rounded" onClick={handleReload}>Reload</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-green-700 rounded" onClick={handleSave}>Save</button>
      </div>
      <div className="max-w-screen-lg p-10 mx-auto">
        {loading ? <Spinner /> :
          <>
            {workspace.map(ws => getWorkspaceElement(ws.id, ws.element))}
            <button className="btn" onClick={handleAddChordBuilder}>New Builder</button>
          </>
        }
      </div>
      {showUltimateInput && <UltimateInputModal loadFromUltimateGuitar={loadFromUltimateGuitar} setShowUltimateInput={setShowUltimateInput} />}
      <Notification />
    </main>
  )
}

// This gets called on every request
export async function getServerSideProps(context: BaseContext): Promise<{ props: ChordsPageProps }> {
  const firebaseService = FirebaseService.getInstance()
  firebaseService.initializeFirebaseApp()
  const uniqueId = context.query.id
  if (uniqueId) {
    const workspace = await firebaseService.getWorkspace(uniqueId)
    return {
      props: { workspace, uniqueId }
    }
  }
  return { props: { workspace: [], uniqueId: null } }
}

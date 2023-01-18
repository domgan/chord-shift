import { useEffect, useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord-card"
import Link from "next/link"
import Image from 'next/image'
import generateUUID from "../features/generate-uuid"
import FirebaseService from "../services/firebase-service"
import { useRouter } from "next/router"
import Spinner from "../components/spinner"


export type WorkspaceElement = {
  id: number
  element: ChordsWorkshopProps
}

type ChordsWorkshopProps = {
  id: number
  chords: Chord[]
}

const firebaseService = new FirebaseService()  // inside or outside default component?

export default function Chords() {
  const [workspace, setWorkspace] = useState<WorkspaceElement[]>([])
  const [uniqueId, setUniqueId] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  const fetchWorkspace = async (linkId: string) => {
    const workspaceFromFirebase = await firebaseService.getWorkspace(linkId)
    setWorkspace(workspaceFromFirebase)
  }

  useEffect(() => {
    if (router.isReady) {
      const uniqueIdFromQuery = router.query.id?.toString()
      uniqueIdFromQuery && fetchWorkspace(uniqueIdFromQuery)
      setUniqueId(uniqueIdFromQuery)
      setLoading(false)
    }
  }, [router.isReady])

  const ChordsWorkshop = (props: ChordsWorkshopProps) => {
    const [chords, setChords] = useState<Chord[]>(props.chords)
    const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

    const handleDelete = () => {
      setWorkspace(workspace.filter(ws => ws.id !== props.id))
      // workspace.splice(0, workspace.length, ...workspace.filter(ws => ws.id !== id))
    }

    return (
      <div className="p-5">
        {showChordBuilder && <ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />}
        <div className='relative grid grid-flow-row grid-cols-8 gap-4 p-4 rounded-md shadow-md bg-indigo-800'>
          <div className="absolute top-0 left-0 text-xs text-red-500 font-bold">This is a watermark</div>
          {chords.map(chord => <ChordCard chord={chord} chords={chords} setChords={setChords} />)}
          <div className="relative rounded-full flex items-center justify-center">
            <button onClick={() => setShowChordBuilder(true)}
              className='bg-green-500 text-white rounded-full h-12 w-12 text-center text-xl hover:bg-green-600 focus:outline-none grid place-items-center'>
              <Image src='/plus.svg' alt='plus' width={40} height={40} />
            </button>
          </div>
          <button onClick={handleDelete} className='absolute top-0 right-0 rounded-full bg-white hover:bg-red-500 h-10 w-10 focus:outline-none grid place-items-center'>
            <Image alt='close' width={24} height={24} src='/close.svg' />
          </button>
        </div>
      </div >
    )
  }

  const handleAddChordBuilder = () => {
    const ws = [...workspace]
    const id = Date.now()
    ws.push({ id, element: { id, chords: [] } })
    setWorkspace(ws)
  }

  const getWorkspaceElement = (id: number, element: ChordsWorkshopProps) => {
    return <ChordsWorkshop id={id} chords={element.chords} />
  }

  const handleNew = () => {
    setWorkspace([])
    router.push({ pathname: `/chords`, },
      undefined,
      { shallow: true }
    )
    setUniqueId(undefined)
  }

  const handleReload = () => {
    router.reload()
  }

  const handleSave = () => {
    const uniqueIdToSave = uniqueId ?? generateUUID()
    firebaseService.setWorkspace(uniqueIdToSave, workspace)
    router.push({
      pathname: `/chords`,
      query: { id: uniqueIdToSave }
    },
      `/chords?id=${uniqueIdToSave}`,
      { shallow: true }
    )
    setUniqueId(uniqueIdToSave)
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
        {loading ? <Spinner /> : <>
          {workspace.map(ws => getWorkspaceElement(ws.id, ws.element))}
          <button className="btn" onClick={handleAddChordBuilder}>New Builder</button>
        </>}
      </div>
    </main>
  )
}
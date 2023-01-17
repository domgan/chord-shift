import { useEffect, useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord-card"
import Link from "next/link"
import Image from 'next/image'
import generateUUID from "../features/generate-uuid"
import FirebaseService from "../services/firebase-service"
import { useRouter } from "next/router"


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

  const handleClear = () => {
    setWorkspace([])
  }

  const handleReload = () => {
    router.reload()
  }

  const handleSave = () => {
    const uniqueIdToSave = uniqueId ?? generateUUID()
    firebaseService.setWorkspace(uniqueIdToSave, workspace)
    setUniqueId(uniqueIdToSave)
    // todo set url to new uniqueId
  }

  const Spinner = () => {
    return (
      <div role="status">
        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return (
    <main className='main'>
      <div className="absolute grid">
        <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border border-blue-700 rounded text-center" href='/'>Home</Link>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-red-700 rounded" onClick={handleClear}>Clear</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-yellow-700 rounded" onClick={handleReload}>Reload</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-1 px-2 border-4 border-green-700 rounded" onClick={handleSave}>Save</button>
      </div>
      <div className="max-w-screen-lg p-10 mx-auto">
        {loading ? <Spinner /> : <>
          {workspace.map(ws => getWorkspaceElement(ws.id, ws.element))}
          <button className="btn" onClick={handleAddChordBuilder}>New Builder</button>
        </>}
      </div>
      {loading && <p>Ładowanie</p>}
      <Spinner />
    </main>
  )
}
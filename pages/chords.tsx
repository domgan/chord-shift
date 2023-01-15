import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord"
import Link from "next/link"
import Image from 'next/image'

type WorkspaceElement = {
  id: number,
  element: Chord[] | ReactElement
}

// type ChordsWorkshopProps = {
//   workspace: WorkspaceElement,
//   setWorkspace: Dispatch<SetStateAction<WorkspaceElement[]>>
// }

export default function Chords() {
  const [workspace, setWorkspace] = useState<WorkspaceElement[]>([])

  const ChordsWorkshop = () => {
    const [chords, setChords] = useState<Chord[]>([])
    const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

    const handleSave = () => {
      const w = [...workspace]
      w.push({ id: workspace.length, element: chords })
      setWorkspace(w)
    }

    return (
      <div className="max-w-screen-lg p-10 mx-auto">
        {showChordBuilder && (<ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />)}
        <div className='grid grid-flow-row grid-cols-8 gap-4'>
          {chords.map(chord => <ChordCard chord={chord} chords={chords} setChords={setChords} />)}
          <div className="relative rounded-full flex items-center justify-center">
            <button onClick={() => setShowChordBuilder(true)}
              className='bg-green-500 text-white rounded-full h-12 w-12 text-center text-xl hover:bg-green-600 focus:outline-none grid place-items-center'>
              <Image src='/plus.svg' alt='plus' width={40} height={40} />
            </button>
          </div>
        </div>
        <br /><button className="btn" onClick={handleSave}>Save to Workspace</button>
      </div>
    )
  }

  return (
    <main className='main'>
      <Link className="absolute bg-blue-500 hover:bg-blue-700 text-white font-bold m-0.5 py-1 px-2 border border-blue-700 rounded" href='/'>Home</Link>
      <ChordsWorkshop />
      <ChordsWorkshop />
      <p>{JSON.stringify(workspace)}</p>
    </main>
  )
}
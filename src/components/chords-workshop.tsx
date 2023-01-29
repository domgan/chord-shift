import { Dispatch, SetStateAction, useState } from "react"
import { WorkspaceElement } from "../pages/chords"
import ChordBuilder from "./chord-builder"
import ChordCard, { Chord } from "./chord-card"
import Image from 'next/image'

type ChordsWorkshopProps = {
  id: number
  chords: Chord[]
  workspace: WorkspaceElement[]
  setWorkspace: Dispatch<SetStateAction<WorkspaceElement[]>>
}

export default function ChordsWorkshop(props: ChordsWorkshopProps) {
  const [chords, setChords] = useState<Chord[]>(props.chords)
  const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

  const handleDelete = () => {
    props.setWorkspace(props.workspace.filter(ws => ws.id !== props.id))
    // workspace.splice(0, workspace.length, ...workspace.filter(ws => ws.id !== id))
  }

  return (
    <div className="p-3">
      {showChordBuilder && <ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />}
      <div className='relative grid grid-cols-6 gap-3 p-3 rounded-md shadow-md bg-indigo-800 sm:grid-cols-10'>
        <div className="absolute top-0 left-0 text-xs text-slate-600">todo placeholder</div>
        {chords.map(chord => <ChordCard key={chord.id} chord={chord} chords={chords} setChords={setChords} />)}
        <div className="relative rounded-full flex items-center justify-center">
          <button onClick={() => setShowChordBuilder(true)}
            className='bg-green-500 text-white rounded-full h-12 w-12 text-center text-xl hover:bg-green-600 focus:outline-none grid place-items-center'>
            <Image src='/plus.svg' alt='plus' width={40} height={40} priority />
          </button>
        </div>
        <button onClick={handleDelete} className='absolute top-0 right-0 rounded-full hover:bg-red-500 h-8 w-8 focus:outline-none grid place-items-center'>
          <Image alt='close' width={24} height={24} src='/close.svg' />
        </button>
      </div>
    </div>
  )
}
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
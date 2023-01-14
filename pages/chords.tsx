import { useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord"
import Link from "next/link"

export default function Chords() {
  const [chords, setChords] = useState<Chord[]>([])
  const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

  return (
    <main className='main'>
      <Link className="absolute left-1 top-1 bg-blue-500 font-semibold" href='/'>Home</Link>
      <div className="max-w-screen-lg p-10">
        {showChordBuilder && (<ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />)}
        <div className='grid grid-flow-row grid-cols-8 gap-4'>
          {chords.map(chord => <ChordCard chord={chord} chords={chords} setChords={setChords} />)}
          <div className="relative rounded-full flex items-center">
            <button onClick={() => setShowChordBuilder(true)} className='bg-green-500 text-white rounded-full h-12 w-12 text-center text-xl hover:bg-green-600 focus:outline-none'>+</button>
          </div>
        </div>
      </div>
    </main>
  )
}
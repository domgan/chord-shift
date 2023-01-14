import { useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord"
import styles from '../styles/Home.module.css'

export default function Chords() {
  const [chords, setChords] = useState<Chord[]>([])
  const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

  return (
    <main className='main'>
      <div className="max-w-screen-lg mx-auto p-4">
        {showChordBuilder && (<ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />)}
        <div className='grid grid-cols-4'>
          {chords.map(chord => <ChordCard chord={chord} chords={chords} setChords={setChords} />)}
          <div className="relative rounded-full flex items-center">
            <button onClick={() => setShowChordBuilder(true)} className='bg-green-500 text-white rounded-full h-12 w-12 text-center text-xl hover:bg-green-600 focus:outline-none'>+</button>
          </div>
        </div>
      </div>
    </main>
  )
}
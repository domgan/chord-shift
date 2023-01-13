import { useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord"
import styles from '../styles/Home.module.css'

export default function Chords() {
  const [chords, setChords] = useState<Chord[]>([])
  const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

  return (
    <div className='grid'>
      {showChordBuilder
        ? (<ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />)
        : (<div className={styles.grid_chords}>
          {chords.map(chord => <ChordCard chord={chord} chords={chords} setChords={setChords} />)}
          <a onClick={() => setShowChordBuilder(true)} className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75'>+</a>
        </div>)
      }
    </div>
  )
}
import { useState } from "react"
import ChordBuilder from "../components/chord-builder"
import ChordCard, { Chord } from "../components/chord"
import styles from '../styles/Home.module.css'

export default function Chords() {
  const [chords, setChords] = useState<Chord[]>([])
  const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

  return (
    <div className={styles.main}>
      {showChordBuilder
        ? (<ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />)
        : (<div className={styles.grid_chords}>
          {chords.map(chord => <ChordCard chord={chord} chords={chords} setChords={setChords} />)}
          <a onClick={() => setShowChordBuilder(true)} className={styles.card}>+</a>
        </div>)
      }
    </div>
  )
}
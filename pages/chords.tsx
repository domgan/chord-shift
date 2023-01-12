import { useState } from "react"
import ChordBuilder from "../components/chord-builder"
import styles from '../styles/Home.module.css'

export default function Chords() {
    const [chords, setChords] = useState<string[]>([])
    const [showChordBuilder, setShowChordBuilder] = useState<boolean>(false)

    return (
        showChordBuilder
            ? (<ChordBuilder chords={chords} setShowChordBuilder={setShowChordBuilder} />)
            : (<div className={styles.grid}>
                {chords.map(chord => { return (<a className={styles.card}>{chord}</a>) })}
                <a onClick={() => setShowChordBuilder(true)} className={styles.card}>+</a>
            </div>)
    )
}
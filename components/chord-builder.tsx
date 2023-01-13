import { Dispatch, SetStateAction, useState } from "react"
import Select from "react-dropdown-select"
import styles from '../styles/Home.module.css'
import { Chord } from "./chord"

const notes = 'CDEFGAB'
export type ChordPart = {
  value: number
  label: string
}

type ChooseChordProps = {
  chords: Chord[]
  // setChords: Dispatch<SetStateAction<string[]>>
  setShowChordBuilder: Dispatch<SetStateAction<boolean>>
}

export default function ChordBuilder(props: ChooseChordProps) {
  const [note, setNote] = useState<ChordPart>({ value: 1, label: '' })
  const [chromatic, setChromatic] = useState<ChordPart>({ value: 1, label: '' })
  const [tonality, setTonality] = useState<ChordPart>({ value: 1, label: '' })

  const ChooseChord = () => {
    let noteOptions = []
    for (let i = 1; i < notes.length + 1; i++) {
      noteOptions.push({ value: i, label: notes[i] })
    }
    const chromaticOptions = [{ value: 1, label: '' }, { value: 2, label: '♯' }, { value: 3, label: '♭' }]
    const tonalityOptions = [{ value: 1, label: '' }, { value: 2, label: 'm' }]

    return (
      <div className={styles.center}>
        <Select options={noteOptions} onChange={(values) => setNote(values[0])} values={[]} />
        <Select options={chromaticOptions} onChange={(values) => setChromatic(values[0])} values={[]} />
        <Select options={tonalityOptions} onChange={(values) => setTonality(values[0])} values={[]} />
      </div>
    )
  }

  const handleSave = () => {
    props.chords.push({ id: props.chords.length, label: note.label + chromatic.label + tonality.label })
    // props.setChords(props.chords)
    props.setShowChordBuilder(false)
  }

  return (
    <div className={styles.main}>
      <ChooseChord />
      {note.label}{chromatic.label}{tonality.label}
      <div className={styles.grid}>
        <a className={styles.card} onClick={handleSave}>Save</a>
        <a className={styles.card} onClick={() => props.setShowChordBuilder(false)}>Cancel</a>
      </div>
    </div>
  )
}
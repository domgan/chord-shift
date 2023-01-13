import { Dispatch, SetStateAction, useState } from 'react'
import styles from '../styles/Home.module.css'

export type Chord = {
  id: number
  label: string
  // todo name: string
}

type ChordCardProps = {
  chord: Chord
  chords: Chord[]
  setChords: Dispatch<SetStateAction<Chord[]>>
}

export default function ChordCard(props: ChordCardProps) {
  const [showRemove, setShowRemove] = useState<boolean>(false)

  const handleRemove = () => {
    props.setChords(props.chords.filter(chord => { return chord.label !== props.chord.label }))
  }

  const RemoveButton = () => {
    return (
      <a className={styles.card} onClick={handleRemove}>X</a>
    )
  }

  return (
    <>
      <a className={styles.card} onClick={() => setShowRemove(!showRemove)}>{props.chord.label} </a>
      {showRemove && <RemoveButton />}
    </>
  )
}

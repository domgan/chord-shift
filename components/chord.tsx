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
    props.setChords(props.chords.filter(chord => { return chord.id !== props.chord.id }))
  }

  const RemoveButton = () => {
    return (
      <button className='hover:bg-red-700 bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75 top-0 right-0 h-6 w-6' onClick={handleRemove}>X</button>
    )
  }

  return (
    <>
      <a className='inline-block hover:bg-sky-700 bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75 h-16 w-16 text-center' onClick={() => setShowRemove(!showRemove)}>{props.chord.label} {showRemove && <RemoveButton />} </a>
    </>
  )
}

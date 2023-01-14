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
      <button className='absolute top-0 right-2 text-center font-medium text-gray-500 rounded-full bg-white hover:bg-red-500 h-8 w-8 focus:outline-none' onClick={handleRemove} >X</button>
    )
  }

  return (
    <div className='flex flex-wrap justify-center relative'>
      <button className='bg-gradient-to-r from-purple-600 to-indigo-500 p-4 m-4 h-48 w-48 rounded-sm text-center hover:to-purple-700' onClick={() => setShowRemove(!showRemove)}>
        <div className='text-xl font-bold'>{props.chord.label}</div>
        <div className="text-lg">Chord Notes</div>
        {showRemove && <RemoveButton />}
      </button>
    </div>
  )
}

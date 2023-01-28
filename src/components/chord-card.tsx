import { Dispatch, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { generateLabel, generateNotes } from '../features/generate-chord-info'

export const chromatics = {
  none: '',
  sharp: '♯',
  flat: '♭'
}

export type Chord = {
  id: number
  note: string,
  chromatic: string,
  tonality: string
}

type ChordCardProps = {
  chord: Chord
  chords: Chord[]
  setChords: Dispatch<SetStateAction<Chord[]>>
}

export default function ChordCard(props: ChordCardProps) {
  const [showRemove, setShowRemove] = useState<boolean>(false)

  const handleRemove = () => {
    props.setChords(props.chords.filter(chord => chord.id !== props.chord.id))
    props.chords.splice(0, props.chords.length, ...props.chords.filter(chord => chord.id !== props.chord.id))
  }

  const RemoveButton = () => {
    return (
      <button className='absolute top-0 right-0 rounded-full bg-white hover:bg-red-500 h-6 w-6 focus:outline-none grid place-items-center'
        onClick={handleRemove}><Image alt='close' width={24} height={24} src='/close.svg' />
      </button>
    )
  }

  return (
    <div className='flex flex-wrap justify-center relative'>
      <button className='bg-gradient-to-r from-purple-600 to-indigo-500 h-24 w-36 rounded-sm text-center hover:to-purple-700'
        onClick={() => setShowRemove(!showRemove)}>
        <div className='text-xl font-bold'>{generateLabel(props.chord)}</div>
        <div className="text-lg">{generateNotes(props.chord).join('-')}</div>
        {showRemove && <RemoveButton />}
      </button>
    </div>
  )
}

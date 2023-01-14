import { Dispatch, SetStateAction, useState } from 'react'
import styles from '../styles/Home.module.css'
import chordStyles from '../styles/chords.module.css'
import { Chord } from "./chord"

export type ChordPart = {
  value: number
  label: string
}

type CharSelectorProps = {
  title: string
  blocks: string[]
  char: string
  setChar: Dispatch<SetStateAction<string>>
}

type ChooseChordProps = {
  chords: Chord[]
  // setChords: Dispatch<SetStateAction<string[]>>
  setShowChordBuilder: Dispatch<SetStateAction<boolean>>
}

export default function ChordBuilder(props: ChooseChordProps) {
  const [note, setNote] = useState<string>('C')
  const [chromatic, setChromatic] = useState<string>('')
  const [tonality, setTonality] = useState<string>('')

  const CharSelector = (props: CharSelectorProps) => {
    return (
      <select title={props.title} onChange={e => props.setChar(e.target.value)} value={props.char} className='text-lg font-medium py-2 px-3 rounded-lg bg-gray-200 focus:outline-none'>
        {props.blocks.map(block => <option className='py-1 px-2 hover:bg-gray-200'>{block}</option>)}
      </select>
    )
  }

  const ChooseChord = () => {
    const notes = 'CDEFGAB'.split('')
    const chromatics = ' ♯♭'.split('')
    const tonalities = ' m'.split('')  // todo objects {name: string, label: string}

    return (
      <div className='flex'>
        <CharSelector title='Notes' blocks={notes} char={note} setChar={setNote} />
        <CharSelector title='Chromatics' blocks={chromatics} char={chromatic} setChar={setChromatic} />
        <CharSelector title='Tonality' blocks={tonalities} char={tonality} setChar={setTonality} />
      </div>
    )
  }

  const handleSave = () => {
    const label = note + chromatic + tonality
    label && props.chords.push({ id: props.chords.length, label: note + chromatic + tonality })
    // props.setChords(props.chords)
    props.setShowChordBuilder(false)
  }

  return (
    <>
      <div className="absolute rounded-lg p-4 m-auto max-w-lg bg-white z-20">
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-medium">
            Chord Builder
          </h3>
        </div>
        <div>
          <ChooseChord />
        </div>
        {/* <p>{note}{chromatic}{tonality}</p> */}
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button className='btn rounded-full' onClick={handleSave}>Save</button>
          <button className='btn rounded-full' onClick={() => props.setShowChordBuilder(false)}>Cancel</button>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-25 z-10"></div>
    </>
  )
}
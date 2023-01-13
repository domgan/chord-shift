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
      <select title={props.title} onChange={e => props.setChar(e.target.value)} value={props.char} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
        {props.blocks.map(block => <option>{block}</option>)}
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
    <div className=''>
      <ChooseChord />
      {/* <p>{note}{chromatic}{tonality}</p> */}
      <div className={styles.grid}>
        <button className='inline-block hover:bg-sky-700 bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75' onClick={handleSave}>Save</button>
        <button className='inline-block hover:bg-sky-700 bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75' onClick={() => props.setShowChordBuilder(false)}>Cancel</button>
      </div>
    </div>
  )
}
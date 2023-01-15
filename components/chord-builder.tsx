import { Dispatch, SetStateAction, useState } from 'react'
import { Chord } from "./chord"
import { tonalitiesMap } from '../features/generate-chord-info'

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
  const [tonality, setTonality] = useState<string>('major')

  const CharSelector = (props: CharSelectorProps) => {
    return (
      <select title={props.title} onChange={e => props.setChar(e.target.value)} value={props.char} className='hover:shadow-lg text-lg font-medium mx-0.5 py-2 px-3 rounded-lg bg-gray-200 focus:outline-none'>
        {props.blocks.map(block => <option className='py-1 px-2 hover:bg-gray-200'>{block}</option>)}
      </select>
    )
  }

  const ChooseChord = () => {
    const notes = 'CDEFGAB'.split('')
    const chromatics = ' ♯♭'.split('')
    const tonalities = Object.keys(tonalitiesMap)

    return (
      <div className='flex items-center justify-between'>
        <CharSelector title='Notes' blocks={notes} char={note} setChar={setNote} />
        <CharSelector title='Chromatics' blocks={chromatics} char={chromatic} setChar={setChromatic} />
        <CharSelector title='Tonality' blocks={tonalities} char={tonality} setChar={setTonality} />
      </div>
    )
  }

  const handleSave = () => {
    props.chords.push({ id: props.chords.length, note, chromatic, tonality })
    // props.setChords(props.chords)
    props.setShowChordBuilder(false)
  }

  return (
    <>
      <div className="absolute rounded-lg p-4 m-auto max-w-lg z-20 shadow-md bg-gradient-to-r from-cyan-500 to-blue-500">
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
          <button className='bg-green-500 hover:bg-green-600 hover:shadow-lg text-white font-medium p-2 rounded-lg w-24 h-12' onClick={handleSave}>Save</button>
          <button className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg hover:shadow-lg font-medium w-24 h-12' onClick={() => props.setShowChordBuilder(false)}>Cancel</button>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-25 z-10"></div>
    </>
  )
}
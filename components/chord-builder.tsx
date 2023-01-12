import { Dispatch, SetStateAction, useState } from "react"
import Select from "react-dropdown-select"
import styles from '../styles/Home.module.css'

const notes = 'CDEFGAB'
export interface ChordOption {
    value: number
    label: string
}
// interface SelectChordProps {
//     setNote: Dispatch<SetStateAction<ChordOption>>
//     setChromatic: Dispatch<SetStateAction<ChordOption>>
//     setTonality: Dispatch<SetStateAction<ChordOption>>
// }
interface SelectChordProps {
    chords: string[]
    setChords: Dispatch<SetStateAction<string[]>>
    setShowChordBuilder: Dispatch<SetStateAction<boolean>>
}

export default function ChordBuilder(props: SelectChordProps) {
    const [note, setNote] = useState<ChordOption>({ value: 1, label: '' })
    const [chromatic, setChromatic] = useState<ChordOption>({ value: 1, label: '' })
    const [tonality, setTonality] = useState<ChordOption>({ value: 1, label: '' })

    const SelectChord = () => {
        let noteOptions = []
        for (let i = 1; i < notes.length + 1; i++) {
            noteOptions.push({ value: i, label: notes[i] })
        }
        const chromaticOptions = [{ value: 1, label: '' }, { value: 2, label: '♯' }, { value: 3, label: '♭' }]
        const tonalityOptions = [{ value: 1, label: '' }, { value: 2, label: 'm' }]

        return (
            <div className=''>
                <Select options={noteOptions} onChange={(values) => setNote(values[0])} values={[]} />
                <Select options={chromaticOptions} onChange={(values) => setChromatic(values[0])} values={[]} />
                <Select options={tonalityOptions} onChange={(values) => setTonality(values[0])} values={[]} />
            </div>
        )
    }

    const handleSave = () => {
        props.chords.push(note.label + chromatic.label + tonality.label)
        // props.setChords(props.chords)
        props.setShowChordBuilder(false)
    }

    return (
        <div className=''>
            <SelectChord />
            {note.label}{chromatic.label}{tonality.label}
            <a className={styles.card} onClick={handleSave}>Save</a>
            {/* <button><Link href={{ pathname: '/chords', query: { chord: note.label + chromatic.label + tonality.label } }}>Save</Link></button> */}
        </div>
    )
}
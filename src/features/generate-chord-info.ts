import type { Chord } from '@/types/chord'
import { Chromatic, TonalitiesMap } from '@/types/chord'

const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

const INTERVALS: Record<string, number[]> = {
  major: [4, 7],
  minor: [3, 7],
  diminished: [3, 6],
  augmented: [4, 8],
  'major seventh': [4, 7, 11],
  'minor seventh': [3, 7, 10],
  'dominant seventh': [4, 7, 10],
  'diminished seventh': [3, 6, 9],
  sus2: [2, 7],
  sus4: [5, 7],
}

export function generateNotes(chord: Chord): string[] {
  // Normalize root note
  let rootNote: string
  if (chord.chromatic === Chromatic.flat) {
    rootNote = NOTES[(NOTES.indexOf(chord.note) + 11) % 12]
  } else {
    rootNote = chord.note + chord.chromatic
  }

  const rootIndex = NOTES.indexOf(rootNote)
  const intervals = INTERVALS[chord.tonality]

  if (!intervals) {
    throw new Error(`Invalid tonality: ${chord.tonality}`)
  }

  let chordNotes = [rootNote, ...intervals.map((i) => NOTES[(rootIndex + i) % 12])]

  // Denormalize to use flats when appropriate
  const useFlats =
    chord.chromatic === Chromatic.flat ||
    ((chord.tonality.includes('minor') || chord.tonality.includes('diminished')) &&
      !rootNote.includes(Chromatic.sharp))

  if (useFlats) {
    chordNotes = chordNotes.map((n) =>
      n.includes(Chromatic.sharp)
        ? NOTES[(NOTES.indexOf(n) + 1) % 12] + Chromatic.flat
        : n
    )
  }

  return chordNotes
}

export function generateLabel(chord: Chord): string {
  return chord.note + chord.chromatic + TonalitiesMap[chord.tonality]
}

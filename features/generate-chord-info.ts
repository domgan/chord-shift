import { Chord } from "../components/chord-card";

export const tonalitiesMap: { [key: string]: string } = {
  major: '',
  minor: 'm',
  sus2: 'sus2',
  sus4: 'sus4',
  augmented: 'aug',  // +
  diminished: 'dim',
  'major seventh': 'M7',  // △
  'minor seventh': 'm7',
  'dominant seventh': '7',
  'diminished seventh': 'dim7',  // °
}

export function generateNotes(chord: Chord): string[] {  // (rootNote: string, tonality: string, chromatics: string)
  const notes = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

  // normalize
  let rootNote;
  if (chord.chromatic === '♭') {
    rootNote = notes[(notes.indexOf(chord.note) + 11) % 12]
  } else {
    rootNote = chord.note + chord.chromatic
  }

  let chordNotes = [rootNote];
  let rootIndex = notes.indexOf(rootNote);

  switch (chord.tonality) {
    case "major":
      chordNotes.push(notes[(rootIndex + 4) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      break
    case "minor":
      chordNotes.push(notes[(rootIndex + 3) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      break
    case "diminished":
      chordNotes.push(notes[(rootIndex + 3) % 12])
      chordNotes.push(notes[(rootIndex + 6) % 12])
      break
    case "augmented":
      chordNotes.push(notes[(rootIndex + 4) % 12])
      chordNotes.push(notes[(rootIndex + 8) % 12])
      break
    case "major seventh":
      chordNotes.push(notes[(rootIndex + 4) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      chordNotes.push(notes[(rootIndex + 11) % 12])
      break
    case "minor seventh":
      chordNotes.push(notes[(rootIndex + 3) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      chordNotes.push(notes[(rootIndex + 10) % 12])
      break
    case "dominant seventh":
      chordNotes.push(notes[(rootIndex + 4) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      chordNotes.push(notes[(rootIndex + 10) % 12])
      break
    case "diminished seventh":
      chordNotes.push(notes[(rootIndex + 3) % 12])
      chordNotes.push(notes[(rootIndex + 6) % 12])
      chordNotes.push(notes[(rootIndex + 9) % 12])
      break
    case "sus2":
      chordNotes.push(notes[(rootIndex + 2) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      break
    case "sus4":
      chordNotes.push(notes[(rootIndex + 5) % 12])
      chordNotes.push(notes[(rootIndex + 7) % 12])
      break
    default:
      throw new Error("Invalid tonality")
  }
  // denormalize
  if (chord.chromatic === '♭' || ((chord.tonality.includes('minor') || chord.tonality.includes('diminished')) && rootNote[1] !== '♯')) {
    chordNotes = chordNotes.map(n => n.includes('♯') ? notes[(notes.indexOf(n) + 1)] + '♭' : n)
  }

  return chordNotes
}

export function generateLabel(chord: Chord): string {
  return chord.note + chord.chromatic + tonalitiesMap[chord.tonality]
}
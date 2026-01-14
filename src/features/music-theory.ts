import type { Chord } from '@/types/chord'

// ============================================================================
// CONSTANTS
// ============================================================================

export const NOTES: readonly string[] = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export const NOTES_FLAT: readonly string[] = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']

// Scale degrees for major scale (in semitones from root) - kept for reference
// const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11] as const

// Common chord types and their scale positions in major key - kept for reference
// const MAJOR_KEY_CHORDS = {
//   I: { degree: 0, quality: 'major' },
//   ii: { degree: 2, quality: 'minor' },
//   iii: { degree: 4, quality: 'minor' },
//   IV: { degree: 5, quality: 'major' },
//   V: { degree: 7, quality: 'major' },
//   vi: { degree: 9, quality: 'minor' },
//   'vii°': { degree: 11, quality: 'diminished' },
// } as const

// ============================================================================
// CHORD FUNCTIONS (Tonic, Subdominant, Dominant)
// ============================================================================

export type ChordFunction = 'tonic' | 'subdominant' | 'dominant' | 'unknown'

export const CHORD_FUNCTION_COLORS: Record<ChordFunction, string> = {
  tonic: 'from-emerald-500 to-teal-600',
  subdominant: 'from-amber-500 to-orange-600',
  dominant: 'from-rose-500 to-red-600',
  unknown: 'from-slate-500 to-slate-600',
}

export const CHORD_FUNCTION_LABELS: Record<ChordFunction, string> = {
  tonic: 'T',
  subdominant: 'S',
  dominant: 'D',
  unknown: '?',
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize a note to its chromatic index (0-11)
 */
export function noteToIndex(note: string, chromatic: string = ''): number {
  const normalizedNote = note.replace('♭', '').replace('♯', '')
  let baseIndex = NOTES.findIndex(n => n === normalizedNote || n === `${normalizedNote}♯`)

  if (baseIndex === -1) {
    // Handle cases like "D♭" which isn't directly in NOTES
    const flatIndex = NOTES_FLAT.indexOf(note + chromatic)
    if (flatIndex !== -1) return flatIndex
    baseIndex = NOTES.indexOf(normalizedNote)
  }

  if (chromatic === '♯') {
    return (baseIndex + 1) % 12
  } else if (chromatic === '♭') {
    return (baseIndex + 11) % 12
  }

  return baseIndex
}

/**
 * Get note name at given index
 */
export function indexToNote(index: number, preferFlats: boolean = false): string {
  const normalizedIndex = ((index % 12) + 12) % 12
  return preferFlats ? NOTES_FLAT[normalizedIndex] : NOTES[normalizedIndex]
}

/**
 * Get the interval (in semitones) between two notes
 */
export function getInterval(note1: string, chromatic1: string, note2: string, chromatic2: string): number {
  const index1 = noteToIndex(note1, chromatic1)
  const index2 = noteToIndex(note2, chromatic2)
  return ((index2 - index1) + 12) % 12
}

// ============================================================================
// KEY DETECTION
// ============================================================================

export interface DetectedKey {
  root: string
  mode: 'major' | 'minor'
  confidence: number
}

/**
 * Detect the most likely key(s) from a chord progression
 */
export function detectKey(chords: Chord[]): DetectedKey[] {
  if (chords.length === 0) return []

  const candidates: DetectedKey[] = []

  // Test all possible keys (major and minor)
  for (let rootIndex = 0; rootIndex < 12; rootIndex++) {
    const majorScore = scoreKeyFit(chords, rootIndex, 'major')
    const minorScore = scoreKeyFit(chords, rootIndex, 'minor')

    if (majorScore > 0) {
      candidates.push({
        root: NOTES[rootIndex],
        mode: 'major',
        confidence: majorScore,
      })
    }
    if (minorScore > 0) {
      candidates.push({
        root: NOTES[rootIndex],
        mode: 'minor',
        confidence: minorScore,
      })
    }
  }

  // Sort by confidence and return top results
  return candidates
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
}

/**
 * Score how well chords fit in a given key
 */
function scoreKeyFit(chords: Chord[], keyRoot: number, mode: 'major' | 'minor'): number {
  let score = 0
  const scaleIntervals = mode === 'major'
    ? [0, 2, 4, 5, 7, 9, 11]  // Major scale
    : [0, 2, 3, 5, 7, 8, 10]  // Natural minor scale

  const diatonicChords = mode === 'major'
    ? [
        { degree: 0, quality: 'major' },
        { degree: 2, quality: 'minor' },
        { degree: 4, quality: 'minor' },
        { degree: 5, quality: 'major' },
        { degree: 7, quality: 'major' },
        { degree: 9, quality: 'minor' },
        { degree: 11, quality: 'diminished' },
      ]
    : [
        { degree: 0, quality: 'minor' },
        { degree: 2, quality: 'diminished' },
        { degree: 3, quality: 'major' },
        { degree: 5, quality: 'minor' },
        { degree: 7, quality: 'minor' },
        { degree: 8, quality: 'major' },
        { degree: 10, quality: 'major' },
      ]

  for (const chord of chords) {
    const chordRoot = noteToIndex(chord.note, chord.chromatic)
    const intervalFromKey = ((chordRoot - keyRoot) + 12) % 12

    // Check if chord root is in the scale
    if (scaleIntervals.includes(intervalFromKey)) {
      score += 1
    }

    // Bonus points if chord quality matches expected
    const expectedQuality = diatonicChords.find(dc => dc.degree === intervalFromKey)
    if (expectedQuality && normalizeQuality(chord.tonality) === expectedQuality.quality) {
      score += 2
    }
  }

  // Normalize by number of chords
  return chords.length > 0 ? score / chords.length : 0
}

function normalizeQuality(tonality: string): string {
  if (tonality.includes('minor') && !tonality.includes('seventh')) return 'minor'
  if (tonality === 'major' || tonality === 'major seventh') return 'major'
  if (tonality.includes('diminished')) return 'diminished'
  return tonality
}

// ============================================================================
// ROMAN NUMERAL ANALYSIS
// ============================================================================

export interface RomanNumeral {
  numeral: string
  function: ChordFunction
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const

/**
 * Get the Roman numeral for a chord in a given key
 */
export function getRomanNumeral(chord: Chord, keyRoot: string, keyMode: 'major' | 'minor'): RomanNumeral {
  const keyRootIndex = noteToIndex(keyRoot, '')
  const chordRootIndex = noteToIndex(chord.note, chord.chromatic)
  const interval = ((chordRootIndex - keyRootIndex) + 12) % 12

  // Find the scale degree
  const scaleIntervals = keyMode === 'major'
    ? [0, 2, 4, 5, 7, 9, 11]
    : [0, 2, 3, 5, 7, 8, 10]

  let degreeIndex = scaleIntervals.indexOf(interval)
  let accidental = ''

  if (degreeIndex === -1) {
    // Chord is chromatic - find nearest scale degree
    for (let i = 0; i < scaleIntervals.length; i++) {
      if (interval === (scaleIntervals[i] + 1) % 12) {
        degreeIndex = i
        accidental = '♯'
        break
      } else if (interval === (scaleIntervals[i] + 11) % 12) {
        degreeIndex = i
        accidental = '♭'
        break
      }
    }
  }

  if (degreeIndex === -1) degreeIndex = 0 // Fallback

  const baseNumeral = ROMAN_NUMERALS[degreeIndex]
  const isMinor = chord.tonality.includes('minor') || chord.tonality.includes('diminished')
  const numeral = isMinor ? baseNumeral.toLowerCase() : baseNumeral

  // Add quality suffix
  let suffix = ''
  if (chord.tonality.includes('diminished')) suffix = '°'
  if (chord.tonality.includes('augmented')) suffix = '+'
  if (chord.tonality.includes('seventh')) suffix += '7'
  if (chord.tonality.includes('sus2')) suffix = 'sus2'
  if (chord.tonality.includes('sus4')) suffix = 'sus4'

  const chordFunction = getChordFunction(degreeIndex, keyMode)

  return {
    numeral: accidental + numeral + suffix,
    function: chordFunction,
  }
}

/**
 * Get the harmonic function of a chord based on scale degree
 */
export function getChordFunction(degree: number, mode: 'major' | 'minor'): ChordFunction {
  // In major: I, iii, vi are tonic; IV, ii are subdominant; V, vii° are dominant
  // In minor: i, III, VI are tonic; iv, ii° are subdominant; V, VII are dominant
  if (mode === 'major') {
    switch (degree) {
      case 0: case 2: case 5: return 'tonic'  // I, iii, vi
      case 3: case 1: return 'subdominant'    // IV, ii
      case 4: case 6: return 'dominant'       // V, vii°
      default: return 'unknown'
    }
  } else {
    switch (degree) {
      case 0: case 2: case 5: return 'tonic'  // i, III, VI
      case 3: case 1: return 'subdominant'    // iv, ii°
      case 4: case 6: return 'dominant'       // V, VII
      default: return 'unknown'
    }
  }
}

// ============================================================================
// TRANSPOSITION
// ============================================================================

/**
 * Transpose a single chord by N semitones
 */
export function transposeChord(chord: Chord, semitones: number): Chord {
  const currentIndex = noteToIndex(chord.note, chord.chromatic)
  const newIndex = ((currentIndex + semitones) + 12) % 12

  // Decide whether to use sharps or flats
  const useFlats = chord.chromatic === '♭' ||
    chord.tonality.includes('minor') ||
    chord.tonality.includes('diminished')

  const newNote = indexToNote(newIndex, useFlats)

  // Parse the note and chromatic
  let note: string
  let chromatic: string

  if (newNote.includes('♯')) {
    note = newNote.replace('♯', '')
    chromatic = '♯'
  } else if (newNote.includes('♭')) {
    note = newNote.replace('♭', '')
    chromatic = '♭'
  } else {
    note = newNote
    chromatic = ''
  }

  return {
    ...chord,
    note,
    chromatic,
  }
}

/**
 * Transpose an array of chords by N semitones
 */
export function transposeChords(chords: Chord[], semitones: number): Chord[] {
  return chords.map(chord => transposeChord(chord, semitones))
}

// ============================================================================
// PROGRESSION TEMPLATES
// ============================================================================

export interface ProgressionTemplate {
  id: string
  name: string
  genre: string
  description: string
  chords: Array<{ note: string; chromatic: string; tonality: string }>
}

export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  {
    id: 'pop-1645',
    name: 'Pop Classic (I-vi-IV-V)',
    genre: 'Pop',
    description: 'The most common pop progression. Used in countless hits.',
    chords: [
      { note: 'C', chromatic: '', tonality: 'major' },
      { note: 'A', chromatic: '', tonality: 'minor' },
      { note: 'F', chromatic: '', tonality: 'major' },
      { note: 'G', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'pop-1564',
    name: 'Axis Progression (I-V-vi-IV)',
    genre: 'Pop',
    description: 'Another extremely common progression. Think "With or Without You".',
    chords: [
      { note: 'C', chromatic: '', tonality: 'major' },
      { note: 'G', chromatic: '', tonality: 'major' },
      { note: 'A', chromatic: '', tonality: 'minor' },
      { note: 'F', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'jazz-251',
    name: 'Jazz ii-V-I',
    genre: 'Jazz',
    description: 'The fundamental jazz progression. Learn this first!',
    chords: [
      { note: 'D', chromatic: '', tonality: 'minor seventh' },
      { note: 'G', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'major seventh' },
    ],
  },
  {
    id: 'blues-12bar',
    name: '12-Bar Blues',
    genre: 'Blues',
    description: 'The classic blues form. 12 bars of pure soul.',
    chords: [
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'F', chromatic: '', tonality: 'dominant seventh' },
      { note: 'F', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'G', chromatic: '', tonality: 'dominant seventh' },
      { note: 'F', chromatic: '', tonality: 'dominant seventh' },
      { note: 'C', chromatic: '', tonality: 'dominant seventh' },
      { note: 'G', chromatic: '', tonality: 'dominant seventh' },
    ],
  },
  {
    id: 'rock-1-b7-4',
    name: 'Rock Power (I-♭VII-IV)',
    genre: 'Rock',
    description: 'Classic rock sound with the borrowed flat-seven.',
    chords: [
      { note: 'A', chromatic: '', tonality: 'major' },
      { note: 'G', chromatic: '', tonality: 'major' },
      { note: 'D', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'pachelbel',
    name: 'Pachelbel Canon',
    genre: 'Classical',
    description: 'The famous Pachelbel progression (I-V-vi-iii-IV-I-IV-V).',
    chords: [
      { note: 'D', chromatic: '', tonality: 'major' },
      { note: 'A', chromatic: '', tonality: 'major' },
      { note: 'B', chromatic: '', tonality: 'minor' },
      { note: 'F', chromatic: '♯', tonality: 'minor' },
      { note: 'G', chromatic: '', tonality: 'major' },
      { note: 'D', chromatic: '', tonality: 'major' },
      { note: 'G', chromatic: '', tonality: 'major' },
      { note: 'A', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'sad-1-5-6-4',
    name: 'Sad Progression (i-v-VI-IV)',
    genre: 'Ballad',
    description: 'Minor version of the axis progression. Emotional and melancholic.',
    chords: [
      { note: 'A', chromatic: '', tonality: 'minor' },
      { note: 'E', chromatic: '', tonality: 'minor' },
      { note: 'F', chromatic: '', tonality: 'major' },
      { note: 'D', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'andalusian',
    name: 'Andalusian Cadence',
    genre: 'Flamenco',
    description: 'Spanish/Flamenco progression (i-VII-VI-V). Think "Hit the Road Jack".',
    chords: [
      { note: 'A', chromatic: '', tonality: 'minor' },
      { note: 'G', chromatic: '', tonality: 'major' },
      { note: 'F', chromatic: '', tonality: 'major' },
      { note: 'E', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'doo-wop',
    name: 'Doo-Wop (I-vi-IV-V)',
    genre: '50s',
    description: 'The classic 50s progression. Stand By Me, Earth Angel, etc.',
    chords: [
      { note: 'C', chromatic: '', tonality: 'major' },
      { note: 'A', chromatic: '', tonality: 'minor' },
      { note: 'F', chromatic: '', tonality: 'major' },
      { note: 'G', chromatic: '', tonality: 'major' },
    ],
  },
  {
    id: 'royal-road',
    name: 'Royal Road (IV-V-iii-vi)',
    genre: 'J-Pop',
    description: 'Common in anime and J-Pop. Emotional and uplifting.',
    chords: [
      { note: 'F', chromatic: '', tonality: 'major' },
      { note: 'G', chromatic: '', tonality: 'major' },
      { note: 'E', chromatic: '', tonality: 'minor' },
      { note: 'A', chromatic: '', tonality: 'minor' },
    ],
  },
]

// ============================================================================
// GUITAR CHORD POSITIONS
// ============================================================================

export interface GuitarChordPosition {
  frets: (number | 'x' | 0)[] // 6 strings, low E to high E
  fingers: (number | 0)[]
  barreeFret?: number
  baseFret: number
}

// Standard open chord voicings (simplified set for common chords)
export const GUITAR_CHORD_SHAPES: Record<string, GuitarChordPosition> = {
  'C major': { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
  'D major': { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
  'E major': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
  'F major': { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barreeFret: 1, baseFret: 1 },
  'G major': { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
  'A major': { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
  'B major': { frets: ['x', 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barreeFret: 2, baseFret: 2 },

  'C minor': { frets: ['x', 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barreeFret: 3, baseFret: 3 },
  'D minor': { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
  'E minor': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
  'F minor': { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barreeFret: 1, baseFret: 1 },
  'G minor': { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barreeFret: 3, baseFret: 3 },
  'A minor': { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
  'B minor': { frets: ['x', 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barreeFret: 2, baseFret: 2 },

  'C dominant seventh': { frets: ['x', 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1 },
  'D dominant seventh': { frets: ['x', 'x', 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1 },
  'E dominant seventh': { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1 },
  'G dominant seventh': { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1 },
  'A dominant seventh': { frets: ['x', 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], baseFret: 1 },
}

/**
 * Get guitar chord diagram data for a chord
 */
export function getGuitarChordPosition(chord: Chord): GuitarChordPosition | null {
  const key = `${chord.note}${chord.chromatic} ${chord.tonality}`.replace('♯', '').replace('♭', '')
  const normalizedKey = `${chord.note} ${chord.tonality}`
  return GUITAR_CHORD_SHAPES[normalizedKey] || GUITAR_CHORD_SHAPES[key] || null
}

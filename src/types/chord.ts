export const Chromatic = {
  none: '',
  sharp: '♯',
  flat: '♭',
} as const

export type ChromaticValue = typeof Chromatic[keyof typeof Chromatic]

export interface Chord {
  id: string
  note: string
  chromatic: string
  tonality: string
}

export const TonalitiesMap: Record<string, string> = {
  major: '',
  minor: 'm',
  sus2: 'sus2',
  sus4: 'sus4',
  augmented: 'aug',
  diminished: 'dim',
  'major seventh': 'M7',
  'minor seventh': 'm7',
  'dominant seventh': '7',
  'diminished seventh': 'dim7',
} as const

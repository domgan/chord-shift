import type { Chord } from '@/types/chord'
import { Chromatic, TonalitiesMap } from '@/types/chord'
import type { WorkshopElement, WorkspaceElement } from '@/types/workspace'

const getChromatic = (chord: string): string =>
  chord.includes('b')
    ? Chromatic.flat
    : chord.includes('#')
      ? Chromatic.sharp
      : Chromatic.none

const getTonality = (chord: string): string => {
  const rawTonality = chord.slice(1).replace('b', '').replace('#', '')
  return (
    Object.keys(TonalitiesMap).find(
      (key) => TonalitiesMap[key] === rawTonality
    ) ?? 'major'
  )
}

const parseChord = (chord: string): Chord => ({
  id: crypto.randomUUID(),
  note: chord[0],
  chromatic: getChromatic(chord),
  tonality: getTonality(chord),
})

export default function getWorkspaceFromUltimateGuitar(
  ultimateChords: string[][]
): WorkspaceElement[] {
  return ultimateChords.map((chordsLine) => {
    const id = crypto.randomUUID()
    const chords: Chord[] = chordsLine.map((ultimateChord) =>
      parseChord(ultimateChord)
    )
    const workshop: WorkshopElement = { id, chords }
    return { id, element: workshop }
  })
}
